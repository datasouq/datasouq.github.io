/* ==========================================================================
   Lucide icon fragments — shared between the card head icons and the metric
   icons in assets/js/datasets.js.

   Per apps/design-system/content/docs/icons.mdx, stroke attributes
   (fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
   stroke-linejoin="round") live on the wrapping <svg>, not on children —
   site.js sets them once, in the card-rendering code, so they are not
   repeated here. Every icon below uses Lucide's standard 24x24 viewBox,
   which site.js also sets once. Each value here is only the inner markup —
   the <path>/<rect>/<circle> elements, copied unmodified from Lucide.

   Add a new icon here when a new dataset needs one that nothing below
   already fits; reuse an existing key otherwise.
   ========================================================================== */

const ICONS = {
  hardHat: `
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
    <path d="M14 6a6 6 0 0 1 6 6v3"/>
    <path d="M4 15v-3a6 6 0 0 1 6-6"/>
    <rect x="2" y="15" width="20" height="4" rx="1"/>`,

  draftingCompass: `
    <path d="m12.99 6.74 1.93 3.44"/>
    <path d="M19.136 12a10 10 0 0 1-14.271 0"/>
    <path d="m21 21-2.16-3.84"/>
    <path d="m3 21 8.02-14.26"/>
    <circle cx="12" cy="5" r="2"/>`,

  hospital: `
    <path d="M12 7v4"/>
    <path d="M14 21v-3a2 2 0 0 0-4 0v3"/>
    <path d="M14 9h-4"/>
    <path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/>
    <path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/>`,

  rows3: `
    <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 9H3"/><path d="M21 15H3"/>`,

  mapPin: `
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,

  layers: `
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>
    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/>
    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>`,

  mail: `
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>`,

  phone: `
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>`,

  globe: `
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,

  briefcase: `
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>`,

  buildingTwo: `
    <path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/>
    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/>
    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>`,

  graduationCap: `
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
    <path d="M22 10v6"/>
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,

  bookOpen: `
    <path d="M12 7v14"/>
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>`,
};
