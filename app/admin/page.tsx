import { headers } from 'next/headers';
import { isValidAdminCookie } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeLead } from '@/lib/text';
import LeadActions from './LeadActions';
import QuotaControl from './QuotaControl';
import BrokerageManager from './BrokerageManager';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  creci: string | null;
  brokerage: string | null;
  brokerage_id: string | null;
  broker_profile: string | null;
  interest: string | null;
  relationship: string | null;
  utm_source: string | null;
};

type Brokerage = {
  id: string;
  name: string;
  slug: string;
  invite_limit: number;
  invite_code: string;
  is_active: boolean;
};

function Login() {
  return (
    <main className="adminLogin">
      <form action="/api/admin/login" method="post">
        <div className="adminLoginLogo">
          <img src="/rocha-logo-header.png" alt="Rocha Empreendimentos" />
        </div>
        <input type="password" name="password" placeholder="Senha do painel" required autoFocus />
        <button>Entrar</button>
      </form>
    </main>
  );
}

export default async function AdminPage() {
  const cookie = (await headers()).get('cookie');
  if (!isValidAdminCookie(cookie)) return <Login />;

  const supabase = getSupabaseAdmin();

  const [{ data: leadsData }, { data: brokeragesData }] = await Promise.all([
    supabase.from('salao_leads').select('*').order('created_at', { ascending: false }),
    supabase.from('salao_brokerages').select('id,name,slug,invite_limit,invite_code,is_active').eq('is_active', true).order('name'),
  ]);

  const leads = ((leadsData || []) as Lead[]).map((lead) => normalizeLead(lead));
  const brokerages = (brokeragesData || []) as Brokerage[];

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = leads.filter((lead) => lead.created_at.startsWith(today)).length;
  const newPartners = leads.filter((lead) => lead.relationship === 'Ainda não').length;

  const usedByBrokerage = new Map<string, number>();
  for (const lead of leads) {
    if (!lead.brokerage_id) continue;
    usedByBrokerage.set(lead.brokerage_id, (usedByBrokerage.get(lead.brokerage_id) || 0) + 1);
  }

  const quotas = brokerages.map((brokerage) => {
    const used = usedByBrokerage.get(brokerage.id) || 0;
    const remaining = Math.max(0, brokerage.invite_limit - used);
    const percent = brokerage.invite_limit > 0 ? Math.min(100, Math.round((used / brokerage.invite_limit) * 100)) : 100;
    return { ...brokerage, used, remaining, percent, full: remaining === 0 };
  });

  return (
    <main className="adminPage">
      <div className="adminTop">
        <div>
          <div className="brand">ROCHA <span>EMPREENDIMENTOS</span></div>
          <h1>Corretores • Salão do Imóvel</h1>
        </div>
        <form action="/api/admin/logout" method="post"><button className="ghost">Sair</button></form>
      </div>

      <div className="stats">
        <div><span>Total de corretores</span><b>{leads.length}</b></div>
        <div><span>Cadastros hoje</span><b>{todayCount}</b></div>
        <div><span>Novos parceiros</span><b>{newPartners}</b></div>
      </div>

      <BrokerageManager quotas={quotas} />

      <QuotaControl quotas={quotas} />

      <div className="adminActions">
        <a href="/api/admin/export/xlsx">Baixar Excel (.xlsx)</a>
        <a href="/api/admin/export/docx">Baixar Word (.docx)</a>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Data</th><th>Corretor</th><th>WhatsApp</th><th>CRECI</th><th>Imobiliária / Perfil</th><th>Perfil</th><th>Interesse</th><th>Já vende Rocha?</th><th>Origem</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{new Date(lead.created_at).toLocaleString('pt-BR', { timeZone: 'America/Maceio' })}</td>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.creci || '—'}</td>
                <td>{lead.brokerage || '—'}</td>
                <td>{lead.broker_profile || '—'}</td>
                <td>{lead.interest || 'Todos'}</td>
                <td>{lead.relationship || '—'}</td>
                <td>{lead.utm_source || 'Direto'}</td>
                <td><LeadActions id={lead.id} name={lead.name} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
