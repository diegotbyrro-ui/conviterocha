-- =============================================================
-- ROCHA • SALÃO DO IMÓVEL — HARDENING DE BANCO
-- Execute UMA VEZ no SQL Editor do Supabase após criar as tabelas/função.
-- Este arquivo NÃO apaga dados.
-- =============================================================

-- RLS ligada e nenhuma leitura/escrita pública direta.
alter table if exists public.salao_leads enable row level security;
alter table if exists public.salao_brokerages enable row level security;

revoke all on table public.salao_leads from anon, authenticated;
revoke all on table public.salao_brokerages from anon, authenticated;

-- O backend usa apenas a chave secreta/service_role.
grant select, insert, update, delete on table public.salao_leads to service_role;
grant select, insert, update, delete on table public.salao_brokerages to service_role;

-- Evita criação de objetos por papéis públicos no schema exposto.
revoke create on schema public from public, anon, authenticated;

-- A função de cadastro não pode ser chamada por anon/authenticated diretamente.
revoke all on function public.register_salao_lead(
  text,text,text,text,text,text,text,text,boolean,text,text,text,text
) from public, anon, authenticated;

grant execute on function public.register_salao_lead(
  text,text,text,text,text,text,text,text,boolean,text,text,text,text
) to service_role;

-- Confirmação visual dos privilégios essenciais.
select
  c.relname as objeto,
  c.relrowsecurity as rls_ativo
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('salao_leads','salao_brokerages')
order by c.relname;
