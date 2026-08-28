# DataSouq · داتا سوق

A minimal bilingual (EN/AR) product page. One dataset, one call to action — every order goes
straight to **WhatsApp**. No backend, no build step, no dependencies.

صفحة منتج بسيطة بلغتين. قاعدة بيانات واحدة، وكل الطلبات بتروح على **واتساب** مباشرة.

🔗 **Live:** https://datasouq.github.io

---

## Features · المميزات

- 🌍 **Bilingual** — English (default) + Arabic, with automatic `dir` switching (LTR ⇄ RTL)
- 🎨 **Supabase-inspired design system** — light mode by default, dark mode toggle
- 💬 **WhatsApp ordering** — prefilled message in the visitor's active language
- 📱 Fully responsive
- ⚡ Plain HTML/CSS/JS — three files, nothing to install
- 💾 Language and theme preferences persist in `localStorage`

---

## Structure · هيكل المشروع

```
.
├── index.html            The page · الصفحة
├── assets/
│   ├── css/styles.css    Design tokens + layout · التصميم
│   └── js/site.js        ⚙️ Config + translations + logic · الإعدادات والترجمة والمنطق
└── .nojekyll             Disable Jekyll processing
```

Everything you normally need to edit lives in **one file**: [`assets/js/site.js`](assets/js/site.js).

---

## ⚙️ Configuration · الإعداد

### ⚠️ Before publishing · قبل النشر

Two values are still empty. While either is missing, an owner-only warning shows on the page.

لسه فيه قيمتين فاضيين. طول ما هما فاضيين هيظهر تنبيه على الصفحة.

| Field · الحقل | Where · المكان | Note · ملاحظة |
|---|---|---|
| `PRODUCT.specs.records` | `site.js` | Number of records · عدد السجلات |
| `CONFIG.price` | `site.js` | `null` shows "On request" · `null` يعرض "عند الطلب" |

```js
// assets/js/site.js
const CONFIG = {
  whatsappNumber: "mbi.group",
  price: null,          // ← e.g. 3500
  currency: { en: "SAR", ar: "ريال" },
  defaultLang: "en",    // "en" | "ar"
  defaultTheme: "light" // "light" | "dark"
};

const PRODUCT = {
  specs: {
    records: { en: "12,400", ar: "١٢٬٤٠٠" },  // ← fill this
    ...
  }
};
```

> Any spec row with an empty value is **hidden automatically** — so nothing unfinished ever
> shows up on the live page.
> أي صف مواصفات قيمته فاضية بيتخفي تلقائيًا من الصفحة.

### WhatsApp number format · صيغة رقم الواتساب

Country code + number. No `+`, no leading zero, no spaces.
كود الدولة + الرقم، من غير `+` ولا صفر في الأول ولا مسافات.

Current: `mbi.group` (🇪🇬 @mbi.group)

### Product content · محتوى المنتج

`PRODUCT.name`, `PRODUCT.description` and `PRODUCT.fields` each take an `en` and an `ar` value.
Edit both so the page stays consistent in either language.

### UI text · نصوص الواجهة

All interface strings live in the `I18N` object (`en` and `ar` blocks). Elements are wired with
`data-i18n="key"` in the HTML.

---

## Local development · التشغيل محليًا

```bash
py -m http.server 8000 --directory .
```

Then open `http://localhost:8000`.

> A local server is required — opening `index.html` directly may block the JS from loading.
> لازم سيرفر محلي — فتح الملف مباشرة ممكن يمنع تحميل الجافاسكريبت.

---

## Deployment · النشر

Published automatically via **GitHub Pages** from the `main` branch.
Any push to `main` goes live within about a minute.

منشور تلقائيًا عبر GitHub Pages من فرع `main`.

---

© DataSouq — All rights reserved.
