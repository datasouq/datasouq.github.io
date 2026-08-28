# DataSouq · داتا سوق

An introductory page. **No products, prices or catalogue are listed yet** — the page explains
what DataSouq does and routes enquiries to WhatsApp or email.

صفحة تعريفية. **مفيش منتجات ولا أسعار ولا كتالوج معروض حاليًا** — الصفحة بتعرّف بالنشاط
وبتوجّه الاستفسارات على واتساب أو الإيميل.

🔗 **Live:** https://datasouq.github.io

---

## Features · المميزات

- 🌍 **Bilingual** — English (default) + Arabic, with automatic `dir` switching (LTR ⇄ RTL)
- 🎨 **Supabase design system** — tokens traced to their actual source, not approximated
- 🌓 Light mode by default, dark mode toggle; both persist in `localStorage`
- 📱 Responsive
- ⚡ Three files. No build step, no dependencies, no framework

---

## Structure · هيكل المشروع

```
.
├── index.html            The page · الصفحة
├── assets/
│   ├── css/styles.css    Design tokens + layout · التصميم
│   └── js/site.js        ⚙️ Config + translations + logic
└── .nojekyll             Disable Jekyll processing
```

---

## Design system provenance · مصدر نظام التصميم

Token values are taken from the Supabase repository rather than eyeballed:

| What | Source file |
|---|---|
| Brand scale (`brand-200…600`, `brand-link`) | `packages/ui/build/css/themes/{light,dark}.css` |
| `--radius-panel: 6px`, font stack | `packages/config/css/theme.css` |
| Button variants (`primary`, `default`, `outline`) | `packages/ui/src/components/Button/Button.tsx` |
| Size scale (26/34/38/42/50px) | `packages/ui/src/lib/constants.ts` |

Key rules this page follows:

- **Brand green is identical in both themes** — `#3ECF8E`. Supabase does *not* darken it for
  light mode; it uses a separate `--brand-link` (`#0A844E` light / `#00C573` dark) for text.
- **Elevation brightens.** Their light theme comment: *"Soft-gray canvas (not pure white) so
  elevated surfaces have headroom to brighten toward white."* So the canvas is `#f3f4f5` and
  panels climb toward white — the same direction as dark mode.
- **Primary buttons are tinted, not saturated** — `brand-400` fill in light (`#72E3AD`),
  `brand-500` in dark (`#006239`), always with normal foreground text and a brand-tinted border.
- **Buttons use font-weight 400**, height 38/42/50px, 14/16px text, 6px radius.
- **Depth comes from surface layers and borders — never shadows.** Supabase ships no shadow scale.
- **Type scale is 12/14/16/18/20/24/30/36/48px.** No arbitrary in-between sizes.

### Two deliberate deviations · مخالفتان مقصودتان

1. **Inter replaces Circular.** Supabase's `--font-sans` starts with `Circular`, a commercially
   licensed typeface that cannot be redistributed. Inter is the closest free substitute.
2. **WhatsApp green is not used.** WhatsApp's `#25D366` sits ~11° from the Supabase brand hue,
   and the two greens side by side read as a muddy palette. The contact button uses the brand
   token instead. To switch, set `--brand-fill` and `--brand-fill-border` in `styles.css`.

### Bilingual typography note · ملاحظة الطباعة

Negative letter-spacing and `text-transform: uppercase` are scoped to `[dir="ltr"]`. Arabic is
cursive — tracking damages the letter joins, and uppercase has no meaning in Arabic at all.

التتبّع السالب و`uppercase` محصورين في `[dir="ltr"]` فقط، لأن الخط العربي متصل والتتبّع بيضر
الوصلات، و`uppercase` مالوش معنى في العربي أصلًا.

---

## ⚙️ Configuration · الإعداد

Everything editable lives in [`assets/js/site.js`](assets/js/site.js):

```js
const CONFIG = {
  whatsappNumber: "mbi.group",   // country code + number, no +, no leading zero
  email: "mbi.datasouq@gmail.com",
  defaultLang: "en",                // "en" | "ar"
  defaultTheme: "light",            // "light" | "dark"
};
```

All interface copy lives in the `I18N` object (`en` and `ar` blocks). Elements are wired with
`data-i18n="key"` in the HTML — add a key to both language blocks and it appears in both.

نصوص الواجهة كلها في `I18N` (قسمين `en` و `ar`). العناصر مربوطة بـ `data-i18n="key"`.

---

## Local development · التشغيل محليًا

```bash
py -m http.server 8000 --directory .
```

Then open `http://localhost:8000`.

> A local server is required — opening `index.html` directly may block the JS from loading.

---

## Deployment · النشر

Published via **GitHub Pages** from the `main` branch. Any push to `main` goes live in about a
minute.

---

© DataSouq — All rights reserved.
