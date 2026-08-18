-- =============================================================
-- ROCHA • SALÃO DO IMÓVEL — CADASTRO DAS IMOBILIÁRIAS REAIS
-- A lista real já foi recebida e está em `brokerages-real.sql`.
-- Mantenha este arquivo apenas como modelo para futuras alterações manuais.
-- =============================================================

-- Exemplo de formato (mantenha comentado):
-- insert into public.salao_brokerages (name, slug, invite_limit, is_active)
-- values
--   ('Nome da Imobiliária', 'nome-da-imobiliaria', 30, true)
-- on conflict (slug) do update set
--   name = excluded.name,
--   invite_limit = excluded.invite_limit,
--   is_active = excluded.is_active;

-- Para desativar uma imobiliária sem apagar histórico:
-- update public.salao_brokerages
-- set is_active = false
-- where slug = 'nome-da-imobiliaria';
