/* ==========================================================================
   DataSouq — configuration, translations and page logic
   الإعدادات والترجمة ومنطق الصفحة

   ⚙️  EDIT HERE / عدّل من هنا:
       CONFIG.whatsappNumber   رقم الواتساب
       CONFIG.price            السعر (null = "on request" / "عند الطلب")
       PRODUCT                 بيانات المنتج بالإنجليزي والعربي

   ⚠️  TODO — املأ القيم دي قبل النشر / fill these before publishing:
       PRODUCT.specs.records   عدد السجلات في القاعدة
       CONFIG.price            السعر النهائي
       PRODUCT.fields          تأكيد الحقول اللي فعلاً موجودة في القاعدة
       (أي صف مواصفات قيمته فاضية بيتخفي تلقائيًا من الصفحة)
   ========================================================================== */

const CONFIG = {
  whatsappNumber: "mbi.group",
  email: "mbi.datasouq@gmail.com",
  github: "https://github.com/datasouq",

  defaultLang: "en",   /* "en" أو "ar" */
  defaultTheme: "light", /* "light" أو "dark" */

  /* null = يعرض "عند الطلب" — حط رقم زي 3500 عشان يظهر السعر */
  price: null,
  currency: { en: "SAR", ar: "ريال" },
};

/* ==========================================================================
   Product / المنتج
   ========================================================================== */

const PRODUCT = {
  id: "saudi-contractors",

  name: {
    en: "Saudi Arabia Registered Contractors Database",
    ar: "قاعدة بيانات المقاولين المسجّلين في المملكة العربية السعودية",
  },

  description: {
    en: "A structured, cleaned dataset of contractors registered in Saudi Arabia — ready to use for sales outreach, market research and lead generation.",
    ar: "قاعدة بيانات منظّمة ومنظّفة للمقاولين المسجّلين في المملكة العربية السعودية — جاهزة للاستخدام في المبيعات وأبحاث السوق واستهداف العملاء.",
  },

  /* الحقول المتاحة في القاعدة — عدّلها حسب اللي عندك فعلًا */
  fields: {
    en: [
      "Contractor / company name",
      "Commercial registration number",
      "Classification grade",
      "Activity & specialization",
      "City and region",
      "Contact details",
    ],
    ar: [
      "اسم المقاول / الشركة",
      "رقم السجل التجاري",
      "درجة التصنيف",
      "النشاط والتخصص",
      "المدينة والمنطقة",
      "بيانات التواصل",
    ],
  },

  /* أي صف قيمته "" بيتخفي من الصفحة تلقائيًا */
  specs: {
    records: { en: "", ar: "" },        /* ← ⚠️ حط عدد السجلات هنا، مثال: "12,400" */
    coverage: {
      en: "All regions of Saudi Arabia",
      ar: "كل مناطق المملكة العربية السعودية",
    },
    format: { en: "Excel (XLSX) & CSV", ar: "إكسل (XLSX) و CSV" },
    delivery: {
      en: "Within 24 hours of confirmation",
      ar: "خلال ٢٤ ساعة من التأكيد",
    },
    sample: { en: "Free sample on request", ar: "عيّنة مجانية عند الطلب" },
  },
};

/* ==========================================================================
   Translations / الترجمة
   ========================================================================== */

const I18N = {
  en: {
    dir: "ltr",
    langBtn: "العربية",
    langBtnAria: "Switch to Arabic",
    themeAria: "Toggle theme",

    heroBadge: "Available now",
    heroTitle: "Saudi contractors data, ready to use",
    heroLead:
      "One curated dataset of contractors registered in Saudi Arabia. No sign-up, no checkout — pick it, message us on WhatsApp, and we deliver.",
    ctaOrder: "Order on WhatsApp",
    ctaDetails: "See details",

    productEyebrow: "Dataset",
    includedTitle: "What's included",
    specsTitle: "Details",

    specRecords: "Records",
    specCoverage: "Coverage",
    specFormat: "Format",
    specDelivery: "Delivery",
    specSample: "Sample",

    priceLabel: "Price",
    priceOnRequest: "On request",

    stepsTitle: "How to order",
    step1Title: "Message us",
    step1Body: "Tap the WhatsApp button — the message is written for you.",
    step2Title: "Confirm details",
    step2Body: "We agree on the scope, the price and the payment method.",
    step3Title: "Receive your file",
    step3Body: "The dataset is delivered within 24 hours of confirmation.",

    footerRights: "All rights reserved.",
    footerWhatsapp: "WhatsApp",
    footerEmail: "Email",
    footerGithub: "GitHub",

    waMessage: () =>
      `Hello 👋\n\nI'm interested in the *${PRODUCT.name.en}*.\n\n` +
      `Could you share more details and the price?`,
  },

  ar: {
    dir: "rtl",
    langBtn: "English",
    langBtnAria: "التبديل إلى الإنجليزية",
    themeAria: "تبديل المظهر",

    heroBadge: "متاح الآن",
    heroTitle: "بيانات المقاولين السعوديين، جاهزة للاستخدام",
    heroLead:
      "قاعدة بيانات واحدة منظّمة للمقاولين المسجّلين في السعودية. من غير تسجيل ولا بوابات دفع — كلّمنا على واتساب وإحنا نسلّمك.",
    ctaOrder: "اطلب عبر واتساب",
    ctaDetails: "شوف التفاصيل",

    productEyebrow: "قاعدة بيانات",
    includedTitle: "اللي هتستلمه",
    specsTitle: "المواصفات",

    specRecords: "عدد السجلات",
    specCoverage: "التغطية",
    specFormat: "صيغة الملف",
    specDelivery: "التسليم",
    specSample: "عيّنة",

    priceLabel: "السعر",
    priceOnRequest: "عند الطلب",

    stepsTitle: "طريقة الطلب",
    step1Title: "كلّمنا",
    step1Body: "اضغط زر الواتساب — الرسالة مكتوبة جاهزة.",
    step2Title: "نتفق على التفاصيل",
    step2Body: "نحدد المطلوب والسعر وطريقة الدفع.",
    step3Title: "استلم الملف",
    step3Body: "بيتسلّم خلال ٢٤ ساعة من التأكيد.",

    footerRights: "جميع الحقوق محفوظة.",
    footerWhatsapp: "واتساب",
    footerEmail: "البريد",
    footerGithub: "جيت هب",

    waMessage: () =>
      `السلام عليكم 👋\n\nمهتم بـ *${PRODUCT.name.ar}*.\n\n` +
      `ممكن تفاصيل أكتر والسعر؟`,
  },
};

/* ==========================================================================
   Logic / المنطق
   ========================================================================== */

(function () {
  "use strict";

  let lang = CONFIG.defaultLang;

  const $ = (id) => document.getElementById(id);

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[ch]);
  }

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

  const checkIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';

  /* -------------------------------------------------------------------- */

  function renderFields() {
    $("included-list").innerHTML = PRODUCT.fields[lang]
      .map((f) => `<li>${checkIcon}<span>${escapeHtml(f)}</span></li>`)
      .join("");
  }

  function renderSpecs() {
    const t = I18N[lang];
    const rows = [
      ["specRecords", PRODUCT.specs.records[lang]],
      ["specCoverage", PRODUCT.specs.coverage[lang]],
      ["specFormat", PRODUCT.specs.format[lang]],
      ["specDelivery", PRODUCT.specs.delivery[lang]],
      ["specSample", PRODUCT.specs.sample[lang]],
    ];

    $("specs-list").innerHTML = rows
      .filter(([, value]) => value && String(value).trim() !== "")
      .map(
        ([key, value]) =>
          `<div class="spec"><dt>${escapeHtml(t[key])}</dt><dd>${escapeHtml(value)}</dd></div>`
      )
      .join("");
  }

  function renderPrice() {
    const t = I18N[lang];
    $("price-label").textContent = t.priceLabel;

    if (CONFIG.price === null || CONFIG.price === undefined) {
      $("price-value").textContent = t.priceOnRequest;
      return;
    }

    const formatted = new Intl.NumberFormat("en-US").format(CONFIG.price);
    $("price-value").innerHTML =
      `${escapeHtml(formatted)}<small>${escapeHtml(CONFIG.currency[lang])}</small>`;
  }

  function applyLang(next) {
    lang = next;
    const t = I18N[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;

    /* Simple text nodes */
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (t[key] !== undefined) node.textContent = t[key];
    });

    /* Product name + description live outside the dictionary */
    $("product-name").textContent = PRODUCT.name[lang];
    $("product-desc").textContent = PRODUCT.description[lang];
    document.title = `${PRODUCT.name[lang]} — DataSouq`;

    /* Language button */
    const btn = $("lang-toggle");
    btn.querySelector("span").textContent = t.langBtn;
    btn.setAttribute("aria-label", t.langBtnAria);
    $("theme-toggle").setAttribute("aria-label", t.themeAria);

    renderFields();
    renderSpecs();
    renderPrice();
    updateWhatsAppLinks();

    store("datasouq-lang", lang);
  }

  function updateWhatsAppLinks() {
    const url = whatsappUrl();
    document.querySelectorAll("[data-wa]").forEach((node) => node.setAttribute("href", url));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store("datasouq-theme", next);
  }

  function initNotice() {
    const missingRecords = !PRODUCT.specs.records.en && !PRODUCT.specs.records.ar;
    const missingPrice = CONFIG.price === null || CONFIG.price === undefined;
    if (missingRecords || missingPrice) $("config-notice").hidden = false;
  }

  function init() {
    applyLang(store("datasouq-lang") || CONFIG.defaultLang);
    initNotice();

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
