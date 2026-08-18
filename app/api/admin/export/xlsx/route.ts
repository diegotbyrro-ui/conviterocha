import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as XLSX from 'xlsx';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLead } from '@/lib/text';
import { safeSpreadsheetCell } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isValidAdminCookie((await headers()).get('cookie'))) return new NextResponse('Não autorizado', { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('salao_leads').select('*').order('created_at', { ascending: false });
  if (error) return new NextResponse('Erro ao exportar', { status: 500 });

  const rows = (data || []).map((raw: any) => {
    const l = normalizeLead(raw);
    return {
      Data: safeSpreadsheetCell(new Date(l.created_at).toLocaleString('pt-BR', { timeZone: 'America/Maceio' })),
      Corretor: safeSpreadsheetCell(l.name),
      WhatsApp: safeSpreadsheetCell(l.phone),
      Email: safeSpreadsheetCell(l.email || ''),
      CRECI: safeSpreadsheetCell(l.creci || ''),
      'Imobiliária / Perfil': safeSpreadsheetCell(l.brokerage || ''),
      'Perfil de atuação': safeSpreadsheetCell(l.broker_profile || ''),
      'Produto de interesse': safeSpreadsheetCell(l.interest || 'Todos'),
      'Já comercializa Rocha?': safeSpreadsheetCell(l.relationship || ''),
      Origem: safeSpreadsheetCell(l.utm_source || 'Direto'),
      Midia: safeSpreadsheetCell(l.utm_medium || ''),
      Campanha: safeSpreadsheetCell(l.utm_campaign || ''),
      Referrer: safeSpreadsheetCell(l.referrer || ''),
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{wch:20},{wch:30},{wch:18},{wch:30},{wch:18},{wch:28},{wch:24},{wch:24},{wch:22},{wch:16},{wch:16},{wch:20},{wch:35}];
  XLSX.utils.book_append_sheet(wb, ws, 'Corretores');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="corretores-salao-rocha.xlsx"',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
