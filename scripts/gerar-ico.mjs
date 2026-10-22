// Monta um favicon.ico com as imagens PNG de 48 e 96 px dentro (formato aceito por todos os navegadores).
import { readFileSync, writeFileSync } from 'node:fs';

const [saida, ...entradas] = process.argv.slice(2);
const imagens = entradas.map((caminho) => ({ dados: readFileSync(caminho), lado: Number(caminho.match(/(\d+)\.png$/)[1]) }));
const cabecalho = Buffer.alloc(6 + 16 * imagens.length);
cabecalho.writeUInt16LE(0, 0); cabecalho.writeUInt16LE(1, 2); cabecalho.writeUInt16LE(imagens.length, 4);
let deslocamento = cabecalho.length;
imagens.forEach((img, i) => {
  const o = 6 + 16 * i;
  cabecalho.writeUInt8(img.lado >= 256 ? 0 : img.lado, o);
  cabecalho.writeUInt8(img.lado >= 256 ? 0 : img.lado, o + 1);
  cabecalho.writeUInt16LE(1, o + 4); cabecalho.writeUInt16LE(32, o + 6);
  cabecalho.writeUInt32LE(img.dados.length, o + 8); cabecalho.writeUInt32LE(deslocamento, o + 12);
  deslocamento += img.dados.length;
});
writeFileSync(saida, Buffer.concat([cabecalho, ...imagens.map((i) => i.dados)]));
console.log('ok', saida);
