import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeText } from '@/lib/text';
import { checkRateLimit, getClientIp, isSameOriginRequest, readJsonWithLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

const idSchema = z.string().uuid();
const editSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().max(160).email().optional().or(z.literal('')),
  creci: z.string().trim().max(40).optional().default(''),
  brokerage_id: z.string().uuid(),
  broker_profile: z.string().trim().min(2).max(80),
  interest: z.enum(['', 'Easy Rota do Mar', 'Vistas do Sino', 'Eco Vittá']).optional().default(''),
  relationship: z.enum(['Sim', 'Ainda não']),
});

function unauthorized() {
  return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
}

function forbidden() {
  return NextResponse.json({ error: 'Requisição inválida.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
}

async function authorize(req: Request) {
  if (!isValidAdminCookie((await headers()).get('cookie'))) return unauthorized();
  if (!isSameOriginRequest(req)) return forbidden();

  const rate = checkRateLimit(`admin-mutate:${getClientIp(req)}`, 60, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Muitas operações. Aguarde um momento.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter), 'Cache-Control': 'no-store' } }
    );
  }
  return null;
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await authorize(req);
  if (authError) return authError;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return NextResponse.json({ error: 'Cadastro inválido.' }, { status: 400 });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('salao_leads').delete().eq('id', parsedId.data);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Falha ao excluir lead:', error instanceof Error ? error.message : 'erro desconhecido');
    return NextResponse.json(
      { error: 'Não foi possível excluir o cadastro.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await authorize(req);
  if (authError) return authError;

  const { id } = await params;
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return NextResponse.json({ error: 'Cadastro inválido.' }, { status: 400 });

  try {
    const body = editSchema.parse(await readJsonWithLimit(req, 12 * 1024));
    const supabase = getSupabaseAdmin();

    const [{ data: currentLead, error: leadError }, { data: brokerage, error: brokerageError }] = await Promise.all([
      supabase.from('salao_leads').select('id,brokerage_id').eq('id', parsedId.data).maybeSingle(),
      supabase.from('salao_brokerages').select('id,name,invite_limit,is_active').eq('id', body.brokerage_id).maybeSingle(),
    ]);

    if (leadError || !currentLead) {
      return NextResponse.json({ error: 'Cadastro não encontrado.' }, { status: 404 });
    }
    if (brokerageError || !brokerage || !brokerage.is_active) {
      return NextResponse.json({ error: 'Imobiliária não encontrada ou indisponível.' }, { status: 400 });
    }

    if (currentLead.brokerage_id !== brokerage.id) {
      const { count, error: countError } = await supabase
        .from('salao_leads')
        .select('id', { count: 'exact', head: true })
        .eq('brokerage_id', brokerage.id);

      if (countError) throw countError;
      if ((count || 0) >= brokerage.invite_limit) {
        return NextResponse.json(
          { error: 'A imobiliária selecionada já atingiu o limite de convites.' },
          { status: 409, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    const { error: updateError } = await supabase
      .from('salao_leads')
      .update({
        name: normalizeText(body.name),
        phone: normalizeText(body.phone),
        email: body.email ? normalizeText(body.email) : null,
        creci: body.creci ? normalizeText(body.creci) : null,
        brokerage: brokerage.name,
        brokerage_id: brokerage.id,
        broker_profile: normalizeText(body.broker_profile),
        interest: body.interest ? normalizeText(body.interest) : null,
        relationship: normalizeText(body.relationship),
      })
      .eq('id', parsedId.data);

    if (updateError) throw updateError;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Revise os dados do corretor.' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return NextResponse.json({ error: 'Requisição muito grande.' }, { status: 413 });
    }
    console.error('Falha ao editar lead:', error instanceof Error ? error.message : 'erro desconhecido');
    return NextResponse.json(
      { error: 'Não foi possível salvar as alterações.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
