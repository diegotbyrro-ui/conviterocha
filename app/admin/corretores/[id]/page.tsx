import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLead } from '@/lib/text';
import EditLeadForm from '../../EditLeadForm';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export default async function EditLeadPage({ params }: Params) {
  const cookie = (await headers()).get('cookie');
  if (!isValidAdminCookie(cookie)) redirect('/admin');

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const [{ data: leadData, error: leadError }, { data: brokeragesData, error: brokeragesError }] = await Promise.all([
    supabase.from('salao_leads').select('*').eq('id', id).maybeSingle(),
    supabase.from('salao_brokerages').select('id,name,invite_limit').eq('is_active', true).order('name'),
  ]);

  if (leadError || !leadData) notFound();
  if (brokeragesError) throw brokeragesError;

  const lead = normalizeLead(leadData as any);

  return (
    <main className="editLeadPage">
      <div className="editLeadShell">
        <div className="editLeadHeader">
          <div>
            <span>ROCHA EMPREENDIMENTOS</span>
            <h1>Editar corretor</h1>
            <p>Altere os dados do cadastro. Se mudar a imobiliária, o sistema verifica o limite de vagas antes de salvar.</p>
          </div>
          <a href="/admin">← Voltar ao painel</a>
        </div>
        <EditLeadForm lead={lead as any} brokerages={(brokeragesData || []) as any} />
      </div>
    </main>
  );
}
