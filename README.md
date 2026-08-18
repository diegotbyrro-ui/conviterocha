# Rocha • Salão do Imóvel ADEMI 2026

Versão 14 preparada para **GitHub + Hostinger**, mantendo o layout aprovado e acrescentando endurecimento de segurança para produção.

## O que está pronto

- Convite online responsivo para corretores.
- Cadastro vinculado à imobiliária.
- Limite de convites por imobiliária processado no PostgreSQL/Supabase.
- Bloqueio automático quando a cota da imobiliária é atingida.
- Painel administrativo protegido por senha.
- Edição e exclusão de corretores.
- Exportação Excel (`.xlsx`) e Word (`.docx`).
- Limites/ocupação das imobiliárias visíveis apenas no painel interno.
- Nenhuma imobiliária fictícia cadastrada nesta versão.
- Cabeçalhos de segurança, honeypot, validação, rate limit básico e proteção de sessão administrativa.
- Dependências de framework atualizadas para uma linha de segurança suportada do Next.js.

## Requisitos

- Node.js 22 (`.nvmrc` incluído).
- npm 10+.
- Projeto Supabase já configurado.
- Hospedagem Hostinger com suporte a Node.js Web App.

## Rodar localmente

1. Copie `.env.example` para `.env.local`.
2. Preencha as variáveis reais localmente.
3. Instale e rode:

```powershell
npm install
npm run dev
```

Site:

```text
http://localhost:3000
```

Painel:

```text
http://localhost:3000/admin
```

## Variáveis de ambiente

Obrigatórias para produção:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_COOKIE_SECRET`
- `APP_ORIGIN`

Use `.env.local` somente no computador. Na Hostinger, cadastre os valores diretamente em **Environment Variables** no hPanel. Nunca suba `.env.local` ao GitHub.

## Banco

Os scripts ficam em `database/`:

- `database/supabase-schema.sql`
- `database/security-hardening.sql`
- `database/brokerages-template.sql`

Como o banco já está criado, mantenha a estrutura atual. Quando o cliente enviar a lista real, use o modelo em `database/brokerages-template.sql` para inserir/atualizar as imobiliárias e seus limites.

## GitHub

O projeto já possui `.gitignore` para impedir o envio dos arquivos `.env`, `.env.local`, builds e logs.

Antes do primeiro push, confira:

```powershell
git status
```

Garanta que **nenhum arquivo `.env.local` apareça**.

## Hostinger

Leia `HOSTINGER_DEPLOY.md`. O fluxo recomendado é:

1. Repositório privado no GitHub.
2. Hostinger → Add Website / Deploy Web App.
3. Importar o repositório GitHub.
4. Selecionar Node.js 22.
5. Adicionar as 5 variáveis de ambiente.
6. Build: `npm run build`.
7. Start: `npm run start`.
8. Testar LP, `/admin`, cadastro, limites e exportação antes de divulgar o endereço.

## Segurança

Leia `SECURITY.md` antes de publicar.


## Corretor autônomo

A lista pública inclui a opção **Corretor autônomo**, com cota própria de **10 convites**.
Ela utiliza o mesmo controle atômico de limite do banco e não expõe a quantidade de vagas ao visitante.
O total configurado passa a ser **350 convites**: 340 das 43 imobiliárias + 10 para corretores autônomos.
