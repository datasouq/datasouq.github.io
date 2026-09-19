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

   An id carries the country it covers, as its ISO 3166-1 alpha-2 code: `sa-schools`,
   `eg-…`, and `global` where a dataset spans more than one country or none. It is the same
   code the workbook's own datasouq_key carries (DS-SA-SCH-00001), so one dataset is named the
   same way wherever it appears.

   `previousIds` lists what the dataset used to be called. Those URLs were sent to people and
   are in search indexes, so dataset.html still answers to them and corrects the address bar to
   the current id — a link never dies just because we renamed something.
   ========================================================================== */

const DATASETS = [
  {
    id: "sa-contractors",
    previousIds: ["contractors"],
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
    id: "sa-schools",
    previousIds: ["schools"],
    icon: ICONS.graduationCap,

    titleEn: "Schools in Saudi Arabia",
    titleAr: "المدارس في السعودية",
    bodyEn:
      "<strong>A structured dataset of schools across Saudi Arabia</strong>, with their programs, tuition by grade and facilities, delivered in Arabic and English. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمدارس في المملكة</strong>، ببرامجها ورسومها لكل صف ومرافقها، تُسلَّم بالعربية والإنجليزية. تواصل معنا لمعرفة السعر.",

    /* The source delivers 9,032 rows and 2,354 schools: a row is a school-and-
       program, so the headline counts the school. The gap is not the seven
       stage levels it looks like — the largest group holds 144 programs at one
       address, because the source keys on the registered name and files a
       company's branches under it. 2,143 groups hold eight programs or fewer.

       The second metric says "areas", never "regions". The column holds 16
       values and the Kingdom has 13 administrative regions: Jeddah, Taif and
       Al-Ahsa are listed separately here although they sit inside Makkah and
       the Eastern Province. The same trap the healthcare card avoids by saying
       health directorates.

       Two things are deliberately not stated. Websites: 51% of source rows
       carry one but only 36.7% of schools do, because the schools with more
       rows are likelier to have a site — the row figure would flatter it, and
       the school figure is too thin to lead with. Students and fees are the
       source's own numbers, carried across unchanged and never confirmed with
       the schools, so they are in the file but not on the card.

       The fifth metric counts schools running at least one International
       program: 765. National is 1,844 and Tahfeez 59; a school teaching both
       is counted in both, so they add up past 2,354.

       One pairing comes from the source and is carried as it stands: the
       English "National" sits against the Arabic "أهلي", which means private.
       They are not translations of each other. Both are what the source
       supplies for that column, and replacing either would be writing a value
       we were not given. */
    metrics: [
      { icon: ICONS.rows3,         metric: "records",    labelEn: "schools", labelAr: "مدرسة" },
      { icon: ICONS.mapPin,        metric: "cities",     labelEn: "cities across {areas} areas", labelAr: "مدينة في {areas} منطقة" },
      { icon: ICONS.bookOpen,      metric: "programs",   labelEn: "programs across 4 levels", labelAr: "برنامج على ٤ مراحل" },
      { icon: ICONS.phone,         metric: "mobilePct",  labelEn: "carry a mobile number", labelAr: "منها برقم جوال" },
      { icon: ICONS.globe,         metric: "international", labelEn: "teach an international curriculum", labelAr: "مدرسة بمنهج دولي" },
    ],

    seo: {
      anchor: "schools-saudi-arabia",
      alternateName: "المدارس في السعودية",
      description:
        "A structured dataset of 2,354 schools across Saudi Arabia, cleaned and deduplicated, covering 110 cities and 9,032 programs across four stage levels. Every school carries an email and 99.4% carry a mobile number, with tuition by grade, facilities and services on their own sheets. Delivered in Arabic and English.",
      inLanguage: ["ar", "en"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["school name", "area", "city", "stage level", "curriculum", "annual tuition"],
    },
  },

  {
    id: "sa-engineering",
    previousIds: ["engineering"],
    icon: ICONS.draftingCompass,

    titleEn: "Engineering Offices in Saudi Arabia",
    titleAr: "المكاتب الهندسية في السعودية",
    bodyEn:
      "<strong>A structured dataset of engineering offices and consulting firms across Saudi Arabia</strong>, cleaned and deduplicated, delivered in Arabic. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمكاتب الهندسية والشركات الاستشارية في المملكة</strong>، منقّحة وخالية من التكرار، تُسلَّم بالعربية. تواصل معنا لمعرفة السعر.",

    /* The file's only record sheet is Arabic (office_name_ar, region_ar,
       city_ar — no English columns), so unlike the contractors dataset this
       one does not claim delivery in English. Rule 4: one main sheet per
       language the source actually carries, and no invented translation.

       Every figure comes from assets/data/metrics.js now. Before it did, the
       city count here said 133 against a measured 134 — small, wrong, and
       exactly the kind of drift a hand-kept number produces.

       "Classified" counts the offices carrying one of the six grades, not the
       seven values the column holds: غير مصنف is one of them and covers
       37% of the file. The same treatment the contractors card gives its own
       classified share.

       The fifth metric is not from the office sheet: the consulting firms are
       a second entity in the same workbook, keyed DS-SA-CNS against DS-SA-ENG,
       counted separately rather than folded into the office total.

       Phone is deliberately not a metric here. It would read as reachability,
       and the REV 02 rebuild found 176 offices whose number is one digit
       repeated — kept and flagged, never counted as dialable. The share that
       does parse is on the dataset page's coverage chart, where it sits next
       to what it means. */
    metrics: [
      { icon: ICONS.rows3,     metric: "records",       labelEn: "offices", labelAr: "مكتب" },
      { icon: ICONS.mapPin,    metric: "cities",        labelEn: "cities across {regions} regions", labelAr: "مدينة في {regions} منطقة" },
      { icon: ICONS.layers,    metric: "classifiedPct", labelEn: "classified, across 6 grades", labelAr: "مصنّفون على ٦ درجات" },
      { icon: ICONS.mail,      metric: "emailPct",      labelEn: "carry an email", labelAr: "منهم ببريد إلكتروني" },
      { icon: ICONS.briefcase, metric: "consulting",    labelEn: "consulting firms included", labelAr: "شركة استشارية ضمن القاعدة" },
    ],

    seo: {
      anchor: "engineering-offices-saudi-arabia",
      alternateName: "المكاتب الهندسية في السعودية",
      description:
        "A structured dataset of 6,808 engineering offices across Saudi Arabia, cleaned and deduplicated, covering 134 cities in 13 regions, plus 290 consulting firms. 69.1% of records carry an email, and 63% are classified across 6 grades. Delivered in Arabic.",
      inLanguage: ["ar"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["office name", "region", "city", "office classification", "office type"],
    },
  },

  {
    id: "sa-health-facilities",
    previousIds: ["healthcare", "sa-healthcare"],
    icon: ICONS.hospital,

    titleEn: "Health Facilities in Saudi Arabia",
    titleAr: "المنشآت الصحية في السعودية",
    bodyEn:
      "<strong>A structured dataset of health facilities across Saudi Arabia</strong>, from hospitals to primary centres, clinics and laboratories, with map coordinates. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة للمنشآت الصحية في المملكة</strong>، من المستشفيات إلى المراكز الأولية والعيادات والمختبرات، بإحداثيات على الخريطة. تواصل معنا لمعرفة السعر.",

    /* This card used to be called "healthcare" and described these same 4,563
       facilities. The id changed twice — once for the country code, once when
       this became one of three healthcare datasets — and previousIds keeps both
       old links working.

       The second metric says "health directorates", never "regions". There are
       20 of them against the Kingdom's 13, and Jeddah, Taif and Al-Ahsa are
       listed separately although they sit inside Makkah and the Eastern
       Province. The same trap the schools card avoids by saying "areas".

       Phone is stated as the share that PARSES as a Saudi line, not the share
       of non-empty cells. The two are far apart here: 3,019 facilities have
       something in that column and 2,297 of those can be dialled, because the
       source writes an absent value four different ways and 366 cells hold the
       literal string NULL.

       Email is deliberately not a metric: 27.4%. The contractors card set the
       precedent for not leading with a figure that thin. */
    metrics: [
      { icon: ICONS.rows3,  metric: "records",     labelEn: "facilities", labelAr: "منشأة" },
      { icon: ICONS.mapPin, metric: "cities",      labelEn: "cities across {directorates} health directorates", labelAr: "مدينة في {directorates} منطقة صحية" },
      { icon: ICONS.layers, metric: "types",       labelEn: "facility types, from hospitals to clinics", labelAr: "نوع منشأة، من المستشفيات إلى العيادات" },
      { icon: ICONS.phone,  metric: "dialablePct", labelEn: "carry a dialable number", labelAr: "منها برقم صالح للاتصال" },
      { icon: ICONS.globe,  metric: "coordinates", labelEn: "carry map coordinates", labelAr: "منشأة بإحداثيات على الخريطة" },
    ],

    seo: {
      anchor: "health-facilities-saudi-arabia",
      alternateName: "المنشآت الصحية في السعودية",
      description:
        "A structured dataset of 4,563 health facilities across Saudi Arabia, cleaned and deduplicated, covering 328 cities in 20 health directorates and 18 facility types. 3,731 carry map coordinates and 2,297 carry a number that parses as a real Saudi line. Delivered in Arabic, with English facility names.",
      inLanguage: ["ar", "en"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["facility name", "facility type", "health directorate", "city", "phone number", "coordinates"],
    },
  },

  {
    id: "sa-medical-providers",
    icon: ICONS.buildingTwo,

    titleEn: "Medical Providers in Saudi Arabia",
    titleAr: "مقدمو الخدمة الطبية في السعودية",
    bodyEn:
      "<strong>A structured dataset of medical providers appointed to a health-insurance network</strong>, each with its insurance number — hospitals, polyclinics, pharmacies and optical centres. Message us for the price.",
    bodyAr:
      "<strong>قاعدة بيانات منظّمة لمقدمي الخدمة الطبية المعتمدين في شبكة تأمين صحي</strong>، لكل منهم رقم الضمان الصحي — مستشفيات ومجمعات وصيدليات وبصريات. تواصل معنا لمعرفة السعر.",

    /* This is not a second view of the facilities dataset and the card must not
       read like one. Two thirds of it — 2,250 pharmacies and 444 optical
       centres — do not appear in the facility list at all. What makes it its
       own thing is the insurance number: 4,001 of 4,004 rows carry one.

       Not stated: the number a provider publishes is often a chain switchboard.
       The most-shared one reaches 578 providers, so "carries a phone" would
       overstate how many distinct places you can actually reach. The workbook
       flags those rows; the dataset page's coverage chart carries the figure
       next to the sentence that explains it. */
    metrics: [
      { icon: ICONS.rows3,       metric: "records",    labelEn: "providers", labelAr: "مقدم خدمة" },
      { icon: ICONS.layers,      metric: "categories", labelEn: "provider categories", labelAr: "تصنيف مقدم خدمة" },
      { icon: ICONS.mapPin,      metric: "cities",     labelEn: "cities", labelAr: "مدينة" },
      { icon: ICONS.briefcase,   metric: "cchiPct",    labelEn: "carry an insurance number", labelAr: "منهم برقم ضمان صحي" },
      { icon: ICONS.buildingTwo, metric: "pharmacies", labelEn: "pharmacies included", labelAr: "صيدلية ضمن القاعدة" },
    ],

    seo: {
      anchor: "medical-providers-saudi-arabia",
      alternateName: "مقدمو الخدمة الطبية في السعودية",
      description:
        "A structured dataset of 4,004 medical providers appointed to a health-insurance network across Saudi Arabia, covering 160 cities and 11 provider categories. 4,001 carry an insurance number, and 2,250 are pharmacies. Delivered in Arabic and English.",
      inLanguage: ["ar", "en"],
      spatialCoverage: "Saudi Arabia",
      encodingFormat: ["application/vnd.ms-excel", "text/csv"],
      variableMeasured: ["provider name", "provider category", "insurance number", "city", "region", "phone number"],
    },
  },
];
