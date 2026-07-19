# Decisions

| Data | Decisão | Razão | Status |
| --- | --- | --- | --- |
| 2026-07-18 | Executar a reconstrução em `dev` e promover para `main` somente após validação e aprovação explícita. | Separar baseline, desenvolvimento e publicação. | active |
| 2026-07-18 | Adotar o nome `Studio Flamboyant` e uma identidade tipográfica própria em preto, off-white, vermelho-flama e verde-folhagem. | Construir uma referência brasileira com identidade autônoma. | implemented |
| 2026-07-18 | Apresentar o estúdio e todos os projetos como fictícios, conceituais e não construídos, creditando o design e o frontend a Fabiano Frank. | Demonstrar senioridade sem simular autoria, operação ou portfólio arquitetônico real. | implemented |
| 2026-07-18 | Usar inglês como idioma canônico em `/` e português brasileiro sob `/pt`. | Manter alcance internacional com localização explícita e URLs indexáveis. | implemented |
| 2026-07-18 | Não fazer redirecionamento geográfico obrigatório; oferecer português de forma não bloqueante quando a Vercel indicar país BR. | Preservar controle do visitante, indexação estável e privacidade. | implemented |
| 2026-07-18 | Limitar o conteúdo a três estudos: Horizon Pavilion, Mist House e Courtyard House, com slugs e textos próprios em EN/PT. | Criar um conjunto pequeno, editorial e inteiramente verificável. | implemented |
| 2026-07-18 | Adaptar a variante SVG Random Grid do `Hiro-kiii/Scroll-Transition`/Codrops e preservar o aviso MIT. | Usar a origem correta da assinatura de motion com licença rastreável. | implemented |
| 2026-07-18 | Usar somente as dez imagens do demo licenciado, processadas sem upscale e registradas por origem, dimensões e hashes. | Eliminar mídia da cliente e manter proveniência auditável. | implemented |
| 2026-07-18 | Usar Arthur Casas, OH Architecture e Mana Hotel apenas como referências de composição, sem copiar assets, texto, marca ou código. | Referência visual não transfere direitos sobre conteúdo. | active |
| 2026-07-18 | Reconstruir `/studio` e `/pt/escritorio` como composição dual de trilho de mídia e manifesto, usando o ritmo editorial do detalhe de projeto. | Integrar a página institucional ao sistema visual do restante do case. | implemented |
| 2026-07-18 | Direcionar o contato a projetos digitais reais de Fabiano, com Resend e sem banco próprio de leads. | Transformar o case em prova comercial transparente sem fingir captação de arquitetura. | implemented |
| 2026-07-18 | Validar origem, payload, consentimento, honeypot e tempo de submissão; usar idempotência e não registrar PII nos logs. | Reduzir abuso, duplicação e exposição de dados com uma superfície pequena. | implemented |
| 2026-07-18 | Migrar para Next.js 16, React 19 e ESLint flat config. | Remover a linha vulnerável/obsoleta e alinhar runtime, tipos e ferramentas atuais. | implemented |
| 2026-07-18 | Publicar apenas dados estruturados verdadeiros (`WebSite`, `CollectionPage`, `CreativeWork`) e alternates EN/PT. | Fortalecer SEO sem inventar empresa, endereço, equipe ou autoria arquitetônica. | implemented |
| 2026-07-18 | Integrar Vercel Analytics e Speed Insights; registrar conversão somente após envio aceito e sem PII. | Observar experiência e funil com minimização de dados. | implemented |
| 2026-07-18 | Usar uma pilha tipográfica de sistema sem webfonts. | Eliminar 266 KB e a repintura que atrasava o LCP móvel sem perder o contraste editorial sans/serif. | implemented |
| 2026-07-18 | Publicar em repositório, projeto Vercel e domínio neutros, sem histórico ou identidade de terceiros. | A troca da branch principal não remove histórico público nem vínculos de deploy anteriores. | active |
