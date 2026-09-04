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
    /* Each option's name is the visible code plus the language spelled out,
       so it reads "EN, English". The code alone does not say what it is, and
       replacing it with an aria-label would drop the visible text out of the
       name, which is the WCAG 2.5.3 failure this control already had once. */
    langGroupLabel: "Language",
    langEnFull: ", English",
    langArFull: ", Arabic",
    /* Western digits are already Arabic numerals in the sense the page needs
       for English; this is the identity so the two dictionaries have the same
       shape and the caller never branches. */
    digits: (value) => String(value),
    themeName: "Dark theme",
    skipLink: "Skip to content",

    catalogueLabel: "Catalogue",
    catalogueTitle: "Datasets",
    /* No language promise here. Being delivered in Arabic and English is true
       of the one dataset listed today and is stated on its card; as a heading
       for the whole catalogue it would commit every future dataset to it. */
    catalogueLead: "Structured datasets, cleaned and deduplicated before delivery.",
    /* Named generically on purpose. The dataset is ours; it is not the register
       of any authority, and the wording must not suggest ownership or any
       affiliation with one. */
    datasetTitle: "Contractors in Saudi Arabia",
    datasetBody:
      "<strong>A structured dataset of contractors across Saudi Arabia</strong>, cleaned and deduplicated, delivered in Arabic and English. Message us for the full field list and the price.",
    datasetCta: "Ask about this dataset",

    /* Every figure is measured from the file, not estimated, and re-measured
       against it before each change.

       Two things are deliberately not stated. Phone numbers: the column is
       filled on 33.21% of rows, but only 45% of those parse as a Saudi mobile
       — 111111111, 123456789, 0 and friends make up the rest — so 14.95% of
       records carry a number worth dialling, and a metric would flatter it.
       Street addresses: 8.02%.

       Measure against the file a buyer actually receives, never against a
       working copy. The two have diverged before and a metric here went stale
       without anything on the page looking wrong. Whenever the delivered file
       changes, re-measure all five before publishing.

       The fifth metric counts membership_type = "Non-Saudi Contractor":
       1,624 rows, 9.39%. Saudi Contractor is 15,581, and 18 rows are
       Affiliate-Organization.

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

    /* Footer. The two column headings and their links reuse catalogueTitle,
       datasetTitle and whatLabel, so only "Company" is new here — a second
       copy of "Datasets" would be a second thing to keep in step. */
    footerCompany: "Company",
    rights: "All rights reserved.",
    brandHome: "DataSouq — home",
    emailLabel: "Email",

    /* The handle itself is not translated: it is the string that gets copied
       and it is the same in both languages. */
    discordCopy: "Copy our Discord username, datasouq",
    discordTitle: "Discord — datasouq",
    copied: (value) => value + " copied",

    subLead: "Get new datasets and updates from DataSouq.",
    subPlaceholder: "Your email",
    subEmailLabel: "Your email address",
    subBtn: "Subscribe",
    thanksTitle: "Check your mail app",
    thanksBody:
      "We opened a message with the request ready. Send it and you are on the list.",

    subMailSubject: "Subscribe to DataSouq updates",
    subMailBody: (address) =>
      "Hello,\n\nPlease add this address to the DataSouq mailing list:\n" +
      address + "\n",
  },

  ar: {
    dir: "rtl",
    docTitle: "داتا سوق — بيانات منظّمة وجاهزة للاستخدام",
    langGroupLabel: "اللغة",
    langEnFull: "، الإنجليزية",
    langArFull: "، العربية",

    /* Arabic-Indic digits, with the Arabic separators that go with them:
       U+066C for thousands, U+066B for the decimal, U+066A for percent. Applied
       to the one number that is computed rather than written — the year. */
    digits: (value) =>
      String(value)
        .replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d])
        .replace(/,/g, "٬")
        .replace(/\./g, "٫")
        .replace(/%/g, "٪"),
    themeName: "المظهر الغامق",
    skipLink: "تخطَّ إلى المحتوى",

    catalogueLabel: "الكتالوج",
    catalogueTitle: "قواعد البيانات",
    catalogueLead: "قواعد بيانات منظّمة ومنقّحة وخالية من التكرار قبل التسليم.",
    datasetTitle: "المقاولون في السعودية",
    datasetBody:
      "<strong>قاعدة بيانات منظّمة للمقاولين في المملكة</strong>، منقّحة وخالية من التكرار، تُسلَّم بالعربية والإنجليزية. تواصل معنا للحصول على قائمة الحقول كاملة والسعر.",
    datasetCta: "استفسر عن هذه القاعدة",

    /* Arabic-Indic digits and Arabic separators, written out rather than
       converted at render time: these are literals, so there is nothing to
       convert. The figures are the same ones measured from the file — 17,304 /
       302 / 31% / 99.5% / 1,624 — and any re-measurement has to be transcribed
       here as well as into the English block. */
    m1Value: "١٧٬٣٠٤",   m1Label: "سجل",
    m2Value: "٣٠٢",      m2Label: "مدينة في ١٣ منطقة",
    m3Value: "٣١٪",      m3Label: "مصنّفون على ٦ درجات",
    m4Value: "٩٩٫٥٪",    m4Label: "منهم ببريد إلكتروني",
    m5Value: "١٬٦٢٤",    m5Label: "مقاول غير سعودي",

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

    footerCompany: "الشركة",
    rights: "جميع الحقوق محفوظة.",
    brandHome: "داتا سوق — الصفحة الرئيسية",
    emailLabel: "البريد الإلكتروني",

    discordCopy: "انسخ اسم المستخدم على ديسكورد، datasouq",
    discordTitle: "ديسكورد — datasouq",
    copied: (value) => "تم نسخ " + value,

    subLead: "اشترك لتصلك أحدث قواعد البيانات وأخبار داتا سوق.",
    subPlaceholder: "بريدك الإلكتروني",
    subEmailLabel: "عنوان بريدك الإلكتروني",
    subBtn: "اشترك",
    thanksTitle: "افتح تطبيق البريد",
    thanksBody: "فتحنا لك رسالة جاهزة بالطلب. أرسلها وتكون في القائمة.",

    subMailSubject: "الاشتراك في تحديثات داتا سوق",
    subMailBody: (address) =>
      "السلام عليكم،\n\nأرجو إضافة هذا العنوان إلى قائمة بريد داتا سوق:\n" +
      address + "\n",
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

    /* The two-tone card body needs a <strong> around its lead clause, so this
       one string carries markup. innerHTML is safe here and only here: the
       value is a literal in this file, never anything a visitor supplied. */
    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const value = t[node.dataset.i18nHtml];
      if (value !== undefined) node.innerHTML = value;
    });

    /* Text nodes were the only thing translated until the footer arrived with a
       placeholder, an email field's accessible name, a copy-this-username
       button and a tooltip. Each entry is `attribute:key`, comma separated. */
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      node.dataset.i18nAttr.split(",").forEach((pair) => {
        const cut = pair.indexOf(":");
        if (cut < 1) return;
        const attr = pair.slice(0, cut).trim();
        const value = t[pair.slice(cut + 1).trim()];
        if (value !== undefined) node.setAttribute(attr, value);
      });
    });

    /* The two codes are static and CSS lights the live one from :root[lang],
       so the only thing left to write here is the clarifier a screen reader
       reads after them — the visible text is "en ar", which says nothing about
       what pressing it does. Keeping the codes in the accessible name is what
       WCAG 2.5.3 asks: the name contains the visible label.
       The wordmark is tagged lang="en" in the markup so a screen reader does
       not voice it with Arabic phonemes; the footer used to carry lang="en" on
       its whole container, and now that it is translated only the wordmark
       inside it still declares English. */
    /* aria-checked is the state, and the roving tabindex follows it so the
       group is one tab stop with the live option as its entry point. */
    document.querySelectorAll(".langgroup__item").forEach((item) => {
      const on = item.dataset.lang === lang;
      item.setAttribute("aria-checked", on ? "true" : "false");
      item.setAttribute("tabindex", on ? "0" : "-1");
    });

    /* The year is the one number on the page that is not a literal in this
       file, so it is the one that needs converting at runtime. */
    const year = $("year");
    if (year) year.textContent = t.digits(new Date().getFullYear());

    describeTheme();

    const general = whatsappUrl("waMessage");
    document.querySelectorAll("[data-wa]").forEach((n) => n.setAttribute("href", general));

    /* The catalogue card opens WhatsApp naming the dataset and asking for the
       three details the page deliberately does not state. */
    const dataset = whatsappUrl("waDatasetMessage");
    document.querySelectorAll("[data-wa-dataset]").forEach((n) => n.setAttribute("href", dataset));

    store("datasouq-lang", lang);
  }

  /* The sun/moon swap is CSS-only, so without this a screen reader gets no
     confirmation of which theme is now in effect.

     aria-pressed with a STATE-NEUTRAL name, not with an action-worded one: the
     two together announce "Switch to dark theme, toggle button, pressed", which
     is the classic toggle anti-pattern — the label says one thing and the state
     says its opposite. The name stays "Dark theme" and aria-pressed carries
     whether it is on. Upstream exposes state through a radio group in a
     dropdown instead, which is more chrome than two controls justify, so this
     pairing is ours. */
  function describeTheme() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const btn = $("theme-toggle");
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", I18N[lang].themeName);
  }

  function toggleTheme() {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store("datasouq-theme", next);
    const meta = $("theme-color");
    if (meta) meta.setAttribute("content", next === "dark" ? "#151816" : "#fdfdfd");
    describeTheme();
  }

  function init() {
    applyLang(store("datasouq-lang") || CONFIG.defaultLang);

    /* A radiogroup is one tab stop, so the arrows move between the options and
       select as they go, which is what radio semantics promise. With two of
       them every arrow does the same thing: go to the other one. */
    const items = Array.from(document.querySelectorAll(".langgroup__item"));
    items.forEach((item, index) => {
      item.addEventListener("click", () => applyLang(item.dataset.lang));
      item.addEventListener("keydown", (event) => {
        const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const next =
          event.key === "Home" ? items[0]
          : event.key === "End" ? items[items.length - 1]
          : items[(index + 1) % items.length];
        applyLang(next.dataset.lang);
        next.focus();
      });
    });
    $("theme-toggle").addEventListener("click", toggleTheme);

    /* Anything carrying data-copy puts that string on the clipboard and says so.
       Used for the Discord username, which has no linkable URL. */
    document.querySelectorAll("[data-copy]").forEach((node) => {
      node.addEventListener("click", async () => {
        const value = node.dataset.copy;
        const status = $("copy-status");

        /* navigator.clipboard.writeText needs the document focused and a secure
           context, and refuses in enough situations to be worth a fallback. The
           execCommand path is deprecated but still the one that works when the
           modern API declines. */
        let copied = false;
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch (e) {
          try {
            const scratch = document.createElement("textarea");
            scratch.value = value;
            scratch.setAttribute("readonly", "");
            scratch.style.cssText = "position:fixed;top:-100px;opacity:0";
            document.body.appendChild(scratch);
            scratch.select();
            copied = document.execCommand("copy");
            scratch.remove();
          } catch (e2) { /* neither route available */ }
        }

        /* Either way the visitor learns the username: copied, or shown so it can
           be read off and typed. Never a silent no-op. */
        /* Read from the dictionary at click time, not at bind time: the
           visitor can switch language after this listener is attached. */
        const said = () => I18N[lang].copied(value);
        const idle = () => I18N[lang].discordTitle;

        if (status) status.textContent = copied ? said() : value;
        node.dataset.copied = copied ? "true" : "shown";
        node.setAttribute("title", copied ? said() : idle());
        setTimeout(() => {
          delete node.dataset.copied;
          node.setAttribute("title", idle());
          if (status) status.textContent = "";
        }, 1600);
      });
    });

    /* The subscribe form has nowhere to POST on a static host, so rather than
       fail silently it hands the address to the visitor's own mail client with
       the request already written. Nothing is transmitted from this page. */
    const form = $("subscribe");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const field = $("subscribe-email");
        if (!field.checkValidity()) { field.reportValidity(); return; }
        window.location.href =
          "mailto:" + CONFIG.email +
          "?subject=" + encodeURIComponent(I18N[lang].subMailSubject) +
          "&body=" + encodeURIComponent(I18N[lang].subMailBody(field.value));
        form.reset();

        /* Swap the form for the confirmation, as theirs does. */
        const thanks = document.querySelector(".footer__thanks");
        if (thanks) {
          form.hidden = true;
          thanks.hidden = false;
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
