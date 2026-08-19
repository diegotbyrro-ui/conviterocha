'use client';

import { FormEvent, useMemo, useState } from 'react';

type ManagedBrokerage = {
  id: string;
  name: string;
  slug: string;
  invite_code: string;
  invite_limit: number;
  used: number;
  remaining: number;
  percent: number;
  full: boolean;
};

type Draft = {
  name: string;
  invite_limit: string;
};

export default function BrokerageManager({ quotas }: { quotas: ManagedBrokerage[] }) {
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('10');
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      quotas.map((quota) => [
        quota.id,
        { name: quota.name, invite_limit: String(quota.invite_limit) },
      ])
    )
  );

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR');

    return [...quotas]
      .filter(
        (quota) =>
          !term ||
          quota.name.toLocaleLowerCase('pt-BR').includes(term) ||
          quota.invite_code.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (a.slug === 'corretor-autonomo') return -1;
        if (b.slug === 'corretor-autonomo') return 1;
        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [query, quotas]);

  function updateDraft(id: string, field: keyof Draft, value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || { name: '', invite_limit: '0' }),
        [field]: value,
      },
    }));
  }

  async function createBrokerage(event: FormEvent) {
    event.preventDefault();
    setFeedback('');
    setBusy('create');

    try {
      const limit = Number(newLimit);
      const res = await fetch('/api/admin/brokerages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ name: newName, invite_limit: limit }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback(json.error || 'Não foi possível adicionar a imobiliária.');
        return;
      }

      window.location.reload();
    } catch {
      setFeedback('Falha de conexão ao adicionar imobiliária.');
    } finally {
      setBusy(null);
    }
  }

  async function saveBrokerage(quota: ManagedBrokerage) {
    const draft = drafts[quota.id];
    if (!draft) return;

    setFeedback('');
    setBusy(quota.id);

    try {
      const res = await fetch(`/api/admin/brokerages/${quota.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          name: quota.slug === 'corretor-autonomo' ? quota.name : draft.name,
          invite_limit: Number(draft.invite_limit),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback(json.error || 'Não foi possível salvar as alterações.');
        return;
      }

      window.location.reload();
    } catch {
      setFeedback('Falha de conexão ao salvar.');
    } finally {
      setBusy(null);
    }
  }

  async function regenerateCode(quota: ManagedBrokerage) {
    const confirmed = window.confirm(
      `Gerar um novo código para ${quota.name}? O código atual deixará de funcionar imediatamente.`
    );
    if (!confirmed) return;

    setFeedback('');
    setBusy(`code:${quota.id}`);

    try {
      const res = await fetch(`/api/admin/brokerages/${quota.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ regenerate_code: true }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback(json.error || 'Não foi possível gerar um novo código.');
        return;
      }

      window.location.reload();
    } catch {
      setFeedback('Falha de conexão ao gerar novo código.');
    } finally {
      setBusy(null);
    }
  }

  async function deleteBrokerage(quota: ManagedBrokerage) {
    if (quota.slug === 'corretor-autonomo') {
      setFeedback('O perfil Corretor autônomo é protegido e não pode ser excluído.');
      return;
    }

    const confirmed = window.confirm(
      `Excluir ${quota.name}? Esta ação só será permitida se não houver corretores cadastrados neste grupo.`
    );
    if (!confirmed) return;

    setFeedback('');
    setBusy(`delete:${quota.id}`);

    try {
      const res = await fetch(`/api/admin/brokerages/${quota.id}`, {
        method: 'DELETE',
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback(json.error || 'Não foi possível excluir a imobiliária.');
        return;
      }

      window.location.reload();
    } catch {
      setFeedback('Falha de conexão ao excluir a imobiliária.');
    } finally {
      setBusy(null);
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback(`Código ${code} copiado.`);
    } catch {
      setFeedback('Não foi possível copiar automaticamente. Selecione o código e copie manualmente.');
    }
  }

  return (
    <section className="brokerageManager">
      <div className="brokerageManagerHead">
        <div>
          <span>GESTÃƒO DE ACESSOS</span>
          <h2>Imobiliárias, códigos e vagas</h2>
        </div>
        <p>
          Cada imobiliária possui um código próprio. O código identifica automaticamente o grupo do corretor no cadastro.
        </p>
      </div>

      <form className="brokerageCreate" onSubmit={createBrokerage}>
        <div>
          <span>NOVA IMOBILIÁRIA</span>
          <strong>Adicionar grupo</strong>
        </div>
        <label>
          Nome
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Nome da imobiliária"
            required
            minLength={2}
          />
        </label>
        <label>
          Vagas
          <input
            type="number"
            min="1"
            max="2000"
            value={newLimit}
            onChange={(event) => setNewLimit(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={busy === 'create'}>
          {busy === 'create' ? 'Adicionando...' : 'Adicionar imobiliária'}
        </button>
      </form>

      <div className="brokerageManagerTools">
        <label>
          <span>BUSCAR GRUPO OU CÓDIGO</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar imobiliária..."
          />
        </label>
        <small>
          Para diminuir vagas, o novo limite não pode ser menor que a quantidade de corretores já cadastrados.
        </small>
      </div>

      {feedback && <div className="brokerageFeedback">{feedback}</div>}

      <div className="brokerageManageTableWrap">
        <table className="brokerageManageTable">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Código de convite</th>
              <th>Cadastrados</th>
              <th>Vagas</th>
              <th>Disponíveis</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((quota) => {
              const draft = drafts[quota.id] || {
                name: quota.name,
                invite_limit: String(quota.invite_limit),
              };
              const isAutonomous = quota.slug === 'corretor-autonomo';
              const rowBusy =
                busy === quota.id ||
                busy === `code:${quota.id}` ||
                busy === `delete:${quota.id}`;

              return (
                <tr key={quota.id}>
                  <td>
                    {isAutonomous && <span className="managedSpecial">PERFIL AUTÔNOMO</span>}
                    <input
                      className="managedNameInput"
                      value={draft.name}
                      disabled={isAutonomous || rowBusy}
                      onChange={(event) => updateDraft(quota.id, 'name', event.target.value)}
                    />
                  </td>
                  <td>
                    <div className="managedCode">
                      <code>{quota.invite_code}</code>
                      <button type="button" onClick={() => copyCode(quota.invite_code)}>
                        Copiar
                      </button>
                    </div>
                  </td>
                  <td className="managedNumeric"><b>{quota.used}</b></td>
                  <td>
                    <input
                      className="managedLimitInput"
                      type="number"
                      min={quota.used}
                      max="2000"
                      value={draft.invite_limit}
                      disabled={rowBusy}
                      onChange={(event) => updateDraft(quota.id, 'invite_limit', event.target.value)}
                    />
                  </td>
                  <td className="managedNumeric">{quota.remaining}</td>
                  <td>
                    <div className="managedActions">
                      <button
                        type="button"
                        className="managedSave"
                        disabled={rowBusy}
                        onClick={() => saveBrokerage(quota)}
                      >
                        {busy === quota.id ? 'Salvando...' : 'Salvar'}
                      </button>

                      <button
                        type="button"
                        className="managedRegenerate"
                        disabled={rowBusy}
                        onClick={() => regenerateCode(quota)}
                      >
                        {busy === `code:${quota.id}` ? 'Gerando...' : 'Novo código'}
                      </button>

                      <button
                        type="button"
                        className="managedDelete"
                        disabled={rowBusy || isAutonomous}
                        title={isAutonomous ? 'Perfil protegido' : 'Excluir imobiliária'}
                        onClick={() => deleteBrokerage(quota)}
                      >
                        {busy === `delete:${quota.id}` ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
