-- =============================================================
-- ROCHA • SALÃO DO IMÓVEL — SCHEMA FINAL
-- Sem imobiliárias fictícias e sem apagar dados existentes.
-- Para um projeto novo, execute este arquivo uma vez no SQL Editor.
-- =============================================================

create extension if not exists pgcrypto;

create table if not exists public.salao_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  creci text,
  brokerage text,
  brokerage_id uuid,
  broker_profile text,
  interest text,
  relationship text,
  consent boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text
);

create table if not exists public.salao_brokerages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  invite_limit integer not null check (invite_limit >= 0),
  is_active boolean not null default true
);

alter table public.salao_leads add column if not exists brokerage_id uuid;

-- Adiciona a FK somente se ainda não existir.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'salao_leads_brokerage_id_fkey'
      and conrelid = 'public.salao_leads'::regclass
  ) then
    alter table public.salao_leads
      add constraint salao_leads_brokerage_id_fkey
      foreign key (brokerage_id) references public.salao_brokerages(id);
  end if;
end $$;

create index if not exists idx_salao_leads_created_at on public.salao_leads(created_at desc);
create index if not exists idx_salao_leads_interest on public.salao_leads(interest);
create index if not exists idx_salao_leads_brokerage on public.salao_leads(brokerage);
create index if not exists idx_salao_leads_brokerage_id on public.salao_leads(brokerage_id);

alter table public.salao_leads enable row level security;
alter table public.salao_brokerages enable row level security;

create or replace function public.register_salao_lead(
  p_name text,
  p_phone text,
  p_email text,
  p_creci text,
  p_brokerage_slug text,
  p_broker_profile text,
  p_interest text,
  p_relationship text,
  p_consent boolean,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_referrer text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_brokerage public.salao_brokerages%rowtype;
  v_used integer := 0;
  v_lead_id uuid;
begin
  select *
    into v_brokerage
  from public.salao_brokerages
  where slug = p_brokerage_slug
    and is_active = true
  for update;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'BROKERAGE_NOT_FOUND');
  end if;

  select count(*)::integer
    into v_used
  from public.salao_leads
  where brokerage_id = v_brokerage.id;

  if v_used >= v_brokerage.invite_limit then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'BROKERAGE_FULL',
      'brokerage', v_brokerage.name,
      'limit', v_brokerage.invite_limit,
      'used', v_used,
      'remaining', 0
    );
  end if;

  insert into public.salao_leads (
    name, phone, email, creci, brokerage, brokerage_id,
    broker_profile, interest, relationship, consent,
    utm_source, utm_medium, utm_campaign, referrer
  ) values (
    p_name,
    p_phone,
    nullif(p_email, ''),
    nullif(p_creci, ''),
    v_brokerage.name,
    v_brokerage.id,
    p_broker_profile,
    nullif(p_interest, ''),
    p_relationship,
    p_consent,
    nullif(p_utm_source, ''),
    nullif(p_utm_medium, ''),
    nullif(p_utm_campaign, ''),
    nullif(p_referrer, '')
  )
  returning id into v_lead_id;

  return pg_catalog.jsonb_build_object(
    'ok', true,
    'lead_id', v_lead_id,
    'brokerage', v_brokerage.name,
    'limit', v_brokerage.invite_limit,
    'used', v_used + 1,
    'remaining', greatest(0, v_brokerage.invite_limit - (v_used + 1))
  );
end;
$$;

-- Defesa em profundidade: nada de acesso direto com chaves públicas.
revoke all on table public.salao_leads from public, anon, authenticated;
revoke all on table public.salao_brokerages from public, anon, authenticated;
revoke create on schema public from public, anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.salao_leads to service_role;
grant select, insert, update, delete on table public.salao_brokerages to service_role;

revoke all on function public.register_salao_lead(
  text,text,text,text,text,text,text,text,boolean,text,text,text,text
) from public, anon, authenticated;

grant execute on function public.register_salao_lead(
  text,text,text,text,text,text,text,text,boolean,text,text,text,text
) to service_role;
