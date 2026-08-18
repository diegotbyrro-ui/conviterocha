'use client';

import { FormEvent, useState } from 'react';

type Brokerage = {
  id: string;
  name: string;
  invite_limit: number;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  creci: string | null;
  brokerage_id: string | null;
  broker_profile: string | null;
  interest: string | null;
  relationship: string | null;
};

export default function EditLeadForm({ lead, brokerages }: { lead: Lead; brokerages: Brokerage[] }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Não foi possível salvar as alterações.');
        setSaving(false);
        return;
      }
      window.location.href = '/admin';
    } catch {
      setError('Não foi possível salvar as alterações.');
      setSaving(false);
    }
  }

  return (
    <form className="editLeadForm" onSubmit={submit}>
      <div className="editLeadGrid">
        <label>
          Nome completo
          <input name="name" defaultValue={lead.name} required />
        </label>
        <label>
          WhatsApp
          <input name="phone" defaultValue={lead.phone} required />
        </label>
        <label>
          E-mail
          <input type="email" name="email" defaultValue={lead.email || ''} />
        </label>
        <label>
          CRECI
          <input name="creci" defaultValue={lead.creci || ''} />
        </label>
        <label className="editLeadGridFull">
          Imobiliária / Perfil
          <select name="brokerage_id" defaultValue={lead.brokerage_id || ''} required>
            <option value="">Selecione</option>
            {brokerages.map((brokerage) => (
              <option key={brokerage.id} value={brokerage.id}>{brokerage.name} • limite {brokerage.invite_limit}</option>
            ))}
          </select>
        </label>
        <label>
          Perfil
          <select name="broker_profile" defaultValue={lead.broker_profile || ''} required>
            <option value="Corretor autônomo">Corretor autônomo</option>
            <option value="Corretor de imobiliária">Corretor de imobiliária</option>
            <option value="Gestor ou líder de equipe">Gestor ou líder de equipe</option>
            <option value="Imobiliária / parceiro comercial">Imobiliária / parceiro comercial</option>
          </select>
        </label>
        <label>
          Interesse
          <select name="interest" defaultValue={lead.interest || ''}>
            <option value="">Quero conhecer todos</option>
            <option value="Easy Rota do Mar">Easy Rota do Mar</option>
            <option value="Vistas do Sino">Vistas do Sino</option>
            <option value="Eco Vittá">Eco Vittá</option>
          </select>
        </label>
        <label className="editLeadGridFull">
          Já comercializa empreendimentos da Rocha?
          <select name="relationship" defaultValue={lead.relationship || ''} required>
            <option value="Sim">Sim</option>
            <option value="Ainda não">Ainda não</option>
          </select>
        </label>
      </div>

      {error ? <div className="editLeadError">{error}</div> : null}

      <div className="editLeadButtons">
        <a href="/admin" className="editLeadCancel">Cancelar</a>
        <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
      </div>
    </form>
  );
}
