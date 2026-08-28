/* ==========================================================================
   DataSouq — منطق الواجهة
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     الحالة
     --------------------------------------------------------------------- */
  const state = {
    query: "",
    category: "الكل",
    sort: "featured",
  };

  const el = {
    grid: document.getElementById("product-grid"),
    chips: document.getElementById("category-chips"),
    search: document.getElementById("search-input"),
    sort: document.getElementById("sort-select"),
    count: document.getElementById("results-count"),
    modal: document.getElementById("product-modal"),
    modalBody: document.getElementById("modal-content"),
    themeBtn: document.getElementById("theme-toggle"),
    navToggle: document.getElementById("nav-toggle"),
    navLinks: document.getElementById("nav-links"),
    fab: document.getElementById("wa-fab"),
    heroCta: document.getElementById("hero-wa"),
    ctaBtn: document.getElementById("cta-wa"),
    notice: document.getElementById("config-notice"),
    year: document.getElementById("year"),
    statProducts: document.getElementById("stat-products"),
    statCategories: document.getElementById("stat-categories"),
  };

  /* ---------------------------------------------------------------------
     أدوات مساعدة
     --------------------------------------------------------------------- */

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);
  }

  function pageUrl() {
    return window.location.origin + window.location.pathname;
  }

  function waLinkForProduct(product) {
    return buildWhatsAppUrl(SITE_CONFIG.messageTemplate(product, pageUrl()));
  }

  function priceHtml(product) {
    if (product.price === null || product.price === undefined) {
      return '<span class="price">حسب الطلب</span>';
    }
    if (product.price === 0) {
      return '<span class="price">مجانًا</span>';
    }
    const old = product.oldPrice
      ? `<span class="price__old num">${formatPrice(product.oldPrice)}</span>`
      : "";
    return (
      old +
      `<span class="price num">${formatPrice(product.price)}` +
      `<small>${escapeHtml(SITE_CONFIG.currency)}</small></span>`
    );
  }

  function mediaHtml(product, isModal) {
    if (product.image) {
      return `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">`;
    }
    const cls = isModal ? "" : ' class="card__glyph"';
    return `<span${cls} aria-hidden="true">${escapeHtml(product.glyph || "📦")}</span>`;
  }

  /* ---------------------------------------------------------------------
     الفلترة والترتيب
     --------------------------------------------------------------------- */

  function getVisibleProducts() {
    const q = state.query.trim().toLowerCase();

    let list = PRODUCTS.filter((p) => {
      const matchesCategory =
        state.category === "الكل" || p.category === state.category;
      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = [p.name, p.description, p.category, (p.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    const priceOf = (p) =>
      p.price === null || p.price === undefined ? Number.POSITIVE_INFINITY : p.price;

    switch (state.sort) {
      case "price-asc":
        list = list.slice().sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        list = list.slice().sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "name":
        list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
      default:
        list = list.slice().sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }

  /* ---------------------------------------------------------------------
     العرض
     --------------------------------------------------------------------- */

  function cardHtml(product) {
    const badge = product.badge
      ? `<span class="card__badge">${escapeHtml(product.badge)}</span>`
      : "";

    const tags = (product.tags || [])
      .slice(0, 3)
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");

    return `
      <article class="card reveal" id="${escapeHtml(product.id)}">
        <div class="card__media" data-open="${escapeHtml(product.id)}" role="button"
             tabindex="0" aria-label="تفاصيل ${escapeHtml(product.name)}">
          ${badge}
          ${mediaHtml(product, false)}
        </div>
        <div class="card__body">
          <span class="card__cat">${escapeHtml(product.category)}</span>
          <h3 class="card__title" data-open="${escapeHtml(product.id)}">${escapeHtml(product.name)}</h3>
          <p class="card__desc">${escapeHtml(product.description)}</p>
          <div class="card__tags">${tags}</div>
          <div class="card__foot">
            <div>${priceHtml(product)}</div>
            <div class="card__actions">
              <button class="btn btn--outline" data-open="${escapeHtml(product.id)}">تفاصيل</button>
              <a class="btn btn--wa" href="${escapeHtml(waLinkForProduct(product))}"
                 target="_blank" rel="noopener noreferrer">
                ${waIcon()} اطلب
              </a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function waIcon() {
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.44 9.44 0 0 1-4.8-1.32l-.35-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 0 1-1.44-5.03c0-5.21 4.24-9.45 9.45-9.45 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.76 6.68c0 5.21-4.24 9.46-9.46 9.46zM20.5 3.49A11.36 11.36 0 0 0 12.04 0C5.76 0 .65 5.11.64 11.39c0 2.01.52 3.96 1.52 5.69L.5 24l7.09-1.86a11.35 11.35 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z"/></svg>`;
  }

  function emptyHtml() {
    return `
      <div class="empty">
        <div class="empty__icon">🔍</div>
        <h3>مفيش نتائج مطابقة</h3>
        <p>جرّب كلمة بحث تانية أو اختار تصنيف مختلف.</p>
        <button class="btn btn--default" id="reset-filters">إعادة ضبط الفلاتر</button>
      </div>`;
  }

  function render() {
    const list = getVisibleProducts();

    el.grid.innerHTML = list.length
      ? list.map(cardHtml).join("")
      : emptyHtml();

    el.count.innerHTML = list.length
      ? `<strong class="num">${list.length}</strong> منتج`
      : "لا توجد نتائج";

    const reset = document.getElementById("reset-filters");
    if (reset) reset.addEventListener("click", resetFilters);

    observeReveals();
  }

  function resetFilters() {
    state.query = "";
    state.category = "الكل";
    state.sort = "featured";
    el.search.value = "";
    el.sort.value = "featured";
    renderChips();
    render();
  }

  function renderChips() {
    const all = ["الكل", ...CATEGORIES];
    el.chips.innerHTML = all
      .map((cat) => {
        const active = cat === state.category ? " is-active" : "";
        return `<button class="chip${active}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`;
      })
      .join("");
  }

  /* ---------------------------------------------------------------------
     نافذة تفاصيل المنتج
     --------------------------------------------------------------------- */

  function openModal(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    const specs = Object.entries(product.specs || {})
      .map(
        ([k, v]) =>
          `<div class="spec"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`
      )
      .join("");

    const tags = (product.tags || [])
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");

    el.modalBody.innerHTML = `
      <button class="modal__close" id="modal-close" aria-label="إغلاق">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal__media">${mediaHtml(product, true)}</div>
      <div class="modal__body">
        <span class="card__cat">${escapeHtml(product.category)}</span>
        <h2 id="modal-title">${escapeHtml(product.name)}</h2>
        <p class="desc">${escapeHtml(product.details || product.description)}</p>
        ${specs ? `<dl class="specs">${specs}</dl>` : ""}
        <div class="card__tags" style="margin-bottom:22px">${tags}</div>
        <div class="modal__foot">
          <div style="margin-inline-end:auto">${priceHtml(product)}</div>
          <a class="btn btn--wa btn--lg" href="${escapeHtml(waLinkForProduct(product))}"
             target="_blank" rel="noopener noreferrer">
            ${waIcon()} اطلب عبر واتساب
          </a>
        </div>
      </div>`;

    el.modal.classList.add("is-open");
    el.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
      closeBtn.focus();
    }
  }

  function closeModal() {
    el.modal.classList.remove("is-open");
    el.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  /* ---------------------------------------------------------------------
     الثيم
     --------------------------------------------------------------------- */

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("datasouq-theme");
    } catch (e) {
      /* التخزين مش متاح — نكمّل عادي */
    }

    const prefersLight =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = saved || (prefersLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("datasouq-theme", next);
    } catch (e) {
      /* تجاهل */
    }
  }

  /* ---------------------------------------------------------------------
     أنيميشن الظهور
     --------------------------------------------------------------------- */

  let observer = null;

  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
      );
    }
    document
      .querySelectorAll(".reveal:not(.is-visible)")
      .forEach((n) => observer.observe(n));
  }

  /* ---------------------------------------------------------------------
     التهيئة
     --------------------------------------------------------------------- */

  function initWhatsAppLinks() {
    const url = buildWhatsAppUrl(SITE_CONFIG.generalMessage());
    [el.fab, el.heroCta, el.ctaBtn].forEach((node) => {
      if (node) node.setAttribute("href", url);
    });

    document.querySelectorAll("[data-wa-general]").forEach((node) => {
      node.setAttribute("href", url);
    });
  }

  function initNotice() {
    const isPlaceholder =
      String(SITE_CONFIG.whatsappNumber).replace(/\D/g, "") === "201000000000";
    if (el.notice && SITE_CONFIG.showPlaceholderWarning && isPlaceholder) {
      el.notice.hidden = false;
    }
  }

  function initStats() {
    if (el.statProducts) el.statProducts.textContent = PRODUCTS.length + "+";
    if (el.statCategories) el.statCategories.textContent = CATEGORIES.length;
  }

  function bindEvents() {
    /* البحث */
    let debounce;
    el.search.addEventListener("input", (e) => {
      clearTimeout(debounce);
      const value = e.target.value;
      debounce = setTimeout(() => {
        state.query = value;
        render();
      }, 180);
    });

    /* الترتيب */
    el.sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });

    /* التصنيفات */
    el.chips.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-cat]");
      if (!chip) return;
      state.category = chip.dataset.cat;
      renderChips();
      render();
    });

    /* فتح نافذة المنتج */
    el.grid.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open]");
      if (!trigger) return;
      openModal(trigger.dataset.open);
    });

    el.grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const trigger = e.target.closest("[data-open]");
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger.dataset.open);
    });

    /* إغلاق النافذة */
    el.modal.addEventListener("click", (e) => {
      if (e.target === el.modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.modal.classList.contains("is-open")) closeModal();
    });

    /* الثيم */
    el.themeBtn.addEventListener("click", toggleTheme);

    /* قائمة الموبايل */
    el.navToggle.addEventListener("click", () => {
      const open = el.navLinks.classList.toggle("is-open");
      el.navToggle.setAttribute("aria-expanded", String(open));
    });

    el.navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        el.navLinks.classList.remove("is-open");
        el.navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function openFromHash() {
    const id = window.location.hash.replace("#", "");
    if (id && PRODUCTS.some((p) => p.id === id)) openModal(id);
  }

  function init() {
    initTheme();
    initStats();
    initNotice();
    initWhatsAppLinks();
    renderChips();
    render();
    bindEvents();
    observeReveals();
    openFromHash();
    if (el.year) el.year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
