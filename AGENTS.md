# Julia Fonseca Arquitetura - Agent Map

Leia este arquivo antes de alterar layout, copy, componentes, rotas, ingestao de
conteudo ou dados de projetos neste repositorio.

## Leitura inicial

1. `ARCHITECTURE.md`
2. o menor arquivo diretamente ligado a tarefa
3. so depois abrir arquivos legados de Drive, servidor ou briefings antigos

`ARCHITECTURE.md` e o mapa atual do projeto. Este arquivo e o mapa operacional
para futuras janelas do Codex.

## Direcao atual

Este e um site ja implementado em Next.js para Julia Fonseca Arquitetura.

A fase atual e refinamento, nao reconstrucao. Preserve a arquitetura ja
implementada e faca alteracoes precisas.

## Preservar

- linguagem visual bold, limpa e high-profile
- estrutura branco/preto/cinza escuro com acentos azul eletrico e ciano
- `font-display` como voz tipografica principal
- sistema modular de marca em `src/components/brand-mark.tsx`
- vitrine unificada em `/projetos`
- footer global diferente do footer de detalhe
- estrutura atual do menu fullscreen
- intro atual em lockup horizontal unico

## Arquivos por tarefa

Shell global:

- `src/app/layout.tsx`
- `src/app/globals.css`
- `tailwind.config.ts`

Navegacao e identidade:

- `src/components/navigation.tsx`
- `src/components/ui/flip-links.tsx`
- `src/components/brand-mark.tsx`

Home:

- `src/app/page.tsx`
- `src/components/featured-project-showcase.tsx`

Projetos:

- `src/app/projetos/page.tsx`
- `src/components/projects-filter.tsx`
- `src/components/project-card.tsx`
- `src/components/project-page.tsx`
- `src/components/parallax-gallery.tsx`
- `src/components/project-strip-carousel.tsx`

Conteudo e imagens:

- `content/projects/projects.json`
- `src/lib/projects.ts`
- `scripts/optimize-images.ts`
- `public/images/projetos/`

SEO e idioma:

- `src/lib/metadata.ts`
- `src/components/json-ld.tsx`
- `src/lib/i18n.ts`
- `src/app/sitemap.ts`

## Nao reabrir sem pedido claro

- nao reconstruir o site do zero
- nao voltar para uma direcao quente/serifada como eixo principal
- nao duplicar dados de projeto fora dos arquivos estabelecidos
- nao expandir automacao antiga de Drive a menos que a tarefa mencione Drive,
  VPN, servidor, migracao ou compatibilidade
- nao remover arquivos legados apenas porque nao sao o caminho atual
- nao mudar intro, menu ou footers sem pedido especifico

## Fluxo de imagens

Imagens brutas entram em `_originals/[slug]/` e ficam ignoradas pelo git.

Imagens otimizadas entram em:

```text
public/images/projetos/[slug]/
```

Use:

```bash
npm run optimize _originals/[slug] [slug]
```

Depois atualize `content/projects/projects.json`.

## Regra de trabalho

Faca a menor mudanca que preserve o sistema atual.

Se uma nota antiga conflitar com o codigo atual, confie no codigo e atualize o
harness apenas quando a nova direcao for duravel.
