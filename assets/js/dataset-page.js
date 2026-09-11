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
  const dataset = DATASETS.find((entry) => entry.id === requested);

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
          <span><strong>${t.digits(metric.value)}</strong> <span>${escapeHtml(
          lang === "ar" ? metric.labelAr : metric.labelEn
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
    if (!host || !details) return;

    host.innerHTML = details.charts
      .map((chart) => {
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

        const note = lang === "ar" ? chart.noteAr : chart.noteEn;
        return `
        <figure class="chart${coverage ? " chart--coverage" : ""}">
          <figcaption class="chart__head">
            <h3 class="chart__title">${escapeHtml(lang === "ar" ? chart.titleAr : chart.titleEn)}</h3>
            ${note ? `<p class="chart__note">${escapeHtml(note)}</p>` : ""}
          </figcaption>
          <ul class="chart__rows" role="list">${rows}</ul>
        </figure>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------------
     Data dictionary — the file's own column list, verbatim.
     ------------------------------------------------------------------ */
  function renderDictionary(t, lang) {
    const host = $("detail-dictionary");
    const details = DATASET_DETAILS[dataset.id];
    if (!host || !details) return;

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
      <div class="dict">${rows}</div>`;
  }

  /* The page's own WhatsApp button, naming this dataset the way the card's
     does. Built here rather than in the markup so it carries the same
     prefilled message site.js gives every other dataset link. */
  function renderCta(t, lang) {
    const host = $("detail-cta");
    if (!host) return;
    host.innerHTML = `
      <a class="btn btn--primary" data-wa-dataset="${dataset.id}" href="https://wa.me/@mbi.group"
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
