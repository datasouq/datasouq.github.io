/* ==========================================================================
   DataSouq — configuration, translations and page logic
   الإعدادات والترجمة ومنطق الصفحة

   الصفحة تعريفية فقط — مفيش منتجات ولا أسعار معروضة حاليًا.
   This is an introductory page only — no products or prices are listed yet.
   ========================================================================== */

const CONFIG = {
  whatsappNumber: "mbi.group",
  email: "mbi.datasouq@gmail.com",
  github: "https://github.com/datasouq",

  defaultLang: "en",     /* "en" | "ar" */
  defaultTheme: "light", /* "light" | "dark" */
};

/* ==========================================================================
   Translations / الترجمة
   ========================================================================== */

const I18N = {
  en: {
    dir: "ltr",
    docTitle: "DataSouq — structured data, ready to work with",
    langBtn: "العربية",
    langBtnAria: "Switch to Arabic",
    themeAria: "Toggle theme",
    skipLink: "Skip to content",

    heroBadge: "Datasets coming soon",
    heroTitle: "Structured data, ready to work with",
    heroLead:
      "DataSouq cleans, deduplicates and structures raw records, then delivers them as datasets ready to import.",
    ctaContact: "Message us on WhatsApp",
    ctaEmail: "Send an email",

    whatLabel: "What we do",
    whatTitle: "Datasets, cleaning, and custom work",
    whatLead:
      "The scope is narrow on purpose. Everything is cleaned, structured and documented before it reaches you.",

    card1Title: "Curated datasets",
    card1Body: "Ready-made datasets, deduplicated and normalised, delivered in Excel or CSV.",
    card2Title: "Cleaning & structuring",
    card2Body: "Send us the messy files. We standardise formats, remove duplicates and fill the gaps.",
    card3Title: "Custom requests",
    card3Body: "Need something specific? Describe it and we will tell you if we can build it.",

    /* Active language: the title prompts an action, the description explains
       the value of taking it. Per the Empty State Presentational fragment. */
    soonTitle: "Tell us what you're looking for",
    soonBody:
      "The first datasets are still being prepared. Describe what you need and we will tell you whether it is already in the pipeline, and let you know the moment it is ready.",

    footerRights: "All rights reserved.",
    footerWhatsapp: "WhatsApp",
    footerEmail: "Email",
    footerFacebook: "Facebook",
    footerInstagram: "Instagram",
    footerGithub: "GitHub",

    waMessage: () =>
      "Hello 👋\n\nI came across DataSouq and I'd like to know more about " +
      "the datasets you're preparing.\n\nCould you get in touch?",
  },

  ar: {
    dir: "rtl",
    docTitle: "داتا سوق — بيانات منظّمة، جاهزة للشغل",
    langBtn: "English",
    langBtnAria: "التبديل إلى الإنجليزية",
    themeAria: "تبديل المظهر",
    skipLink: "تخطَّ إلى المحتوى",

    heroBadge: "قواعد البيانات قريبًا",
    heroTitle: "بيانات منظّمة، جاهزة للشغل",
    heroLead:
      "داتا سوق بينظّف السجلات الخام ويشيل التكرار وينظّمها، وبيسلّمها قواعد بيانات جاهزة للاستيراد.",
    ctaContact: "كلّمنا على واتساب",
    ctaEmail: "ابعت إيميل",

    whatLabel: "اللي بنعمله",
    whatTitle: "قواعد بيانات، تنظيف، وشغل مخصص",
    whatLead:
      "النطاق ضيق بقصد. أي حاجة بنسلّمها بتبقى منظّفة ومنظّمة وموثّقة قبل ما توصلك.",

    card1Title: "قواعد بيانات جاهزة",
    card1Body: "قواعد بيانات مجهّزة، من غير تكرار وبصيغة موحّدة، بتتسلّم إكسل أو CSV.",
    card2Title: "تنظيف وتنظيم",
    card2Body: "ابعتلنا الملفات المبعثرة. بنوحّد الصيغ ونشيل التكرار ونكمّل الناقص.",
    card3Title: "طلبات مخصصة",
    card3Body: "محتاج حاجة معيّنة؟ احكيلنا وإحنا نقولك لو نقدر نجهّزها.",

    /* صيغة فعل: العنوان بيطلب إجراء والوصف بيشرح قيمته */
    soonTitle: "قول لنا بتدوّر على إيه",
    soonBody:
      "أول قواعد بيانات لسه بتتجهّز. احكيلنا محتاج إيه وإحنا نقولك لو هو في الطريق فعلًا، ونعرّفك أول ما يجهز.",

    footerRights: "جميع الحقوق محفوظة.",
    footerWhatsapp: "واتساب",
    footerEmail: "البريد",
    footerFacebook: "فيسبوك",
    footerInstagram: "إنستجرام",
    footerGithub: "جيت هب",

    waMessage: () =>
      "السلام عليكم 👋\n\nشفت موقع داتا سوق وحابب أعرف أكتر عن قواعد " +
      "البيانات اللي بتجهّزوها.\n\nممكن نتواصل؟",
  },
};

/* ==========================================================================
   Logic / المنطق
   ========================================================================== */

(function () {
  "use strict";

  let lang = CONFIG.defaultLang;
  const $ = (id) => document.getElementById(id);

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* storage unavailable */ }
    return null;
  }

  function whatsappUrl() {
    const number = String(CONFIG.whatsappNumber).replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(I18N[lang].waMessage())}`;
  }

  function applyLang(next) {
    lang = I18N[next] ? next : "en";
    const t = I18N[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = t.docTitle;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = t[node.dataset.i18n];
      if (value !== undefined) node.textContent = value;
    });

    /* Icon-only links carry their label in aria-label + title instead of text */
    document.querySelectorAll("[data-i18n-label]").forEach((node) => {
      const value = t[node.dataset.i18nLabel];
      if (value === undefined) return;
      node.setAttribute("aria-label", value);
      node.setAttribute("title", value);
    });

    const btn = $("lang-toggle");
    btn.querySelector("span").textContent = t.langBtn;
    btn.setAttribute("aria-label", t.langBtnAria);
    $("theme-toggle").setAttribute("aria-label", t.themeAria);

    const url = whatsappUrl();
    document.querySelectorAll("[data-wa]").forEach((n) => n.setAttribute("href", url));

    store("datasouq-lang", lang);
  }

  function toggleTheme() {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store("datasouq-theme", next);
  }

  function init() {
    applyLang(store("datasouq-lang") || CONFIG.defaultLang);

    $("lang-toggle").addEventListener("click", () => applyLang(lang === "en" ? "ar" : "en"));
    $("theme-toggle").addEventListener("click", toggleTheme);

    $("year").textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
