import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateInviteCode } from '@/lib/invites';
import { normalizeText } from '@/lib/text';
import { checkRateLimit, getClientIp, isSameOriginRequest, readJsonWithLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

const idSchema = z.string().uuid();

const schema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  invite_limit: z.coerce.number().int().min(0).max(2000).optional(),
  regenerate_code: z.boolean().optional().default(false),
}).refine(
  (value) => value.name !== undefined || value.invite_limit !== undefined || value.regenerate_code,
  { message: 'Nenhuma alteração informada.' }
);

function json(payload: unknown, status = 200, extra: Record<string, string> = {}) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extra },
  });
}

async function authorize(req: Request) {
  if (!isValidAdminCookie((await headers()).get('cookie'))) {
    return json({ error: 'Não autorizado.' }, 401);
  }

  if (!isSameOriginRequest(req)) {
    return json({ error: 'Requisição inválida.' }, 403);
  }

  const rate = checkRateLimit(`admin-brokerage-edit:${getClientIp(req)}`, 90, 60 * 1000);
  if (!rate.allowed) {
    return json(
      { error: 'Muitas operações. Aguarde um momento.' },
      429,
      { 'Retry-After': String(rate.retryAfter) }
    );
  }

  return null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await authorize(req);
  if (authError) return authError;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return json({ error: 'Imobiliária inválida.' }, 400);
  }

  try {
    const body = schema.parse(await readJsonWithLimit(req, 8 * 1024));
    const supabase = getSupabaseAdmin();

    const [{ data: current, error: currentError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('salao_brokerages')
        .select('id,name,slug,invite_limit,invite_code,is_active')
        .eq('id', parsedId.data)
        .maybeSingle(),
      supabase
        .from('salao_leads')
        .select('id', { count: 'exact', head: true })
        .eq('brokerage_id', parsedId.data),
    ]);

    if (currentError) throw currentError;
    if (countError) throw countError;

    if (!current) {
      return json({ error: 'Imobiliária não encontrada.' }, 404);
    }

    const used = count || 0;

    if (body.invite_limit !== undefined && body.invite_limit < used) {
      return json(
        { error: `Não é possível reduzir para ${body.invite_limit}. Já existem ${used} corretores cadastrados neste grupo.` },
        409
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined && current.slug !== 'corretor-autonomo') {
      updateData.name = normalizeText(body.name);
    }

    if (body.invite_limit !== undefined) {
      updateData.invite_limit = body.invite_limit;
    }

    if (body.regenerate_code) {
      updateData.invite_code = generateInviteCode();
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { data, error } = await supabase
        .from('salao_brokerages')
        .update(updateData)
        .eq('id', parsedId.data)
        .select('id,name,slug,invite_limit,invite_code,is_active')
        .single();

      if (!error) {
        return json({
          ok: true,
          brokerage: data,
          used,
          remaining: Math.max(0, data.invite_limit - used),
        });
      }

      if (error.code === '23505' && body.regenerate_code) {
        updateData.invite_code = generateInviteCode();
        continue;
      }

      throw error;
    }

    return json({ error: 'Não foi possível gerar um novo código. Tente novamente.' }, 409);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ error: 'Revise os dados da imobiliária.' }, 400);
    }
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return json({ error: 'Requisição muito grande.' }, 413);
    }

    console.error('Falha ao editar imobiliária:', error instanceof Error ? error.message : 'erro desconhecido');
    return json({ error: 'Não foi possível salvar as alterações.' }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await authorize(req);
  if (authError) return authError;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return json({ error: 'Imobiliária inválida.' }, 400);
  }

  try {
    const supabase = getSupabaseAdmin();

    const [{ data: current, error: currentError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('salao_brokerages')
        .select('id,name,slug')
        .eq('id', parsedId.data)
        .maybeSingle(),
      supabase
        .from('salao_leads')
        .select('id', { count: 'exact', head: true })
        .eq('brokerage_id', parsedId.data),
    ]);

    if (currentError) throw currentError;
    if (countError) throw countError;

    if (!current) {
      return json({ error: 'Imobiliária não encontrada.' }, 404);
    }

    if (current.slug === 'corretor-autonomo') {
      return json({ error: 'O perfil Corretor autônomo é protegido e não pode ser excluído.' }, 409);
    }

    const used = count || 0;

    if (used > 0) {
      return json(
        {
          error: `Não é possível excluir ${current.name}. Existem ${used} corretor(es) cadastrados neste grupo.`,
          code: 'BROKERAGE_HAS_LEADS',
        },
        409
      );
    }

    const { error: deleteError } = await supabase
      .from('salao_brokerages')
      .delete()
      .eq('id', parsedId.data);

    if (deleteError) throw deleteError;

    return json({ ok: true });
  } catch (error) {
    console.error(
      'Falha ao excluir imobiliária:',
      error instanceof Error ? error.message : 'erro desconhecido'
    );

    return json({ error: 'Não foi possível excluir a imobiliária.' }, 500);
  }
}
