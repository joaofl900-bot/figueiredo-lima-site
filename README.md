# Site da Figueiredo Lima Advocacia

Código do site [figueiredolima.adv.br](https://figueiredolima.adv.br), feito com [Astro](https://astro.build) e publicado na Cloudflare.

## Publicar um artigo (sem programar)

1. Entre em [app.pagescms.org](https://app.pagescms.org) com a sua conta do GitHub e abra este repositório.
2. Clique em **Artigos** e depois em **Add an entry**.
3. Preencha título, resumo (até 170 caracteres), área, data e o texto.
4. Deixe **Rascunho** marcado enquanto estiver escrevendo. Para publicar, desmarque e clique em **Save**.
5. Em cerca de 2 minutos o artigo aparece em `/artigos/`, na página da área e na home.

Regras de conteúdo: linguagem simples, nenhuma promessa de resultado, sem casos concretos, preços ou depoimentos (Código de Ética e Provimento 205/2021 do CFOAB). Cite a lei pelo número e pelo artigo.

## Onde fica cada coisa

| O que mudar | Arquivo |
| --- | --- |
| Telefone, e-mail, OAB, CNPJ, Instagram | `src/data/escritorio.ts` |
| Textos de cada área | `src/content/areas/<área>.yaml` |
| Artigos | `src/content/artigos/*.md` (pelo Pages CMS) |
| Home | `src/pages/index.astro` |
| Aviso do Simples Nacional | `src/components/AvisoSimples.astro` |
| Cores, fontes e espaçamentos | `src/styles/site.css` (tokens no início) |
| Página dos anúncios | `public/regularizacao-fiscal/index.html` (fora das buscas) |
| Cache e segurança | `public/_headers` |

## Para quem for programar

```bash
npm install
npm run dev      # site local em http://localhost:4321
npm run build    # gera a pasta dist/
npm run deploy   # gera e publica na Cloudflare (pede login)
```

Node 22.12 ou mais novo. O design system aprovado está em claude.ai (Figueiredo Lima Design System).
