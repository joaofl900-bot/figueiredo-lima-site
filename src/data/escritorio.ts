// Dados do escritório em um só lugar. Tudo o que aparece no cabeçalho, no rodapé,
// nos botões de WhatsApp e nos dados para o Google vem daqui, para nome, cidade e
// telefone serem sempre idênticos (NAP). Para mudar um dado, mude só este arquivo.

export const escritorio = {
  marca: 'Figueiredo Lima Advocacia',
  razaoSocial: 'João Vitor Figueiredo Lima Sociedade Individual de Advocacia',
  cnpj: '69.728.904/0001-34',
  advogado: 'João Vitor Figueiredo Lima',
  oab: 'OAB/DF 77.088',
  // Endereço público: só bairro e cidade (decisão de 22/10/2026). O completo é enviado no agendamento.
  bairro: 'Lago Norte',
  cidade: 'Brasília',
  uf: 'DF',
  telefone: '(61) 99180-4000',
  telefoneE164: '+5561991804000',
  whatsapp: '5561991804000',
  // Trocar pelo e-mail no domínio quando ele for criado (Fase 7).
  email: 'joaofigueiredolima.adv@gmail.com',
  instagram: 'https://www.instagram.com/joaofigueiredolima/',
  site: 'https://figueiredolima.adv.br',
  cna: 'https://cna.oab.org.br/',
  // Perfil do escritório no Google Maps.
  mapa: 'https://maps.app.goo.gl/g1ZJNjijwAHV24Ft9',
} as const;

// Monta o link do WhatsApp com a mensagem inicial de cada página.
export function linkWhatsApp(mensagem = 'Olá! Vim pelo site do escritório e gostaria de falar com o advogado.') {
  return `https://wa.me/${escritorio.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Menu principal. "Artigos" entra sozinho quando houver artigo publicado (ver Base.astro).
export const menu = [
  { href: '/tributario/', rotulo: 'Tributário', rotuloLongo: 'Tributário para empresas' },
  { href: '/#areas', rotulo: 'Áreas', rotuloLongo: 'Áreas de atuação' },
  { href: '/sobre/', rotulo: 'Sobre', rotuloLongo: 'Sobre o advogado' },
  { href: '/contato/', rotulo: 'Contato', rotuloLongo: 'Contato' },
];
