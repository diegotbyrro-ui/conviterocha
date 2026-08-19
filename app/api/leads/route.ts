import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeInviteCode } from '@/lib/invites';
import { normalizeText } from '@/lib/text';
import { checkRateLimit, getClientIp, isSameOriginRequest, readJsonWithLimit } from '@/lib/security';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().max(160).email().optional().or(z.literal('')),
  creci: z.string().trim().max(40).optional().default(''),
  invite_code: z.string().trim().min(6).max(40),
  interest: z.enum(['', 'Easy Rota do Mar', 'Vistas do Sino', 'Eco Vittá']).optional().default(''),
  relationship: z.enum(['Sim', 'Ainda não']),
  consent: z.literal('yes'),
  utm_source: z.string().max(100).optional().default(''),
  utm_medium: z.string().max(100).optional().default(''),
  utm_campaign: z.string().max(120).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
  website: z.string().max(200).optional().default(''),
  form_started_at: z.coerce.number().int().positive(),
});

type RegistrationResult = {
  ok?: boolean;
  code?: string;
  brokerage?: string;
};

function noStoreJson(payload: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

export async function POST(req: Request) {
  if (!isSameOriginRequest(req)) {
    return noStoreJson({ error: 'Requisição inválida.' }, 403);
  }

  const ip = getClientIp(req);
  const burst = checkRateLimit(`lead-burst:${ip}`, 40, 60 * 1000);
  const hourly = checkRateLimit(`lead-hour:${ip}`, 240, 60 * 60 * 1000);

  if (!burst.allowed || !hourly.allowed) {
    const retryAfter = Math.max(burst.retryAfter, hourly.retryAfter);
    return noStoreJson(
      { error: 'Muitas tentativas. Aguarde um momento e tente novamente.' },
      429,
      { 'Retry-After': String(retryAfter) }
    );
  }

  try {
    const raw = await readJsonWithLimit(req, 12 * 1024);
    const body = schema.parse(raw);

    if (body.website) return noStoreJson({ ok: true });

    const elapsed = Date.now() - body.form_started_at;
    if (elapsed < 1200 || elapsed > 4 * 60 * 60 * 1000) {
      return noStoreJson({ error: 'Atualize a página e tente novamente.' }, 429);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('register_salao_lead_by_code', {
      p_name: normalizeText(body.name),
      p_phone: normalizeText(body.phone),
      p_email: body.email ? normalizeText(body.email) : null,
      p_creci: body.creci ? normalizeText(body.creci) : null,
      p_invite_code: normalizeInviteCode(body.invite_code),
      p_interest: body.interest ? normalizeText(body.interest) : null,
      p_relationship: normalizeText(body.relationship),
      p_consent: true,
      p_utm_source: body.utm_source ? normalizeText(body.utm_source) : null,
      p_utm_medium: body.utm_medium ? normalizeText(body.utm_medium) : null,
      p_utm_campaign: body.utm_campaign ? normalizeText(body.utm_campaign) : null,
      p_referrer: body.referrer ? normalizeText(body.referrer) : null,
    });

    if (error) throw error;
    const result = (data || {}) as RegistrationResult;

    if (!result.ok && result.code === 'INVITE_FULL') {
      return noStoreJson(
        { error: 'O limite de convites deste código já foi atingido.', code: result.code },
        409
      );
    }

    if (!result.ok && result.code === 'INVITE_INVALID') {
      return noStoreJson(
        { error: 'Código de convite inválido ou indisponível.', code: result.code },
        400
      );
    }

    if (!result.ok) {
      return noStoreJson({ error: 'Não foi possível concluir seu cadastro.' }, 400);
    }

    return noStoreJson({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return noStoreJson({ error: 'Revise os dados e tente novamente.' }, 400);
    }
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return noStoreJson({ error: 'Requisição muito grande.' }, 413);
    }

    console.error('Falha ao registrar lead:', error instanceof Error ? error.message : 'erro desconhecido');
    return noStoreJson({ error: 'Não foi possível concluir o cadastro. Tente novamente.' }, 500);
  }
}