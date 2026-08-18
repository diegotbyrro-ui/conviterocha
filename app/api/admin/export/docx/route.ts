import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLead } from '@/lib/text';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isValidAdminCookie((await headers()).get('cookie'))) return new NextResponse('Não autorizado', { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('salao_leads').select('*').order('created_at', { ascending: false });
  if (error) return new NextResponse('Erro ao exportar', { status: 500 });

  const header = new TableRow({ children: ['Data','Corretor','WhatsApp','CRECI','Imobiliária / Perfil','Perfil','Interesse','Já vende Rocha?'].map(v => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v, bold: true })] })] })) });
  const rows = (data || []).map((raw: any) => {
    const l = normalizeLead(raw);
    return new TableRow({ children: [
    new Date(l.created_at).toLocaleString('pt-BR', { timeZone: 'America/Maceio' }), l.name, l.phone, l.creci || '', l.brokerage || '', l.broker_profile || '', l.interest || 'Todos', l.relationship || ''
  ].map(v => new TableCell({ children: [new Paragraph(String(v))] })) });
  });

  const doc = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun({ text: 'Corretores • Salão do Imóvel — Rocha Empreendimentos', bold: true, size: 30 })] }), new Paragraph(`Total de cadastros: ${(data || []).length}`), new Table({ rows: [header, ...rows] })] }] });
  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': 'attachment; filename="corretores-salao-rocha.docx"', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
