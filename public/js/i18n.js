/* =========================================================
   Syncro — idiomas (ES / EN). Los textos se editan en el panel
   (content/textos/*.json) y scripts/build.mjs los escribe aquí y en index.html.
   Script clásico al final del <body>: cambia el idioma antes del
   primer pintado para que no se vea un parpadeo en español.
   Atributos: data-i18n (texto), data-i18n-html (HTML), data-i18n-attr ("atributo:clave,…")
   Eventos: "syncro:lang-before" y "syncro:lang" en document (la navegación vuelve a medir el menú).
   ========================================================= */
(function () {
  "use strict";

  // @generado:textos — lo escribe scripts/build.mjs desde content/textos/*.json (lo que se edita en el panel). No editar a mano.
  var I18N = {
    "es": {
      "hero.title": "Marca y web en sincronía",
      "hero.sub": "Creación de páginas web y branding de marca para empresas locales",
      "studio.label": "Estudio",
      "about.title": "¿Quiénes somos?",
      "about.1": "Syncro es una startup que se dedica a la <span class=\"hl\">creación y desarrollo de páginas web y branding de marca para empresas locales</span>.",
      "about.2": "Impulsamos su presencia combinando diseño web y estrategia de marca, para mejorar la experiencia de sus clientes y empleados.",
      "about.3": "<span class=\"hl\">Somos especialistas en especializarnos.</span> Entendemos que cada negocio es un mundo; por eso nos adaptamos a cada uno y aprendemos de cada proyecto de principio a fin.",
      "mission.label": "Misión",
      "mission.q": "¿Qué hacemos y qué aportamos?",
      "mission.text": "Diseñamos e impulsamos la presencia digital de las empresas locales con páginas web y branding con identidad propia, para <span class=\"hl\">mejorar su comunicación y la experiencia de sus clientes, futuros clientes y empleados</span>. Unimos la creatividad y la pasión humanas con la agilidad de la inteligencia artificial, y aprendemos en cada proyecto de la mano de nuestros clientes.",
      "vision.label": "Visión",
      "vision.q": "¿Qué queremos hacer y aportar en el futuro?",
      "vision.text": "Liderar el sector construyendo un ecosistema en el que cada negocio local tenga una <span class=\"hl\">presencia digital profesional, atemporal y a la altura de las grandes marcas</span>. Y convertir nuestra experiencia en la fortaleza que nos permita afrontar cualquier desafío.",
      "values.title": "Valores",
      "val.1t": "Confianza",
      "val.1d": "Construimos relaciones duraderas basadas en la confianza mutua.",
      "val.2t": "Profesionalismo",
      "val.2d": "Cuidamos cada detalle del proceso para cumplir cada exigencia y expectativa.",
      "val.3t": "Autenticidad",
      "val.3d": "Ayudamos a cada cliente a forjar una identidad única, honesta y a su medida.",
      "val.4t": "Inspiración",
      "val.4d": "Trabajamos motivados y queremos contagiar esa motivación a quien nos ve.",
      "svc.label": "Servicios",
      "svc.title": "<em>Verse</em> y <em>venderse</em>.",
      "svc.1t": "Identidad de marca",
      "svc.1d": "Logo, color, tipografía y manual: tu marca, igual en el rótulo que en Instagram.",
      "svc.2t": "Web a medida",
      "svc.2d": "Diseñada para tu negocio, rápida en el móvil y lista para Google.",
      "svc.3t": "Reservas y venta online",
      "svc.3d": "Citas, pedidos o catálogo en tu propia web, sin comisiones.",
      "svc.4t": "Cuidado continuo",
      "svc.4d": "Hosting, dominio, cambios y copias de seguridad por una cuota al mes.",
      "svc.5t": "Apps",
      "svc.5d": "Próximamente",
      "work.label": "Proyectos",
      "work.title": "Hecho por nosotros, <em>de principio a fin</em>.",
      "work.intro": "Nuestra marca, un producto propio y cuatro webs completas que puedes abrir.",
      "work.p0s": "Nuestra propia marca",
      "work.izS": "Reservas y gestión para estudios de tatuaje",
      "work.p1s": "Panadería de barrio",
      "work.p2s": "Clínica de fisioterapia",
      "work.p3s": "Taller de bicicletas",
      "work.p4s": "Taberna marinera",
      "work.own": "Caso 00",
      "work.dev": "En desarrollo",
      "work.concept": "Conceptual",
      "work.brand": "Identidad de marca",
      "work.orders": "Pedidos online",
      "work.booking": "Reservas",
      "work.appts": "Citas",
      "work.view": "Ver web",
      "work.newTab": "(se abre en otra pestaña)",
      "work.rail": "Proyectos (desplazable)",
      "work.prev": "Proyecto anterior",
      "work.next": "Proyecto siguiente",
      "proc.label": "Método",
      "proc.title": "Cuatro pasos. Un precio cerrado. <em>Cero sorpresas.</em>",
      "proc.1t": "Escuchar",
      "proc.1d": "Vamos a tu negocio y entendemos qué necesitas.",
      "proc.1w": "Semana 1",
      "proc.2t": "Definir",
      "proc.2d": "Marca, estructura y presupuesto cerrado, por escrito.",
      "proc.2w": "Semanas 1–2",
      "proc.3t": "Construir",
      "proc.3d": "Diseñamos y programamos. Ves avances cada semana.",
      "proc.3w": "Semanas 2–5",
      "proc.4t": "Lanzar",
      "proc.4d": "Publicamos, te enseñamos a usarla y seguimos a tu lado.",
      "proc.4w": "Continuo",
      "proc.q": "Tu web. Tus clientes. <em>Tus datos.</em>",
      "proc.qp": "Sin plataformas que se queden con tu cliente.",
      "price.label": "Planes",
      "price.title": "Sabes lo que pagas <em>antes de empezar</em>.",
      "price.amt": "A medida",
      "price.quote": "Presupuesto cerrado en 48 h",
      "price.monthly": "+ cuota mensual",
      "price.includes": "Qué incluye",
      "price.cta": "Pedir presupuesto",
      "price.aL": "Marca",
      "price.aF": "Para abrir o renovar tu negocio.",
      "price.a1": "Logotipo y variantes",
      "price.a2": "Paleta de color y tipografía",
      "price.a3": "Manual de identidad",
      "price.a4": "Plantillas para redes y tarjetas",
      "price.bF": "Para que te encuentren.",
      "price.b1": "Diseño a medida, hasta 5 secciones",
      "price.b2": "Rápida y pensada para el móvil",
      "price.b3": "SEO local y ficha de Google",
      "price.b4": "Hosting, dominio y soporte en la cuota",
      "price.badge": "Más completo",
      "price.cL": "Marca + Web",
      "price.cN": "Presencia completa",
      "price.cF": "Para vender y reservar online.",
      "price.c1": "Identidad de marca completa",
      "price.c2": "Web a medida",
      "price.c3": "Reservas o pedidos online",
      "price.c4": "Formación para que la gestiones tú",
      "price.note": "IVA no incluido. Cerramos el presupuesto tras la primera reunión.",
      "contact.label": "Contacto",
      "contact.big": "¿Hablamos?",
      "contact.p": "Cuéntanos qué necesita tu negocio y te respondemos en 48 h con una propuesta.",
      "contact.cta": "Escríbenos",
      "contact.copy": "Clic en el email para copiarlo",
      "contact.copied": "Email copiado",
      "foot.p": "Creación y desarrollo de páginas web y branding de marca.",
      "foot.nav": "Navegación",
      "foot.studio": "Estudio",
      "foot.lang": "Idioma",
      "foot.made": "Hecho en Pontevedra",
      "foot.top": "Volver arriba ↑",
      "meta.title": "Syncro · Páginas web y branding para empresas locales",
      "meta.desc": "Syncro es una startup de Pontevedra que crea y desarrolla páginas web y branding de marca para empresas locales, con identidad propia.",
      "nav.studio": "Estudio",
      "nav.services": "Servicios",
      "nav.work": "Proyectos",
      "nav.process": "Método",
      "nav.pricing": "Planes",
      "nav.contact": "Contacto",
      "nav.cta": "Contáctanos",
      "nav.menu": "Abrir menú",
      "a11y.skip": "Saltar al contenido"
    },
    "en": {
      "hero.title": "Brand and web in sync",
      "hero.sub": "Websites and brand identity for local businesses",
      "studio.label": "Studio",
      "about.title": "Who are we?",
      "about.1": "Syncro is a start-up dedicated to <span class=\"hl\">designing and building websites and brand identities for local businesses</span>.",
      "about.2": "We boost their presence by combining web design and brand strategy, improving the experience of their customers and staff.",
      "about.3": "<span class=\"hl\">We specialise in specialising.</span> Every business is a world of its own, so we adapt to each one and learn from every project, start to finish.",
      "mission.label": "Mission",
      "mission.q": "What do we do and what do we bring?",
      "mission.text": "We design and boost the digital presence of local businesses with websites and branding that have an identity of their own, to <span class=\"hl\">improve their communication and the experience of their customers, future customers and staff</span>. We combine human creativity and passion with the agility of artificial intelligence, and we learn from every project hand in hand with our clients.",
      "vision.label": "Vision",
      "vision.q": "What do we want to do and bring in the future?",
      "vision.text": "To lead the sector by building an ecosystem where every local business has a <span class=\"hl\">professional, timeless digital presence that stands up to the big brands</span>. And to turn our experience into the strength that lets us face any challenge.",
      "values.title": "Values",
      "val.1t": "Trust",
      "val.1d": "We build lasting relationships based on mutual trust.",
      "val.2t": "Professionalism",
      "val.2d": "We look after every detail of the process to meet every requirement and expectation.",
      "val.3t": "Authenticity",
      "val.3d": "We help each client build a unique, honest identity that fits them.",
      "val.4t": "Inspiration",
      "val.4d": "We work motivated and want to pass that motivation on to everyone who sees us.",
      "svc.label": "Services",
      "svc.title": "<em>Seen</em> and <em>sold</em>.",
      "svc.1t": "Brand identity",
      "svc.1d": "Logo, colour, type and guidelines: your brand, the same on the shop sign as on Instagram.",
      "svc.2t": "Custom website",
      "svc.2d": "Designed for your business, fast on mobile and ready for Google.",
      "svc.3t": "Bookings & online sales",
      "svc.3d": "Appointments, orders or a catalogue on your own site, with no commissions.",
      "svc.4t": "Ongoing care",
      "svc.4d": "Hosting, domain, updates and backups for a monthly fee.",
      "svc.5t": "Apps",
      "svc.5d": "Coming soon",
      "work.label": "Work",
      "work.title": "Built by us, <em>start to finish</em>.",
      "work.intro": "Our own brand, a product of our own and four complete websites you can open.",
      "work.p0s": "Our own brand",
      "work.izS": "Bookings and management for tattoo studios",
      "work.p1s": "Neighbourhood bakery",
      "work.p2s": "Physiotherapy clinic",
      "work.p3s": "Bicycle workshop",
      "work.p4s": "Seafood tavern",
      "work.own": "Case 00",
      "work.dev": "In development",
      "work.concept": "Concept",
      "work.brand": "Brand identity",
      "work.orders": "Online orders",
      "work.booking": "Bookings",
      "work.appts": "Appointments",
      "work.view": "View site",
      "work.newTab": "(opens in a new tab)",
      "work.rail": "Projects (scrollable)",
      "work.prev": "Previous project",
      "work.next": "Next project",
      "proc.label": "Process",
      "proc.title": "Four steps. One fixed price. <em>Zero surprises.</em>",
      "proc.1t": "Listen",
      "proc.1d": "We visit your business and understand what you need.",
      "proc.1w": "Week 1",
      "proc.2t": "Define",
      "proc.2d": "Brand, structure and a fixed quote, in writing.",
      "proc.2w": "Weeks 1–2",
      "proc.3t": "Build",
      "proc.3d": "We design and code. You see progress every week.",
      "proc.3w": "Weeks 2–5",
      "proc.4t": "Launch",
      "proc.4d": "We go live, show you how to use it and stay by your side.",
      "proc.4w": "Ongoing",
      "proc.q": "Your site. Your customers. <em>Your data.</em>",
      "proc.qp": "No platform standing between you and your customer.",
      "price.label": "Plans",
      "price.title": "Know what you pay <em>before we start</em>.",
      "price.amt": "Tailored",
      "price.quote": "Fixed quote within 48 h",
      "price.monthly": "+ monthly fee",
      "price.includes": "What's included",
      "price.cta": "Get a quote",
      "price.aL": "Brand",
      "price.aF": "To open or refresh your business.",
      "price.a1": "Logo and variations",
      "price.a2": "Colour palette and typography",
      "price.a3": "Brand guidelines",
      "price.a4": "Social and business card templates",
      "price.bF": "To get found.",
      "price.b1": "Custom design, up to 5 sections",
      "price.b2": "Fast and built for mobile",
      "price.b3": "Local SEO and Google Business profile",
      "price.b4": "Hosting, domain and support in the fee",
      "price.badge": "Most complete",
      "price.cL": "Brand + Web",
      "price.cN": "Full presence",
      "price.cF": "To sell and take bookings online.",
      "price.c1": "Complete brand identity",
      "price.c2": "Custom website",
      "price.c3": "Online bookings or orders",
      "price.c4": "Training so you can run it yourself",
      "price.note": "VAT not included. We fix the quote after our first meeting.",
      "contact.label": "Contact",
      "contact.big": "Let's talk.",
      "contact.p": "Tell us what your business needs and we'll reply within 48 h with a proposal.",
      "contact.cta": "Write to us",
      "contact.copy": "Click the email to copy it",
      "contact.copied": "Email copied",
      "foot.p": "Websites and brand identity, designed and built.",
      "foot.nav": "Navigation",
      "foot.studio": "Studio",
      "foot.lang": "Language",
      "foot.made": "Made in Pontevedra",
      "foot.top": "Back to top ↑",
      "meta.title": "Syncro · Websites and branding for local businesses",
      "meta.desc": "Syncro is a start-up from Pontevedra, Spain, that designs and builds websites and brand identities for local businesses, each with an identity of its own.",
      "nav.studio": "Studio",
      "nav.services": "Services",
      "nav.work": "Work",
      "nav.process": "Process",
      "nav.pricing": "Plans",
      "nav.contact": "Contact",
      "nav.cta": "Contact us",
      "nav.menu": "Open menu",
      "a11y.skip": "Skip to content"
    }
  };
  // @fin:textos

  var current = "es";
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  function apply(lang) {
    var dict = I18N[lang] || I18N.es;
    current = I18N[lang] ? lang : "es";
    document.documentElement.lang = current;
    $$("[data-i18n]").forEach(function (el) { var v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$("[data-i18n-html]").forEach(function (el) { var v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split(",").forEach(function (pair) {
        var p = pair.split(":"); var v = dict[p[1]]; if (v != null) el.setAttribute(p[0], v);
      });
    });
    document.title = dict["meta.title"];
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", dict["meta.desc"]);
    $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === current)); });
  }

  function setLang(lang) {
    if (lang === current || !I18N[lang]) return;
    document.dispatchEvent(new CustomEvent("syncro:lang-before", { detail: { lang: lang } }));
    apply(lang);
    store("syncro-lang", lang);
    document.dispatchEvent(new CustomEvent("syncro:lang", { detail: { lang: lang } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang]");
    if (b) setLang(b.dataset.lang);
  });

  var saved = store("syncro-lang");
  var nav = (navigator.language || "es").toLowerCase();
  var initial = saved || (nav.indexOf("es") === 0 || nav.indexOf("gl") === 0 ? "es" : "en");
  if (initial !== "es") apply(initial);

  window.SyncroI18n = {
    setLang: setLang,
    lang: function () { return current; },
    t: function (key) { return (I18N[current] || I18N.es)[key]; }
  };
})();
