import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/security';

export const dynamic = 'force-dynamic';

type Brokerage = {
  id: string;
  name: string;
  slug: string;
};

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`brokerages:${ip}`, 120, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Muitas solicitações.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter), 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('salao_brokerages')
      .select('id,name,slug')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    // A API pública não expõe limites, contadores ou vagas restantes.
    const result = ((data || []) as Brokerage[])
      .map((brokerage) => ({
        id: brokerage.id,
        name: brokerage.name,
        slug: brokerage.slug,
      }))
      .sort((a, b) => {
        if (a.slug === 'corretor-autonomo') return -1;
        if (b.slug === 'corretor-autonomo') return 1;
        return a.name.localeCompare(b.name, 'pt-BR');
      });

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Falha ao carregar imobiliárias:', error instanceof Error ? error.message : 'erro desconhecido');
    return NextResponse.json(
      { error: 'Não foi possível carregar as imobiliárias.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
