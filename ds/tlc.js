/* ==========================================================================
   TRANSYLVANIA LOG CABINS — tlc.js
   One shared behaviour file. Injects the nav + footer so no page ever
   carries its own, plus the mobile drawer and fixed-header-on-scroll.

   USAGE (bottom of every page):
     <script src="../ds/tlc.js"></script>
     <script>TLC.init({ active:"stays", heroNav:true });</script>
   Placeholders in the page:
     <div data-tlc-nav></div>   ... your <main> ...   <div data-tlc-footer></div>
   ========================================================================== */
window.TLC = (function () {

  /* Single source of truth for site navigation. Edit links here, everywhere. */
  var NAV_LINKS = [
    { key: "stays",  label: "The Cabins",  href: "/index.html#collection", children: [
      { label: "Transylvania Log Cabin", href: "/stays/log-cabin.html",     meta: "Sleeps 4" },
      { label: "The Hill Cabin",         href: "/stays/hill-cabin.html",     meta: "Sleeps 4" },
      { label: "Transylvania Treehouse", href: "/stays/treehouse.html",      meta: "Sleeps 2" },
      { label: "The Loft Treehouse",     href: "/stays/loft-treehouse.html", meta: "Sleeps 2" },
      { label: "The Barn Ensuite",       href: "/stays/barn-ensuite.html",   meta: "Sleeps 2" }
    ] },
    { key: "events", label: "Events",     href: "#" },
    { key: "story",  label: "Our story",   href: "/our-story.html" },
    { key: "book",   label: "Book",        href: "/book.html", btn: true }
  ];

  // Wordmark: tracked serif caps, with a cluster of vertical "log" strokes
  // flanking the word LOG (San Luis-inspired timber flourish).
  var BRAND = { name: "Transylvania Log Cabins" };
  // Two thin, organic (gently wavy) vertical strokes — a stylised log — flanking LOG.
  // Two single wavy strokes brought together — a stylised log — set between LOG and CABINS.
  var LOG_MARK = '<svg class="lm" viewBox="0 0 32 48" aria-hidden="true" fill="none"'
    + ' stroke="currentColor" stroke-width="1" stroke-linecap="round">'
    + '<path d="M5 1 C 3.3 14, 6.5 24, 5 34 C 3.7 42, 5.7 45.5, 5 47"/>'
    + '<path d="M4.9 18 C 2.6 14.4, 1.1 12.6, 0.2 11.9"/>'
    + '<path d="M26 1 C 24.3 14, 27.5 24, 26 34 C 24.7 42, 26.7 45.5, 26 47"/>'
    + '<path d="M26.1 31 C 27.4 29.6, 28.2 28.9, 28.8 28.5"/>'
    + '</svg>';
  var BRAND_HTML = 'Transylvania' + LOG_MARK + 'Log Cabins';
  // Placeholder WhatsApp number — replace 40700000000 with the hosts' real number.
  var WA_NUMBER = '40737243214';
  // One clean, delicate, correctly-centered thin-line WhatsApp — used in footer + FAB.
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/><path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1"/></svg>';

  function base(){
    // pages in /stays/ link one level up; root pages link "."
    return /\/stays\//.test(location.pathname) ? ".." : ".";
  }
  // Rewrite a root-absolute internal path ("/book.html") to be relative to the current
  // page, so the site works at ANY base path — local root AND a GitHub Pages subpath.
  function rel(href){ return href && href.charAt(0) === "/" ? base() + href : href; }

  function renderNav(root, opts){
    var active = opts.active || "";
    var heroNav = !!opts.heroNav;
    var book = null;
    var links = NAV_LINKS.filter(function (l) {
      if (l.btn) { book = l; return false; }
      return true;
    }).map(function (l) {
      if (l.children) {
        var sub = l.children.map(function (ch) {
          return '<a href="' + rel(ch.href) + '"><span class="td-name">' + ch.label + '</span>' +
            (ch.meta ? '<span class="td-meta">' + ch.meta + '</span>' : '') + '</a>';
        }).join("");
        return '<div class="tlc-drop-wrap"><a href="' + rel(l.href) + '" class="tlc-drop-trigger">' + l.label +
          '<svg class="tlc-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></a>' +
          '<div class="tlc-drop">' + sub + '</div></div>';
      }
      return '<a href="' + rel(l.href) + '" class="">' + l.label + '</a>';
    }).join("");

    root.innerHTML =
      '<header class="tlc-nav' + (heroNav ? " on-hero" : "") + '">' +
        '<div class="tlc-nav-inner">' +
          '<a class="tlc-brand" href="' + rel("/index.html") + '">' + BRAND_HTML + '</a>' +
          '<nav class="tlc-links">' + links + '</nav>' +
          // Right cluster: language switcher (placeholder) + the Book CTA, anchored far right.
          '<div class="tlc-nav-right">' +
            '<div class="tlc-lang"><button type="button" class="is-on">EN</button><button type="button">RO</button></div>' +
            (book ? '<a class="btn tlc-nav-book" href="' + rel(book.href) + '">' + book.label + '</a>' : '') +
          '</div>' +
          '<button class="tlc-burger" aria-label="Open menu"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</header>' +
      '<div class="tlc-drawer" role="dialog" aria-modal="true">' +
        '<button class="tlc-drawer-close" aria-label="Close menu">&times;</button>' +
        '<div class="tlc-drawer-inner">' +
          '<a class="tlc-brand tlc-drawer-brand" href="' + rel("/index.html") + '">' + BRAND_HTML + '</a>' +
          NAV_LINKS.map(function (l) {
            if (!l.children) return "";
            return '<div class="tlc-drawer-group"><span class="tlc-drawer-cat">' + l.label + '</span>' +
              l.children.map(function (ch) {
                return '<a class="tlc-drawer-stay" href="' + rel(ch.href) + '"><span class="tlc-drawer-stay-name">' + ch.label + '</span>' +
                  (ch.meta ? '<span class="tlc-drawer-meta">' + ch.meta + '</span>' : '') + '</a>';
              }).join("") + '</div>';
          }).join("") +
          '<div class="tlc-drawer-links">' +
            NAV_LINKS.filter(function (l) { return !l.children && !l.btn; }).map(function (l) {
              return '<a class="tlc-drawer-link" href="' + rel(l.href) + '">' + l.label + '</a>';
            }).join("") +
          '</div>' +
          (book ? '<a class="btn tlc-drawer-book" href="' + rel(book.href) + '">Book a stay</a>' : '') +
          '<div class="tlc-lang tlc-lang-drawer"><button type="button" class="is-on">EN</button><button type="button">RO</button></div>' +
        '</div>' +
      '</div>';
  }

  function renderFooter(root, opts){
    opts = opts || {};
    root.innerHTML =
      '<footer class="tlc-footer">' +
        '<div class="tlc-footer-inner">' +
          '<div class="tlc-footer-cta">' +
            '<span class="eyebrow">Private by nature</span>' +
            '<h2 class="display">Come find the <span class="script">quiet</span>.</h2>' +
            '<p class="lead">A private, adults-only escape in wild Transylvania.</p>' +
            '<a class="btn" href="' + rel("/book.html") + '">Check dates &amp; book</a>' +
          '</div>' +
          '<div class="tlc-footer-foot">' +
            '<a class="tlc-brand" href="' + rel("/index.html") + '">' + BRAND_HTML + '</a>' +
            '<nav class="tlc-footer-nav">' +
              '<a href="' + rel("/index.html#collection") + '">The Cabins</a>' +
              '<a href="' + rel("/book.html") + '">Book a stay</a>' +
              '<a href="#">Events</a>' +
              '<a href="' + rel("/our-story.html") + '">Our story</a>' +
            '</nav>' +
            '<div class="tlc-footer-social">' +
              '<a href="https://wa.me/' + WA_NUMBER + '" aria-label="WhatsApp" target="_blank" rel="noopener">' + WA_ICON + '</a>' +
              '<a href="#" aria-label="Instagram"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"12\" cy=\"13\" r=\"3.4\"/><path d=\"M8 6l1.4-2h5L16 6\"/></svg></a>' +
              '<a href="#" aria-label="Email us"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3.5 7l8.5 6 8.5-6\"/></svg></a>' +
              '<a href="#" aria-label="Airbnb"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M4 11l8-6 8 6\"/><path d=\"M6 10v9h12v-9\"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div class="tlc-footer-bottom">' +
            '<span>&copy; ' + yearText() + ' Transylvania Log Cabins</span>' +
            '<span>Pe\u015fteana \u00b7 Hunedoara \u00b7 Transylvania</span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  // No Date.now in some sandboxes; guard it.
  function yearText(){ try { return new Date().getFullYear(); } catch (e) { return "2026"; } }

  function initDrawer(){
    var burger = document.querySelector(".tlc-burger");
    var drawer = document.querySelector(".tlc-drawer");
    if (!burger || !drawer) return;
    var close = drawer.querySelector(".tlc-drawer-close");
    function open(){ drawer.classList.add("open"); document.body.classList.add("drawer-open"); }
    function shut(){ drawer.classList.remove("open"); document.body.classList.remove("drawer-open"); }
    burger.addEventListener("click", open);
    close && close.addEventListener("click", shut);
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", shut); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") shut(); });
  }

  function initFixedHeader(heroNav){
    var nav = document.querySelector(".tlc-nav");
    if (!nav) return;
    var trigger = heroNav ? window.innerHeight * 0.7 : 40;
    function onScroll(){
      if (window.scrollY > trigger) nav.classList.add("is-fixed");
      else nav.classList.remove("is-fixed");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Thank-you modal — fires when a booking request is sent (any .bw request button).
  function initThankYou(){
    var triggers = document.querySelectorAll('.bw-action .btn');
    if (!triggers.length) return;
    var overlay = document.createElement('div');
    overlay.className = 'tlc-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="tlc-modal">' +
        '<button class="tlc-modal-close" aria-label="Close">&times;</button>' +
        '<div class="tlc-modal-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<span class="eyebrow">Request received</span>' +
        '<h2>Thank you.</h2>' +
        '<p>Your request is with Rares &amp; Gabie. They&rsquo;ll get back to you within a day to confirm your dates.</p>' +
        '<button class="btn" type="button" data-modal-close>Close</button>' +
      '</div>';
    document.body.appendChild(overlay);
    function open(){ overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); }
    function shut(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }
    Array.prototype.forEach.call(triggers, function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.hasAttribute('data-modal-close') || (e.target.closest && e.target.closest('.tlc-modal-close'))) shut();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  // Generic image carousel — wires prev/next arrows to scroll any .food-carousel-wrap.
  function initCarousels(){
    Array.prototype.forEach.call(document.querySelectorAll('.food-carousel-wrap'), function (wrap) {
      var car = wrap.querySelector('.food-carousel'); if (!car) return;
      var prev = wrap.querySelector('.food-car-btn.prev'), next = wrap.querySelector('.food-car-btn.next');
      function step(d){ var f = car.querySelector('figure'); var w = f ? f.getBoundingClientRect().width + 16 : 300; car.scrollBy({ left: d * w * 2, behavior: 'smooth' }); }
      if (prev) prev.addEventListener('click', function () { step(-1); });
      if (next) next.addEventListener('click', function () { step(1); });
    });
  }

  function init(opts){
    opts = opts || {};
    var navRoot = document.querySelector("[data-tlc-nav]");
    var footRoot = document.querySelector("[data-tlc-footer]");
    if (navRoot) renderNav(navRoot, opts);
    if (footRoot) renderFooter(footRoot, opts);
    initDrawer();
    initFixedHeader(!!opts.heroNav);
    initThankYou();
    initCarousels();
    if (!document.querySelector('.tlc-wa-fab')) {
      var wa = document.createElement('a');
      wa.className = 'tlc-wa-fab'; wa.href = 'https://wa.me/' + WA_NUMBER;
      wa.target = '_blank'; wa.rel = 'noopener';
      wa.setAttribute('aria-label', 'Message us on WhatsApp');
      wa.innerHTML = WA_ICON;
      document.body.appendChild(wa);
    }
  }

  return { init: init, NAV_LINKS: NAV_LINKS, BRAND: BRAND };
})();
