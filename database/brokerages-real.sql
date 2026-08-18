-- =============================================================
-- ROCHA • SALÃO DO IMÓVEL ADEMI 2026 — IMOBILIÁRIAS REAIS
-- Fonte: Distribuicao_de_Vagas_Imobiliarias.xlsx
-- Total: 43 imobiliárias + Corretor autônomo • 350 convites
-- Seguro para reexecução: atualiza nomes/limites pelo slug e
-- desativa imobiliárias que não estão mais na lista oficial.
-- Não apaga leads já cadastrados.
-- =============================================================

begin;

update public.salao_brokerages set is_active = false;

insert into public.salao_brokerages (name, slug, invite_limit, is_active)
values
  ('Corretor autônomo', 'corretor-autonomo', 10, true),
  ('RSI Resende Soluções Imobiliárias', 'rsi-resende-solucoes-imobiliarias', 23, true),
  ('Digimob Soluções Imobiliárias', 'digimob-solucoes-imobiliarias', 19, true),
  ('LION Negócios Imobiliários', 'lion-negocios-imobiliarios', 18, true),
  ('Miranda Soluções Imobiliárias', 'miranda-solucoes-imobiliarias', 14, true),
  ('Central Imobiliária', 'central-imobiliaria', 14, true),
  ('Maison Inteligência Imobiliária', 'maison-inteligencia-imobiliaria', 12, true),
  ('NOVO LAR', 'novo-lar', 11, true),
  ('J M S Empreendimentos & Consultoria', 'j-m-s-empreendimentos-e-consultoria', 11, true),
  ('HL - Hugo Leonardo Negócios Imobiliário', 'hl-hugo-leonardo-negocios-imobiliario', 11, true),
  ('MS Negócios Imobiliários', 'ms-negocios-imobiliarios', 11, true),
  ('New Imob', 'new-imob', 10, true),
  ('Suprema Imobiliária', 'suprema-imobiliaria', 10, true),
  ('HSE 3 Imobiliária', 'hse-3-imobiliaria', 9, true),
  ('Space Imob', 'space-imob', 8, true),
  ('Open Negócios Imobiliários', 'open-negocios-imobiliarios', 8, true),
  ('Big House', 'big-house', 8, true),
  ('WS Imobiliária', 'ws-imobiliaria', 8, true),
  ('Carlos Henrique Anario de Farias', 'carlos-henrique-anario-de-farias', 7, true),
  ('Infinity Imob Negócios Imobiliários', 'infinity-imob-negocios-imobiliarios', 7, true),
  ('L.M. Consultoria', 'l-m-consultoria', 7, true),
  ('WM Imóveis', 'wm-imoveis', 6, true),
  ('Faber Soluções Imobiliárias', 'faber-solucoes-imobiliarias', 6, true),
  ('Águia Negócios Imobiliários', 'aguia-negocios-imobiliarios', 6, true),
  ('Soares Nobre Consultoria Imobiliária', 'soares-nobre-consultoria-imobiliaria', 6, true),
  ('Inove Imóveis', 'inove-imoveis', 6, true),
  ('Conecta Negócios Imobiliários', 'conecta-negocios-imobiliarios', 6, true),
  ('Re/Max al mare', 're-max-al-mare', 5, true),
  ('Uvcreci720Al', 'uvcreci720al', 5, true),
  ('Lins e Azevedo LTDA', 'lins-e-azevedo-ltda', 5, true),
  ('Re/Max Prime Lançamentos', 're-max-prime-lancamentos', 5, true),
  ('J A IMÓVEIS', 'j-a-imoveis', 5, true),
  ('Imobhouse', 'imobhouse', 5, true),
  ('Invest Imóveis e Negócios Ltda.', 'invest-imoveis-e-negocios-ltda', 5, true),
  ('Brandão Imobiliária', 'brandao-imobiliaria', 5, true),
  ('FC2 Engenharia e Empreendimentos', 'fc2-engenharia-e-empreendimentos', 5, true),
  ('CB Consultoria', 'cb-consultoria', 5, true),
  ('AMC2 Transações Imobiliárias', 'amc2-transacoes-imobiliarias', 4, true),
  ('ALM Imóveis', 'alm-imoveis', 4, true),
  ('Jarvis Inteligência Imobiliária', 'jarvis-inteligencia-imobiliaria', 4, true),
  ('Alessandro Nunes Imóveis', 'alessandro-nunes-imoveis', 4, true),
  ('Vision Imobiliária', 'vision-imobiliaria', 4, true),
  ('Forte Imóveis', 'forte-imoveis', 4, true),
  ('Nexus Negócios Imobiliários', 'nexus-negocios-imobiliarios', 4, true)
on conflict (slug) do update set
  name = excluded.name,
  invite_limit = excluded.invite_limit,
  is_active = excluded.is_active;

commit;

-- Verificação esperada: 44 opções ativas (43 imobiliárias + autônomo) e 350 convites.
select
  count(*) filter (where is_active) as imobiliarias_ativas,
  coalesce(sum(invite_limit) filter (where is_active), 0) as total_convites
from public.salao_brokerages;
