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
  /* A WhatsApp username instead of a phone number, so the number is never
     published. wa.me/@handle redirects to type=username and carries the
     prefilled ?text= through unchanged — verified against wa.me. */
  whatsappHandle: "mbi.group",
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
    catalogueTitle: "Datasets",
    catalogueLead: "Structured datasets, cleaned and delivered in Arabic and English.",
    /* Named generically on purpose. The dataset is ours; it is not the register
       of any authority, and the wording must not suggest ownership or any
       affiliation with one. */
    datasetTitle: "Contractors in Saudi Arabia",
    datasetBody:
      "A structured dataset of contractors across Saudi Arabia, cleaned and deduplicated, delivered in Arabic and English. Message us for the full field list and the price.",
    datasetCta: "Ask about this dataset",

    /* Every figure is measured from the file, not estimated, and re-measured
       against it before each change.

       Two things are deliberately not stated. Phone numbers: the column is
       filled on 33.21% of rows, but only 45% of those parse as a Saudi mobile
       — 111111111, 123456789, 0 and friends make up the rest — so 14.95% of
       records carry a number worth dialling, and a metric would flatter it.
       Street addresses: 8.02%.

       These are measured against the file the buyer actually receives, not
       against the working copy. That distinction bit once already: the
       deliverable withholds the columns that tie a record back to the official
       register — commercial_registration, membership_number, id, member_since,
       company_size and training_credit_hours — while authorisation to publish
       them is still being sorted out. The page had been claiming
       "99.5% carry an email and a commercial registration" for a file that no
       longer carries one. Re-measure here whenever the deliverable changes.

       What survives in it: membership_type, grade, contractor_classification,
       company_name, region, city, organization_email,
       organization_mobile_number, organization_address.

       The fifth metric counts membership_type = "Non-Saudi Contractor":
       1,624 rows, 9.39%. Saudi Contractor is 15,581, and 18 rows are
       Affiliate-Organization.

       Deduplication is not shown as a metric but was checked: id and
       membership_number are both unique across all 17,304 rows.

       The classification metric says 31%, not 7. The column does hold seven
       distinct values, but "Unclassified" is one of them and covers 68.80% of
       the file. "7 classification grades" was true as a count of values and
       false as a description of the data: it reads as though every record
       carries a grade when two in three carry none. What is real is 5,398
       classified contractors, 31.20%, spread over six grades. */
    m1Value: "17,304",  m1Label: "records",
    m2Value: "302",     m2Label: "cities across 13 regions",
    m3Value: "31%",     m3Label: "classified, across 6 grades",
    m4Value: "99.5%",   m4Label: "carry an email",
    m5Value: "1,624",   m5Label: "non-Saudi contractors",

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
      "Describe what you need and we will tell you whether we already hold it or can build it for you.",

    waMessage: () =>
      "Hello 👋\n\nI came across DataSouq and I'd like to know more about " +
      "the datasets you're preparing.\n\nCould you get in touch?",

    waDatasetMessage: () =>
      "Hello 👋\n\nI'm interested in the *Contractors in Saudi Arabia* " +
      "dataset.\n\nCould you send the full field list and the price?",
  },

  ar: {
    dir: "rtl",
    docTitle: "داتا سوق — بيانات منظّمة وجاهزة للاستخدام",
    langBtn: "English",
    langBtnAria: "التبديل إلى الإنجليزية",
    themeAria: "تبديل المظهر",
    skipLink: "تخطَّ إلى المحتوى",

    catalogueLabel: "الكتالوج",
    catalogueTitle: "قواعد البيانات",
    catalogueLead: "قواعد بيانات منظّمة ومنقّحة، تُسلَّم بالعربية والإنجليزية.",
    datasetTitle: "المقاولون في السعودية",
    datasetBody:
      "قاعدة بيانات منظّمة للمقاولين في المملكة، منقّحة وخالية من التكرار، تُسلَّم بالعربية والإنجليزية. تواصل معنا للحصول على قائمة الحقول كاملة والسعر.",
    datasetCta: "استفسر عن هذه القاعدة",

    m1Value: "17,304",   m1Label: "سجل",
    m2Value: "302",      m2Label: "مدينة في 13 منطقة",
    m3Value: "31%",      m3Label: "مصنّفون على 6 درجات",
    m4Value: "99.5%",    m4Label: "منهم ببريد إلكتروني",
    m5Value: "1,624",    m5Label: "مقاول غير سعودي",

    heroTitle: "بيانات منظّمة، جاهزة للاستخدام",
    heroLead:
      "تنقّي داتا سوق السجلات الخام وتزيل التكرار وتنظّمها، ثم تسلّمها قواعد بيانات جاهزة للاستيراد.",
    ctaContact: "تواصل معنا على واتساب",
    ctaEmail: "أرسل بريدًا إلكترونيًا",

    whatLabel: "ما نقدّمه",
    whatTitle: "قواعد بيانات، وتنقية، وأعمال مخصّصة",
    whatLead:
      "النطاق محدود عن قصد. كل ما نسلّمه يكون منقّى ومنظّمًا وموثّقًا قبل أن يصلك.",

    card1Title: "قواعد بيانات جاهزة",
    card1Body: "قواعد بيانات مجهّزة، خالية من التكرار وبصيغة موحّدة، تُسلَّم بصيغة Excel أو CSV.",
    card2Title: "تنقية وتنظيم",
    card2Body: "أرسل إلينا الملفات المبعثرة، ونتولّى توحيد الصيغ وإزالة التكرار واستكمال الناقص.",
    card3Title: "طلبات مخصّصة",
    card3Body: "تحتاج شيئًا بعينه؟ صِف لنا ما تريد ونخبرك إن كان بإمكاننا تجهيزه.",

    /* صيغة فعل: العنوان يطلب إجراءً والوصف يشرح قيمته */
    soonTitle: "أخبرنا بما تبحث عنه",
    soonBody:
      "صِف لنا ما تحتاجه، ونخبرك إن كان متوفّرًا لدينا أو بإمكاننا تجهيزه لك.",

    waMessage: () =>
      "السلام عليكم 👋\n\nاطّلعت على موقع داتا سوق وأودّ معرفة المزيد عن " +
      "قواعد البيانات المتاحة لديكم.\n\nهل يمكننا التواصل؟",

    waDatasetMessage: () =>
      "السلام عليكم 👋\n\nأنا مهتم بقاعدة بيانات *المقاولون في السعودية*.\n\n" +
      "هل يمكنكم إرسال قائمة الحقول كاملة والسعر؟",
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
    const handle = String(CONFIG.whatsappHandle).replace(/^@/, "");
    const build = I18N[lang][key] || I18N[lang].waMessage;
    return `https://wa.me/@${handle}?text=${encodeURIComponent(build())}`;
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

    /* The toggle always reads in the language you are not in: "العربية" on the
       English page, "English" on the Arabic one. WCAG 3.1.2 asks that a phrase
       in another language be markable, so the label carries the other lang —
       without it a screen reader voices "العربية" with English phonemes, and
       "English" with Arabic ones. The wordmark is tagged lang="en" in the
       markup for the same reason, and the pinned footer already was. */
    const btn = $("lang-toggle");
    const label = btn.querySelector("span");
    label.textContent = t.langBtn;
    label.setAttribute("lang", lang === "en" ? "ar" : "en");
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
