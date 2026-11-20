// Política de conteúdo (Content-Security-Policy) do site, gerada DEPOIS do `astro build`.
// O navegador só executa scripts do próprio site e os scripts embutidos cujo resumo (sha256) consta aqui,
// então um script injetado por terceiros não roda. Como os resumos mudam quando o código muda,
// a política é recalculada a cada build e gravada em dist/_headers (o public/_headers não é alterado).
//
// Fora do site, só o Cloudflare Web Analytics (injetado pela Cloudflare em produção, sem cookies).
// Se um dia o GTM for ligado (<meta name="gtm-id">), esta política precisa receber os domínios do Google.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const DIST = "dist";
const html = [];
(function varrer(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) varrer(p);
    else if (p.endsWith(".html")) html.push(p);
  }
})(DIST);

const resumos = new Set();
let gtmLigado = false;
for (const arquivo of html) {
  const texto = readFileSync(arquivo, "utf8");
  if (/<meta[^>]+name="gtm-id"[^>]+content="[^"]+"/.test(texto)) gtmLigado = true;
  // Scripts embutidos que executam (JSON-LD é dado, não código, e não precisa de resumo).
  for (const m of texto.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/application\/ld\+json/.test(m[1])) continue;
    resumos.add(`'sha256-${createHash("sha256").update(m[2], "utf8").digest("base64")}'`);
  }
}

const politica = [
  "default-src 'self'",
  `script-src 'self' ${[...resumos].sort().join(" ")} https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const caminho = join(DIST, "_headers");
const cabecalhos = readFileSync(caminho, "utf8");
const marcador = /^(\/\*\r?\n)/m;
if (!marcador.test(cabecalhos)) throw new Error("dist/_headers sem o bloco /* : política não aplicada.");
writeFileSync(caminho, cabecalhos.replace(marcador, `$1  Content-Security-Policy: ${politica}\n`));

console.log(`CSP gravada em dist/_headers: ${html.length} páginas, ${resumos.size} scripts embutidos autorizados.`);
if (gtmLigado) console.warn("ATENÇÃO: gtm-id preenchido. Inclua os domínios do Google Tag Manager na política antes de publicar.");
