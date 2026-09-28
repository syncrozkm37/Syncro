/* =========================================================
   Syncro — idiomas (ES / EN). Única fuente de textos traducibles.
   Script clásico al final del <body>: cambia el idioma antes del
   primer pintado para que no se vea un parpadeo en español.
   Atributos: data-i18n (texto), data-i18n-html (HTML), data-i18n-attr ("atributo:clave,…")
   Eventos: "syncro:lang-before" y "syncro:lang" en document (los usan los cortes de SplitText).
   ========================================================= */
(function () {
  "use strict";

  var GLYPH = '<svg class="glyph" viewBox="0 0 369.818 259.627" aria-hidden="true"><use href="#isotipo"/></svg>';

  var I18N = {
    es: {
      "meta.title": "Syncro — Branding y web para negocios locales",
      "meta.desc": "Syncro es un estudio de branding y desarrollo web en Pontevedra. Diseñamos la marca y construimos la web de negocios locales para que los encuentren y los elijan.",
      "a11y.skip": "Saltar al contenido",
      "nav.studio": "Estudio", "nav.services": "Servicios", "nav.work": "Proyectos", "nav.process": "Método",
      "nav.pricing": "Precios", "nav.contact": "Contacto", "nav.cta": "Hablemos", "nav.menu": "Abrir menú",
      "hero.label": "Branding y web · Pontevedra", "hero.meta3": "Agenda abierta",
      "hero.title": '<span class="ln"><span>Que te</span></span><span class="ln ln--indent"><span>' + GLYPH + 'encuentren.</span></span><span class="ln"><span>Que te <em>elijan.</em></span></span>',
      "hero.cta": "Cuéntanos tu caso", "hero.scroll": "Scroll",
      "fig.cap": "Identidad Syncro", "fig.a": "Marca y web,", "fig.b": "en sincronía.", "fig.aria": "Marca y web, en sincronía",
      "studio.label": "Estudio",
      "studio.text": 'Pequeños a propósito. <span class="hl">Hablas directamente con quien diseña y con quien programa</span>: sin intermediarios, sin plantillas, sin letra pequeña.',
      "studio.missionL": "Misión",
      "studio.mission": "Resolver lo que te cuesta clientes: no aparecer, perder reservas, no vender online.",
      "studio.visionL": "Visión",
      "studio.vision": "El estudio de referencia en Galicia, de tu primera web a tus propias apps.",
      "studio.teamL": "Equipo",
      "team.jorgeR": "Dirección creativa", "team.jorgeD": "Diseño gráfico e industrial · marca · UI",
      "team.loisR": "Desarrollo", "team.loisD": "Programación y parte técnica",
      "team.eliR": "Proyecto y cliente", "team.eliD": "Tu interlocutor · coordinación · desarrollo",
      "svc.label": "Servicios",
      "svc.title": "<em>Verse</em> y <em>venderse</em>.",
      "svc.1t": "Identidad de marca", "svc.1d": "Logo, color, tipografía y manual. Igual en el rótulo que en Instagram.",
      "svc.1a": "Logotipo", "svc.1b": "Color y tipo", "svc.1c": "Manual",
      "svc.2t": "Web a medida", "svc.2d": "Diseñada para tu negocio, rápida en el móvil y lista para Google.",
      "svc.2b": "Desarrollo", "svc.2c": "SEO local",
      "svc.3t": "Reservas y venta online", "svc.3d": "Citas, pedidos o catálogo en tu web. Sin comisiones por reserva.",
      "svc.3a": "Reservas", "svc.3b": "Pedidos", "svc.3c": "Catálogo",
      "svc.4t": "Cuidado continuo", "svc.4d": "Hosting, dominio, cambios y copias por una cuota mensual.",
      "svc.4b": "Soporte", "svc.4c": "Mejoras",
      "svc.5t": "Apps a medida", "svc.5d": "Próximamente: cuando necesites más que una web.",
      "work.label": "Proyectos",
      "work.title": "Hecho por nosotros, <em>de principio a fin</em>.",
      "work.intro": "Un producto propio y cuatro webs completas. Ábrelas.",
      "work.izS": "Reservas y gestión para estudios de tatuaje", "work.dev": "En desarrollo", "work.izCover": "Web app",
      "work.izAlt": "Izanagi en el móvil: feed de piezas de tatuaje filtrable por estilo",
      "work.rail": "Proyectos (desplazable)", "work.prev": "Proyecto anterior", "work.next": "Proyecto siguiente",
      "work.own": "Caso 00", "work.concept": "Conceptual",
      "work.view": "Ver web", "work.live": "Web navegable", "work.newTab": "(se abre en otra pestaña)", "work.appts": "Citas",
      "work.p0s": "Nuestra propia marca", "work.p1s": "Panadería de barrio", "work.p2s": "Clínica de fisioterapia",
      "work.p3s": "Taller de bicicletas", "work.p4s": "Taberna marinera",
      "work.orders": "Pedidos online", "work.booking": "Reservas",
      "proc.label": "Método",
      "proc.title": "Cuatro pasos. Un precio cerrado. <em>Cero sorpresas.</em>",
      "proc.1t": "Escuchar", "proc.1d": "Vamos a tu local. Antes de diseñar nada, entendemos qué te está costando clientes.", "proc.1w": "Semana 1",
      "proc.2t": "Definir", "proc.2d": "Marca, estructura de la web y presupuesto cerrado. Lo apruebas por escrito antes de empezar.", "proc.2w": "Semanas 1–2",
      "proc.3t": "Diseñar y construir", "proc.3d": "Diseñamos, programamos y te enseñamos avances cada semana. Tú decides; nosotros ejecutamos.", "proc.3w": "Semanas 2–5",
      "proc.4t": "Lanzar y cuidar", "proc.4d": "Publicamos, te enseñamos a gestionarla y seguimos a tu lado con el mantenimiento mensual.", "proc.4w": "Continuo",
      "proc.q": "Tu web. Tus clientes. <em>Tus datos.</em>",
      "proc.qp": "Nada de depender de plataformas que cobran por cada reserva y se quedan con la relación con tu cliente.",
      "price.label": "Precios", "price.title": "Sabes lo que pagas <em>antes de empezar</em>.",
      "price.from": "Precio", "price.amt": "A medida", "price.quote": "Presupuesto cerrado en 48 h", "price.quoteM": "Presupuesto cerrado en 48 h + cuota mensual", "price.cta": "Pedir presupuesto",
      "price.aL": "Marca", "price.aF": "Para abrir o renovar tu negocio con buen pie.",
      "price.a1": "Logotipo y variantes", "price.a2": "Paleta de color y tipografía", "price.a3": "Manual de identidad", "price.a4": "Plantillas para redes y tarjetas",
      "price.bF": "Para que te encuentren en Google y te contacten.",
      "price.b1": "Diseño a medida, hasta 5 secciones", "price.b2": "Optimizada para móvil y velocidad", "price.b3": "SEO local y ficha de Google", "price.b4": "Hosting, dominio y soporte en la cuota",
      "price.badge": "Más completo", "price.cL": "Marca + Web", "price.cN": "Presencia completa",
      "price.cF": "Para negocios que quieren vender o reservar online.",
      "price.c1": "Identidad de marca completa", "price.c2": "Web a medida", "price.c3": "Reservas o pedidos online", "price.c4": "Formación para gestionarla tú",
      "price.note": "IVA no incluido. Tras la primera reunión recibes un presupuesto cerrado: sin extras ni sorpresas.",
      "contact.label": "Contacto", "contact.big": "¿Hablamos?",
      "contact.p": "Cuéntanos qué le pasa a tu negocio. Te respondemos en 48 h laborables con una propuesta, no con un catálogo.",
      "contact.cta": "Escríbenos",
      "foot.p": "Branding y desarrollo web para negocios locales.", "foot.nav": "Navegación", "foot.studio": "Estudio",
      "foot.lang": "Idioma", "foot.made": "Hecho en Pontevedra", "foot.top": "Volver arriba ↑",
      "cursor.drag": "Arrastra", "cursor.view": "Ver web"
    },
    en: {
      "meta.title": "Syncro — Branding & web for local businesses",
      "meta.desc": "Syncro is a branding and web development studio in Pontevedra, Spain. We design the brand and build the website so local businesses get found — and chosen.",
      "a11y.skip": "Skip to content",
      "nav.studio": "Studio", "nav.services": "Services", "nav.work": "Work", "nav.process": "Process",
      "nav.pricing": "Pricing", "nav.contact": "Contact", "nav.cta": "Let's talk", "nav.menu": "Open menu",
      "hero.label": "Branding & web · Pontevedra", "hero.meta3": "Booking new projects",
      "hero.title": '<span class="ln"><span>Get</span></span><span class="ln ln--indent"><span>' + GLYPH + 'found.</span></span><span class="ln"><span>Get <em>chosen.</em></span></span>',
      "hero.cta": "Tell us about it", "hero.scroll": "Scroll",
      "fig.cap": "Syncro identity", "fig.a": "Brand and web,", "fig.b": "in sync.", "fig.aria": "Brand and web, in sync",
      "studio.label": "Studio",
      "studio.text": 'Small on purpose. <span class="hl">You talk directly to the people who design and build</span>: no middlemen, no templates, no fine print.',
      "studio.missionL": "Mission",
      "studio.mission": "Fix what costs you customers: not being found, lost bookings, no online sales.",
      "studio.visionL": "Vision",
      "studio.vision": "Galicia's go-to studio, from your first website to your own apps.",
      "studio.teamL": "Team",
      "team.jorgeR": "Creative direction", "team.jorgeD": "Graphic & industrial design · brand · UI",
      "team.loisR": "Development", "team.loisD": "Engineering and technical build",
      "team.eliR": "Project & client", "team.eliD": "Your point of contact · coordination · development",
      "svc.label": "Services",
      "svc.title": "<em>Seen</em> and <em>sold</em>.",
      "svc.1t": "Brand identity", "svc.1d": "Logo, colour, type and guidelines. Same on the sign as on Instagram.",
      "svc.1a": "Logo", "svc.1b": "Colour & type", "svc.1c": "Guidelines",
      "svc.2t": "Custom website", "svc.2d": "Designed for your business, fast on mobile, ready for Google.",
      "svc.2b": "Development", "svc.2c": "Local SEO",
      "svc.3t": "Bookings & online sales", "svc.3d": "Bookings, orders or a catalogue on your site. No per-booking fees.",
      "svc.3a": "Bookings", "svc.3b": "Orders", "svc.3c": "Catalogue",
      "svc.4t": "Ongoing care", "svc.4d": "Hosting, domain, updates and backups for a monthly fee.",
      "svc.4b": "Support", "svc.4c": "Improvements",
      "svc.5t": "Custom apps", "svc.5d": "Coming soon: for when you need more than a website.",
      "work.label": "Work",
      "work.title": "Built by us, <em>start to finish</em>.",
      "work.intro": "One product of our own and four complete sites. Open them.",
      "work.izS": "Booking and management for tattoo studios", "work.dev": "In development", "work.izCover": "Web app",
      "work.izAlt": "Izanagi on mobile: tattoo feed filterable by style",
      "work.rail": "Projects (scrollable)", "work.prev": "Previous project", "work.next": "Next project",
      "work.own": "Case 00", "work.concept": "Concept",
      "work.view": "View site", "work.live": "Live site", "work.newTab": "(opens in a new tab)", "work.appts": "Appointments",
      "work.p0s": "Our own brand", "work.p1s": "Neighbourhood bakery", "work.p2s": "Physiotherapy clinic",
      "work.p3s": "Bicycle workshop", "work.p4s": "Seafood tavern",
      "work.orders": "Online orders", "work.booking": "Bookings",
      "proc.label": "Process",
      "proc.title": "Four steps. One fixed price. <em>Zero surprises.</em>",
      "proc.1t": "Listen", "proc.1d": "We visit your place. Before designing anything, we understand what is costing you customers.", "proc.1w": "Week 1",
      "proc.2t": "Define", "proc.2d": "Brand, site structure and a fixed quote. You sign off in writing before we start.", "proc.2w": "Weeks 1–2",
      "proc.3t": "Design & build", "proc.3d": "We design, code and show you progress every week. You decide; we deliver.", "proc.3w": "Weeks 2–5",
      "proc.4t": "Launch & care", "proc.4d": "We go live, teach you how to manage it and stay by your side with monthly maintenance.", "proc.4w": "Ongoing",
      "proc.q": "Your site. Your customers. <em>Your data.</em>",
      "proc.qp": "No more relying on platforms that charge for every booking and keep the relationship with your customer.",
      "price.label": "Pricing", "price.title": "Know what you pay <em>before we start</em>.",
      "price.from": "Price", "price.amt": "Tailored", "price.quote": "Fixed quote within 48 h", "price.quoteM": "Fixed quote within 48 h + monthly fee", "price.cta": "Get a quote",
      "price.aL": "Brand", "price.aF": "To open or refresh your business on the right foot.",
      "price.a1": "Logo and variations", "price.a2": "Colour palette and typography", "price.a3": "Brand guidelines", "price.a4": "Social and business card templates",
      "price.bF": "To get found on Google and get contacted.",
      "price.b1": "Custom design, up to 5 sections", "price.b2": "Optimised for mobile and speed", "price.b3": "Local SEO and Google Business profile", "price.b4": "Hosting, domain and support included",
      "price.badge": "Most complete", "price.cL": "Brand + Web", "price.cN": "Full presence",
      "price.cF": "For businesses that want to sell or take bookings online.",
      "price.c1": "Complete brand identity", "price.c2": "Custom website", "price.c3": "Online bookings or orders", "price.c4": "Training to manage it yourself",
      "price.note": "VAT not included. After our first meeting you get a fixed quote: no extras, no surprises.",
      "contact.label": "Contact", "contact.big": "Let's talk.",
      "contact.p": "Tell us what's going on with your business. We reply within 48 working hours with a proposal, not a brochure.",
      "contact.cta": "Write to us",
      "foot.p": "Branding and web development for local businesses.", "foot.nav": "Navigation", "foot.studio": "Studio",
      "foot.lang": "Language", "foot.made": "Made in Pontevedra", "foot.top": "Back to top ↑",
      "cursor.drag": "Drag", "cursor.view": "View site"
    }
  };

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
