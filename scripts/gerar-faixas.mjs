// Faixas bege das peças jurídicas (folha A4 de ponta a ponta, 300 dpi), com o fio dourado que separa
// cabeçalho e rodapé do corpo.
// Uso direto: node scripts/gerar-faixas.mjs   (também é chamado por scripts/gerar-logotipos.mjs)
//
// Padrão do fio (25/11/2026): um só fio, igual no cabeçalho e no rodapé, em posição simétrica.
// - cor #7A5D10 (o dourado do site sobre o bege), espessura de 0,5 mm (6 px a 300 dpi);
// - o fio fica dentro da imagem, encostado na faixa bege, com 1 mm (12 px) de margem transparente do
//   lado da página. Com o fio na borda da imagem, os visualizadores de PDF e o Word cortavam ou
//   clareavam a última linha de pixels de uma faixa e não da outra, e os fios saíam com cor e
//   espessura diferentes. Com 0,5 mm, o fio também passa de 1 pixel de tela a 100%, o que evita a
//   diferença de cor causada pelo arredondamento de pixels.
// No modelo (scripts/gerar-modelo-peticao.py), cada faixa ocupa a altura da parte bege mais a margem:
// o cabeçalho vai do topo até 2,5 cm + 1 mm; o rodapé começa 1 mm acima dos 2,1 cm finais da folha.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

export const bege = { r: 0xF3, g: 0xEE, b: 0xE6 };
export const ouroBege = { r: 0x7A, g: 0x5D, b: 0x10 };
const cm = (v) => Math.round((v / 2.54) * 300);
export const FIO = 6;       // 0,5 mm
export const MARGEM = 12;   // 1 mm, transparente
const larguraA4 = cm(21);

function bloco(height, cor) {
  return sharp({ create: { width: larguraA4, height, channels: 4, background: { ...cor, alpha: 1 } } }).png().toBuffer();
}

export async function gerarFaixas(saida = 'identidade') {
  const transparente = { r: 0, g: 0, b: 0, alpha: 0 };
  const fio = await bloco(FIO, ouroBege);

  // Cabeçalho: bege de 0 a 2,5 cm, com o fio nos últimos 0,5 mm; abaixo, 1 mm transparente.
  const altoCab = cm(2.5);
  await sharp({ create: { width: larguraA4, height: altoCab + MARGEM, channels: 4, background: transparente } })
    .composite([
      { input: await bloco(altoCab - FIO, bege), left: 0, top: 0 },
      { input: fio, left: 0, top: altoCab - FIO },
    ])
    .png({ compressionLevel: 9 }).toFile(`${saida}/faixa-cabecalho.png`);

  // Rodapé: 1 mm transparente; o fio nos primeiros 0,5 mm da faixa; bege até o fim dos 2,1 cm.
  const altoRod = cm(2.1);
  await sharp({ create: { width: larguraA4, height: altoRod + MARGEM, channels: 4, background: transparente } })
    .composite([
      { input: fio, left: 0, top: MARGEM },
      { input: await bloco(altoRod - FIO, bege), left: 0, top: MARGEM + FIO },
    ])
    .png({ compressionLevel: 9 }).toFile(`${saida}/faixa-rodape.png`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await gerarFaixas(process.argv[2] || 'identidade');
  console.log('faixas ok');
}
