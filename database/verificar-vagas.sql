-- ROCHA • VERIFICAÇÃO DE VAGAS POR IMOBILIÁRIA

select
  b.name as imobiliaria,
  b.invite_limit as limite,
  count(l.id)::integer as cadastrados,
  greatest(b.invite_limit - count(l.id)::integer, 0) as disponiveis,
  case when count(l.id) >= b.invite_limit then 'ESGOTADO' else 'DISPONÍVEL' end as status
from public.salao_brokerages b
left join public.salao_leads l on l.brokerage_id = b.id
where b.is_active = true
group by b.id, b.name, b.invite_limit
order by b.name;

select
  count(*) filter (where is_active) as imobiliarias_ativas,
  coalesce(sum(invite_limit) filter (where is_active), 0) as total_convites
from public.salao_brokerages;
