# Charts — how we choose them · كيف نختار الرسوم

**بالعربي، باختصار:** الـ design system بتاع Supabase بيقول شكل الرسم إزاي يبقى،
لكنه **ما بيقولش أي رسم تختار**. فالمصدر متقسّم: الشكل من Supabase، والاختيار من
FT Visual Vocabulary (ومن Carbon للحالات المعقّدة)، والألوان تتفحص بسكربت مش
بالنظر. التفاصيل تحت.

---

## Why this file exists

The rest of this site takes its rules from the Supabase design system, and its
CSS says so in the margins. Charts are the one place that source runs out.
[supabase.com/design-system/docs/ui-patterns/charts](https://supabase.com/design-system/docs/ui-patterns/charts)
documents the *components* — "our own presentational components and Recharts",
with `showYAxis`, `showGrid`, `color`, `strokeWidth` — and no chart colour
tokens. On which chart to reach for, its only line is:

> Always try to use the default provided charts first

That is a component preference, not a decision procedure. So the choice has to
come from somewhere, and writing down where is the point of this file: one
answer, not a fresh opinion per chart.

## The split

| Question | Source |
|---|---|
| How should it look — marks, spacing, type, tokens | The Supabase design system, same as the rest of the site |
| **Which chart for this data** | **FT Visual Vocabulary** — nine data relationships, the chart types under each |
| Harder cases, and accessibility | IBM Carbon's Data Visualization guidance — it covers selection, colour and a11y together, which is the gap here |
| Why a bar beats a pie at all | Cleveland & McGill (1984): position > length > angle > area > colour |
| Colour, specifically | Adobe Spectrum's data-viz colour, and Datawrapper Academy |

Supabase's components are React on Recharts. This site is plain HTML, CSS and
JS on a static host, so — exactly as with Card and ToggleGroup elsewhere here —
we rebuild the rules rather than import the component. Charts are HTML, not
SVG: the labels and values are then real text that find-in-page reaches, that
the language switch translates with everything else, and that RTL lays out
without hand-flipped text anchors.

## The three forms, and when each applies

Adding a fourth is allowed — it just has to answer a question the first three
don't, and be written down here.

| Form | The reader's question | Used for |
|---|---|---|
| **Nominal bar**, one colour | "which of these is biggest" | regions, cities, facility types, membership, phone line type |
| **Ordinal bar**, light→dark ramp, sorted by the scale | "how does the file spread across this ladder" | classification grades 1-6, completeness tiers A-D |
| **Coverage meter**, filled against a 0-100 track | "what share carries this, and what share doesn't" | contact coverage (email, phone, website, address) |

Two things follow from the middle row. Ordered categories are sorted **by the
scale, never by count** — grade 1 first even when grade 6 is the tallest bar —
because the shape of the ladder is the finding. And a value that is off the
scale (Unclassified, Not recorded) takes a neutral grey, never the next ramp
step: it is the absence of a grade, not a further grade.

## Rules we don't break

- **One series, one colour.** Colouring bars by their own value encodes length
  twice and spends the only free channel on what the bar already says. The
  ordinal ramp is not an exception — there the colour carries the *category's*
  rung, which the bar length does not.
- **Never two y-scales on one plot.** Two measures of different size are two
  charts.
- **Blanks are shown, not dropped.** A chart that quietly omits the records
  with no value is true and misleading at once. Every non-subset chart's bars
  add up to the dataset's record count; a top-N chart says in its note how many
  records carry no value. `paired(..., drop_blank=False)` in the build script
  is what does this.
- **The value is on the bar, not in a tooltip.** Direct labels before
  gridlines, gridlines before an axis. A value only a mouse can reach is a
  value a keyboard and a screen reader cannot.
- **Text never wears the data colour.** Bars carry the hue; labels, values and
  notes stay on the page's text tokens.
- **Colour is checked, not eyeballed.** Both palettes below were run through a
  validator; the ordinal ramp failed three times on step spacing and light-end
  contrast before it passed. Contrast, lightness band, monotonicity and hue
  spread are arithmetic — so compute them.

## The palettes, and what they passed

Light surface `#ffffff`, dark surface `#1c1f1d` (the card, which is what the
bars actually sit on — not the page background).

| Token | Light | Dark |
|---|---|---|
| `--chart-bar` | `#097C4F` | `#2BA770` |
| `--chart-ramp-1..6` | `#2dcc87` `#27b175` `#219764` `#1c7e53` `#166543` `#114c33` | `#afe6ce` `#76d4ab` `#3cbf87` `#33a272` `#2b885f` `#236d4d` |
| `--chart-null` | `rgba(3,3,3,.26)` | `rgba(243,246,244,.24)` |

`--chart-bar` clears 3:1 against its surface and sits inside its mode's
lightness band in both themes. The ramps are single-hue (2° and 6° spread),
monotone in OKLCH lightness, every adjacent step ≥ 0.06 apart, lightest step
above the 2:1 floor. The dark ramp is its own set of steps against the dark
card — not the light ramp inverted, which would put the pale end where the
surface already is.

`--chart-bar` light is the site's own `--brand-600`. The brand accent
`#3ECF8E` is deliberately *not* the dark bar: it measures L 0.762, outside the
0.48–0.67 band dark mode asks for.

## Adding a chart

Charts are generated, never hand-written. Add it in
`tools/build_dataset_details.py` — `bar()`, `ordinal()` or `coverage()` — then:

```
python tools/build_dataset_details.py
```

That re-measures every figure from the delivered Excel file, rewrites
`assets/data/<id>.js`, and regenerates `sitemap.xml`. Nothing in
`dataset.html`, `assets/js/dataset-page.js` or the CSS needs to change for a
new chart or a new dataset.
