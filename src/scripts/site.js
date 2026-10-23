/* Figueiredo Lima Advocacia: interações do site.
   Tudo é melhoria progressiva: sem JavaScript, o conteúdo, o menu de âncoras e os botões continuam funcionando. */
(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  var temObserver = 'IntersectionObserver' in window;

  /* Avisos com prazo: [data-ate] some depois da data; [data-depois] aparece no lugar dele */
  var agora = Date.now();
  document.querySelectorAll('[data-ate]').forEach(function (el) {
    var vencido = agora >= Date.parse(el.getAttribute('data-ate'));
    el.hidden = vencido;
    var substituto = el.parentNode.querySelector('[data-depois]');
    if (substituto) substituto.hidden = !vencido;
  });

  /* Cabeçalho que diminui depois de rolar 80px */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var agendado = false;
    var atualizar = function () {
      hdr.classList.toggle('is-compact', window.scrollY > 80);
      agendado = false;
    };
    window.addEventListener('scroll', function () {
      if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

  /* Menu do celular: abre em tela cheia, fecha com Esc, com o botão ou ao escolher um link */
  var botao = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    var abrir = function (aberto) {
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      if (aberto) { menu.setAttribute('data-open', ''); } else { menu.removeAttribute('data-open'); }
      document.body.classList.toggle('menu-aberto', aberto);
      if (aberto) { var primeiro = menu.querySelector('a'); if (primeiro) primeiro.focus(); }
    };
    botao.addEventListener('click', function () { abrir(botao.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) abrir(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') { abrir(false); botao.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) abrir(false); });
  }

  /* WhatsApp flutuante: aparece só quando nenhum outro botão verde está visível,
     para nunca haver dois na mesma tela. Os botões de referência têm data-wa-ancora. */
  var flutuante = document.querySelector('.wa-float');
  var ancoras = document.querySelectorAll('[data-wa-ancora], .ftr');
  if (flutuante && temObserver && ancoras.length) {
    var visiveis = new Set();
    var obsWa = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target); });
      flutuante.classList.toggle('is-visible', visiveis.size === 0 && !document.body.classList.contains('menu-aberto'));
    });
    ancoras.forEach(function (el) { obsWa.observe(el); });
  } else if (flutuante) {
    flutuante.classList.add('is-visible');
  }

  /* Botões "Copiar" da página de contato */
  document.querySelectorAll('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var alvo = document.getElementById(b.getAttribute('data-copiar'));
      var texto = alvo ? alvo.textContent.trim() : '';
      var original = b.textContent;
      var volta = function () { setTimeout(function () { b.textContent = original; }, 1600); };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(function () { b.textContent = 'Copiado'; volta(); }, function () { b.textContent = texto; volta(); });
      }
    });
  });

  /* Origem do contato: quem chega por anúncio (gclid ou utm_medium=cpc) manda "Vi o anúncio do escritório"
     no lugar de "Vim pelo site", sem código visível ao cliente; "Olá, tudo bem?" marca as campanhas de SP. O gclid não é guardado;
     só a campanha fica na sessão, para valer também nas outras páginas da mesma visita. */
  var campanha = null;
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid') || /^(cpc|ppc|paid|paidsearch)$/i.test(q.get('utm_medium') || '')) {
      sessionStorage.setItem('fl_anuncio', (q.get('utm_campaign') || 'anuncio').slice(0, 20).toLowerCase());
    }
    campanha = sessionStorage.getItem('fl_anuncio');
  } catch (e) {}
  if (campanha) {
    var ola = /^sp/.test(campanha) ? 'Olá, tudo bem? ' : 'Olá! ';
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      var partes = a.href.split('?text=');
      if (partes.length < 2) return;
      var msg = decodeURIComponent(partes[1]).replace(/^Olá! Vim pelo site( do escritório)?/, ola + 'Vi o anúncio do escritório');
      a.href = partes[0] + '?text=' + encodeURIComponent(msg);
    });
  }

  /* Medição: cada clique no WhatsApp vira um evento no dataLayer (o GTM só é ativado na Fase 7, com consentimento) */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-evento]');
    if (a) window.dataLayer.push({ event: a.getAttribute('data-evento'), local: a.getAttribute('data-local') || '', pagina: location.pathname, campanha: campanha || '' });
  });
})();
