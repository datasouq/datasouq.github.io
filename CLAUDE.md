# DataSouq site

A static site on GitHub Pages. Every tracked file here is served verbatim and is public the
moment it is pushed — including the generated ones under `assets/data/`.

## Describing a dataset

Describe a dataset by **what it holds** — counts, coverage, columns, how it was cleaned. Never by
**where the records came from**. No organisation, site, export filename or attribution line.

This applies everywhere, not just to page copy: the generated data files, the JSON-LD blocks,
`README.md`, **commit messages**, and **pull request titles, bodies and comments**. A commit
message feels like a working note, but it is published on push and stays readable long after the
line it described is gone.

When you need to refer to the origin of a file, *the source export* and *the delivered file* carry
the meaning without naming anything.

## Figures on the cards

Every number on a dataset card is measured, never estimated, and never typed in by hand.

`tools/build_dataset_details.py` reads the delivered workbooks and writes `assets/data/*.js`,
including `metrics.js`. A card metric names the figure it wants:

```js
{ icon: ICONS.rows3, metric: "records", labelEn: "records", labelAr: "سجل" }
```

Labels take `{placeholders}` resolved the same way, which is what lets a label reorder between
languages while both numbers still come from the file.

So a new edition updates the site **by being built**, not by anyone editing `datasets.js`. If you
find yourself typing a count into that file, re-run the tool instead.

A metric with a literal `value:` and no `metric:` still renders — that is how a dataset whose
workbook the tool does not build yet keeps working. Those figures are hand-kept, and the comment
above each such entry records what was measured and what was deliberately left out.

## Numbers in Arabic

Written once in Western numerals. `I18N.ar.digits()` in `site.js` derives the Arabic-Indic
rendering at display time, so there is one number to update, not two.
