-- =============================================================
-- ROCHA â€¢ SALÃƒO DO IMÃ“VEL â€” MIGRAÃ‡ÃƒO PARA CÃ“DIGOS DE CONVITE
-- Execute no SQL Editor do Supabase antes de publicar.
-- =============================================================

create extension if not exists pgcrypto;

alter table public.salao_brokerages
  add column if not exists invite_code text;

update public.salao_brokerages
set invite_code =
  'RCH-' ||
  upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 4)) || '-' ||
  upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 4)) || '-' ||
  upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 4)) || '-' ||
  upper(substr(md5(gen_random_uuid()::text || clock_timestamp()::text), 1, 4))
where invite_code is null
   or btrim(invite_code) = '';

create unique index if not exists ux_salao_brokerages_invite_code
  on public.salao_brokerages(invite_code);

alter table public.salao_brokerages
  alter column invite_code set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'salao_brokerages_invite_code_format'
      and conrelid = 'public.salao_brokerages'::regclass
  ) then
    alter table public.salao_brokerages
      add constraint salao_brokerages_invite_code_format
      check (invite_code ~ '^RCH-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$');
  end if;
end $$;

create or replace function public.register_salao_lead_by_code(
  p_name text,
  p_phone text,
  p_email text,
  p_creci text,
  p_invite_code text,
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
  v_profile text;
begin
  select *
    into v_brokerage
  from public.salao_brokerages
  where invite_code = upper(btrim(p_invite_code))
    and is_active = true
  for update;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'INVITE_INVALID');
  end if;

  select count(*)::integer
    into v_used
  from public.salao_leads
  where brokerage_id = v_brokerage.id;

  if v_used >= v_brokerage.invite_limit then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'INVITE_FULL',
      'brokerage', v_brokerage.name
    );
  end if;

  v_profile := case
    when v_brokerage.slug = 'corretor-autonomo' then 'Corretor autÃ´nomo'
    else 'Corretor de imobiliÃ¡ria'
  end;

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
    v_profile,
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
    'brokerage', v_brokerage.name
  );
end;
$$;

revoke all on function public.register_salao_lead_by_code(
  text,text,text,text,text,text,text,boolean,text,text,text,text
) from public, anon, authenticated;

grant execute on function public.register_salao_lead_by_code(
  text,text,text,text,text,text,text,boolean,text,text,text,text
) to service_role;