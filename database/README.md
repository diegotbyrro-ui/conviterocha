# Banco de dados

- `supabase-schema.sql`: criação/atualização da estrutura base, tabelas, índices e função atômica de cadastro.
- `security-hardening.sql`: reforço de RLS/permissões. Não apaga dados.
- `brokerages-template.sql`: modelo para cadastrar a lista real de imobiliárias e limites quando o cliente enviar.

Nunca coloque Secret Keys dentro de arquivos SQL versionados.
