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

  /* Surgimento suave das seções ao entrarem na tela; sem observer, tudo aparece de imediato */
  var revelaveis = document.querySelectorAll('[data-reveal]');
  if (temObserver) {
    var obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obsReveal.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revelaveis.forEach(function (el) { obsReveal.observe(el); });
  } else {
    revelaveis.forEach(function (el) { el.classList.add('is-in'); });
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

  /* Medição: cada clique no WhatsApp vira um evento no dataLayer (o GTM só é ativado na Fase 7, com consentimento) */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-evento]');
    if (a) window.dataLayer.push({ event: a.getAttribute('data-evento'), local: a.getAttribute('data-local') || '', pagina: location.pathname });
  });
})();
