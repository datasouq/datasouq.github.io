/* ==========================================================================
   DataSouq — configuration, translations and page logic
   الإعدادات والترجمة ومنطق الصفحة

   الصفحة بتعرض قاعدة بيانات واحدة، ومؤشراتها مقيسة من الملف نفسه.
   السعر وقائمة الحقول الكاملة مش معروضين — بيتحددوا في المحادثة.
   One dataset is listed. Its metrics are measured from the file itself; the
   price and the full field list are not stated anywhere on the page, and the
   WhatsApp message asks for them instead.
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

    catalogueLabel: "Catalogue",
    catalogueTitle: "Available now",
    catalogueLead: "More datasets are in preparation.",
    datasetTitle: "Saudi Contractors Authority registry",
    datasetBody:
      "Contractors registered with the Saudi Contractors Authority, cleaned and structured. Message us for the full field list and the price.",
    datasetCta: "Ask about this dataset",

    /* Every figure is measured from the file, not estimated. Phone numbers are
       deliberately absent from the metrics: only 31.7% are usable. */
    m1Value: "17,304",  m1Label: "records",
    m2Value: "302",     m2Label: "cities across 13 regions",
    m3Value: "7",       m3Label: "classification grades",
    m4Value: "99.5%",   m4Label: "carry an email",
    m5Value: "AR + EN", m5Label: "in one file",

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
      "More datasets are in preparation. Describe what you need and we will tell you whether it is already in the pipeline, and let you know the moment it is ready.",

    waMessage: () =>
      "Hello 👋\n\nI came across DataSouq and I'd like to know more about " +
      "the datasets you're preparing.\n\nCould you get in touch?",

    waDatasetMessage: () =>
      "Hello 👋\n\nI'm interested in the *Saudi Contractors Authority registry* " +
      "dataset.\n\nCould you send the full field list and the price?",
  },

  ar: {
    dir: "rtl",
    docTitle: "داتا سوق — بيانات منظّمة، جاهزة للشغل",
    langBtn: "English",
    langBtnAria: "التبديل إلى الإنجليزية",
    themeAria: "تبديل المظهر",
    skipLink: "تخطَّ إلى المحتوى",

    catalogueLabel: "الكتالوج",
    catalogueTitle: "متاح الآن",
    catalogueLead: "وفيه قواعد بيانات تانية بتتجهّز.",
    datasetTitle: "سجل الهيئة السعودية للمقاولين",
    datasetBody:
      "المقاولون المسجّلون في الهيئة السعودية للمقاولين، منظّفين ومنظّمين. كلّمنا تعرف قائمة الحقول كاملة والسعر.",
    datasetCta: "اسأل عن القاعدة دي",

    m1Value: "17,304",   m1Label: "سجل",
    m2Value: "302",      m2Label: "مدينة في 13 منطقة",
    m3Value: "7",        m3Label: "درجات تصنيف",
    m4Value: "99.5%",    m4Label: "منهم بإيميل",
    m5Value: "عربي + إنجليزي", m5Label: "في ملف واحد",

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
      "فيه قواعد بيانات تانية بتتجهّز. احكيلنا محتاج إيه وإحنا نقولك لو هو في الطريق فعلًا، ونعرّفك أول ما يجهز.",

    waMessage: () =>
      "السلام عليكم 👋\n\nشفت موقع داتا سوق وحابب أعرف أكتر عن قواعد " +
      "البيانات اللي بتجهّزوها.\n\nممكن نتواصل؟",

    waDatasetMessage: () =>
      "السلام عليكم 👋\n\nمهتم بـ *سجل الهيئة السعودية للمقاولين*.\n\n" +
      "ممكن تبعتوا لي قائمة الحقول كاملة والسعر؟",
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

  function whatsappUrl(key) {
    const number = String(CONFIG.whatsappNumber).replace(/\D/g, "");
    const build = I18N[lang][key] || I18N[lang].waMessage;
    return `https://wa.me/${number}?text=${encodeURIComponent(build())}`;
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

    const general = whatsappUrl("waMessage");
    document.querySelectorAll("[data-wa]").forEach((n) => n.setAttribute("href", general));

    /* The catalogue card opens WhatsApp naming the dataset and asking for the
       three details the page deliberately does not state. */
    const dataset = whatsappUrl("waDatasetMessage");
    document.querySelectorAll("[data-wa-dataset]").forEach((n) => n.setAttribute("href", dataset));

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
