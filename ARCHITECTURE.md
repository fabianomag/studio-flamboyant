# Studio Flamboyant — Arquitetura

## Produto e fronteira

Studio Flamboyant é um case público de frontend apresentado como experiência de
um escritório de arquitetura conceitual. A arquitetura, a marca e os três
projetos são fictícios e não construídos; o trabalho de design e engenharia do
site é real e creditado a Fabiano Frank.

O produto não capta clientes de arquitetura. O fechamento comercial leva a um
formulário para sites, sistemas frontend e produtos digitais.

## Runtime e organização

- Next.js 16 App Router, React 19 e TypeScript;
- Server Components por padrão e ilhas client somente para navegação, motion,
  sugestão de idioma e formulário;
- conteúdo localizado e contratos de rota centralizados em
  `src/content/site.ts`;
- estilos responsivos e tokens do sistema em `src/app/globals.css`;
- tipografia baseada em fontes de sistema (`Helvetica Neue`/Helvetica/Arial e
  Georgia), sem payload ou repintura tardia de webfont;
- assets locais processados por `next/image`;
- páginas de projeto pré-geradas por `generateStaticParams`, com
  `dynamicParams = false`;
- `global-not-found.tsx` como saída explícita para URLs fora do contrato.

## Contrato de URLs

O inglês é canônico e não recebe prefixo. O português brasileiro ocupa a árvore
`/pt`. Não há redirecionamento geográfico obrigatório.

| Inglês | Português |
| --- | --- |
| `/` | `/pt` |
| `/projects` | `/pt/projetos` |
| `/projects/horizon-pavilion` | `/pt/projetos/pavilhao-horizonte` |
| `/projects/mist-house` | `/pt/projetos/casa-neblina` |
| `/projects/courtyard-house` | `/pt/projetos/casa-patio` |
| `/studio` | `/pt/escritorio` |
| `/contact` | `/pt/contato` |
| `/privacy` | `/pt/privacidade` |

## Composição da interface

`LocaleRoot` monta o documento de cada idioma: `html[lang]`, skip link,
navegação, conteúdo principal, rodapé, sugestão de idioma, dados estruturados,
Analytics e Speed Insights.

- A home usa a variante Random Grid do demo MIT de Hiroki/Codrops. A máscara é
  formada por retângulos SVG embaralhados, com grades de 14, 10 ou 6 colunas
  conforme a largura da viewport, e é conduzida por GSAP/ScrollTrigger.
- `prefers-reduced-motion` remove a timeline de scroll e mantém uma leitura
  estática. Lenis também é desativado para movimento reduzido e ponteiro coarse.
- O índice apresenta os três estudos em uma hierarquia numerada.
- O detalhe alterna hero, pares e imagens amplas conforme o campo
  `presentation` de cada asset.
- A página de escritório usa trilho de mídia e manifesto/princípios em composição
  dual no desktop, reorganizada linearmente em telas menores.
- A navegação tem estado de rota, menu com ciclo de foco, fechamento por Escape e
  troca de idioma para a contraparte exata da página ou projeto atual.

## Conteúdo e mídia

Existe uma única fonte tipada para conteúdo EN/PT, IDs, slugs, rotas e imagens.
Os projetos são:

- Horizon Pavilion / Pavilhão Horizonte;
- Mist House / Casa Neblina;
- Courtyard House / Casa Pátio.

Nenhum projeto declara localização, área, cliente, equipe, fotógrafo ou autoria
arquitetônica inexistente. As dez imagens vieram do repositório
`Hiro-kiii/Scroll-Transition` na revisão fixada em `REFERENCES.md`, foram
otimizadas sem upscale e têm dimensões e hashes registrados em
`THIRD_PARTY_NOTICES.md`. A cópia integral da licença MIT permanece em
`public/licenses/`.

Arthur Casas, OH Architecture e Mana Hotel são referências de composição e
interação; nenhum asset, texto, marca ou código desses sites foi incorporado.

## Idioma e sugestão regional

O seletor manual grava `studio-flamboyant-locale` em `localStorage`. Para uma
primeira visita em inglês, `GET /api/locale-hint` lê apenas o header
`x-vercel-ip-country` e devolve `{ suggestPortuguese: boolean }`. O cliente mostra
uma sugestão descartável quando o país é BR; a decisão nunca bloqueia nem
redireciona a navegação.

O endpoint não devolve o país ou IP, usa cache privado curto e marca a resposta
como `noindex`.

## Captação de leads

`POST /api/leads` é um Route Handler Node.js. O fluxo é:

1. limitar o corpo JSON a 16 KiB e validar `Content-Type` e origem;
2. aplicar honeypot, tempo mínimo de preenchimento e expiração do formulário;
3. validar e normalizar os campos com Zod;
4. renderizar versões HTML e texto do aviso com React Email;
5. enviar pelo Resend com chave de idempotência derivada do `submissionId`;
6. responder com mensagens localizadas em inglês ou português.

O cliente valida os campos nativos antes da requisição e registra
`lead_submitted` somente após sucesso, com idioma e tipo de projeto. Não existe
banco de leads. Os logs do servidor contêm apenas resultado técnico,
`submissionId`, duração e eventual status do provedor; nome, e-mail, empresa e
mensagem não entram no log.

As credenciais são carregadas apenas durante a requisição. Em produção, o
endpoint retorna erro de serviço indisponível quando `NEXT_PUBLIC_SITE_URL`,
`RESEND_API_KEY`, `CONTACT_TO_EMAIL` ou `CONTACT_FROM_EMAIL` não estão
configuradas corretamente. Rate limiting no edge permanece requisito de deploy.

## SEO e descoberta

- `NEXT_PUBLIC_SITE_URL` define a origem canônica; os fallbacks de ambiente da
  Vercel e `localhost` existem para build e desenvolvimento;
- cada página publica canonical e alternates `en`, `pt-BR` e `x-default`;
- projetos usam título, descrição e imagem social próprios;
- imagens Open Graph estáticas e localizadas evitam dependência de resolução de
  metadata em múltiplos root layouts;
- `sitemap.xml` lista as contrapartes EN/PT de home, índice, estúdio e projetos;
- `robots.txt` libera páginas, bloqueia `/api/` e aponta para o sitemap;
- JSON-LD usa apenas tipos verdadeiros: `WebSite`, `CollectionPage` e
  `CreativeWork`.

Não há schema de `Architect`, `LocalBusiness`, endereço, telefone ou equipe
fictícia.

## Acessibilidade, performance e segurança

A implementação inclui landmarks, skip link, labels, estados `aria-live`,
navegação por teclado, foco preso no menu, textos alternativos localizados e
fallback para movimento reduzido. Imagens têm dimensões estáveis por
`next/image`; smooth scroll é evitado em dispositivos coarse.

O Next configura compressão, formatos AVIF/WebP e headers de segurança para
MIME sniffing, referrer, framing e permissões de câmera, microfone e
geolocalização.

O harness de qualidade contém:

- ESLint flat config para Next 16 e TypeScript;
- typecheck e build;
- Playwright com matriz Chromium desktop, mobile e tablet, incluindo execução
  isolada contra `next start`;
- smoke das rotas EN/PT e das rotas retiradas;
- navegação/localização, responsividade, formulário e movimento reduzido;
- testes diretos do contrato seguro de `/api/leads` sem envio de e-mail;
- Axe nas páginas principais, bloqueando violações serious e critical;
- Lighthouse mobile nas cinco superfícies críticas.

O README registra a baseline de laboratório do build; métricas de campo só são
afirmadas depois do deploy.

## Deploy e branches

- `dev` contém o case e sua validação;
- a branch de publicação recebe o case somente depois de configuração do
  ambiente, verificação no Vercel e aprovação explícita;
- repositório, projeto Vercel e domínio públicos precisam ser neutros e próprios
  do Studio Flamboyant/Fabiano Frank.

As únicas pendências operacionais ficam em `NEXT.md`.
