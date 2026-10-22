// Gera os ícones do site a partir do logotipo oficial quadrado (src/assets/logotipo-oficial-quadrado.webp),
// sem alterar o desenho: o ícone é o próprio logotipo, só com menos margem ao redor do texto.
// Uso: node scripts/gerar-icones.mjs   (grava em public/)
import sharp from 'sharp';

const origem = 'src/assets/logotipo-oficial-quadrado.webp';
const saida = 'public';

// Quadrado centrado no texto do logotipo (texto de x=139 a 1123 e y=546 a 709, na imagem de 1254 px).
const recorte = { left: 113, top: 110, width: 1035, height: 1035 };

for (const [lado, nome] of [[48, 'icone-48.png'], [96, 'icone-96.png'], [192, 'icone-192.png'], [512, 'icone-512.png'], [180, 'apple-touch-icon.png']]) {
  await sharp(origem).extract(recorte).resize(lado, lado, { kernel: 'lanczos3' }).png().toFile(`${saida}/${nome}`);
}
// Logotipo completo, como enviado, para os dados estruturados do Google.
await sharp(origem).resize(600, 600, { kernel: 'lanczos3' }).png().toFile(`${saida}/logo-quadrado.png`);
console.log('ok');
