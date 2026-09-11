# Chart rules · قواعد الرسوم

**بالعربي:** ده مش رأي شخصي — كل قاعدة تحت مكتوب جنبها مصدرها. اللي مالوش
مصدر خارجي مكتوب صراحةً إنه **قرار بيتنا**، عشان نعرف نغيّره لما نحتاج بدل ما
نفتكره قاعدة. لو حاجة مش مغطاة هنا، تتضاف هنا الأول وبعدين تتنفّذ.

Every rule below carries its source. Where no external source settles a
question, it is labelled **House** — a decision we made, recorded so it can be
argued with later instead of being mistaken for law. Nothing gets decided at
the keyboard: if a case is not covered here, it gets added here first.

## The sources, and what each one actually settles

| Source | What it settles | What it does **not** |
|---|---|---|
| [Supabase design system](https://supabase.com/design-system/docs/ui-patterns/charts) | The look: components, tokens, spacing — the rest of this site follows it | Which chart to use. Its only line on selection is "Always try to use the default provided charts first" |
| [IBM Carbon — chart types](https://carbondesignsystem.com/data-visualization/chart-types/) | The taxonomy: purpose → chart family. "Start by identifying the purpose of the visualization and then choose the appropriate chart type" | Numeric thresholds; its per-chart pages are demos, not rules |
| FT **Visual Vocabulary** | The same taxonomy at finer grain — nine data relationships, the charts under each | Marks, colour, layout |
| Anthropic **dataviz skill** (`references/`, `scripts/validate_palette.js`) | The numbers: mark sizes, colour checks, anti-patterns — and a runnable validator | The taxonomy (it defers to the same job→form idea) |
| Cleveland & McGill (1984) | Why the ranking is what it is: position > length > angle > area > colour | Anything specific to a design system |

Carbon and Supabase both stop short of a decision procedure. That is why this
file exists, and why the numeric rules below come from the dataviz skill: it
is the only source of the five that states thresholds and ships a validator.

---

## 1 · Choosing the form

**Rule 1.1 — Purpose first, never data shape first.** Name the question the
reader is asking, then pick from its family. *(Carbon; FT)*

| The reader asks | Family | What we use |
|---|---|---|
| Which category is biggest? | Comparison | horizontal bar, sorted by value |
| How does it spread across a ladder? | Comparison, ordered | bar sorted by the ladder + ordinal ramp |
| What is the share of each class? | Part-to-whole | one segmented bar (`split`) |
| What share carries this attribute? | Part-to-whole | meter against a 0–100 track (`coverage`) |
| What is this one number? | — | a stat tile, not a chart |

**Rule 1.2 — One value is not a chart.** A single figure is a stat tile; the
page's metrics row is exactly that. *(dataviz skill: "A one-bar bar chart" is
listed as an anti-pattern)*

**Rule 1.3 — No pie, no donut here.** Part-to-whole goes to a segmented bar.
Angle and area are read less accurately than length. *(Cleveland & McGill;
dataviz skill: "A donut/pie for comparing close values" → use a bar)*

**Rule 1.4 — Never two y-scales on one plot.** Two measures of different size
are two charts. *(dataviz skill, listed first among anti-patterns)*

**Rule 1.5 — Reach for `split` when one class holds most of the file.** As
separate bars, 15,581 against 18 is one full bar and three hairlines, which
answers nothing. **House**, following the part-to-whole family.

---

## 2 · Scale and what goes in the frame

**Rule 2.1 — Counts scale to the biggest bar in their own chart. Shares scale
to a fixed 100.** A 27% coverage bar must read as 27% of the row, not as "the
smallest of these four". **House.**

**Rule 2.2 — A value that is not on the scale is kept out of the plot and
reported in the note.** Unclassified is not a seventh grade. Left in, it set
the ceiling at 11,905 against a biggest grade of 2,134 and flattened all six
grades into hairlines — the chart's whole subject became unreadable. *(dataviz
skill, on ordered categories taking the ordinal ramp; the exclusion itself is
**House**.)*

**Rule 2.3 — Missing values are shown, never dropped.** A chart that quietly
omits the records with no value is true and misleading at once. Every
non-subset chart's bars add up to the dataset's record count; a top-N or
subset chart states in its note how many records it leaves out. **House** —
and the rule that caught the region charts silently dropping 9.5% of
contractors.

**Rule 2.4 — Fold a long tail past 8 categories into "Other".** Eighteen
facility types put nine bars under three pixels. Keep the eight largest, sum
the rest, and say in the note how many were folded. *(dataviz skill: past ~7
classes "fold the tail into Other, facet into small multiples")*

---

## 3 · Order

**Rule 3.1 — Nominal categories sort by value, descending.** Regions, cities,
facility types. **House** (the ranking convention).

**Rule 3.2 — Ordered categories sort by the ladder, never by value.** Grade 1
first even when grade 6 is the tallest bar: the shape of the ladder is the
finding. **House**, following the ordered-category treatment in the dataviz
skill.

**Rule 3.3 — Off-scale values go last**, after everything on the scale.
**House.**

---

## 4 · Colour

**Rule 4.1 — One series, one colour.** Colouring bars by their own value
encodes length twice and spends the only free channel on what the bar already
says. *(dataviz skill: "A value-ramp on nominal categories" is an
anti-pattern)*

**Rule 4.2 — Ordered categories take a one-hue ramp, light → dark.** The
colour carries the category's rung, which the bar length does not. *(dataviz
skill: "Ordered categories (funnel, tiers, age bands) → the ordinal ramp")*

**Rule 4.3 — Off-scale values take a neutral grey**, never the next ramp step.
They are the absence of a value. **House**, by analogy with the neutral
diverging midpoint.

**Rule 4.4 — Never a rainbow for magnitude; never more than 8 colour classes
carrying meaning.** *(dataviz skill)*

**Rule 4.5 — Colour is validated, not eyeballed.** Every palette is run
through `scripts/validate_palette.js` in **both** themes against the card
surface, not the page background:

```
node scripts/validate_palette.js "<hex,hex,...>" --mode light --surface "#ffffff"
node scripts/validate_palette.js "<hex,...>" --ordinal --surface "#1c1f1d"
```

Thresholds it enforces: OKLCH lightness band (light 0.43–0.77, dark
0.48–0.67), chroma ≥ 0.10, contrast ≥ 3:1 against the surface, and for a ramp:
monotone lightness, adjacent ΔL ≥ 0.06, lightest step ≥ 2:1. The ordinal ramp
here failed three times before it passed. *(dataviz skill)*

**Rule 4.6 — Dark mode gets its own steps, never the light ramp inverted.**
*(dataviz skill: "dark mode is selected — its own steps from the same ramps")*

**Rule 4.7 — Text never wears the data colour.** Bars carry the hue; labels,
values and notes stay on the page's text tokens. *(dataviz skill)*

### The validated palettes

Light surface `#ffffff`, dark surface `#1c1f1d`.

| Token | Light | Dark |
|---|---|---|
| `--chart-bar` | `#097C4F` | `#2BA770` |
| `--chart-ramp-1..6` | `#2dcc87` `#27b175` `#219764` `#1c7e53` `#166543` `#114c33` | `#afe6ce` `#76d4ab` `#3cbf87` `#33a272` `#2b885f` `#236d4d` |
| `--chart-null` | `rgba(3,3,3,.26)` | `rgba(243,246,244,.24)` |

`--chart-bar` light is the site's own `--brand-600`. The brand accent
`#3ECF8E` is deliberately not the dark bar: at L 0.762 it sits outside the
0.48–0.67 band dark mode requires.

---

## 5 · Marks

*(All from the dataviz skill's mark specs.)*

**5.1** Bars ≤ 24px thick — ours are 10px, because these run to twenty rows and
the gap between bars has to stay bigger than the bar for the list to read as a
list.
**5.2** 4px rounded at the data end, square at the baseline — written with
logical corners so RTL mirrors without a second rule.
**5.3** A 2px gap in the **surface colour** separates touching marks. Never a
border around a mark: a stroke adds ink that is not data.
**5.4** Gridlines and axes, where they exist, are solid hairlines one step off
the surface — never dashed.
**5.5** A track is drawn only where the scale is a fixed 0–100. On a
count chart it would imply a maximum that does not exist. **House.**

---

## 6 · Labels

**6.1 — The value is printed at the end of every bar.** *(dataviz skill:
"Direct labels before gridlines; gridlines before a second axis.")* This is
why the charts carry no axis and no gridlines at all.

**6.2 — A value must never be reachable only by hover.** A tooltip-only value
is invisible to a keyboard and to a screen reader. *(dataviz skill: "A tooltip
as the only way to read a value" is an anti-pattern)*

**6.3 — A single series gets no legend;** the title names what is plotted. A
`split` does get a key, because it has more than one segment. *(dataviz
skill)*

**6.4 — Labels are never clipped.** The label column is `fit-content(38%)`:
it takes the width the longest label needs and stops there. *(dataviz skill:
"A label that won't fit doesn't get clipped — measure first")*

---

## 7 · Layout

**Rule 7.1 — The three columns align down the whole chart, not per row.**
Label / bar / value are one grid with `subgrid` rows. As a grid per row, an
`auto` value column sized itself to each row's number — 910 against 2,974 —
which left the fr columns different widths and started every bar at a
different x. **House**, and the defect a reader spotted before we did.

**Rule 7.2 — Cards flow in columns, not grid rows.** A grid stretches every
card to the tallest in its row: a four-row chart beside an eighteen-row one
was padded to 670px, 400 of them blank. Multi-column packs each card at its
own height. **House** — no source settles dashboard layout.

**Rule 7.3 — Two columns on desktop, one under 900px.** The trade is track
width: two columns give a bar ~310px to run in rather than ~700. Acceptable
**only because** rule 6.1 prints the value — precision does not rest on the
bar's length. **House.** If a chart ever needs the width more than the page
needs the density, this is the rule to revisit.

---

## 8 · Data integrity

**8.1 — No figure is ever typed by hand.** Every number comes from
`tools/build_dataset_details.py` reading the delivered Excel file.
**8.2 — Re-measure on every delivery.** The script rewrites all payloads and
`sitemap.xml` in one run.
**8.3 — Every non-subset chart reconciles to the record count** (rule 2.3),
which is worth re-checking after any change to the builders.

---

## Adding a chart

1. Find the reader's question in the table in §1. If it has no row there, add
   the row — with its source — before writing any code.
2. Add it in `tools/build_dataset_details.py` using `bar()`, `ordinal()`,
   `split()` or `coverage()`.
3. Run `python tools/build_dataset_details.py "<folder with the .xlsx files>"`.
4. If it needs a colour that is not already a token, validate it (rule 4.5)
   in both themes before adding it.

Nothing in `dataset.html`, `assets/js/dataset-page.js` or the CSS changes for
a new chart or a new dataset.
