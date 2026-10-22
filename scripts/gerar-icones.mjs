// Gera os ícones do site a partir do PRÓPRIO logotipo (sem redesenhar):
// - ícone quadrado com o "F" e o "L" recortados do logotipo original, sobre o creme da marca;
// - logotipo completo centralizado num quadrado, para os dados estruturados do Google.
import { createRequire } from 'node:module';
const sharp = createRequire('D:/sites/figueiredo-lima-site/package.json')('sharp');

const logo = 'D:/sites/figueiredo-lima-site/src/assets/logo.png';
const saida = process.argv[2];
const creme = { r: 0xF3, g: 0xEE, b: 0xE6, alpha: 1 };

// Recortes medidos no logotipo (1006 × 186): linha do nome de y=12 a y=94.
const F = { left: 11, top: 12, width: 58, height: 83 };
const L = { left: 729, top: 12, width: 59, height: 83 };

async function icone(lado) {
  const alturaLetra = Math.round(lado * 0.5);
  const escala = alturaLetra / 83;
  const f = await sharp(logo).extract(F).resize({ height: alturaLetra, kernel: 'lanczos3' }).png().toBuffer();
  const l = await sharp(logo).extract(L).resize({ height: alturaLetra, kernel: 'lanczos3' }).png().toBuffer();
  const lf = Math.round(58 * escala), ll = Math.round(59 * escala), vao = Math.round(lado * 0.03);
  const x0 = Math.round((lado - (lf + vao + ll)) / 2), y0 = Math.round((lado - alturaLetra) / 2);
  return sharp({ create: { width: lado, height: lado, channels: 4, background: creme } })
    .composite([{ input: f, left: x0, top: y0 }, { input: l, left: x0 + lf + vao, top: y0 }])
    .png();
}

for (const lado of [48, 96, 180, 192, 512]) {
  await (await icone(lado)).toFile(`${saida}/icone-${lado}.png`);
}
// favicon.ico com a imagem de 48 px (o Google aceita PNG; o .ico atende navegadores antigos)
await (await icone(48)).toFile(`${saida}/favicon-48.png`);

// Logotipo completo num quadrado de 600 px, com margem, para o schema "logo".
const largura = 520;
const marca = await sharp(logo).resize({ width: largura, kernel: 'lanczos3' }).png().toBuffer();
const meta = await sharp(marca).metadata();
await sharp({ create: { width: 600, height: 600, channels: 4, background: creme } })
  .composite([{ input: marca, left: Math.round((600 - largura) / 2), top: Math.round((600 - meta.height) / 2) }])
  .png().toFile(`${saida}/logo-quadrado-600.png`);
console.log('ok');
