# Deploy — Hostinger

## 1. GitHub

Use um repositório **privado**. Não envie `.env.local`, Secret Keys ou senhas.

Estrutura que deve estar no repositório:

- `app/`
- `lib/`
- `public/`
- `database/`
- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `.env.example`
- `.gitignore`

Não envie `node_modules/` nem `.next/`.

## 2. Criar o Web App na Hostinger

No hPanel:

1. Abra **Websites**.
2. Escolha **Add Website / Deploy Web App / Node.js Web App** (o texto pode variar conforme o painel).
3. Conecte o GitHub.
4. Selecione o repositório e a branch de produção.
5. Use **Node.js 22**.

O projeto informa em `package.json` que requer Node `>=22 <23`.

## 3. Variáveis de ambiente

Cadastre no hPanel:

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
ADMIN_COOKIE_SECRET
APP_ORIGIN
```

`APP_ORIGIN` deve ser a URL pública exata, sem `/` no final. Exemplo:

```text
https://convite.meurocha.com.br
```

Regras:

- `ADMIN_PASSWORD`: 16+ caracteres em produção.
- `ADMIN_COOKIE_SECRET`: 32+ caracteres; 64+ recomendado.
- `SUPABASE_SERVICE_ROLE_KEY`: nunca expor no navegador ou GitHub.

## 4. Comandos

Build:

```text
npm run build
```

Start:

```text
npm run start
```

O `start` já escuta em `0.0.0.0` e usa a porta fornecida pelo ambiente.

## 5. SSL e domínio

Ative o SSL gerenciado pela Hostinger antes do uso público. A aplicação envia HSTS em produção, então o domínio deve operar corretamente em HTTPS.

## 6. Checklist depois do deploy

Teste nesta ordem:

1. Abrir a LP em desktop e celular.
2. Confirmar que o mapa aparece.
3. Confirmar que a lista real de imobiliárias carrega.
4. Fazer 1 cadastro controlado.
5. Conferir no Supabase.
6. Entrar em `/admin`.
7. Conferir o cadastro no painel.
8. Baixar Excel e Word.
9. Excluir o cadastro de teste.
10. Testar uma imobiliária próxima do limite antes do lançamento oficial.

## 7. Atualizações futuras

Ao alterar código no GitHub, faça o redeploy pelo painel da Hostinger. Se alterar Environment Variables, salve e redeploy/reinicie o app para que os novos valores sejam carregados.
