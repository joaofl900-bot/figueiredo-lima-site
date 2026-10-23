// Gera as versões do logotipo oficial para fundo escuro e as faixas pretas das peças jurídicas.
// O desenho do logotipo não muda. Sobre o preto do site (#1B1814) ele usa o mesmo dourado claro do site
// (#C9A54A), padronizado com o texto do rodapé das peças; sobre fundo claro continua o dourado original.
// Uso: node scripts/gerar-logotipo-preto.mjs   (grava em identidade/)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const saida = 'identidade';
const preto = { r: 0x1B, g: 0x18, b: 0x14 };
const ouro = { r: 0xC9, g: 0xA5, b: 0x4A };
mkdirSync(saida, { recursive: true });

// Troca o dourado original pelo dourado claro, preservando a transparência e as nuances do desenho:
// cada pixel recebe o novo tom na proporção do seu brilho em relação ao brilho médio das letras.
function dourarClaro(rgba) {
  const lum = (i) => 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
  let soma = 0, n = 0;
  for (let i = 0; i < rgba.length; i += 4) if (rgba[i + 3] > 200) { soma += lum(i); n++; }
  const media = soma / n;
  const out = Buffer.from(rgba);
  for (let i = 0; i < rgba.length; i += 4) {
    if (!rgba[i + 3]) continue;
    const k = lum(i) / media;
    out[i] = Math.min(255, Math.round(ouro.r * k));
    out[i + 1] = Math.min(255, Math.round(ouro.g * k));
    out[i + 2] = Math.min(255, Math.round(ouro.b * k));
  }
  return out;
}

async function versoes(nome, rgba, width, height, margem) {
  const raw = { raw: { width, height, channels: 4 } };
  await sharp(rgba, raw).png().toFile(`${saida}/${nome}-transparente.png`);
  const claro = dourarClaro(rgba);
  await sharp(claro, raw).png().toFile(`${saida}/${nome}-dourado-claro.png`);
  const camada = await sharp(claro, raw).png().toBuffer();
  await sharp({ create: { width: width + 2 * margem.x, height: height + 2 * margem.y, channels: 3, background: preto } })
    .composite([{ input: camada, left: margem.x, top: margem.y }]).png().toFile(`${saida}/${nome}-preto.png`);
  return claro;
}

// Logotipo quadrado: separa o dourado do creme. Cada pixel é uma mistura de dourado e creme; o canal azul
// mede quanto há de dourado (azul do creme ~221, do dourado ~20), e a cor original é recuperada.
const creme = [237, 231, 221];
const azulOuro = 20;
const { data, info } = await sharp('src/assets/logotipo-oficial-quadrado.webp').raw().toBuffer({ resolveWithObject: true });
const quadrado = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
  let a = (creme[2] - data[i + 2]) / (creme[2] - azulOuro);
  a = a < 0.04 ? 0 : Math.min(1, a);
  for (let c = 0; c < 3; c++) {
    const v = a > 0 ? (data[i + c] - (1 - a) * creme[c]) / a : 0;
    quadrado[j + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
  quadrado[j + 3] = Math.round(a * 255);
}
await versoes('logotipo-quadrado', quadrado, info.width, info.height, { x: 0, y: 0 });

// Logotipo horizontal (o do cabeçalho do site, já transparente).
const { data: hData, info: hInfo } = await sharp('src/assets/logo.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const horizontalClaro = await versoes('logotipo-horizontal', hData, hInfo.width, hInfo.height,
  { x: Math.round(hInfo.width * 0.12), y: Math.round(hInfo.height * 0.6) });

// Faixas pretas das peças (folha A4 de ponta a ponta, 300 dpi): cabeçalho com o logotipo no centro e
// fio dourado embaixo; rodapé com fio dourado em cima (o texto do rodapé fica editável no Word).
const cm = (v) => Math.round((v / 2.54) * 300);
const fio = 4;
const larguraA4 = cm(21);
const altoCab = cm(2.5);
const logoAlto = cm(0.95);
const logoCab = await sharp(horizontalClaro, { raw: { width: hInfo.width, height: hInfo.height, channels: 4 } })
  .resize({ height: logoAlto }).png().toBuffer();
const { width: logoLargo } = await sharp(logoCab).metadata();
const fioOuro = await sharp({ create: { width: larguraA4, height: fio, channels: 3, background: ouro } }).png().toBuffer();
await sharp({ create: { width: larguraA4, height: altoCab, channels: 3, background: preto } })
  .composite([
    { input: logoCab, left: Math.round((larguraA4 - logoLargo) / 2), top: Math.round((altoCab - fio - logoAlto) / 2) },
    { input: fioOuro, left: 0, top: altoCab - fio },
  ])
  .png({ palette: true, colours: 64 }).toFile(`${saida}/faixa-cabecalho.png`);
await sharp({ create: { width: larguraA4, height: cm(2.1), channels: 3, background: preto } })
  .composite([{ input: fioOuro, left: 0, top: 0 }])
  .png({ palette: true, colours: 8 }).toFile(`${saida}/faixa-rodape.png`);
console.log('ok');
