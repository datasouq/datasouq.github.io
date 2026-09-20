/* ==========================================================================
   DataSouq — the dataset page
   صفحة قاعدة البيانات

   dataset.html is one page for every dataset: ?id= picks which. This file
   reads that id, finds the entry in assets/js/datasets.js, loads the
   generated assets/data/<id>.js payload beside it, and writes the header,
   the charts and the data dictionary from the two.

   Nothing here names a dataset. Adding one means adding its entry to
   datasets.js and re-running tools/build_dataset_details.py — this file and
   dataset.html do not change.
   ========================================================================== */

(function () {
  "use strict";

  /* The payload files each assign into this, so it has to exist before the
     first one runs. */
  window.DATASET_DETAILS = window.DATASET_DETAILS || {};

  const BASE = "https://datasouq.github.io/";
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("id");

  /* An id carries its country now — sa-schools, not schools — and the older links were sent to
     people and are in search indexes. `previousIds` on each entry keeps them answering, and the
     address bar is corrected to the current id so the copy someone makes from it is the one we
     want indexed. The language stays exactly as the visitor found it. */
  const dataset =
    DATASETS.find((entry) => entry.id === requested) ||
    DATASETS.find((entry) => (entry.previousIds || []).indexOf(requested) !== -1);

  if (dataset && dataset.id !== requested) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("id", dataset.id);
      window.history.replaceState(null, "", url.toString());
    } catch (e) { /* no history API */ }
  }

  const $ = (id) => document.getElementById(id);

  /* Values are stored once, in Western numerals, exactly as on the landing
     page; the active language's digits() turns them into Arabic-Indic at
     render time. Counts get their thousands separators here rather than in
     the data, so the generated files stay plain numbers. */
  function number(value, t) {
    return t.digits(value.toLocaleString("en-US"));
  }

  function percent(value, t) {
    /* One decimal, and only when it carries something: 74.5% keeps its .5,
       100% does not become 100.0%. */
    const text = Number.isInteger(value) ? String(value) : value.toFixed(1);
    return t.digits(text + "%");
  }

  /* A note is prose with numbers in it, so it cannot go through digits()
     whole: that maps every "." to the Arabic decimal separator, and a note's
     last character is a full stop — "مسجّل." would come out "مسجّل٫". Only
     number tokens are converted, separators included, and the punctuation
     around them is left where it is.

     Notes are generated with Western digits by
     tools/build_dataset_details.py, the same way every other value on the
     site is stored once in Western numerals and converted at render time.
     Arabic-Indic digits already in a note are untouched: \d is ASCII-only. */
  function numbersIn(text, t) {
    return String(text).replace(/\d+(?:[,٬]\d+)*(?:\.\d+)?%?/g, (token) =>
      t.digits(token)
    );
  }

  /* Supabase documents this as a pattern, not an afterthought: "Empty states
     convey the fact that there is nothing to list, perform, or display on
     the current page. Ideally, they also provide a clear action for the user
     to take."

     It is reachable by design. The whole point of the architecture is that a
     dataset appears on the site the moment it is added to datasets.js — so
     between that edit and the next run of the builder, a real page exists
     with no measurements behind it. Without this it rendered two section
     headings promising figures and a data dictionary, with nothing at all
     underneath them. */
  function emptyState(t) {
    return `
      <div class="emptystate">
        <p class="emptystate__title">${escapeHtml(t.detailEmptyTitle)}</p>
        <p class="emptystate__body">${escapeHtml(t.detailEmptyBody)}</p>
        <a class="btn btn--default" data-wa-dataset="${dataset.id}"
           href="https://wa.me/@datasouq" target="_blank" rel="noopener noreferrer"
           >${escapeHtml(t.detailEmptyCta)}</a>
      </div>`;
  }

  /* site.js has this function too, and the copy is deliberate. Sharing it through
     window.DATASOUQ_METRIC looked like the tidier answer and shipped a broken page: the two files
     are cached independently for ten minutes each, so a visitor holding yesterday's site.js and
     today's dataset-page.js read `escape` off an object that did not have it yet, and this page
     drew no charts and no dictionary at all. A six-line pure function with no state and no policy
     in it is cheaper to write twice than a contract that has to survive two caches. What the
     review actually found was that the two copies DISAGREED about whether to escape - that is
     fixed, and both escape. */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------
     Header — the same icon, title, body and five metrics the card shows,
     rebuilt here at page scale rather than card scale.
     ------------------------------------------------------------------ */
  function renderHead(t, lang) {
    const host = $("detail-head");
    if (!host) return;

    const title = lang === "ar" ? dataset.titleAr : dataset.titleEn;
    const body = lang === "ar" ? dataset.bodyAr : dataset.bodyEn;

    const metrics = dataset.metrics
      .map(
        (metric) => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${metric.icon}</svg>
          <span><strong>${t.digits(window.DATASOUQ_METRIC.value(dataset, metric))}</strong> <span>${escapeHtml(
          t.digits(window.DATASOUQ_METRIC.label(dataset, lang === "ar" ? metric.labelAr : metric.labelEn))
        )}</span></span>
        </li>`
      )
      .join("");

    host.innerHTML = `
      <div class="detail__title">
        <div class="card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dataset.icon}</svg>
        </div>
        <h1>${escapeHtml(title)}</h1>
      </div>
      <p class="detail__lead">${body}</p>
      <div class="detail__metrics">
        <ul class="metrics" role="list">${metrics}</ul>
      </div>`;
  }

  /* ------------------------------------------------------------------
     Charts — one horizontal bar per category, scaled to the largest value
     in the chart (counts) or to a fixed 100 (coverage shares).
     ------------------------------------------------------------------ */
  function renderCharts(t, lang) {
    const host = $("detail-charts");
    const details = DATASET_DETAILS[dataset.id];
    if (!host) return;
    if (!details) {
      host.innerHTML = emptyState(t);
      return;
    }

    /* Segment colours come off the ordinal ramp rather than a second
       palette: the steps are already validated, they stay one hue, and the
       key beside them carries the identity so nothing rests on telling two
       greens apart. Spread across the ramp so neighbouring segments are as
       far apart in lightness as the count allows. */
    const segmentFill = (index, count, lastIsNeutral) => {
      if (lastIsNeutral && index === count - 1) return "var(--chart-null)";
      const steps = lastIsNeutral ? count - 1 : count;
      const spread = steps > 1 ? Math.round((index * 5) / (steps - 1)) : 0;
      return "var(--chart-ramp-" + (spread + 1) + ")";
    };

    /* A choropleth of the thirteen regions.

       Colour is the value channel here, which it is nowhere else on this page
       — so the two things that keeps honest are both present: a legend naming
       every band, and the region bar chart beside it carrying each exact
       count. The map answers "where is this concentrated", which a ranked
       list cannot; the list answers "how much exactly", which a shaded area
       cannot.

       Bands are quantiles, not equal slices of the range. Riyadh holds six
       times what the median region does, so an equal-interval scale would
       put one region in the top band and eleven in the bottom, and the map
       would show nothing but where the capital is. The note says which
       method is in use, because the choice changes what the map appears to
       say. */
    const renderMap = (chart) => {
      /* Read as a bare identifier, not off window: assets/data/geo-sa-regions.js
         declares it with `const`, and a top-level const is not a property of
         the global object the way a `var` would be — `window.GEO_SA_REGIONS`
         is undefined even with the file loaded. ICONS and DATASETS are read
         the same way for the same reason. typeof guards the case where the
         file failed to load at all. */
      const geo = typeof GEO_SA_REGIONS !== "undefined" ? GEO_SA_REGIONS : null;
      if (!geo) return "";

      const byIso = {};
      chart.items.forEach((item) => (byIso[item.iso] = item));

      const sorted = chart.items.slice().sort((a, b) => a.value - b.value);
      const bands = 6;
      const bandOf = {};
      const inBand = [];
      sorted.forEach((item, index) => {
        const band = Math.min(bands - 1, Math.floor((index * bands) / sorted.length));
        bandOf[item.iso] = band;
        (inBand[band] = inBand[band] || []).push(item);
      });

      const paths = geo.regions
        .map((region) => {
          const item = byIso[region.iso];
          const fill =
            item === undefined
              ? "var(--chart-null)"
              : "var(--chart-ramp-" + (bandOf[item.iso] + 1) + ")";
          const label = item
            ? (lang === "ar" ? item.labelAr : item.labelEn) + " — " + number(item.value, t)
            : lang === "ar"
            ? region.nameAr
            : region.nameEn;
          return `<path class="map__region" d="${region.d}" style="fill:${fill}"><title>${escapeHtml(
            label
          )}</title></path>`;
        })
        .join("");

      /* One entry per band, reading high to low, each naming the REGIONS in
         that band and their counts rather than the range of values it spans.

         A band label of "729–2,552" asks the reader to hold a number range
         in their head, look at a shade, and match the two. Naming the
         regions removes that step: the shade points at the places, and every
         place carries its own figure — which is rule 6.1, the value printed
         rather than decoded, finally applied to the map as well.

         Grouped by band and not one row per region on purpose. Thirteen rows
         of name-and-count IS the "Records by region" chart sitting beside
         this one, minus the bars; six rows explain the shading without
         becoming a second copy of it.

         What this does NOT fix: the shading still encodes totals, and FT is
         explicit that a choropleth "should always be rates rather than
         totals". Naming the regions defuses most of the harm — nobody has to
         read a magnitude off the colour any more — but the encoding is
         unchanged. Recorded as rule 4.4d rather than left implied. */
      const legend = inBand
        .map((items, band) => {
          const names = items
            .slice()
            .sort((a, b) => b.value - a.value)
            .map(
              (item) =>
                `<span class="map__place">${escapeHtml(
                  lang === "ar" ? item.labelAr : item.labelEn
                )} <b>${number(item.value, t)}</b></span>`
            )
            .join("");
          return `
          <li class="map__key">
            <span class="map__swatch" style="background:var(--chart-ramp-${band + 1})"></span>
            <span class="map__places">${names}</span>
          </li>`;
        })
        .reverse()
        .join("");

      const summary = lang === "ar" ? chart.titleAr : chart.titleEn;
      /* Drawing and legend side by side once there is width for it: the card
         spans both columns, and a centred drawing with empty flanks wastes
         the span it was given. They stack again on a narrow screen. */
      return `
        <div class="map__wrap">
          <svg class="map" viewBox="${geo.viewBox}" role="img" aria-label="${escapeHtml(summary)}">${paths}</svg>
          <ul class="map__legend" role="list">${legend}</ul>
        </div>`;
    };

    /* A dot per location, on the same outline as the choropleth.

       Reached for when the file carries real coordinates rather than an
       administrative name, which the healthcare register does. It is the
       right form twice over: FT's choropleth entry says shading "should
       always be rates rather than totals" and ours are totals, while its
       dot-density entry is for "the location of individual events" — which
       is what a facility is.

       The payload holds viewBox positions, not coordinates: the projection
       and the rounding happen in tools/build_dataset_details.py and one unit
       is 2.14 km, so nothing here could reconstruct an address even if it
       wanted to. Each dot carries how many facilities merged into it, and
       area follows that count — radius is the square root, because the eye
       reads a circle by its area and scaling the radius instead would make a
       cell of 18 look like a cell of 324. */
    const renderDots = (chart) => {
      const geo = typeof GEO_SA_REGIONS !== "undefined" ? GEO_SA_REGIONS : null;
      if (!geo) return "";

      const points = chart.points || [];
      const base = 1.8;
      let biggest = 1;
      for (let i = 2; i < points.length; i += 3) {
        if (points[i] > biggest) biggest = points[i];
      }

      /* The country first, as a quiet ground. Without it the dots float and
         the shape of Saudi Arabia — which is the whole reason a map beats a
         list here — is left for the reader to infer from where the dots
         stop. */
      const ground = geo.regions
        .map((region) => `<path class="dots__ground" d="${region.d}"></path>`)
        .join("");

      const marks = [];
      for (let i = 0; i < points.length; i += 3) {
        const count = points[i + 2];
        marks.push(
          `<circle class="dots__dot" cx="${points[i]}" cy="${points[i + 1]}" r="${(
            base * Math.sqrt(count)
          ).toFixed(1)}"></circle>`
        );
      }

      /* Three sizes, which is what a proportional-symbol key takes: the one
         every single dot is, the top of the range, and a step between. */
      const steps = [1, Math.max(2, Math.round(Math.sqrt(biggest))), biggest]
        .filter((value, index, all) => all.indexOf(value) === index)
        .map((count) => {
          const r = base * Math.sqrt(count);
          const box = base * Math.sqrt(biggest) * 2 + 2;
          return `
            <li class="dots__key">
              <svg class="dots__swatch" viewBox="0 0 ${box} ${box}" aria-hidden="true">
                <circle class="dots__dot" cx="${box / 2}" cy="${box / 2}" r="${r.toFixed(1)}"></circle>
              </svg>
              <span>${t.dotsKey(number(count, t))}</span>
            </li>`;
        })
        .join("");

      const summary = lang === "ar" ? chart.titleAr : chart.titleEn;
      return `
        <div class="map__wrap">
          <svg class="map" viewBox="${geo.viewBox}" role="img" aria-label="${escapeHtml(summary)}">
            <g>${ground}</g><g>${marks.join("")}</g>
          </svg>
          <ul class="map__legend" role="list">${steps}</ul>
        </div>`;
    };

    const renderSplit = (chart) => {
      const items = chart.items;
      /* A "Not recorded" segment is the absence of a value, so it takes the
         neutral rather than a ramp step — same rule the ordinal bars use. */
      const last = items[items.length - 1];
      const lastIsNeutral = /not recorded|not specified|غير مسجَّل|غير محدد/i.test(
        last.labelEn + " " + last.labelAr
      );
      const fill = (index) => segmentFill(index, items.length, lastIsNeutral);

      const bar = items
        .map(
          (item, index) =>
            `<span class="split__seg" style="inline-size:${item.share}%;background:${fill(index)}"></span>`
        )
        .join("");

      const key = items
        .map(
          (item, index) => `
          <li class="split__row">
            <span class="split__swatch" style="background:${fill(index)}"></span>
            <span class="split__name">${escapeHtml(lang === "ar" ? item.labelAr : item.labelEn)}</span>
            <span class="split__share">${percent(item.share, t)}</span>
            <span class="split__count">${number(item.value, t)}</span>
          </li>`
        )
        .join("");

      return `<div class="split">${bar}</div><ul class="split__key" role="list">${key}</ul>`;
    };

    /* One card's markup. The grouping below decides where it lands. */
    const renderChart = (chart) => {
        const coverage = chart.type === "coverage";
        /* Counts scale to the biggest bar in their own chart; shares always
           scale to 100, so a 27% bar reads as 27% of the row and not as
           "the smallest of these four". */
        const ceiling = coverage
          ? 100
          : Math.max.apply(null, chart.items.map((item) => item.value));

        const rows = chart.items
          .map((item) => {
            const label = lang === "ar" ? item.labelAr : item.labelEn;
            const width = ceiling > 0 ? (item.value / ceiling) * 100 : 0;
            const value = coverage ? percent(item.value, t) : number(item.value, t);
            /* An ordered scale paints its rung; everything else is one
               colour, and an off-scale value (step null) is neutral. */
            const fill =
              chart.type === "ordinal"
                ? item.step === null || item.step === undefined
                  ? "var(--chart-null)"
                  : "var(--chart-ramp-" + Math.min(item.step + 1, 6) + ")"
                : "";
            return `
            <li class="chart__row">
              <span class="chart__label">${escapeHtml(label)}</span>
              <span class="chart__track"><span class="chart__bar" style="inline-size:${width.toFixed(
                2
              )}%${fill ? ";background:" + fill : ""}"></span></span>
              <span class="chart__value">${value}</span>
            </li>`;
          })
          .join("");

        const raw = lang === "ar" ? chart.noteAr : chart.noteEn;
        const note = raw ? numbersIn(raw, t) : raw;
        const body =
          chart.type === "split"
            ? renderSplit(chart)
            : chart.type === "map"
            ? renderMap(chart)
            : chart.type === "dots"
            ? renderDots(chart)
            : `<ul class="chart__rows" role="list">${rows}</ul>`;

        /* Three lines, three jobs, and no two of them say the same thing.

           KICKER is the subject, so the page can still be scanned for "the
           region chart" — a page of seven sentences cannot.

           TITLE is the finding. Knaflic: a title carries the message rather
           than naming the subject. It is generated in
           tools/build_dataset_details.py from the same counts the bars are
           drawn from, so it cannot drift from them the way a written-in
           sentence would (rule 8.1).

           METRIC is how much of the file the chart accounts for, which is
           rule 2.3 printed instead of left to be checked. It is the figure
           that differs from card to card: 100% for a chart of everything,
           71% for the ten biggest cities, 31% for the grade ladder. Shape
           follows Supabase's ChartMetric — a value with its label under it. */
        const subject = lang === "ar" ? chart.titleAr : chart.titleEn;
        const rawHeadline = lang === "ar" ? chart.headlineAr : chart.headlineEn;
        const headline = rawHeadline ? numbersIn(rawHeadline, t) : subject;
        const metric = chart.metric;

        return `
        <figure class="chart${coverage ? " chart--coverage" : ""}${
          chart.type === "map" || chart.type === "dots" ? " chart--map" : ""
        }" aria-label="${escapeHtml(subject)}">
          <figcaption class="chart__head">
            <div class="chart__heading">
              ${rawHeadline ? `<p class="chart__kicker">${escapeHtml(subject)}</p>` : ""}
              <h4 class="chart__title">${escapeHtml(headline)}</h4>
            </div>
            ${
              metric
                ? `<p class="chart__metric">
                     <span class="chart__metric-value">${percent(metric.value, t)}</span>
                     <span class="chart__metric-label">${escapeHtml(
                       numbersIn(lang === "ar" ? metric.labelAr : metric.labelEn, t)
                     )}</span>
                   </p>`
                : ""
            }
            ${note ? `<p class="chart__note">${escapeHtml(note)}</p>` : ""}
          </figcaption>
          ${body}
        </figure>`;
    };

    /* Charts are grouped, and the groups are ordered, because seven cards in
       one flow have no hierarchy and nothing to separate them.

       Carbon's dashboard guidance is the source: "Place the most important at
       the top of the page and follow the F-pattern for the remaining
       elements, finishing with the least important information", and white
       space that "either sets elements apart or brings them together to
       distinguish a point's priority". The group and its rank come from the
       payload — tools/build_dataset_details.py decides them, so the ordering
       lives with the data rather than here.

       A group whose charts are all missing renders nothing rather than an
       empty heading: the healthcare dataset has no map, and a dataset added
       later may have no usability charts at all. */
    const groups = [];
    details.charts.forEach((chart) => {
      const key = chart.group || "composition";
      let group = groups.find((entry) => entry.key === key);
      if (!group) groups.push((group = { key: key, charts: [] }));
      group.charts.push(chart);
    });

    /* The heading is an h3 and the cards inside are h4s. As two h3s the
       outline said the group and the charts were siblings, so the grouping a
       sighted reader gets from the gap and the label was simply absent for
       anyone reading the outline. aria-labelledby gives each group a name,
       which is what turns a <section> into a region a screen reader can jump
       between.

       The description under the title is Supabase's pattern, not a flourish:
       "use PageSectionTitle AND PageSectionDescription to label each
       section". Without it the label says "Coverage" and leaves the reader
       to work out what that covers. */
    host.innerHTML = groups
      .map((group) => {
        const id = "chartgroup-" + group.key;
        const note = t.chartGroupNotes && t.chartGroupNotes[group.key];
        return `
        <section class="chartgroup" aria-labelledby="${id}">
          <h3 class="chartgroup__title" id="${id}">${escapeHtml(
            t.chartGroups[group.key] || group.key
          )}</h3>
          ${note ? `<p class="chartgroup__note">${escapeHtml(note)}</p>` : ""}
          <div class="charts">${group.charts.map(renderChart).join("")}</div>
        </section>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------------
     Data dictionary — the file's own column list, verbatim.
     ------------------------------------------------------------------ */
  function renderDictionary(t, lang) {
    const host = $("detail-dictionary");
    const details = DATASET_DETAILS[dataset.id];
    if (!host) return;
    if (!details) {
      host.innerHTML = emptyState(t);
      return;
    }

    const rows = details.dictionary
      .map((field) => {
        const description = lang === "ar" ? field.ar || field.en : field.en || field.ar;
        return `
        <article class="dict__row">
          <span class="dict__field">${escapeHtml(field.column)}</span>
          <div>
            <p class="dict__desc">${escapeHtml(description)}</p>
            ${field.notes ? `<p class="dict__notes">${escapeHtml(field.notes)}</p>` : ""}
          </div>
        </article>`;
      })
      .join("");

    host.innerHTML = `
      <p class="dict__count">${t.fieldCount(t.digits(details.dictionary.length))}</p>
      <div class="dict">
        <div class="dict__head" aria-hidden="true">
          <span>${escapeHtml(t.dictColField)}</span>
          <span>${escapeHtml(t.dictColMeaning)}</span>
        </div>
        ${rows}
      </div>`;
  }

  /* The page's own WhatsApp button, naming this dataset the way the card's
     does. Built here rather than in the markup so it carries the same
     prefilled message site.js gives every other dataset link. */
  function renderCta(t, lang) {
    const host = $("detail-cta");
    if (!host) return;
    host.innerHTML = `
      <a class="btn btn--primary" data-wa-dataset="${dataset.id}" href="https://wa.me/@datasouq"
         target="_blank" rel="noopener noreferrer" tabindex="0">${escapeHtml(t.datasetCta)}</a>`;
  }

  /* ------------------------------------------------------------------
     Page metadata. One HTML file serves every dataset, so the title, the
     description, the canonical and the og: pair are all rewritten for
     whichever one is being shown.
     ------------------------------------------------------------------ */
  function renderMeta(t, lang) {
    const title = lang === "ar" ? dataset.titleAr : dataset.titleEn;
    const pageTitle = title + " — DataSouq";
    document.title = pageTitle;

    const set = (selector, attribute, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attribute, value);
    };
    set('meta[name="description"]', "content", dataset.seo.description);
    set('meta[property="og:title"]', "content", pageTitle);
    set('meta[property="og:description"]', "content", dataset.seo.description);
    set('link[rel="canonical"]', "href", BASE + "dataset.html?id=" + dataset.id);
    set('meta[property="og:url"]', "content", BASE + "dataset.html?id=" + dataset.id);
  }

  /* site.js appends a Dataset entry for every dataset in the catalogue. On
     this page only one of them is the subject, so the others are dropped:
     a crawler reading this URL should come away with markup about the
     dataset it is looking at. */
  function narrowStructuredData() {
    const script = $("ld-json");
    if (!script) return;
    let graph;
    try {
      graph = JSON.parse(script.textContent);
    } catch (e) {
      return;
    }
    const id = BASE + "#" + dataset.seo.anchor;
    graph["@graph"] = graph["@graph"].filter(
      (node) => node["@type"] !== "Dataset" || node["@id"] === id
    );
    script.textContent = JSON.stringify(graph);
  }

  /* A missing or unknown ?id= is a real URL someone can arrive on — a stale
     link, a typo, a dataset that has since been renamed — so it gets a
     designed state and a way back, not an empty page. */
  function renderMissing(t) {
    document.title = t.notFoundTitle + " — DataSouq";
    const head = $("detail-head");
    if (head) {
      head.innerHTML = `
        <div class="detail__missing">
          <h1>${escapeHtml(t.notFoundTitle)}</h1>
          <p>${escapeHtml(t.notFoundBody)}</p>
          <a class="btn btn--primary" href="index.html#datasets" tabindex="0">${escapeHtml(
            t.backToCatalogue
          )}</a>
        </div>`;
    }
    ["figures", "dictionary"].forEach((section) => {
      const node = $(section);
      if (node) node.hidden = true;
    });
    const cta = document.querySelector("#detail-cta");
    if (cta && cta.closest(".section")) cta.closest(".section").hidden = true;
  }

  function render(lang, t) {
    if (!dataset) {
      renderMissing(t);
      return;
    }
    renderMeta(t, lang);
    renderHead(t, lang);
    renderCharts(t, lang);
    renderDictionary(t, lang);
    renderCta(t, lang);
    /* The CTA is rebuilt on every language switch, so its prefilled WhatsApp
       message has to be re-attached after it — site.js writes those hrefs
       before this hook runs. */
    if (typeof window.DATASOUQ_WIRE_WA === "function") window.DATASOUQ_WIRE_WA();
  }

  /* site.js calls this after every language change, and once on load. */
  window.DATASOUQ_RENDER = render;

  function start() {
    if (!dataset) {
      /* site.js has already run its first applyLang by now, so the hook
         above will not fire again on its own. */
      if (window.DATASOUQ_LANG) render(window.DATASOUQ_LANG.lang, window.DATASOUQ_LANG.t);
      return;
    }
    narrowStructuredData();

    /* The payload is fetched per dataset rather than shipped with the page:
       the landing page never needs it, and it grows with the dictionary and
       the charts of every dataset if it were bundled. */
    const script = document.createElement("script");
    script.src = "assets/data/" + dataset.id + ".js";
    script.onload = () => {
      if (window.DATASOUQ_LANG) render(window.DATASOUQ_LANG.lang, window.DATASOUQ_LANG.t);
    };
    script.onerror = () => {
      /* The header and the CTA come from datasets.js and stand without the
         payload, so a failed load costs the charts and the dictionary
         rather than the whole page. */
      if (window.DATASOUQ_LANG) render(window.DATASOUQ_LANG.lang, window.DATASOUQ_LANG.t);
    };
    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
