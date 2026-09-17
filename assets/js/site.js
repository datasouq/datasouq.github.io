/* ==========================================================================
   DataSouq — configuration, translations and page logic
   الإعدادات والترجمة ومنطق الصفحة

   الصفحة بتعرض قواعد بيانات، ومؤشرات كل واحدة مقيسة من ملفها نفسه.
   السعر هو الوحيد اللي مش معروض — بيتحدد في المحادثة.
   The datasets themselves — titles, copy, metrics, icons, SEO fields — live
   in assets/js/datasets.js, not in this file. This file only renders them:
   the catalogue cards, the footer's dataset links, the JSON-LD Dataset
   entries and each card's WhatsApp link are all built from that array, so
   adding a dataset never touches the code below. Each one's metrics are
   measured from its own file. The full field list is published, on each
   dataset's own page; the price is the one thing still settled in the
   conversation, and the WhatsApp message asks for it.
   ========================================================================== */

const CONFIG = {
  /* A WhatsApp username instead of a phone number, so the number is never
     published. wa.me/@handle redirects to type=username and carries the
     prefilled ?text= through unchanged — verified against wa.me. */
  whatsappHandle: "datasouq",
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
    /* The picker's accessible name says both what the control is and where it
       currently stands — "Language: English" — which is the name the control
       at claude.com carries and what WCAG 2.5.3 asks for here: the visible
       word ("English") is inside the accessible name. */
    langPickerLabel: "Language: English",
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
    /* Every dataset's title, body copy and metrics now live in
       assets/js/datasets.js, one entry per card — see that file's own header
       comment. Only the copy shared by every card (the CTA label and the
       WhatsApp message template) stays here. */
    datasetCta: "Ask about this dataset",

    /* dataset.html — one page per dataset, all of it shared chrome, so it
       belongs here rather than in any dataset's own entry. */
    backToCatalogue: "All datasets",
    chartsLabel: "Inside the data",
    chartsTitle: "What the file actually holds",
    chartsLead: "Every figure below is counted from the delivered file, not estimated.",
    dictLabel: "Data dictionary",
    dictTitle: "Every field, described",
    dictLead:
      "The full column list as it ships in the file, with what each one holds and the values it takes.",
    fieldCount: (count) => count + " fields",
    /* The table's two column captions. aria-hidden on the header row: it
       labels the layout for a sighted reader, and a screen reader already
       gets the name and its description read in order. */
    /* The three groups the charts are sorted into, in the order a buyer asks
       them: is this my market, can I act on it, what is the mix. */
    chartGroups: {
      coverage: "Coverage",
      usability: "Usability",
      composition: "What's in it",
    },
    /* Supabase pairs a PageSectionTitle with a PageSectionDescription, and
       the reason shows here: "Coverage" alone leaves the reader to guess
       what is being covered. One line, naming the question the group
       answers. */
    chartGroupNotes: {
      coverage: "Where these records are, and whether the file reaches your market.",
      usability: "Whether you can act on a record once you have it.",
      composition: "How the file is made up — which classes, which types.",
    },
    /* The dot map's size key. Deliberately noun-free: the same string serves
       records, offices and facilities. */
    dotsKey: (count) => count + " per dot",
    dictColField: "Field",
    dictColMeaning: "What it holds, and the values it takes",
    detailCtaTitle: "Want this file?",
    detailCtaBody: "Message us and we'll send a sample of the real records and the price.",
    notFoundTitle: "That dataset isn't here",
    notFoundBody: "The link may be out of date. Everything we publish is in the catalogue.",
    detailEmptyTitle: "The figures for this file aren't published yet",
    detailEmptyBody:
      "Every number on these pages is measured from the delivered file, and this one hasn't been measured yet. The file itself is ready.",
    detailEmptyCta: "Ask us for the breakdown",

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

    /* One template for every dataset card, not one function per dataset: the
       title is the only thing that changes between them, so it is the only
       thing passed in. Adding dataset #4 needs no new entry here. */
    waDatasetMessage: (title) =>
      `Hello 👋\n\nI'm interested in the *${title}* ` +
      "dataset.\n\nCould you send a sample and the price?",

    /* Footer. The two column headings and their links reuse catalogueTitle
       and whatLabel, so only "Company" is new here — a second copy of
       "Datasets" would be a second thing to keep in step. The dataset links
       themselves are rendered from assets/js/datasets.js, not listed here.

       No "rights" key: "All rights reserved." is pinned in English in the
       markup itself (index.html, dataset.html), not run through this
       dictionary — see the comment on .footer__copy there. */
    footerCompany: "Company",
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
    langPickerLabel: "اللغة: العربية",

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
    /* عناوين ونصوص وأرقام كل قاعدة بيانات صارت في assets/js/datasets.js —
       راجع التعليق أعلى الملف. اللي فاضل هنا هو النص المشترك بين كل
       البطاقات فقط (زر الاستفسار وقالب رسالة واتساب). */
    datasetCta: "استفسر عن هذه القاعدة",

    /* dataset.html — صفحة واحدة لكل قاعدة، وكل نصوصها مشتركة، فمكانها هنا
       وليس في بيانات أي قاعدة بعينها. */
    backToCatalogue: "كل قواعد البيانات",
    chartsLabel: "داخل البيانات",
    chartsTitle: "ما الذي يحتويه الملف فعلاً",
    chartsLead: "كل رقم بالأسفل محسوب من الملف المُسلَّم نفسه، وليس تقديراً.",
    dictLabel: "قاموس البيانات",
    dictTitle: "كل حقل، موصوفاً",
    dictLead:
      "قائمة الأعمدة كاملة كما تُسلَّم في الملف، مع ما يحتويه كل عمود والقيم التي يأخذها.",
    fieldCount: (count) => count + " حقلاً",
    chartGroups: {
      coverage: "التغطية",
      usability: "جاهزية الاستخدام",
      composition: "المكوّنات",
    },
    chartGroupNotes: {
      coverage: "أين تقع هذه السجلات، وهل يصل الملف إلى سوقك.",
      usability: "هل تستطيع التصرف في السجل بعد ما تأخذه.",
      composition: "ممّا يتكوّن الملف — أي الفئات، وأي الأنواع.",
    },
    dotsKey: (count) => count + " في النقطة",
    dictColField: "الحقل",
    dictColMeaning: "ما يحتويه، والقيم التي يأخذها",
    detailCtaTitle: "تريد هذا الملف؟",
    detailCtaBody: "تواصل معنا ونرسل لك عيّنة من السجلات الحقيقية والسعر.",
    notFoundTitle: "قاعدة البيانات هذه غير موجودة",
    notFoundBody: "قد يكون الرابط قديماً. كل ما ننشره موجود في الكتالوج.",
    detailEmptyTitle: "أرقام هذا الملف لم تُنشر بعد",
    detailEmptyBody:
      "كل رقم في هذه الصفحات محسوب من الملف المُسلّم نفسه، وهذا الملف لم يُقَس بعد. الملف نفسه جاهز.",
    detailEmptyCta: "اطلب منا التفاصيل",

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

    /* قالب واحد لكل بطاقات القواعد بدل دالة منفصلة لكل واحدة: العنوان هو
       الفرق الوحيد بينها، فهو الشيء الوحيد اللي بيتبعت هنا. إضافة قاعدة
       رابعة مش محتاجة أي تعديل في هذا القالب. */
    waDatasetMessage: (title) =>
      `السلام عليكم 👋\n\nأنا مهتم بقاعدة بيانات *${title}*.\n\n` +
      "هل يمكنكم إرسال عيّنة والسعر؟",

    footerCompany: "الشركة",
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

  function whatsappUrl(message) {
    const handle = String(CONFIG.whatsappHandle).replace(/^@/, "");
    return `https://wa.me/@${handle}?text=${encodeURIComponent(message)}`;
  }

  /* One card's markup, built from its assets/js/datasets.js entry and the
     active language. Rebuilt in full on every language switch rather than
     patched in place — there is no per-node state worth preserving, and a
     fresh render can never drift out of sync with a stale data-i18n node the
     way the old hand-authored cards could. */
  /* A card's figures come from assets/data/metrics.js, which the build measures from the
     delivered file. A metric names the figure it wants rather than carrying a copy of it, so a
     new edition updates the page by being built, not by anyone editing this file. A metric that
     names nothing keeps its literal value — that is how a dataset whose workbook this pipeline
     does not build yet still renders. Labels may carry {placeholders} for the same reason. */
  function figure(datasetId, name) {
    const set = (typeof DATASET_METRICS !== "undefined" && DATASET_METRICS[datasetId]) || {};
    return set[name];
  }

  function metricValue(dataset, m) {
    return (m.metric && figure(dataset.id, m.metric)) || m.value || "";
  }

  function metricLabel(dataset, text) {
    return String(text || "").replace(/\{(\w+)\}/g, (whole, name) =>
      figure(dataset.id, name) || whole);
  }

  /* The detail page renders the same five metrics from the same catalogue entry, so it resolves
     them the same way rather than keeping a second copy of the rule. */
  window.DATASOUQ_METRIC = { value: metricValue, label: metricLabel };

  function renderDatasetCard(dataset, t) {
    const title = lang === "ar" ? dataset.titleAr : dataset.titleEn;
    const body = lang === "ar" ? dataset.bodyAr : dataset.bodyEn;
    const metrics = dataset.metrics
      .map(
        (m) => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${m.icon}</svg>
          <span><strong>${t.digits(metricValue(dataset, m))}</strong> <span>${t.digits(metricLabel(dataset, lang === "ar" ? m.labelAr : m.labelEn))}</span></span>
        </li>`
      )
      .join("");

    /* The title is a link and the whole card is its target: CSS stretches
       this one anchor's ::after over the card. One link in the
       accessibility tree, a card-sized target for a mouse — and the
       WhatsApp button below sits above the overlay so it still takes its
       own clicks. */
    return `
      <article class="card card--dataset">
        <div class="card__head">
          <div class="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dataset.icon}</svg>
          </div>
          <h3><a href="dataset.html?id=${dataset.id}" tabindex="0">${title}</a></h3>
        </div>
        <p class="card__body">${body}</p>
        <ul class="metrics" role="list">${metrics}</ul>
        <div class="card__actions">
          <a class="btn btn--default" data-wa-dataset="${dataset.id}" href="https://wa.me/@datasouq" target="_blank" rel="noopener noreferrer" tabindex="0">${t.datasetCta}</a>
        </div>
      </article>`;
  }

  /* A dataset marked `hidden` is built and measured like any other but is not
     advertised: it stays out of the catalogue, out of the footer and out of the
     structured data, and the build leaves it out of the sitemap. Its page still
     answers, so a link to it can be sent to someone for review before anyone
     else is told it exists. Deleting the entry instead would take the card, its
     comment and its measured figures with it. */
  const LISTED = DATASETS.filter((d) => !d.hidden);

  /* The catalogue grid and the footer's "Datasets" links both come from the
     same DATASETS array, so a new dataset appears in both the moment it is
     added to assets/js/datasets.js — neither this function nor its caller
     needs to know how many datasets there are. */
  function renderCatalogue() {
    const t = I18N[lang];

    const grid = document.querySelector(".cards--catalogue");
    if (grid) grid.innerHTML = LISTED.map((d) => renderDatasetCard(d, t)).join("");

    /* The footer links point at each dataset's own page rather than at the
       catalogue anchor: from the dataset page, a link back to #datasets on
       another document would be a worse answer to "show me that one" than
       the page itself. */
    const footerLinks = $("footer-dataset-links");
    if (footerLinks) {
      footerLinks.innerHTML = LISTED.map(
        (d) =>
          `<li><a href="dataset.html?id=${d.id}" tabindex="0">${
            lang === "ar" ? d.titleAr : d.titleEn
          }</a></li>`
      ).join("");
    }
  }

  /* Adds one schema.org Dataset entry per assets/js/datasets.js entry to the
     page's existing JSON-LD script (id="ld-json"), which otherwise carries
     only Organization and WebSite. Run once at startup, not on every
     language switch: the descriptions here are the canonical English ones
     search engines read, not the toggled UI language. Dataset entries are
     filtered out before re-adding so a resume/re-run never duplicates them. */
  function renderDatasetStructuredData() {
    const script = $("ld-json");
    if (!script) return;

    let graph;
    try {
      graph = JSON.parse(script.textContent);
    } catch (e) {
      return;
    }

    const base = "https://datasouq.github.io/";
    graph["@graph"] = graph["@graph"]
      .filter((node) => node["@type"] !== "Dataset")
      .concat(
        LISTED.map((d) => ({
          "@type": "Dataset",
          "@id": base + "#" + d.seo.anchor,
          name: d.titleEn,
          alternateName: d.seo.alternateName,
          description: d.seo.description,
          inLanguage: d.seo.inLanguage,
          isAccessibleForFree: false,
          creator: { "@id": base + "#organization" },
          provider: { "@id": base + "#organization" },
          spatialCoverage: { "@type": "Place", name: d.seo.spatialCoverage },
          encodingFormat: d.seo.encodingFormat,
          variableMeasured: d.seo.variableMeasured,
        }))
      );

    script.textContent = JSON.stringify(graph);
  }

  /* The language a link carries.

     A ?lang= in the address is an instruction from whoever sent the link, so it wins over the
     visitor's stored preference and is stored in turn — otherwise a link shared in Arabic would
     flip back to English on the next click, halfway through reading. One use of the picker
     overrides it again, and that is stored too.

     applyLang writes the language back into the address bar on every switch, so a URL copied
     from there always says which language it opens in. That is the whole point: a link sent to
     a client should not open in whichever language that client's browser happens to remember. */
  function langFromUrl() {
    try {
      const value = new URLSearchParams(window.location.search).get("lang");
      return I18N[value] ? value : null;
    } catch (e) {
      return null;
    }
  }

  function writeLangToUrl(value) {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("lang") === value) return;
      url.searchParams.set("lang", value);
      window.history.replaceState(null, "", url.toString());
    } catch (e) { /* no history API, or a file:// page */ }
  }

  function applyLang(next) {
    lang = I18N[next] ? next : "en";
    const t = I18N[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = t.docTitle;

    renderCatalogue();

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

    /* The picker names the language it is currently in, and each option is
       written in its own script — those endonyms are markup, never
       translated, so a reader stuck in the wrong language can still find
       theirs. All that changes here is which option is checked and what the
       trigger says.

       The wordmark is tagged lang="en" in the markup so a screen reader does
       not voice it with Arabic phonemes; the footer used to carry lang="en"
       on its whole container, and now that it is translated only the wordmark
       inside it still declares English. */
    const current = $("lang-current");
    document.querySelectorAll(".langpicker__item").forEach((item) => {
      const on = item.dataset.lang === lang;
      item.setAttribute("aria-checked", on ? "true" : "false");
      /* The trigger's visible word is the live option's own label, taken from
         the option rather than from this dictionary: there is then one place
         a language's name is written, and it is the one the menu shows. */
      if (on && current) current.textContent = item.textContent.trim();
    });

    /* The year is computed, not a literal in this file, so it still has to
       be written on every render — but NOT through digits(). The copyright
       line it sits in is pinned in English in both languages (see the
       comment on .footer__copy in index.html/dataset.html), so "2026" stays
       Western numerals in Arabic too, the same as "DataSouq" stays Latin. */
    const year = $("year");
    if (year) year.textContent = String(new Date().getFullYear());

    describeTheme();
    wireWhatsapp();

    store("datasouq-lang", lang);
    writeLangToUrl(lang);

    /* The dataset page renders itself from the same DATASETS array and has
       to follow a language switch the way the catalogue does. It registers
       a renderer here; the landing page defines none and this is a no-op.
       DATASOUQ_LANG is what lets that page render on its own schedule too —
       it loads its payload asynchronously and can land after this ran. */
    window.DATASOUQ_LANG = { lang: lang, t: t };
    if (typeof window.DATASOUQ_RENDER === "function") window.DATASOUQ_RENDER(lang, t);
  }

  /* Every WhatsApp link on the page, general and per-dataset.

     Exposed because the dataset page rebuilds its own CTA after this has
     already run, and an un-wired link would open WhatsApp with no message
     at all. */
  function wireWhatsapp() {
    const t = I18N[lang];

    const general = whatsappUrl(t.waMessage());
    document.querySelectorAll("[data-wa]").forEach((n) => n.setAttribute("href", general));

    /* Each catalogue card opens WhatsApp naming its own dataset and asking
       for the price. data-wa-dataset carries the dataset's id from
       assets/js/datasets.js, so a new dataset gets a correct link the moment
       it is added — nothing here has to change. */
    document.querySelectorAll("[data-wa-dataset]").forEach((n) => {
      const dataset = DATASETS.find((d) => d.id === n.dataset.waDataset);
      if (!dataset) return;
      const title = lang === "ar" ? dataset.titleAr : dataset.titleEn;
      n.setAttribute("href", whatsappUrl(t.waDatasetMessage(title)));
    });
  }
  window.DATASOUQ_WIRE_WA = wireWhatsapp;

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
    renderDatasetStructuredData();
    applyLang(langFromUrl() || store("datasouq-lang") || CONFIG.defaultLang);

    /* The language picker: a menu button, following the keyboard contract a
       menu owes — Enter/Space/Down opens onto the first option, Up opens onto
       the last, arrows move within it, Escape closes and hands focus back to
       the trigger, and a click anywhere outside closes it. Without that last
       one a menu opened by mistake has no way out but the keyboard. */
    const trigger = $("lang-trigger");
    const menu = $("lang-menu");
    const items = Array.from(document.querySelectorAll(".langpicker__item"));

    if (trigger && menu) {
      const isOpen = () => trigger.getAttribute("aria-expanded") === "true";

      const open = (focusIndex) => {
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        if (items.length) items[focusIndex === -1 ? items.length - 1 : focusIndex].focus();
      };

      const close = (returnFocus) => {
        /* Focus cannot be left on what is about to be hidden. It is taken
           back whenever it was still inside the menu — which covers the
           click-outside case, where the menu closes without anyone asking
           for the focus to move. Clicking another control is not that case:
           the browser has already moved focus there, so nothing is stolen
           back from it. */
        const hadFocusInside = menu.contains(document.activeElement);
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        if (returnFocus || hadFocusInside) trigger.focus();
      };

      trigger.addEventListener("click", () => (isOpen() ? close(false) : open(0)));

      trigger.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(0);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          open(-1);
        }
      });

      items.forEach((item, index) => {
        item.addEventListener("click", () => {
          applyLang(item.dataset.lang);
          close(true);
        });

        item.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            items[(index + step + items.length) % items.length].focus();
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            items[event.key === "Home" ? 0 : items.length - 1].focus();
          } else if (event.key === "Escape") {
            event.preventDefault();
            close(true);
          } else if (event.key === "Tab") {
            /* Tabbing out of a menu closes it; focus is already leaving, so
               it is not taken back to the trigger. */
            close(false);
          }
        });
      });

      document.addEventListener("click", (event) => {
        if (isOpen() && !event.target.closest(".langpicker")) close(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) close(true);
      });
    }

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
