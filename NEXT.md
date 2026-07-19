# Next

## Deploy e promoção

1. Criar ou confirmar um repositório e um projeto Vercel públicos neutros. Não
   reutilizar um remoto, histórico, nome de projeto ou domínio associado a um
   trabalho de cliente.
2. Configurar no Vercel Firewall um limite para `POST /api/leads`; as barreiras
   da aplicação reduzem bots simples, mas não substituem rate limiting no edge.
3. Verificar o domínio remetente no Resend e definir os endereços reais de
   `CONTACT_FROM_EMAIL` e `CONTACT_TO_EMAIL`.
4. Configurar no projeto Vercel, por ambiente, `RESEND_API_KEY`,
   `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` e `NEXT_PUBLIC_SITE_URL`. A URL
   pública precisa coincidir com a origem que envia o formulário; em produção,
   deve ser o domínio canônico final.
5. Gerar um Preview Deployment a partir de `dev` e validar no ambiente Vercel:
   envio real pelo Resend, sugestão de português para país BR, canonical,
   `hreflang`, Open Graph, `sitemap.xml`, `robots.txt`, Analytics e Speed
   Insights. O preview usado para testar o formulário deve ter uma origem
   coerente com seu `NEXT_PUBLIC_SITE_URL`.
6. Apresentar o preview e o resumo da validação a Fabiano. Somente após aprovação
   explícita, promover `dev` para `main` e publicar a implantação de produção.
7. Após a promoção, executar um smoke final no domínio canônico e confirmar a
   entrega de um lead real antes de encerrar. Se houver regressão, manter `main`
   anterior disponível para rollback.
