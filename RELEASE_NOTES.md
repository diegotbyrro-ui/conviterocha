# Release — Versão 14 Hostinger

## Mantido

- Layout e conteúdo visual da versão 14 aprovada.
- Fluxo de cadastro por imobiliária.
- Controle de cotas por imobiliária.
- Painel admin, edição, exclusão, Excel e Word.

## Preparação para produção

- Migração do projeto para Next.js 15.5.21 (linha Maintenance LTS com patch de segurança de julho/2026).
- React/React DOM 19.1.6.
- Supabase JS 2.112.3 para Node.js 22.
- Node.js 22 fixado como runtime recomendado/aceito.
- SheetJS 0.20.3 pela distribuição oficial.
- APIs assíncronas do Next 15 ajustadas (`headers` e `params`).
- Cookie admin reforçado com prefixo `__Host-` em produção.
- `APP_ORIGIN` adicionado para validação de origem no domínio final.
- Headers de segurança revisados.
- `.gitignore` e `.gitattributes` preparados para GitHub.
- Documentação de deploy específica para Hostinger.
- Scripts SQL organizados em `database/`.
- Nenhuma imobiliária/cadastro fictício incluído.
- Nenhum `.env.local` ou segredo real incluído.
