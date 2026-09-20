# Interface rules · قواعد الواجهة

**بالعربي:** زي ملف الرسوم بالظبط — كل قاعدة تحت مكتوب جنبها مصدرها، واللي
مالوش مصدر خارجي مكتوب صراحةً إنه **قرار بيتنا**. الفرق إن الملف ده بيغطي
الواجهة نفسها: الألوان، الطباعة، المسافات، وأحجام الأهداف. لو حاجة مش مغطاة
هنا، تتضاف هنا الأول وبعدين تتنفّذ.

Every rule below carries its source, and anything with no external source is
labelled **House**. `charts.md` rules what goes inside a chart card; this file
rules everything around it. Most of what is written here was already decided
and already measured — it simply lived in a comment in `styles.css`, where it
could be read only by whoever was editing that line. A rule nobody can find is
a rule nobody can argue with, and rule 6.8 in `charts.md` is the proof: it was
written down, so it was applied and then checked. The same reasoning about the
dictionary's notes column lived only in a CSS comment, one column away from
where it was needed, and was missed until this file was written.

## The sources, and what each one actually settles

| Source | What it settles | What it does **not** |
|---|---|---|
| [WCAG 2.2 SC 1.4.3 — Contrast (Minimum), AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | The floor for text: "a contrast ratio of at least 4.5:1", and 3:1 for large-scale text | Which colour to choose. It is a floor, not a palette |
| [WCAG 2.2 SC 1.4.8 — Visual Presentation, AAA](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) | The number for line width: "no more than 80 characters or glyphs" | It asks for a **mechanism** that can reach those values, not for the content to use them. Applying the number directly is ours |
| [WCAG 2.2 SC 2.5.8 — Target Size (Minimum), AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | "at least 24 by 24 CSS pixels", and the **Spacing** exception: a 24px circle centred on each undersized target must not intersect another | Anything about how a control should look |
| [Supabase design system](https://supabase.com/design-system/docs/ui-patterns/layout) — the upstream the tokens are derived from, file by file in the notes in `styles.css` | The token ladders and the section rhythm: what a surface, a border and an elevation step are, and which gap separates a section header from its content | Our content, our two languages, and every number re-measured at our sizes |
| Tailwind's 4px spacing base | The spacing unit, which the upstream inherits and does not override | Which step to use where |
| `CLAUDE.md` | That a number is written once in Western numerals and rendered per language at display time | Anything visual |

---

## 1 · Tokens

**1.1 — No colour is written outside a token block.** Every painted colour is
`var(--something)`. Measured on 2026-09-20: **0 raw colour literals** in 2,606
lines of `styles.css`, against 108 tokens defined. **House**, and the reason
the dark theme can exist at all.

**1.2 — An unused token that completes a ladder stays; machinery that paints
nothing is deleted.** `--secondary`, `--border-stronger`, `--lh-lg` and the
other contiguous type steps are referenced by nothing and are kept on purpose:
a ladder with a rung missing is worse to reason about than one with a rung
unused. The `--accent` chain, which produced a colour nothing painted, was
deleted instead. **House** — recorded in `styles.css` above the token block,
restated here so that an audit that greps for unused tokens finds the answer
before it files the finding.

**1.3 — A token is measured on the surface it is used on, not in general.**
`--foreground-lighter` measures 4.27:1 on `--card` in dark and fails AA there,
while measuring 5.42:1 light and 4.59:1 dark on `--background`. The same token
is therefore allowed on one surface and not on another. **House**, from
SC 1.4.3.

---

## 2 · Colour contrast

**2.1 — Text meets 4.5:1, and large text 3:1.** Large is ≥24px, or ≥18.66px at
weight 700 or above. *(SC 1.4.3, AA.)* Measured on 2026-09-20 across the
landing page and a dataset page, in both themes and both languages:
**0 failures in 434 and 733 elements.**

**2.2 — Non-text marks that carry meaning meet 3:1.** Chart bars, map bands and
focus rings are marks, not decoration. *(SC 1.4.11, AA.)*

**2.3 — Contrast is measured through the browser, never from the token text.**
The tokens are `oklch()`, and `getComputedStyle` hands `oklch()` straight back:
a check that parses `rgb(...)` with a regex silently reads no background at
all, defaults to white, and reports a passing pair as 2.0:1. Resolve the colour
by painting it — a 1×1 canvas, `fillStyle`, `getImageData` — and read the
bytes. **House**, and a measurement bug that produced two false findings in one
review before it was caught.

**2.4 — A theme change is not settled in the same tick.** Setting
`data-theme` and reading a computed colour in the same block reads the old
value. Reload, or the numbers are fiction. **House**, same review.

---

## 3 · Line length

**3.1 — No line of prose runs past 80 characters, anywhere.** *(SC 1.4.8 names
80; applying it to the content rather than to a mechanism is **House**. The
comfortable range is 45–75.)* This is rule 6.8 of `charts.md`, and it is not
about charts: it holds for a dictionary cell, a footer paragraph and a card
body alike.

**3.2 — The cap is written in `ch` and calibrated at the size it is used at.**
`ch` is the width of a "0", which is wider than the average letter, so a `ch`
number never equals a character count. Measured:

| element | size | cap | real characters on a line |
|---|---|---|---|
| `.chart__note` | `--text-xs` | `58ch` | 78 |
| `.dict__desc` | `--text-sm` | `56ch` | — capped from 129 |
| `.dict__notes` | `--text-xs` | `58ch` | 75 — and `60ch` measures exactly 80 |

Copying a neighbour's number is how this goes wrong in the other direction:
`56ch` at `--text-xs` is a narrower column than at `--text-sm`, because the
`0` it counts is smaller. Measure, then write the number down with what it
measured. **House.**

**3.3 — In Arabic the same cap admits a few more characters, and that is
accepted rather than tightened.** `ch` is calibrated on the Latin font, and the
Arabic face sets narrower glyphs, so `58ch` measures 75 characters in English
and up to **83** in Arabic. Measured on the contractors page at 1024px: two
single-line paragraphs at 83 and 82 characters, in columns 407px and 492px
wide. The overshoot is 4%, the physical measure is well inside the comfortable
band, and tightening the cap would narrow every Arabic column to catch three
characters on two lines. **House** — recorded so the next audit finds the
answer instead of the finding. Revisit it if a paragraph is ever measured past
90.

---

## 4 · Target size

**4.1 — A control is 24×24 CSS px, or it passes the spacing exception.**
*(SC 2.5.8, AA: "Undersized targets … are positioned so that if a 24 CSS pixel
diameter circle is centered on the bounding box of each, the circles do not
intersect another target".)* Measured on 2026-09-20 on a dataset page: 15 of 23
interactive controls are under 24px — the social row at 22×22 and the footer
links at 16.7px tall — and **every one passes by spacing**, the nearest centre
being 32px and the social row 42px. At 375px width the result is the same, with
no horizontal scroll.

**4.2 — An audit measures the exception, not the box.** A finding that lists
undersized targets without their centre distances has not been measured.
**House**, from the criterion's own wording.

---

## 5 · Typography

**5.1 — The scale is a ladder of tokens, and a line-height is derived from its
size rather than typed beside it.** `--lh-sm` is
`calc(var(--text-sm) * 1.25 / 0.875)`. One number to change, not two — the same
reason `CLAUDE.md` gives for Arabic digits.

| token | value | | token | value |
|---|---|---|---|---|
| `--text-xs` | 0.75rem | | `--text-xl` | 1.125rem |
| `--text-sm` | 0.875rem | | `--text-2xl` | 1.375rem |
| `--text-base` | 0.9375rem | | `--text-3xl` | 1.75rem |
| `--text-lg` | 1rem | | `--text-4xl` | 2.125rem |
| | | | `--text-5xl` | 2.875rem |

**5.2 — Three families, each with a job.** `--font` Inter for text, and
`--font-heading` Manrope for headings, each falling back to IBM Plex Sans
Arabic for Arabic glyphs; `--font-brand` Space Grotesk for the wordmark alone,
requested with `&text=DataSouq` so the browser fetches only the eight letters
it will draw — **2,352 bytes**, against 24,836 for the next smallest family.
**House.**

**5.3 — What the families cost is measured, not assumed.** On a cold visit,
measured live on 2026-09-20: Inter 48,256 bytes, IBM Plex Sans Arabic 45,296,
Manrope 24,836, Space Grotesk 2,352. An Arabic reader downloads all four —
120,740 bytes, against 74,295 for the whole of the landing page beside them.
**Open question, not a rule:** whether headings keep a family of their own.
Inter carries the weights Manrope is used for, so dropping it would save the
24,836 bytes measured above and change every heading on the site. Decide it
here before changing it in CSS.

---

## 6 · Numbers, and the two languages

**6.1 — A number is written once, in Western numerals, and rendered per
language at display time.** `I18N.ar.digits()` derives the Arabic-Indic form.
*(`CLAUDE.md`.)*

**6.2 — Arabic digits are not the same width as Western ones, and the
difference is measured, not guessed.** At 12px: ٠ sets 3.38px, ٩ 6.10, ٪ 6.79,
٫ 3.26, ٬ 3.38. Anything aligned on digit width is aligned on these numbers.
**House**, recorded in `styles.css`.

**6.3 — An Arabic string is never built from an English one.** This is rule 6.9
of `charts.md`, and it holds outside charts too.

---

## 7 · Spacing and rhythm

**7.1 — Spacing steps are multiples of 4px.** Tailwind's base, which the
upstream inherits and does not override.

**7.2 — A number in a layout has a reason or it is not in the layout.** "60px
was a number with nothing behind it" is a comment in `styles.css` above the
value that replaced it. **House.**

---

## 8 · Two files, two caches

**8.1 — Every asset is cached for ten minutes, and each one separately.** GitHub Pages sends
`Cache-Control: max-age=600` on everything it serves and the header is not ours to change.
Measured on 2026-09-20 on `styles.css`, `site.js` and each payload. So a visitor does not hold
"the site" at a version; they hold each file at whatever version they last fetched.

**8.2 — A shared surface between two files takes two deploys, in both directions.** One deploy
that adds the surface and starts reading it in the same breath is a broken page for anybody whose
cache straddles it:

| deploy | to add | to remove |
|---|---|---|
| first | publish it, read nobody | stop reading it, keep publishing |
| then | wait out the ten minutes | wait out the ten minutes |
| second | start reading it | stop publishing it |

**House**, and it cost a live page to learn. `escapeHtml` was shared through
`window.DATASOUQ_METRIC` in one commit: the detail page read a key the catalogue script had only
just started publishing, and a visitor holding yesterday's `site.js` with today's
`dataset-page.js` got `TypeError: escapeHtml is not a function` and a page with **no charts and no
dictionary at all**. Taking the key back off again, once the detail page had its own function,
broke the mirror image of that pair. The key is still published, read by nothing, for exactly this
reason — the note in `site.js` says when it can go.

**8.3 — A six-line pure function is cheaper written twice than shared across a cache boundary.**
No state, no policy, nothing to keep in step: `escapeHtml` is written in both files on purpose,
with a note above each copy. What was wrong before was not the duplication — it was that the two
copies **disagreed** about whether to escape a label. Fix the disagreement; the duplication is
sometimes the answer. **House.**

**8.4 — This class of defect is invisible locally.** A dev server on a fresh origin always hands
out a matched pair, so the page works perfectly on `localhost` and fails in production. The check
that finds it is the pair matrix above, reasoned through before merging — or the published site
loaded from a browser that already had one of the two files. Note also that a stale tab proves
nothing on its own: tell a stale cache from a bad deploy with
`fetch(url, { cache: "reload" })` and read `Age` and `Last-Modified` off the response, because a
CDN edge can serve the previous version for a minute after the build says built. **House**, same
incident.

---

## Adding a rule

Same procedure as `charts.md`. Find the external source first and quote it —
not from memory, and not a paraphrase that says more than the source does.
If no source settles it, write the rule as **House** with what it was measured
against and when. A rule with a number in it names the thing measured, the
size it was measured at, and what it measured out to: that is what makes it
possible to check the rule later instead of trusting it.
