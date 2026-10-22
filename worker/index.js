// Porta de entrada do site na Cloudflare. Faz uma coisa só antes de entregar os arquivos:
// manda www.figueiredolima.adv.br e qualquer acesso por http:// para o endereço oficial
// https://figueiredolima.adv.br, com redirecionamento permanente (301). Assim o Google
// guarda um endereço só. Todo o resto vai direto para as páginas geradas pelo Astro.

const OFICIAL = 'figueiredolima.adv.br';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const doDominio = url.hostname === OFICIAL || url.hostname === `www.${OFICIAL}`;
    if (doDominio && (url.hostname !== OFICIAL || url.protocol === 'http:')) {
      url.hostname = OFICIAL;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
