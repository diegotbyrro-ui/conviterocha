# Segurança — Convite Rocha

Esta versão usa defesa em camadas. Nenhuma aplicação pública é impossível de atacar; o objetivo é reduzir a superfície de ataque, limitar abuso e proteger os dados e o painel administrativo.

## Barreiras implementadas

- Secret Key do Supabase usada somente no servidor.
- RLS ativada e acesso direto público às tabelas revogado.
- Função de cadastro executável apenas pelo backend privilegiado.
- Reserva de vaga por imobiliária feita de forma atômica no PostgreSQL.
- Senha administrativa sem fallback padrão no código.
- Em produção, senha administrativa exige ao menos 16 caracteres.
- Comparação da senha em tempo constante.
- Login limitado por IP e atraso em tentativas inválidas.
- Sessão administrativa assinada com HMAC e nonce aleatório.
- Cookie admin `HttpOnly`, `SameSite=Strict`, `Secure` em produção, `Priority=High`, sessão de 2 horas e prefixo `__Host-` em produção.
- Verificação de origem em POSTs; `APP_ORIGIN` permite fixar a origem pública exata na Hostinger.
- Rate limiting básico em memória para login, cadastro e endpoints públicos.
- Honeypot e tempo mínimo de preenchimento para reduzir bots simples.
- Limite de tamanho de payload e validação rígida com Zod.
- API pública de imobiliárias não expõe limite, ocupação ou vagas restantes.
- Mensagem de lotação não informa o número de convites.
- Mitigação de formula injection na exportação Excel.
- CSP, HSTS em produção, `X-Frame-Options`, `nosniff`, Permissions Policy, Referrer Policy, COOP, CORP e outros headers.
- `/admin` e `/api` com `no-store` e `noindex`.
- `.gitignore` bloqueia arquivos de segredo.
- Next.js em linha de manutenção com patch de segurança atual e React em versão corrigida para RSC.
- SheetJS atualizado para a distribuição oficial 0.20.3 em vez do pacote npm legado 0.18.5.

## Antes de publicar na Hostinger

1. Use repositório privado no GitHub.
2. Ative 2FA em GitHub, Hostinger e Supabase.
3. Configure as variáveis apenas no hPanel da Hostinger.
4. Defina `APP_ORIGIN` com a URL final exata.
5. Troque a senha usada durante os testes por uma nova senha exclusiva.
6. Gere um novo `ADMIN_COOKIE_SECRET` aleatório.
7. Se uma Secret Key já tiver sido exposta em Git, chat público ou arquivo compartilhado, rotacione-a no Supabase.
8. Execute `database/security-hardening.sql` se ainda não foi aplicado ao banco atual.
9. Mantenha SSL/HTTPS ativo.
10. Após o lançamento, revise periodicamente logs, dependências e atualizações de segurança.

## Rate limiting

O limitador dentro do Node.js é uma camada adicional e usa memória do processo. Reinícios do app zeram os contadores e múltiplas instâncias podem ter contadores independentes. Se o plano/infraestrutura da Hostinger oferecer firewall, CDN, proteção anti-bot ou rate limiting na borda, habilite essas proteções também.

## Backup

Antes de alterações importantes nas cotas ou no banco, mantenha backup/restore disponível no Supabase e exporte a lista de cadastros pelo painel.
