'use client';

import { useState } from 'react';

export default function LeadActions({ id, name }: { id: string; name: string }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function removeLead() {
    const ok = window.confirm(`Excluir o cadastro de ${name}?\n\nEssa ação libera uma vaga da imobiliária e não pode ser desfeita.`);
    if (!ok) return;

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Não foi possível excluir o cadastro.');
        setDeleting(false);
        return;
      }
      window.location.reload();
    } catch {
      setError('Não foi possível excluir o cadastro.');
      setDeleting(false);
    }
  }

  return (
    <div className="leadActionsCell">
      <a className="leadAction leadAction--edit" href={`/admin/corretores/${id}`}>Editar</a>
      <button className="leadAction leadAction--delete" type="button" onClick={removeLead} disabled={deleting}>
        {deleting ? 'Excluindo...' : 'Excluir'}
      </button>
      {error ? <small className="leadActionError">{error}</small> : null}
    </div>
  );
}
