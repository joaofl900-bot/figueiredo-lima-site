// Gera as versões do logotipo oficial e as faixas bege das peças jurídicas.
// O desenho do logotipo não muda, só o tom do dourado conforme o fundo:
// sobre o bege do site (#F3EEE6), o dourado de texto do site (#7A5D10), mais firme que o original;
// sobre o preto do site (#1B1814), o dourado claro (#C9A54A).
// Uso: node scripts/vetorizar-logotipo.mjs && node scripts/gerar-logotipos.mjs
//      (grava em identidade/ e o logotipo do site em src/assets/)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const saida = 'identidade';
const bege = { r: 0xF3, g: 0xEE, b: 0xE6 };
const preto = { r: 0x1B, g: 0x18, b: 0x14 };
const ouroBege = { r: 0x7A, g: 0x5D, b: 0x10 };
const ouroPreto = { r: 0xC9, g: 0xA5, b: 0x4A };
mkdirSync(saida, { recursive: true });

// Troca o dourado original por outro tom, preservando a transparência e as nuances do desenho:
// cada pixel recebe o novo tom na proporção do seu brilho em relação ao brilho médio das letras.
function dourar(rgba, ouro) {
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

async function comFundo(rgba, width, height, margem, fundo, arquivo) {
  const camada = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
  await sharp({ create: { width: width + 2 * margem.x, height: height + 2 * margem.y, channels: 3, background: fundo } })
    .composite([{ input: camada, left: margem.x, top: margem.y }]).png().toFile(arquivo);
}

async function versoes(nome, rgba, width, height, margem) {
  const raw = { raw: { width, height, channels: 4 } };
  await sharp(rgba, raw).png().toFile(`${saida}/${nome}-transparente.png`);
  const paraBege = dourar(rgba, ouroBege);
  const paraPreto = dourar(rgba, ouroPreto);
  await sharp(paraBege, raw).png().toFile(`${saida}/${nome}-dourado-bege.png`);
  await sharp(paraPreto, raw).png().toFile(`${saida}/${nome}-dourado-claro.png`);
  await comFundo(paraBege, width, height, margem, bege, `${saida}/${nome}-bege.png`);
  await comFundo(paraPreto, width, height, margem, preto, `${saida}/${nome}-preto.png`);
  return paraBege;
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
const horizontal = await versoes('logotipo-horizontal', hData, hInfo.width, hInfo.height,
  { x: Math.round(hInfo.width * 0.12), y: Math.round(hInfo.height * 0.6) });
await sharp(horizontal, { raw: { width: hInfo.width, height: hInfo.height, channels: 4 } }).png().toFile('src/assets/logo-dourado-bege.png');

// Faixas bege das peças (folha A4 de ponta a ponta, 300 dpi): cabeçalho só com o fio dourado embaixo e
// rodapé todo bege, sem fio. O logotipo entra no Word como imagem própria, em alta resolução, gerada do SVG
// vetorizado (scripts/vetorizar-logotipo.mjs): dentro da faixa larga ele perdia qualidade, porque o
// Google Docs reduz imagens largas para cerca de 2.000 pixels.
const cm = (v) => Math.round((v / 2.54) * 300);
const fio = 4;
const larguraA4 = cm(21);
const fioOuro = await sharp({ create: { width: larguraA4, height: fio, channels: 3, background: ouroBege } }).png().toBuffer();
await sharp({ create: { width: larguraA4, height: cm(2.5), channels: 3, background: bege } })
  .composite([{ input: fioOuro, left: 0, top: cm(2.5) - fio }])
  .png({ palette: true, colours: 2 }).toFile(`${saida}/faixa-cabecalho.png`);
await sharp({ create: { width: larguraA4, height: cm(2.1), channels: 3, background: bege } })
  .png({ palette: true, colours: 2 }).toFile(`${saida}/faixa-rodape.png`);
// 2.000 px de largura para 5 cm na folha: cerca de 1.000 dpi, abaixo do limite do Google Docs.
const svg = `${saida}/logotipo-horizontal-dourado-bege.svg`;
const { width: svgLargo } = await sharp(svg).metadata();
await sharp(svg, { density: (72 * 2000) / svgLargo }).png().toFile(`${saida}/logotipo-horizontal-dourado-bege-alta.png`);
console.log('ok');
