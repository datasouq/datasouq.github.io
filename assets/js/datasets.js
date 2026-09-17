/* ==========================================================================
   Dataset catalogue — one entry per card in the "Datasets" section.

   This is the ONLY file to touch when a new dataset is added. site.js reads
   this array to build the catalogue cards, the footer's dataset links and
   the JSON-LD Dataset entries — all three, from one entry, without naming a
   dataset anywhere in its own code. Adding #4 means appending one object
   below, nothing more; the render logic in site.js does not change.

   Icon fields point into assets/js/icons.js — reuse a key that already fits
   the dataset, or add a new one there first.

   Every metric's `value` is written once, in Western numerals ("17,304",
   "31%", "99.5%"). The Arabic-Indic rendering ("١٧٬٣٠٤", "٣١٪", "٩٩٫٥٪") is
   derived from it at render time by I18N.ar.digits() in site.js, so there is
   only one number to update when a file is re-measured. `labelEn`/`labelAr`
   stay independently hand-translated because they are prose, not digits,
   and can reorder entirely between languages — see the contractors dataset's
   second metric below, "cities across 13 regions" against "مدينة في ١٣ منطقة":
   city count and region count swap sides between the two languages.

   A metric names the figure it wants (`metric: "records"`) rather than
   carrying a copy of it; the value comes from assets/data/metrics.js, which
   the build measures from the delivered file. So a new edition updates these
   cards by being built, not by anyone editing this file. Labels may carry
   {placeholders} resolved the same way.

   A metric with a literal `value:` and no `metric:` still renders — that is
   how a dataset whose workbook the pipeline does not build yet keeps working.
   Those figures ARE hand-kept, and the comment above each such entry records
   what was measured and what was deliberately left out.
   ========================================================================== */

const DATASETS = [
  {
    id: "contractors",
    icon: ICONS.hardHat,

    /* Named generically on purpose. The dataset is ours; it is not the
       register of any authority, and the wording must not suggest ownership
       of or affiliation with one. The same applies to every titleEn/titleAr
       below. */
    titleEn: "Contractors in Saudi Arabia",
    titleAr: "المقاولون في السعودية",
    bodyEn:
      "<strong>A structured dataset of contractors across Saudi Arabia</strong>, cleaned and deduplicated, delivered in Arabic and English. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمقاولين في المملكة</strong>، منقّحة وخالية من التكرار، تُسلَّم بالعربية والإنجليزية. تواصل معنا لمعرفة السعر.",

    /* Every figure is measured from the file, not estimated, and re-measured
       against it before each change.

       Two things are deliberately not stated. Phone numbers: the column is
       filled on 33.21% of rows, but only 45% of those parse as a Saudi
       mobile — 111111111, 123456789, 0 and friends make up the rest — so
       14.95% of records carry a number worth dialling, and a metric would
       flatter it. Street addresses: 8.02%.

       Measure against the file a buyer actually receives, never against a
       working copy. The two have diverged before and a metric here went
       stale without anything on the page looking wrong.

       The fifth metric counts membership_type = "Non-Saudi Contractor":
       1,705 rows, 9.49%. Saudi Contractor is 16,167, 19 rows are
       Affiliate-Organization, and 67 carry no membership type.

       The classification metric says 31%, not 7. The column does hold seven
       distinct values, but "Unclassified" is one of them and covers most of
       the file. "7 classification grades" was true as a count of values
       and false as a description of the data: it reads as though every
       record carries a grade when two in three carry none. What is real is
       5,483 classified contractors across the six grades, 30.53%.

       2026-09-12 edition: 17,958 records, up from 17,304. The classified
       share did NOT move with it — 5,483 against 5,398, on a bigger file,
       so the percentage fell from 31.20% to 30.53%. The source column looks
       fuller than that because 2,921 of its values are a literal 0 meaning
       Unclassified; counting those would have read as a 47% jump that never
       happened. Cities rose from 301 to 311. */
    metrics: [
      { icon: ICONS.rows3,  metric: "records",       labelEn: "records", labelAr: "سجل" },
      { icon: ICONS.mapPin, metric: "cities",        labelEn: "cities across {regions} regions", labelAr: "مدينة في {regions} منطقة" },
      { icon: ICONS.layers, metric: "classifiedPct", labelEn: "classified, across 6 grades", labelAr: "مصنّفون على ٦ درجات" },
      { icon: ICONS.mail,   metric: "emailPct",      labelEn: "carry an email", labelAr: "منهم ببريد إلكتروني" },
      { icon: ICONS.globe,  metric: "nonSaudi",      labelEn: "non-Saudi contractors", labelAr: "مقاول غير سعودي" },
    ],

    seo: {
      anchor: "contractors-saudi-arabia",
      alternateName: "المقاولون في السعودية",
      description:
        "A structured dataset of 17,958 contractors across Saudi Arabia, cleaned and deduplicated, covering 311 cities in 13 regions. 99.6% of records carry an email, 31% are classified across 6 grades, and 1,705 are non-Saudi contractors. Delivered in Arabic and English.",
      inLanguage: ["ar", "en"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["company name", "region", "city", "contractor classification", "membership type"],
    },
  },

  {
    id: "engineering",
    icon: ICONS.draftingCompass,

    titleEn: "Engineering Offices in Saudi Arabia",
    titleAr: "المكاتب الهندسية في السعودية",
    bodyEn:
      "<strong>A structured dataset of engineering offices and consulting firms across Saudi Arabia</strong>, cleaned and deduplicated, delivered in Arabic. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمكاتب الهندسية والشركات الاستشارية في المملكة</strong>، منقّحة وخالية من التكرار، تُسلَّم بالعربية. تواصل معنا لمعرفة السعر.",

    /* The file's only record sheet is Arabic (office_name_ar, region_ar,
       city_ar — no English columns), so unlike the contractors dataset this
       one does not claim delivery in English.

       6,808 offices across 133 cities and all 13 regions.
       office_classification holds "غير مصنف" (Unclassified) on 2,549 rows,
       37.44%; the other 4,259, 62.56%, carry one of six grades — rounded to
       63%, the same treatment the contractors card gives its own classified
       share. organization_email is filled on 4,707 rows, 69.14%.

       The fifth metric is not measured from the AR sheet: Consulting_Firms
       is a separate 290-row sheet of consulting firms (record_id prefix
       DS-SA-CNS, against DS-SA-ENG for the offices), bundled into the same
       file rather than folded into the office count. */
    metrics: [
      { icon: ICONS.rows3,     value: "6,808", labelEn: "records", labelAr: "سجل" },
      { icon: ICONS.mapPin,    value: "133",   labelEn: "cities across 13 regions", labelAr: "مدينة في ١٣ منطقة" },
      { icon: ICONS.layers,    value: "63%",   labelEn: "classified, across 6 grades", labelAr: "مصنّفون على ٦ درجات" },
      { icon: ICONS.mail,      value: "69.1%", labelEn: "carry an email", labelAr: "منهم ببريد إلكتروني" },
      { icon: ICONS.briefcase, value: "290",   labelEn: "consulting firms included", labelAr: "شركة استشارية ضمن القاعدة" },
    ],

    seo: {
      anchor: "engineering-offices-saudi-arabia",
      alternateName: "المكاتب الهندسية في السعودية",
      description:
        "A structured dataset of 6,808 engineering offices across Saudi Arabia, cleaned and deduplicated, covering 133 cities in 13 regions, plus 290 consulting firms. 69.1% of records carry an email, and 63% are classified across 6 grades. Delivered in Arabic.",
      inLanguage: ["ar"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["office name", "region", "city", "office classification", "office type"],
    },
  },

  {
    id: "healthcare",
    icon: ICONS.hospital,

    titleEn: "Healthcare Facilities in Saudi Arabia",
    titleAr: "المنشآت الصحية في السعودية",
    bodyEn:
      "<strong>A structured dataset of healthcare facilities across Saudi Arabia</strong>, spanning hospitals, clinics and health centers, cleaned and deduplicated. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمنشآت الصحية في المملكة</strong>، تشمل المستشفيات والعيادات والمراكز الصحية، منقّحة وخالية من التكرار. تواصل معنا لمعرفة السعر.",

    /* The source sheet is titled المنشآت (Facilities), not مستشفيات
       (Hospitals): only 916 of its 4,563 rows, 20.07%, are one of the six
       hospital-labelled facility_type values (MOH, private, military,
       seasonal, university, specialised). The rest are primary health
       centres, clinics, labs, pharmacies and more across 18 distinct types
       — so the card is titled and described for what the file actually
       holds, with the hospital count called out as its own metric rather
       than standing in for the whole dataset.

       region holds MOH health-directorate names, not the Kingdom's 13
       administrative regions — Jeddah and Makkah are two separate entries
       here, for one example — so the label says "health directorates",
       never "regions", to avoid reading as the same geography the other
       two datasets measure.

       organization_email is filled on only 27.44% of rows, which the
       contractors dataset's own precedent says not to state; phone at
       74.51% is the honest contact-rate figure to lead with instead.
       الاسم الإنجليزي (English facility name) is filled on all 4,563 rows,
       but region and city are Arabic-only, so the body promises English
       facility names rather than a full bilingual delivery. */
    metrics: [
      { icon: ICONS.rows3,       value: "4,563", labelEn: "records", labelAr: "سجل" },
      { icon: ICONS.mapPin,      value: "328",   labelEn: "cities across 20 health directorates", labelAr: "مدينة في ٢٠ منطقة صحية" },
      { icon: ICONS.layers,      value: "18",    labelEn: "facility types, from hospitals to clinics", labelAr: "نوع منشأة، من المستشفيات إلى العيادات" },
      { icon: ICONS.phone,       value: "74.5%", labelEn: "carry a phone number", labelAr: "منها برقم هاتف" },
      { icon: ICONS.buildingTwo, value: "916",   labelEn: "hospitals included", labelAr: "مستشفى ضمن القاعدة" },
    ],

    seo: {
      anchor: "healthcare-facilities-saudi-arabia",
      alternateName: "المنشآت الصحية في السعودية",
      description:
        "A structured dataset of 4,563 healthcare facilities across Saudi Arabia, cleaned and deduplicated, covering 328 cities in 20 health directorates and 18 facility types, including 916 hospitals. 74.5% of records carry a phone number. Delivered in Arabic, with English facility names.",
      inLanguage: ["ar", "en"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["facility name", "facility type", "region", "city", "phone number"],
    },
  },
];
