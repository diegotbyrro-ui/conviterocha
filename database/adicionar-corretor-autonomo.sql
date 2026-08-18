-- Adiciona a cota de 10 convites para corretores autônomos.
-- Seguro para executar mais de uma vez.

insert into public.salao_brokerages (name, slug, invite_limit, is_active)
values ('Corretor autônomo', 'corretor-autonomo', 10, true)
on conflict (slug) do update set
  name = excluded.name,
  invite_limit = excluded.invite_limit,
  is_active = true;

select name, invite_limit, is_active
from public.salao_brokerages
where slug = 'corretor-autonomo';

select
  count(*) filter (where is_active) as opcoes_ativas,
  coalesce(sum(invite_limit) filter (where is_active), 0) as total_convites
from public.salao_brokerages;
