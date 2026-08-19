import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeInviteCode } from '@/lib/invites';
import { checkRateLimit, getClientIp, isSameOriginRequest, readJsonWithLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

const schema = z.object({
  code: z.string().trim().min(6).max(40),
});

function json(payload: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return json({ error: 'Requisição inválida.' }, 403);
  }

  const ip = getClientIp(req);
  const burst = checkRateLimit(`invite-validate:${ip}`, 30, 60 * 1000);
  const hourly = checkRateLimit(`invite-validate-hour:${ip}`, 240, 60 * 60 * 1000);

  if (!burst.allowed || !hourly.allowed) {
    const retryAfter = Math.max(burst.retryAfter, hourly.retryAfter);
    return json(
      { error: 'Muitas tentativas. Aguarde um momento e tente novamente.' },
      429,
      { 'Retry-After': String(retryAfter) }
    );
  }

  try {
    const body = schema.parse(await readJsonWithLimit(req, 4 * 1024));
    const code = normalizeInviteCode(body.code);
    const supabase = getSupabaseAdmin();

    const { data: brokerage, error } = await supabase
      .from('salao_brokerages')
      .select('id,name,slug,invite_limit,is_active')
      .eq('invite_code', code)
      .maybeSingle();

    if (error) throw error;

    if (!brokerage || !brokerage.is_active) {
      return json({ error: 'Código de convite inválido.', code: 'INVITE_INVALID' }, 404);
    }

    const { count, error: countError } = await supabase
      .from('salao_leads')
      .select('id', { count: 'exact', head: true })
      .eq('brokerage_id', brokerage.id);

    if (countError) throw countError;

    if ((count || 0) >= brokerage.invite_limit) {
      return json(
        { error: 'O limite de convites deste código já foi atingido.', code: 'INVITE_FULL' },
        409
      );
    }

    return json({
      ok: true,
      name: brokerage.name,
      profile: brokerage.slug === 'corretor-autonomo'
        ? 'Corretor autônomo'
        : 'Corretor de imobiliária',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ error: 'Código de convite inválido.' }, 400);
    }
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return json({ error: 'Requisição muito grande.' }, 413);
    }

    console.error('Falha ao validar convite:', error instanceof Error ? error.message : 'erro desconhecido');
    return json({ error: 'Não foi possível validar o convite. Tente novamente.' }, 500);
  }
}