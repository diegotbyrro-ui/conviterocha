import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateInviteCode, slugifyBrokerage } from '@/lib/invites';
import { normalizeText } from '@/lib/text';
import { checkRateLimit, getClientIp, isSameOriginRequest, readJsonWithLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  invite_limit: z.coerce.number().int().min(1).max(2000),
});

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

  const rate = checkRateLimit(`admin-brokerages:${getClientIp(req)}`, 60, 60 * 1000);
  if (!rate.allowed) {
    return json(
      { error: 'Muitas operações. Aguarde um momento.' },
      429,
      { 'Retry-After': String(rate.retryAfter) }
    );
  }

  return null;
}

export async function POST(req: Request) {
  const authError = await authorize(req);
  if (authError) return authError;

  try {
    const body = schema.parse(await readJsonWithLimit(req, 8 * 1024));
    const supabase = getSupabaseAdmin();
    const name = normalizeText(body.name);

    const { data: existing, error: existingError } = await supabase
      .from('salao_brokerages')
      .select('id')
      .ilike('name', name)
      .limit(1);

    if (existingError) throw existingError;
    if (existing && existing.length > 0) {
      return json({ error: 'Já existe uma imobiliária com esse nome.' }, 409);
    }

    const baseSlug = slugifyBrokerage(name);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const slug = attempt === 0
        ? baseSlug
        : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

      const { data, error } = await supabase
        .from('salao_brokerages')
        .insert({
          name,
          slug,
          invite_limit: body.invite_limit,
          invite_code: generateInviteCode(),
          is_active: true,
        })
        .select('id,name,slug,invite_limit,invite_code,is_active')
        .single();

      if (!error) return json({ ok: true, brokerage: data }, 201);
      if (error.code !== '23505') throw error;
    }

    return json({ error: 'Não foi possível gerar um código único. Tente novamente.' }, 409);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ error: 'Revise o nome e a quantidade de vagas.' }, 400);
    }
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return json({ error: 'Requisição muito grande.' }, 413);
    }

    console.error('Falha ao criar imobiliária:', error instanceof Error ? error.message : 'erro desconhecido');
    return json({ error: 'Não foi possível adicionar a imobiliária.' }, 500);
  }
}