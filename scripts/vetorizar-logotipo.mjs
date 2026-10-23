// Vetoriza o logotipo oficial horizontal (src/assets/logo.png) sem mudar o desenho: o contorno das letras é
// traçado a partir da transparência do PNG, ampliado 4 vezes antes do traço para as curvas saírem lisas.
// O resultado é um SVG em dourado chapado, nítido em qualquer zoom, usado nas peças (e disponível para gráfica).
// Uso: node scripts/vetorizar-logotipo.mjs   (grava identidade/logotipo-horizontal-dourado-bege.svg e -dourado-claro.svg)
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFileSync } from 'node:fs';

const escala = 4;
const { data, info } = await sharp('src/assets/logo.png').ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });

// Recorte justo nas letras, com 2 px de folga.
let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  if (data[y * info.width + x] > 20) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
}
const recorte = { left: Math.max(0, x0 - 2), top: Math.max(0, y0 - 2) };
recorte.width = Math.min(info.width, x1 + 3) - recorte.left;
recorte.height = Math.min(info.height, y1 + 3) - recorte.top;

// Tinta preta em fundo branco, ampliada: é o que o potrace traça.
const tinta = await sharp(data, { raw: { width: info.width, height: info.height, channels: 1 } })
  .extract(recorte).negate()
  .resize({ width: recorte.width * escala, kernel: 'lanczos3' })
  .png().toBuffer();

const tracar = (cor) => new Promise((ok, erro) => potrace.trace(tinta, { threshold: 128, turdSize: 8, optTolerance: 0.2, color: cor, background: 'transparent' },
  (e, svg) => (e ? erro(e) : ok(svg))));

for (const [nome, cor] of [['dourado-bege', '#7A5D10'], ['dourado-claro', '#C9A54A']]) {
  const svg = (await tracar(cor))
    .replace(/width="(\d+)" height="(\d+)"/, (_, w, h) => `width="${w / escala}" height="${h / escala}"`)
    .replace('<svg ', '<svg role="img" aria-label="Figueiredo Lima Advocacia" ');
  writeFileSync(`identidade/logotipo-horizontal-${nome}.svg`, svg);
}
console.log('ok', recorte);
