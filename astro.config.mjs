// Configuração do Astro. O site é gerado como páginas estáticas (HTML pronto),
// publicadas na Cloudflare. Endereços sempre terminam com barra: /tributario/.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// A lista /artigos/ só entra no mapa para o Google quando houver ao menos um artigo publicado.
const pastaArtigos = new URL('./src/content/artigos/', import.meta.url);
const temArtigoPublicado = readdirSync(pastaArtigos)
  .filter((f) => f.endsWith('.md'))
  .some((f) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(f, pastaArtigos), 'utf8')));

export default defineConfig({
  site: 'https://figueiredolima.adv.br',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/regularizacao-fiscal/') &&
        !page.endsWith('/404/') &&
        (temArtigoPublicado || !page.endsWith('/artigos/')),
    }),
  ],
});
