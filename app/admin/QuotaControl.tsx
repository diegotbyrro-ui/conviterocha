'use client';

import { useMemo, useState } from 'react';

type Quota = {
  id: string;
  name: string;
  slug: string;
  invite_limit: number;
  used: number;
  remaining: number;
  percent: number;
  full: boolean;
};

type Filter = 'all' | 'available' | 'low' | 'full';
type Sort = 'name' | 'limit-desc' | 'remaining-asc';

const PAGE_SIZE = 12;

function isAutonomous(quota: Quota) {
  return quota.slug === 'corretor-autonomo' || quota.name.toLocaleLowerCase('pt-BR').includes('autônomo');
}

function isNearlyFull(quota: Quota) {
  if (quota.full || quota.invite_limit <= 0) return false;
  const threshold = Math.max(1, Math.ceil(quota.invite_limit * 0.15));
  return quota.remaining <= threshold;
}

function statusFor(quota: Quota) {
  if (quota.full) return { label: 'Esgotado', tone: 'full' };
  if (isNearlyFull(quota)) return { label: quota.remaining === 1 ? 'Resta 1 vaga' : `Restam ${quota.remaining}`, tone: 'low' };
  return { label: 'Disponível', tone: 'available' };
}

export default function QuotaControl({ quotas }: { quotas: Quota[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('name');
  const [page, setPage] = useState(1);

  const autonomous = quotas.find(isAutonomous) || null;
  const brokerages = quotas.filter((quota) => !isAutonomous(quota));

  const totals = useMemo(() => {
    return quotas.reduce(
      (acc, quota) => {
        acc.invites += quota.invite_limit;
        acc.used += quota.used;
        acc.remaining += quota.remaining;
        return acc;
      },
      { invites: 0, used: 0, remaining: 0 }
    );
  }, [quotas]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');

    const list = brokerages.filter((quota) => {
      const matchesQuery = !normalizedQuery || quota.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery);
      if (!matchesQuery) return false;

      if (filter === 'full') return quota.full;
      if (filter === 'low') return isNearlyFull(quota);
      if (filter === 'available') return !quota.full;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === 'limit-desc') return b.invite_limit - a.invite_limit || a.name.localeCompare(b.name, 'pt-BR');
      if (sort === 'remaining-asc') return a.remaining - b.remaining || a.name.localeCompare(b.name, 'pt-BR');
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [brokerages, filter, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilter(value: Filter) {
    setFilter(value);
    setPage(1);
  }

  function updateSort(value: Sort) {
    setSort(value);
    setPage(1);
  }

  const autonomousStatus = autonomous ? statusFor(autonomous) : null;

  return (
    <section className="quotaSection quotaSection--compact">
      <div className="quotaHeading quotaHeading--compact">
        <div>
          <span>CONTROLE DE CONVITES</span>
          <h2>Vagas por imobiliária</h2>
        </div>
        <p>Acompanhamento interno. Limites e ocupação não são exibidos para os corretores.</p>
      </div>

      <div className="quotaSummary" aria-label="Resumo dos convites">
        <div><span>Grupos</span><b>{quotas.length}</b></div>
        <div><span>Convites</span><b>{totals.invites}</b></div>
        <div><span>Utilizados</span><b>{totals.used}</b></div>
        <div><span>Disponíveis</span><b>{totals.remaining}</b></div>
      </div>

      {autonomous && autonomousStatus && (
        <div className="autonomousQuota">
          <div className="autonomousQuotaCopy">
            <span>PERFIL SEPARADO</span>
            <strong>Corretor autônomo</strong>
          </div>
          <div className="autonomousQuotaNumbers">
            <b>{autonomous.used}</b>
            <span>de {autonomous.invite_limit} convites</span>
          </div>
          <div className="autonomousQuotaRemaining">
            <span className={`quotaStatus quotaStatus--${autonomousStatus.tone}`}>{autonomousStatus.label}</span>
            <small>{autonomous.remaining} disponíveis</small>
          </div>
          <div className="compactProgress" aria-label={`${autonomous.percent}% utilizado`}>
            <i style={{ width: `${autonomous.percent}%` }} />
          </div>
        </div>
      )}

      <div className="quotaToolbar">
        <label className="quotaSearch">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Buscar imobiliária..."
          />
        </label>

        <div className="quotaFilters" aria-label="Filtrar imobiliárias">
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => updateFilter('all')}>Todas</button>
          <button type="button" className={filter === 'available' ? 'is-active' : ''} onClick={() => updateFilter('available')}>Com vagas</button>
          <button type="button" className={filter === 'low' ? 'is-active' : ''} onClick={() => updateFilter('low')}>Quase lotadas</button>
          <button type="button" className={filter === 'full' ? 'is-active' : ''} onClick={() => updateFilter('full')}>Esgotadas</button>
        </div>

        <label className="quotaSort">
          <span>Ordenar</span>
          <select value={sort} onChange={(event) => updateSort(event.target.value as Sort)}>
            <option value="name">Nome A–Z</option>
            <option value="limit-desc">Maior limite</option>
            <option value="remaining-asc">Menos vagas</option>
          </select>
        </label>
      </div>

      <div className="quotaTableWrap">
        <table className="quotaTable">
          <thead>
            <tr>
              <th>Imobiliária</th>
              <th>Cadastrados</th>
              <th>Limite</th>
              <th>Disponíveis</th>
              <th>Ocupação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((quota) => {
              const status = statusFor(quota);
              return (
                <tr key={quota.id}>
                  <td><strong>{quota.name}</strong></td>
                  <td className="quotaNumeric">{quota.used}</td>
                  <td className="quotaNumeric">{quota.invite_limit}</td>
                  <td className="quotaNumeric"><b>{quota.remaining}</b></td>
                  <td>
                    <div className="quotaProgressCell">
                      <div className="compactProgress"><i style={{ width: `${quota.percent}%` }} /></div>
                      <span>{quota.percent}%</span>
                    </div>
                  </td>
                  <td><span className={`quotaStatus quotaStatus--${status.tone}`}>{status.label}</span></td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="quotaEmpty">Nenhuma imobiliária encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="quotaFooter">
        <span>
          {filtered.length === 0
            ? '0 imobiliárias'
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} de ${filtered.length} imobiliárias`}
        </span>
        <div className="quotaPagination">
          <button type="button" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Anterior</button>
          <b>{safePage} / {totalPages}</b>
          <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Próxima</button>
        </div>
      </div>
    </section>
  );
}
