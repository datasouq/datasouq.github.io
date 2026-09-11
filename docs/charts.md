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
| [Supabase design system](https://supabase.com/design-system/docs/ui-patterns/charts) · [layout](https://supabase.com/design-system/docs/ui-patterns/layout) · [empty states](https://supabase.com/design-system/docs/ui-patterns/empty-states) | The look, and the anatomy: `ChartHeader` (title + `ChartMetric`) over `ChartContent`; `showGrid` and `showYAxis` both default to `false`; a section title paired with a section description; an empty state that "provides a clear action" | Which chart to use. Its only line on selection is "Always try to use the default provided charts first" |
| [IBM Carbon — chart types](https://carbondesignsystem.com/data-visualization/chart-types/) | The taxonomy: purpose → chart family. "Start by identifying the purpose of the visualization and then choose the appropriate chart type" | Numeric thresholds; its per-chart pages are demos, not rules |
| [IBM Carbon — dashboards](https://carbondesignsystem.com/data-visualization/dashboards/) | The arrangement: hierarchy, reading order, white space, consistency — what goes where once the forms are chosen | Any number. It gives no sizes, no column count, no gap values |
| [NN/g — choosing chart types](https://www.nngroup.com/articles/choosing-chart-types/) · [dashboards & preattentive attributes](https://www.nngroup.com/articles/dashboards-preattentive/) | What a reader can actually decode: "length and 2D position" first, bars "ordered in an ascending or descending pattern", horizontal bars "when you're working with long labels" | Anything about a specific design system |
| Knaflic, **Storytelling with Data** | What a title is for: it carries the message, it does not name the subject | Form, colour, layout |
| FT **Visual Vocabulary** | The same taxonomy at finer grain — nine data relationships, the charts under each | Marks, colour, layout |
| Anthropic **dataviz skill** (`references/`, `scripts/validate_palette.js`) | The numbers: mark sizes, colour checks, anti-patterns — and a runnable validator | The taxonomy (it defers to the same job→form idea) |
| Cleveland & McGill (1984) | Why the ranking is what it is: position > length > angle > area > colour | Anything specific to a design system |

Carbon and Supabase both stop short of a decision procedure for *which* chart
to use. That is why this file exists, and why the numeric rules below come
from the dataviz skill: it is the only source here that states thresholds and
ships a validator. Carbon's dashboard page does settle *arrangement* — §7 now
rests on it rather than on house judgement.

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
| Where is it concentrated, by area? | Spatial | choropleth of the 13 regions (`map`), always beside the region bar chart |
| Where exactly is each one? | Spatial | a dot per location (`dots`), when the file carries coordinates |
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

*This rule has a source against it, and it stays anyway.* NN/g is blunt:
stacked bars are "among the charts with the highest error rates", and it
tells you to use "a series of 3 bar charts instead". The error it is talking
about is a reader ESTIMATING a segment's size by eye, and it is worst when
segments have to be compared across several stacked bars with different
baselines. Neither applies here: there is one bar, not a series, so there is
nothing to compare across baselines — and nothing is estimated, because the
key under it prints every segment's share and its count (rule 6.3). If a
`split` ever grows a second bar, this rule stops covering it and NN/g wins.

**Rule 1.6 — Every chart must be decodable in about 30 seconds, without
interacting with it.** These sit on a page someone is deciding whether to buy
from, not in a dashboard they will sit with. Concretely a chart must be:
sorted (§3), direct-labelled (6.1), single-series or keyed (6.3), and no
deeper than ~12 rows.

The one allowed exception is a chart where the **count itself is the
product**. Three charts take it today, and all three are geography: the two
"by region" charts at 14 rows (13 administrative regions plus the
not-recorded bar) and "Facilities by health directorate" at 20. Full
geographic coverage is exactly what a buyer is evaluating, so folding the
tail there would hide the thing being sold. An exception has to be argued in
the note, not taken silently — and a chart that claims it must still satisfy
everything else in this rule.

*Source: the reader-time axis is an idea taken from the `lieflat-charts`
catalogue, which tags every chart with data shape, occasion and reader time
(<10s / ~30s). **The idea only** — that project is
[PolyForm Noncommercial](https://polyformproject.org/licenses/noncommercial/1.0.0),
so none of its code, templates or catalogue text can be used here: DataSouq
sells data, which is commercial use and needs the author's separate
permission. The thresholds and the exception are **House**. Carbon's
dashboard page argues the same direction — "Limit the number of metrics …
strip away anything that could distract a user from interpreting the
information" — without naming a number.*

**Rule 1.7 — A map answers "where", never "how much exactly".** It ships
paired with the region bar chart, never instead of it. A shaded area cannot
be read back to a number, and a ranked list has no geography in it; each
covers what the other cannot. *(Carbon's Geospatial family; FT's Spatial. The
pairing is **House**, and it is also what keeps rule 6.2 satisfied — the
exact counts stay on the page rather than in a hover.)*

**Rule 1.7b — A choropleth is only correct where the geography of the data IS
the geography drawn. Where it is not, and the file has coordinates, use
dots.** The healthcare register's region column holds **20 MOH health
directorates**, not the 13 administrative regions, and eight of the twenty
are units *inside* a region — Jeddah, Taif and Al-Qunfudhah inside Makkah;
Al-Ahsa and Hafar Al-Batin inside Eastern Province; Bisha inside Asir;
Qurayyat inside Al-Jouf. `REGION_ISO` matched 12 of the 20, so a choropleth
would have quietly dropped **1,282 facilities, 28% of the file**, into the
"not on the map" line. That is why it had no map for so long.

It has one now because the file turned out to carry real coordinates: its
map-link column is a `?q=<lat>,<lon>` URL, and 3,731 of 4,563 rows parse to a
point inside the country with nothing malformed and nothing outside. A dot
map needs no administrative join at all, so the directorate problem simply
does not arise — and FT's dot-density entry, "used to show the location of
individual events/locations", is what a facility is. *(FT's Spatial family)*

**Rule 1.7c — A dot map publishes positions, never coordinates.** The
projection and the rounding happen in `tools/build_dataset_details.py`, and
what reaches the payload is whole viewBox units — **one unit is 2.14 km**.
Un-projecting gets a two-kilometre square, not an address. This is not a
technicality: the coordinate column is part of what the site is selling, and
a map that shipped it would be giving a column away to draw a picture of it.
The rounding also merges 3,731 points into 2,487 positions, each carrying its
own count, so density survives the merge. **House.**

**Geometry**: `tools/geo/sa-admin1.geojson`, the 13 regions extracted from
**Natural Earth**, which is public domain — "You may use the maps in any
manner… for personal, educational, and commercial purposes. No permission is
needed." `tools/build_map.py` projects and simplifies it; see
`tools/geo/NOTICE.md`. The join key is the ISO 3166-2 code, never a name:
the sources spell the same region "Ar Riyad", "Riyadh" and "الرياض", and a
region whose spelling is not in the table is reported in the note instead of
being dropped.

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

**Rule 4.4b — On a CHOROPLETH, colour IS the value, and it is the only place
on this page where that is true.** (On a `dots` map colour carries nothing:
position is the value and size is the count, so it takes the single brand
step like a bar, and its key shows three sizes rather than six shades —
"legend design matters — 3 example sizes usually".) It therefore takes the same one-hue ramp as an
ordered scale, and it must carry a scale legend naming every band — a
sequential encoding without one is unreadable. *(dataviz skill: "No table
view / color-only encoding on a continuous scale" is an anti-pattern)*

**Rule 4.4c — Map bands are quantiles, and the note says so.** Equal
intervals would put Riyadh alone in the top band and eleven regions in the
bottom, leaving a map that shows only where the capital is. Quantiles give
each band a similar number of regions. Both choices are defensible and they
say different things, so the one in use is named on the chart rather than
left for the reader to assume. **House.**

**Rule 4.4d — The choropleth's key names the regions in each band, not the
range of values it spans.** A key reading "729–2,552" asks the reader to hold
a number range in their head, look at a shade, and match the two. "Eastern
Province 2,552 · Madinah 729" removes that step: the shade points at the
places and every place carries its own figure — which is rule 6.1, the value
printed rather than decoded, applied to the map at last.

Grouped **by band**, six rows, and not one row per region. Thirteen rows of
name-and-count *is* the "Records by region" chart beside it minus the bars;
six rows explain the shading without becoming a second copy of it.

*This does not fix what it looks like it fixes.* FT is explicit that a
choropleth "should always be rates rather than totals", and ours shades
totals — the trap being that Riyadh region is both the largest in area and
the largest in count, so area and magnitude are confounded exactly as the
rule warns. Naming the regions defuses most of the harm, because nobody has
to read a magnitude off a colour any more, but **the encoding is unchanged**.
The two real fixes are a rate (per capita, which needs a population source
the repo does not have and a figure rule 8.1 forbids typing in) or
proportional symbols at region centroids (same data, correct form, and it
would make all three maps look alike again). Open, and recorded as open.
**House.**

**Rule 4.5b — A ramp's end-of-scale allowance applies to whichever end is
nearest the surface.** The band below is written "lightest ≥ 2:1" because it
was written against a white card, where the light end is the one that runs
out of contrast — in light theme `--chart-ramp-1` is 2.08:1 and
`--chart-ramp-2` 2.75:1, both deliberate. In dark theme the constrained end
is the DARKEST: `--chart-ramp-6` measures 2.66:1 against the dark card, which
is the same allowance seen from the other side and not a defect. Read
literally in dark mode the rule checks the wrong end of the ramp. **House.**

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
why the charts carry no axis and no gridlines at all — which is also what
the design system itself does: `ChartBar` and `ChartLine` both default
`showGrid: false` and `showYAxis: false`. *(Supabase)*

**6.2 — A value must never be reachable only by hover.** A tooltip-only value
is invisible to a keyboard and to a screen reader. *(dataviz skill: "A tooltip
as the only way to read a value" is an anti-pattern)*

**6.3 — A single series gets no legend;** the kicker names what is plotted
(rule 6.7). A `split` does get a **key**, because it has more than one
segment — and a key is not a legend: it carries each segment's label, share
and count, so it is a readout of the bar above it. *(dataviz skill)*

**6.4 — Labels are never clipped.** The label column is `fit-content(38%)`:
it takes the width the longest label needs and stops there. *(dataviz skill:
"A label that won't fit doesn't get clipped — measure first")*

**6.5 — In Arabic, quantities take Arabic-Indic digits; codes do not.**
A count, a share or a band edge is a quantity and converts — U+0660–U+0669
with U+066C for thousands, U+066B for the decimal, U+066A for percent. An
identifier does not: `E.164` or a grade range of `1-6`
stays as the delivered file writes it, because they are the value stored in
the column and not a measurement of anything. The data dictionary is
therefore left alone; the charts are converted. **House.**

The conversion happens at render time, never in the payload: `digits()` in
`assets/js/site.js` for values, `numbersIn()` in `dataset-page.js` for a
note. A note cannot go through `digits()` whole — it maps every `.` to the
Arabic decimal separator, and a note ends in a full stop.

**6.7 — A card carries three lines and they never say the same thing.**

| Line | Job | Source |
|---|---|---|
| **Kicker** | the subject — "Records by region" | **House.** Knaflic writes for a slide with one chart on it; a page of seven findings and no subjects cannot be scanned |
| **Title** (`h4`) | the finding — "Riyadh and Makkah together: 58.1% of the records" | Knaflic: a title carries the message |
| **Metric** | how much of the file the chart covers — "31.2% of 17,304 records" | Supabase's `ChartMetric`: a value with its label, at the end of the `ChartHeader` |

The title is **generated**, not written: `headline()` in
`tools/build_dataset_details.py` builds it from the same counts the bars are
drawn from, so it cannot drift from them (rule 8.1). Its shares are always
of the dataset total, never of what the chart happens to plot — "the ten
biggest cities are 46.8% of the records" is a fact a buyer can use, "46.8%
of the ten biggest cities" is a denominator nobody asked about.

The form is `subject: share`, with a colon and no verb, because a generated
sentence has to be grammatical for every label it will ever be handed and
the verb is where that breaks — "Primary health centres **is** 53.8%" in
English, and in Arabic an adjective that has to agree with a gender the
script does not know. An `ordinal` chart never names two categories: its
bars are a ladder, so the two biggest by count come out in whatever order
the counts fall — "Sixth Classified and First Classified" — which reads as a
mistake even when it is true.

The metric is rule 2.3 printed rather than left to be checked, and it is the
one figure that differs from card to card: 100% for a chart of everything,
71.1% for the ten biggest cities, 31.2% for the grade ladder.

**6.8 — No line of prose runs past 80 characters.** *(WCAG 1.4.8 caps a
block at 80; the comfortable range is 45–75.)* The note under the
full-width map card ran **180** before this, because a full-width card gives
its text the full width too. Capped with `max-inline-size` in `ch`
— **58ch**, not 80ch: `ch` is the width of a "0", which is wider than the
average letter, so 80ch measured out at 107 real characters and 58ch lands
on 78. The number is calibrated, which is why it is written down.

**6.9 — An Arabic string is never built from an English one.** The map's
"not on the map" tail was assembled from `label_en` for both languages and
put "Not recorded" inside an Arabic sentence. Any generated sentence carries
both labels through from `counted()`, which already returns the pair.
**House**, and a defect that shipped.

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
own height. **House** on the mechanism; the reason it matters is Carbon's:
400px of padding inside a card is not white space doing work, it is a card
claiming importance it does not have.

**Rule 7.3 — Two columns on desktop, one under 900px.** The trade is track
width: two columns give a bar ~310px to run in rather than ~700. Acceptable
**only because** rule 6.1 prints the value — precision does not rest on the
bar's length. **House.** If a chart ever needs the width more than the page
needs the density, this is the rule to revisit.

**Rule 7.4 — Charts are grouped by the question they answer, and the groups
run most important first.** Seven cards in one flow is a list, not a
dashboard: nothing tells the reader where to start or what belongs with what.
Three groups, in this order:

| Group | The question it answers | Why it is where it is |
|---|---|---|
| **Coverage** · التغطية | Where are these records, and does the file reach my area? | The first thing a buyer checks. If the coverage is wrong, nothing below matters |
| **Usability** · جاهزية الاستخدام | Can I act on a record — is there a way to reach it, and how complete is it? | Second: the file covers my area, but can I use it? |
| **What's in it** · المكوّنات | How is the file composed — what classes, what types? | Detail. Read once the first two have passed |

*(Carbon: "Prioritize data by importance, then create a clear visual
hierarchy … Place the most important at the top of the page and follow the
F-pattern for the remaining elements, finishing with the least important
information")*

The group of a chart is set in `CHART_GROUPS` in
`tools/build_dataset_details.py`, next to the data, not in the CSS — it is a
judgement about what the chart says.

**Rule 7.4b — A group is an `h3`, its charts are `h4`s, and the section is
named.** As two `h3`s the outline said the group and its charts were
siblings, so the grouping a sighted reader gets from the 40px gap and the
label was simply absent from the document outline. `aria-labelledby` on the
`<section>` is what turns it into a region a screen reader can jump between.
**House**, and the accessibility half of Carbon's hierarchy rule.

**Rule 7.4c — A group title is followed by a group description.** *(Supabase:
"use `PageSectionTitle` **and** `PageSectionDescription` to label each
section")* One line, naming the question the group answers. "Coverage" on
its own leaves the reader to work out what is being covered.

**Rule 7.5 — The lead chart of the lead group gets the largest area.** The
map spans both columns; every other card takes one. *(Carbon: "The most
important data should have the highest contrast and occupy the largest
area")* The span is a cap, not a stretch: a drawing left to fill the row came
out 880px tall, which is a map eating the page rather than a hierarchy.

**Rule 7.5b — A drawing's size cap belongs outside the media query that
widened it.** The map's cap lived inside `@media (min-width: 900px)`, so
between 768 and 899 — where the card is already full width but the
two-column layout has not fired — nothing stopped it: 663×544 at a 768px
viewport and 755×619 at 860px, both **taller** than the 657×539 it gets at
1280px. A smaller screen was getting a bigger map. **House**, and a defect
that shipped.

**Rule 7.5c — A group of one takes the whole row.** Left in the two-column
flow a lone card sat in the left column with the right half empty, which
reads as a card that failed to load rather than as a group with one chart in
it. The bars simply get longer, which costs nothing: rule 6.1 prints every
value, so precision never rested on a bar's length. **House.** It stopped
being an edge case when the Completeness tier was dropped from contractors
and engineering, which made Usability a single card on all three datasets.

**Rule 7.6 — White space does the grouping: 40px between groups, 12px
between cards inside one.** No rules, no boxes around groups — the gap is
the separator. *(Carbon: "White space either sets elements apart or brings
them together to distinguish a point's priority … Space acts as a visual
separator and guides a user's eye through a page")*

**Rule 7.7 — One layout, one spacing, one legend position for every chart.**
*(Carbon: "All charts should use the same layout and spacing, and have
legends in the same position relative to the charting area")* A **key** is
not a legend under rule 6.3 — the `split`'s key carries label, share and
count, so it is a readout of the bar it sits under, and the map's band legend
is the page's only legend. It sits beside the drawing.

---

## 8 · Data integrity

**8.1 — No figure is ever typed by hand.** Every number comes from
`tools/build_dataset_details.py` reading the delivered Excel file.
**8.2 — Re-measure on every delivery.** The script rewrites all payloads and
`sitemap.xml` in one run.
**8.3 — Every non-subset chart reconciles to the record count** (rule 2.3),
which is worth re-checking after any change to the builders. Rule 6.7 now
prints that reconciliation on the card instead of leaving it to be checked.

**8.4 — A dataset with no measurements says so.** *(Supabase: "Empty states
convey the fact that there is nothing to list, perform, or display on the
current page. Ideally, they also provide a clear action for the user to
take.")* This state is reachable by design, not by accident: the whole point
of the architecture is that a dataset appears on the site the moment it is
added to `datasets.js`, so between that edit and the next run of the builder
a real page exists with no payload behind it. Before this it rendered two
section headings — promising figures and a data dictionary — with nothing
at all underneath them.

---

## Adding a chart

1. Find the reader's question in the table in §1. If it has no row there, add
   the row — with its source — before writing any code.
2. Add it in `tools/build_dataset_details.py` using `bar()`, `ordinal()`,
   `split()`, `coverage()`, `region_map()` or `dots()`.
3. Give it a group and a rank in `CHART_GROUPS` in the same file (rule 7.4).
   Anything not listed there falls to **What's in it**, last.
4. Run `python tools/build_dataset_details.py "<folder with the .xlsx files>"`.
5. If it needs a colour that is not already a token, validate it (rule 4.5)
   in both themes before adding it.
6. Read its generated headline in the build output. `narrate()` gives every
   chart one for free, but a new chart **type** needs its own branch in
   `headline()` — without one it falls to the leader template, which is
   wrong for anything that is not a ranked list of counts.

The script prints any label that fell back to Arabic for want of an `AR_EN`
entry (rule 6.9), so a missing translation is a line of build output rather
than something to be spotted on the page.

Nothing in `dataset.html`, `assets/js/dataset-page.js` or the CSS changes for
a new chart or a new dataset.
