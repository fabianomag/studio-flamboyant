# Next

## Pós-publicação

O case está publicado em `https://flamboyant-studio.vercel.app/`, com `main`
sincronizada ao remoto e card social de licença ativo.

1. Usar o LinkedIn Post Inspector antes de criar uma nova publicação quando a
   rede mostrar a prévia antiga; o LinkedIn mantém cache próprio de URLs já
   compartilhadas.
2. Antes de divulgar o formulário como canal ativo de contato, verificar o
   domínio remetente no Resend, configurar `RESEND_API_KEY`,
   `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` e `NEXT_PUBLIC_SITE_URL` no projeto
   Vercel e confirmar a entrega de um lead real.
3. Configurar rate limiting no Vercel Firewall para `POST /api/leads` quando o
   endpoint de contato passar a receber tráfego público relevante.
4. Se o case ganhar domínio próprio, promover esse domínio a canônico e então
   revisar redirects, `NEXT_PUBLIC_SITE_URL`, sitemap, Open Graph e o envio do
   formulário nessa origem.
