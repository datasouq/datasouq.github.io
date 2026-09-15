# Blog reference · مرجع صفحة المدونة

**بالعربي:** الملف ده مختلف عن `docs/charts.md` — ده مش قواعد ملزمة لحاجة
موجودة، دي ملاحظات مقيسة عن صفحة حقيقية (مقال مدونة Supabase) عشان نرجع
لها لو قررنا نعمل صفحة "Blog" يوماً. لا حاجة هنا اتنفّذت ولا اتقرّرت —
دي مرجع نختار منه، مش التزام.

Unlike `docs/charts.md`, nothing here is binding — there is no blog page
yet. This is a measured record of one page,
[supabase.com/blog/supabase-reports-and-metrics](https://supabase.com/blog/supabase-reports-and-metrics),
captured for the day a blog page is actually built, so the choice draws on
something sourced rather than a fresh guess at the keyboard. Numbers below
were read from the live page's computed styles, not estimated.

---

## 1 · The font question

**Yes — the blog's type is already inside the design system this site
follows, with one gap.**

| Element | Measured on the blog | Ours |
|---|---|---|
| Body text (`p`, `.prose`) | Inter, 400–450 weight, 16px | `--font`: Inter — **exact match**, including the 450 weight (`--font-weight-normal: 450`) |
| Headings (h1–h3) | Manrope | `--font-heading`: Manrope — **exact match** |
| Inline/block code | Source Code Pro, 14px | **no equivalent token** — this build ships no monospace font at all (noted in `styles.css` at the CardTitle rule: "this build ships no mono companion") |

Nothing here would need a new typeface import for prose or headings. A
monospace stack would be the one true addition, and only if a future blog
post ever needs a code sample — nothing on this site currently does.

### Sizes measured, for when a blog scale is chosen

| Element | Size / line-height / weight | Against our ladder |
|---|---|---|
| H1 | 22px / 29.33px / **500** | Matches `--text-2xl` / `--lh-2xl` (22px / 29.33px) exactly — but at 500, not the 600 our own `h1, h2, h3 { font-family: var(--font-heading) }` rule carries (sourced from the same `globals.css`, comment: "h1–h6 get font-heading and font-semibold — all of them"). The blog's own MDX/prose styles override that base weight; a blog page here would need the same deliberate override, not inherit it for free. |
| H2 | 24px / 32px / 400 | Between our `--text-2xl` (22px) and `--text-3xl` (28px) — not one of our four named steps. A blog gets its own local scale on Supabase's own site too; this is not a deviation from anything, just a size we have not named yet. |
| H3 | 20px / 32px / 400 | Same: between `--text-xl` (18px) and `--text-2xl` (22px), not a named step. |
| Body `p` | 16px / 28px / 400 | One step above `--text-base` (15px, what this site's product copy uses) — `--text-lg` (16px). Long-form reading commonly runs a size larger than dense UI copy; Supabase does this on its own blog relative to its own product chrome. |
| `.prose` container | 16px / 24px / **450** | The 450 is the same real Inter weight this site already asks for everywhere else. |
| Inline `code` | 14px / 24.5px, Source Code Pro | New — see the gap above. |

---

## 2 · Layout, top to bottom

Measured at a 1280px viewport, dark theme (the page defaults to whichever
theme the visitor's toggle/OS is set to, same as this site).

**Two-column body: a 638px article column and a 271px sticky sidebar**,
with a ~72px gutter between them (`article` at x:188 w:638; sidebar at
x:898 w:271, `position: sticky; top: 96px` — 96px is room for their own
sticky nav bar plus a gap, so the sidebar clears it while scrolling). Below
some breakpoint the sidebar presumably drops under the article — not
measured, since narrowing this specific page was not tested this session.

1. **Breadcrumb** — `Blog / <category>`, plain text links, small and
   muted, directly above the title. Not a full path, just one level of
   category.
2. **H1** — the post title. Nothing else on the same line.
3. **Meta line** — publish date and a computed reading time ("29 Jul 2021 ·
   6 minute read"), muted, directly under the title.
4. **Author row** — circular avatar, name (medium weight), role/team
   underneath in a smaller muted line (e.g. "Div Arora" / "Engineering").
   The name links to an author archive page.
5. **Cover image** — full column width, directly under the author row,
   before any body text.
6. **Article body** — prose paragraphs; H2/H3 section headings, **each
   carrying its own `#` permalink** (a small anchor icon/link before or
   after the heading text, linking to `#that-heading-slug`) so any section
   can be linked to directly; inline images between sections; inline code
   spans; external links styled distinctly; a pull-quote treatment for at
   least one standalone quoted sentence; ordered and nested bullet lists.
7. **Utility row, right after the article** — "Copy as Markdown" (hands
   the raw content to a clipboard, clearly aimed at someone about to paste
   it into an LLM), "Ask ChatGPT" / "Ask Claude" (pre-filled prompt links
   that open the assistant with a request to read the post from its URL),
   and share links (X, LinkedIn, Hacker News). **This exact set — Copy as
   Markdown plus direct "ask an assistant about this" links — also appears
   a second time**, inside the sticky sidebar; the two are almost certainly
   the same component rendered once for narrow viewports (inline, under
   the article) and once for wide ones (in the sidebar), rather than two
   different features.
8. **Tags** — short pill links (e.g. `launch-week`, `reports`, `database`)
   to tag-archive pages, sitting at the top of the sticky sidebar, above
   the table of contents.
9. **"On this page" — a table of contents**, small-caps label, one link
   per H2, in the sticky sidebar under the tags. Built from the same
   headings that carry the `#` permalinks in the body, so it is one list
   maintained once, not authored twice.
10. **Previous / next post** — two cards after the article, each with the
    adjacent post's title and date, ordered by publish date rather than
    by relevance.
11. **Sitewide CTA band** and **sitewide footer** — not blog-specific;
    the same "Build in a weekend, scale to millions" banner and footer
    every other Supabase page carries. Nothing here is a blog pattern.

## 3 · What would not carry over as-is

This site is bilingual EN/AR with RTL, and Supabase's blog is English-only,
LTR-only. Nothing above was checked against an RTL rendering because the
source has none. Concretely, a blog page here would need its own decisions
— not assumptions carried from this reference — on at least:

- **Which side the sticky sidebar sits on in Arabic.** This site's own
  footer stays LTR by design (deviation 7 in the earlier design-system
  notes); whether a blog sidebar should mirror or also stay pinned is an
  open question, not answered by anything above.
- **Where the heading permalink icon sits** relative to Arabic heading
  text, and whether `#` is the right glyph to carry across languages at
  all.
- **The reading-time string** ("6 minute read") is a sentence, not a
  number — it needs its own Arabic phrasing, not just digit conversion
  the way this site already handles counts elsewhere.
- **Author role labels** ("Engineering") would need an Arabic equivalent
  if authors are ever named on a translated post.

None of this is decided here. It is flagged so it is not skipped later.
