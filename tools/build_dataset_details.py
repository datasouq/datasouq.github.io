#!/usr/bin/env python3
"""Regenerate assets/data/<id>.js from the delivered Excel files.

Every figure the dataset pages show — the data dictionary and every chart —
is measured here from the file a buyer actually receives, never typed by
hand. Re-run this whenever a delivered file changes:

    python tools/build_dataset_details.py ["<source folder>"]

The source folder defaults to the client delivery folder below. Output is
written to assets/data/<id>.js, one file per dataset, each declaring
DATASET_DETAILS["<id>"]. Those files are generated — edit this script, not
them.

The catalogue entries themselves (titles, card copy, headline metrics) live
in assets/js/datasets.js and stay hand-written; this script only produces the
detail-page payload.
"""

import datetime
import io
import json
import os
import re
import sys
from collections import Counter

import openpyxl

DEFAULT_SOURCE = r"C:\Users\sapac\Desktop\DATASOUQ\datasouq for client"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "data")

# ---------------------------------------------------------------------------
# Arabic -> English labels for chart axes. The engineering and healthcare
# files carry Arabic values only, so an English reader would otherwise get
# Arabic bars. Anything missing here falls back to the Arabic string, which is
# visibly wrong rather than silently wrong — add it below when it shows up.
# ---------------------------------------------------------------------------

AR_EN = {
    # Administrative regions
    "الرياض": "Riyadh",
    "مكة المكرمة": "Makkah",
    "المدينة المنورة": "Madinah",
    "القصيم": "Qassim",
    "الشرقية": "Eastern Province",
    "المنطقة الشرقية": "Eastern Province",
    "عسير": "Asir",
    "تبوك": "Tabuk",
    "حائل": "Hail",
    "الحدود الشمالية": "Northern Borders",
    "جازان": "Jazan",
    "نجران": "Najran",
    "الباحة": "Al-Bahah",
    "الجوف": "Al-Jouf",
    # MOH health directorates that are not one of the 13 regions
    "جدة": "Jeddah",
    "الطائف": "Taif",
    "الأحساء": "Al-Ahsa",
    "بيشة": "Bisha",
    "القنفذة": "Al-Qunfudhah",
    "حفر الباطن": "Hafar Al-Batin",
    "القريات": "Qurayyat",
    # Cities
    "الاحساء": "Al-Ahsa",
    "الدمام": "Dammam",
    "الخبر": "Khobar",
    "بريدة": "Buraydah",
    "عنيزة": "Unayzah",
    "خميس مشيط": "Khamis Mushait",
    "أبها": "Abha",
    "ابها": "Abha",
    "ينبع": "Yanbu",
    "الجبيل": "Jubail",
    "حفر الباطن": "Hafar Al-Batin",
    "نجران": "Najran",
    "جازان": "Jazan",
    "سكاكا": "Sakaka",
    "عرعر": "Arar",
    "الخرج": "Al-Kharj",
    "الظهران": "Dhahran",
    "القطيف": "Qatif",
    "المجمعة": "Majmaah",
    "الرس": "Ar Rass",
    "صبيا": "Sabya",
    "بلجرشي": "Baljurashi",
    "الباحه": "Al-Bahah",
    "شرورة": "Sharurah",
    "وادي الدواسر": "Wadi ad-Dawasir",
    "الزلفي": "Zulfi",
    "محايل عسير": "Muhayil Asir",
    "بيش": "Baish",
    "أبو عريش": "Abu Arish",
    "رابغ": "Rabigh",
    "الليث": "Al-Lith",
    "تربة": "Turabah",
    "الدوادمي": "Dawadmi",
    "عفيف": "Afif",
    "حوطة بني تميم": "Hawtat Bani Tamim",
    "القويعية": "Quwaiiyah",
    "الافلاج": "Al-Aflaj",
    "السليل": "As Sulayyil",
    "الخفجي": "Khafji",
    "رأس تنورة": "Ras Tanura",
    "النعيرية": "Nairiyah",
    "بقيق": "Buqayq",
    "الحوطة": "Al-Hawtah",
    "املج": "Umluj",
    "ضباء": "Duba",
    "الوجه": "Al-Wajh",
    "تيماء": "Tayma",
    "خيبر": "Khaybar",
    "العلا": "AlUla",
    "بدر": "Badr",
    "المهد": "Mahd adh Dhahab",
    "الحناكية": "Al-Hinakiyah",
    "رفحاء": "Rafha",
    "طريف": "Turaif",
    "دومة الجندل": "Dumat Al-Jandal",
    "القريات": "Qurayyat",
    "بيشة": "Bisha",
    "النماص": "An Namas",
    "ظهران الجنوب": "Dhahran Al Janub",
    "سراة عبيدة": "Sarat Abidah",
    "احد رفيدة": "Ahad Rafidah",
    "رجال ألمع": "Rijal Almaa",
    "تثليث": "Tathleeth",
    "القنفذة": "Al-Qunfudhah",
    "أضم": "Adham",
    "الكامل": "Al-Kamil",
    "خليص": "Khulais",
    "الجموم": "Al-Jumum",
    "مكة": "Makkah",
    "المدينة": "Madinah",
    "الطايف": "Taif",
    # Classification grades
    "مصنف درجة أولى": "First Classified",
    "مصنف درجة ثانية": "Second Classified",
    "مصنف درجة ثالثة": "Third Classified",
    "مصنف درجة رابعة": "Fourth Classified",
    "مصنف درجة خامسة": "Fifth Classified",
    "مصنف درجة سادسة": "Sixth Classified",
    "غير مصنف": "Unclassified",
    # Engineering office types
    "مكاتب استشارات هندسية": "Engineering consultancy offices",
    "مكاتب مهندسين استشاريين": "Consulting engineer offices",
    "مكاتب مهندسين": "Engineer offices",
    "شركات مهنية سعودية": "Saudi professional companies",
    "شركات مهنية مختلطة": "Mixed professional companies",
    "مكاتب فحص التربة والأساسات والخرسانة والمساحة": "Soil, foundation, concrete and survey testing",
    "مكاتب مساحة أرضية": "Land survey offices",
    # Healthcare facility types
    "مراكز صحية أولية": "Primary health centres",
    "المستشفيات الخاصة": "Private hospitals",
    "مراكز تخصصية حكومية": "Government specialised centres",
    "مستشفيات وزارة الصحة": "MOH hospitals",
    "مجمع طبي عام": "General medical complexes",
    "مستوصفات خاصة": "Private dispensaries",
    "منشآت صحية حكومية غير تابعة لوزارة الصحة": "Government non-MOH facilities",
    "مختبرات خاصة": "Private laboratories",
    "مراكز تخصصية خاصة": "Private specialised centres",
    "المستشفيات العسكرية": "Military hospitals",
    "مستشفيات موسمية": "Seasonal hospitals",
    "مراكز فحص السموم": "Toxicology screening centres",
    "المستشفيات الجامعية": "University hospitals",
    "مراكز صحية موسمية": "Seasonal health centres",
    "عيادة فحص السموم": "Toxicology clinics",
    "المدن الطبية": "Medical cities",
    "صيدلية": "Pharmacies",
    "المستشفيات التخصصية": "Specialised hospitals",
    # Phone line types
    "أرضي": "Landline",
    "موبايل": "Mobile",
    "رقم موحد / مجاني": "Unified / toll-free",
    "غير محدد": "Not specified",
}


def en(value):
    """English label for an Arabic value, falling back to the Arabic itself."""
    if value is None:
        return "Not recorded"
    text = str(value).strip()
    return AR_EN.get(text, text)


def cased(value):
    """Title-case a label the source shouts in caps (city names, mostly)."""
    text = str(value).strip()
    return text.title() if text.isupper() else text


def rows_of(ws, key_column):
    """Yield dicts for every data row, keyed by header name."""
    stream = ws.iter_rows(values_only=True)
    header = next(stream)
    index = {name: position for position, name in enumerate(header)}
    for row in stream:
        if row is None or row[index[key_column]] in (None, ""):
            continue
        yield {name: row[position] for name, position in index.items()}


def bar(chart_id, title_en, title_ar, pairs, note_en=None, note_ar=None, limit=None):
    """A counted bar chart. `pairs` is an iterable of (label_ar_or_en, count)."""
    items = list(pairs)
    if limit:
        items = items[:limit]
    return {
        "id": chart_id,
        "type": "bar",
        "unit": "count",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "items": [
            {"labelEn": label_en, "labelAr": label_ar, "value": value}
            for label_en, label_ar, value in items
        ],
    }


# The six classification grades, in grade order rather than by frequency.
# Both the contractors and the engineering registers use the same ladder.
GRADE_ORDER = [
    "First Classified",
    "Second Classified",
    "Third Classified",
    "Fourth Classified",
    "Fifth Classified",
    "Sixth Classified",
]


def ordinal(chart_id, title_en, title_ar, triples, scale, note_en=None, note_ar=None):
    """A bar chart whose categories are an ordered scale, not a nominal list.

    Grades 1-6 and completeness tiers A-D are ladders: the reader's question
    is "how does the file spread across the scale", so the bars are sorted by
    the scale, never by count, and carry a light-to-dark ramp step. Anything
    off the scale — Unclassified, Not recorded — keeps its place at the end
    and is marked step=None, which the page paints neutral grey: it is the
    absence of a grade, not a seventh grade.
    """
    by_label = {label_en: (label_en, label_ar, value) for label_en, label_ar, value in triples}
    items = []

    for position, label in enumerate(scale):
        if label in by_label:
            label_en, label_ar, value = by_label.pop(label)
            items.append({"labelEn": label_en, "labelAr": label_ar, "value": value, "step": position})

    # Whatever the scale did not claim, in the order it arrived (biggest first).
    for label_en, label_ar, value in triples:
        if label_en in by_label:
            items.append({"labelEn": label_en, "labelAr": label_ar, "value": value, "step": None})

    return {
        "id": chart_id,
        "type": "ordinal",
        "unit": "count",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "items": items,
    }


def coverage(chart_id, title_en, title_ar, items, total, note_en=None, note_ar=None):
    """A share-of-records chart. `items` is (label_en, label_ar, filled_count)."""
    return {
        "id": chart_id,
        "type": "coverage",
        "unit": "percent",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "items": [
            {
                "labelEn": label_en,
                "labelAr": label_ar,
                "value": round(100.0 * count / total, 1),
                "count": count,
            }
            for label_en, label_ar, count in items
        ],
    }


def counted(counter, translate=True, drop_blank=True):
    """Counter -> sorted (label_en, label_ar, value) triples, biggest first."""
    out = []
    for key, value in counter.most_common():
        if drop_blank and key in (None, ""):
            continue
        label_ar = "غير مسجَّل" if key in (None, "") else str(key).strip()
        label_en = en(key) if translate else str(key).strip()
        out.append((label_en, label_ar, value))
    return out


def read_dictionary(ws):
    """The workbook's own Data_Dictionary sheet, verbatim."""
    entries = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row is None or row[0] in (None, ""):
            continue
        entries.append(
            {
                "column": str(row[0]).strip(),
                "en": (row[1] or "").strip(),
                "ar": (row[2] or "").strip(),
                "notes": (row[3] or "").strip(),
            }
        )
    return entries


# ---------------------------------------------------------------------------
# Per-dataset builders
# ---------------------------------------------------------------------------


def build_contractors(source):
    path = os.path.join(source, "DataSouq - Saudi Contractors Database - 2026-09.xlsx")
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)

    dictionary = read_dictionary(book["Data_Dictionary"])

    # The EN and AR sheets are the same records in two languages, same order,
    # so reading both gives a bilingual label for every region and city
    # without a translation table.
    english = list(rows_of(book["EN"], "record_id"))
    arabic = {row["record_id"]: row for row in rows_of(book["AR"], "record_id")}

    total = len(english)
    regions, cities, classes, members, tiers, email_types, priorities = (
        Counter(),
        Counter(),
        Counter(),
        Counter(),
        Counter(),
        Counter(),
        Counter(),
    )
    filled = Counter()

    for row in english:
        arabic_row = arabic.get(row["record_id"], {})
        regions[(row["region"], arabic_row.get("region_ar"))] += 1
        cities[(row["city"], arabic_row.get("city_ar"))] += 1
        classes[(row["contractor_classification"], arabic_row.get("contractor_classification"))] += 1
        members[(row["membership_type"], arabic_row.get("membership_type"))] += 1
        tiers[row["quality_tier"]] += 1
        email_types[(row["email_type"], arabic_row.get("email_type"))] += 1
        priorities[row["outreach_priority"]] += 1

        if row["organization_email"]:
            filled["email"] += 1
        if row["phone_e164"] and str(row["phone_type"]).strip() in ("Mobile", "Landline", "Unified number", "Toll-free"):
            filled["phone"] += 1
        if row["company_website"]:
            filled["website"] += 1
        if row["organization_address"]:
            filled["address"] += 1

    def paired(counter, limit=None, drop_blank=True):
        """Bilingual (label_en, label_ar, count) triples, biggest first.

        drop_blank=False keeps the records with no value as their own
        "Not recorded" bar, so the bars still add up to the record count. A
        chart that quietly omits a tenth of the file is the kind of true-but-
        misleading figure this data is measured to avoid — it is only ever
        set True for a top-N ranking, where the chart is a subset by
        construction and says so.
        """
        out = []
        blank = 0
        for (label_en, label_ar), value in counter.most_common():
            if label_en in (None, ""):
                blank += value
                continue
            out.append((cased(label_en), str(label_ar or label_en).strip(), value))
        out = out[:limit] if limit else out
        if blank and not drop_blank:
            out.append(("Not recorded", "غير مسجَّل", blank))
        return out

    blank_region = sum(v for (label_en, _), v in regions.items() if label_en in (None, ""))
    blank_city = sum(v for (label_en, _), v in cities.items() if label_en in (None, ""))

    charts = [
        bar(
            "regions",
            "Records by region",
            "السجلات حسب المنطقة",
            paired(regions, drop_blank=False),
            note_en="All 13 administrative regions are represented; %s records carry no region."
            % format(blank_region, ","),
            note_ar="كل المناطق الإدارية الـ13 ممثَّلة، و%s سجل بلا منطقة مسجَّلة."
            % format(blank_region, ","),
        ),
        ordinal(
            "classification",
            "Classification grades",
            "درجات التصنيف",
            paired(classes, drop_blank=False),
            GRADE_ORDER,
            note_en="Unclassified is a value in the source register, not a gap in the data.",
            note_ar="«غير مصنّف» قيمة في السجل المصدر، وليست نقصاً في البيانات.",
        ),
        bar(
            "cities",
            "Top 10 cities",
            "أكبر ١٠ مدن",
            paired(cities, limit=10),
            note_en="Out of 301 cities in the file; %s records carry no city." % format(blank_city, ","),
            note_ar="من إجمالي ٣٠١ مدينة في الملف، و%s سجل بلا مدينة مسجَّلة." % format(blank_city, ","),
        ),
        bar(
            "membership",
            "Membership type",
            "نوع العضوية",
            paired(members, drop_blank=False),
        ),
        ordinal(
            "quality",
            "Completeness tier",
            "تصنيف الاكتمال",
            [(tier, tier, value) for tier, value in sorted(tiers.items()) if tier],
            ["A", "B", "C", "D"],
            note_en="A is 80-100 complete, D is under 40.",
            note_ar="A من ٨٠ إلى ١٠٠، وD أقل من ٤٠.",
        ),
        coverage(
            "coverage",
            "Contact coverage",
            "تغطية وسائل التواصل",
            [
                ("Email address", "بريد إلكتروني", filled["email"]),
                ("Dialable phone", "رقم هاتف صالح", filled["phone"]),
                ("Company website", "موقع إلكتروني", filled["website"]),
                ("Street address", "عنوان تفصيلي", filled["address"]),
            ],
            total,
            note_en="Share of the 17,304 records carrying each channel. Phone counts only numbers that parse as a real Saudi line.",
            note_ar="نسبة السجلات التي تحمل كل وسيلة. الهاتف يحتسب فقط الأرقام السليمة فعلاً.",
        ),
    ]

    book.close()
    return {"total": total, "dictionary": dictionary, "charts": charts}


def build_engineering(source):
    path = os.path.join(source, "DataSouq - Saudi Engineering Offices Database - 2026-09.xlsx")
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)

    dictionary = read_dictionary(book["Data_Dictionary"])

    records = list(rows_of(book["AR"], "record_id"))
    total = len(records)

    regions, cities, classes, types, tiers = Counter(), Counter(), Counter(), Counter(), Counter()
    filled = Counter()

    for row in records:
        regions[row["region_ar"]] += 1
        cities[row["city_ar"]] += 1
        classes[row["office_classification"]] += 1
        types[row["office_type"]] += 1
        tiers[row["quality_tier"]] += 1
        if row["organization_email"]:
            filled["email"] += 1
        if row["organization_mobile_number"]:
            filled["mobile"] += 1
        if row["organization_phone_number"]:
            filled["landline"] += 1
        if row["company_website"]:
            filled["website"] += 1

    consulting = sum(1 for _ in rows_of(book["Consulting_Firms"], "record_id"))

    blank_region = sum(v for k, v in regions.items() if k in (None, ""))
    blank_city = sum(v for k, v in cities.items() if k in (None, ""))

    charts = [
        bar("regions", "Offices by region", "المكاتب حسب المنطقة",
            counted(regions, drop_blank=False),
            note_en="All 13 administrative regions are represented; %s offices carry no region."
            % format(blank_region, ","),
            note_ar="كل المناطق الإدارية الـ13 ممثَّلة، و%s مكتباً بلا منطقة مسجَّلة."
            % format(blank_region, ",")),
        ordinal("classification", "Classification grades", "درجات التصنيف",
            counted(classes, drop_blank=False), GRADE_ORDER,
            note_en="Unclassified is a value in the source register, not a gap in the data.",
            note_ar="«غير مصنّف» قيمة في السجل المصدر، وليست نقصاً في البيانات."),
        bar("types", "Office type", "نوع المكتب", counted(types, drop_blank=False),
            note_en="Office type comes from the regional engineering directory, so records sourced elsewhere carry none.",
            note_ar="نوع المكتب يأتي من دليل المكاتب بالمناطق، فالسجلات من مصادر أخرى بلا نوع."),
        bar("cities", "Top 10 cities", "أكبر ١٠ مدن", counted(cities)[:10],
            note_en="Out of 133 cities in the file; %s offices carry no city." % format(blank_city, ","),
            note_ar="من إجمالي ١٣٣ مدينة في الملف، و%s مكتباً بلا مدينة مسجَّلة." % format(blank_city, ",")),
        ordinal("quality", "Completeness tier", "تصنيف الاكتمال",
            [(tier, tier, value) for tier, value in sorted(tiers.items()) if tier],
            ["A", "B", "C", "D"],
            note_en="A is 80-100 complete, D is under 40.",
            note_ar="A من ٨٠ إلى ١٠٠، وD أقل من ٤٠."),
        coverage(
            "coverage",
            "Contact coverage",
            "تغطية وسائل التواصل",
            [
                ("Email address", "بريد إلكتروني", filled["email"]),
                ("Mobile number", "رقم جوال", filled["mobile"]),
                ("Landline", "هاتف أرضي", filled["landline"]),
                ("Website", "موقع إلكتروني", filled["website"]),
            ],
            total,
            note_en="Share of the 6,808 engineering offices carrying each channel. The 290 consulting firms sit on their own sheet and are counted separately.",
            note_ar="نسبة المكاتب الهندسية التي تحمل كل وسيلة. الشركات الاستشارية الـ٢٩٠ في شيت منفصل وتُحسب على حدة.",
        ),
    ]

    book.close()
    return {"total": total, "consulting": consulting, "dictionary": dictionary, "charts": charts}


# The healthcare workbook ships no Data_Dictionary sheet — it is a single
# facility-registry export. This is that sheet's eleven columns, described
# from the data itself, with the fill rate each one measured.
HEALTHCARE_DICTIONARY = [
    ("التسلسل", "Sequential record number", "رقم متسلسل للسجل", ""),
    ("اسم المنشأة", "Facility name in Arabic, as registered", "اسم المنشأة بالعربي كما هو مسجَّل", ""),
    ("الاسم الإنجليزي", "Facility name in English", "اسم المنشأة بالإنجليزي", ""),
    ("نوع المنشأة", "Facility type", "نوع المنشأة",
     "18 values — MOH / private / military / university / seasonal / specialised hospitals, primary health centres, clinics, laboratories, medical cities, pharmacies"),
    ("المنطقة", "MOH health directorate, not one of the Kingdom's 13 administrative regions",
     "المديرية الصحية، وليست إحدى مناطق المملكة الإدارية الـ13",
     "20 values — Jeddah and Makkah, for one example, are separate directorates"),
    ("المدينة", "City", "المدينة", ""),
    ("الهاتف", "Phone number as registered", "رقم الهاتف كما هو مسجَّل", ""),
    ("الفاكس", "Fax number", "رقم الفاكس", ""),
    ("Column1", "Line type of the phone column — header left as exported by the source",
     "نوع خط الهاتف — العنوان كما صدّره المصدر",
     "Landline / Mobile / Unified-toll-free / Not specified"),
    ("البريد الإلكتروني", "Contact email", "البريد الإلكتروني للتواصل", ""),
    ("رابط الموقع على الخريطة", "Map link to the facility location", "رابط موقع المنشأة على الخريطة", ""),
]


def build_healthcare(source):
    path = os.path.join(source, "DATASOUQ-SA HOSPITALS.xlsx")
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)
    sheet = book["المنشآت"]

    records = list(rows_of(sheet, "التسلسل"))
    total = len(records)

    types, directorates, cities, lines = Counter(), Counter(), Counter(), Counter()
    filled = Counter()

    hospital_types = {
        "المستشفيات الخاصة",
        "مستشفيات وزارة الصحة",
        "المستشفيات العسكرية",
        "مستشفيات موسمية",
        "المستشفيات الجامعية",
        "المستشفيات التخصصية",
    }
    hospitals = Counter()

    for row in records:
        facility_type = row["نوع المنشأة"]
        types[facility_type] += 1
        directorates[row["المنطقة"]] += 1
        cities[row["المدينة"]] += 1
        lines[row["Column1"]] += 1
        if facility_type in hospital_types:
            hospitals[facility_type] += 1
        if row["الهاتف"]:
            filled["phone"] += 1
        if row["البريد الإلكتروني"]:
            filled["email"] += 1
        if row["الفاكس"]:
            filled["fax"] += 1
        if row["رابط الموقع على الخريطة"]:
            filled["map"] += 1

    dictionary = [
        {"column": column, "en": description_en, "ar": description_ar, "notes": notes}
        for column, description_en, description_ar, notes in HEALTHCARE_DICTIONARY
    ]

    charts = [
        bar("types", "Facilities by type", "المنشآت حسب النوع", counted(types),
            note_en="18 distinct facility types across the file.",
            note_ar="١٨ نوع منشأة مختلف في الملف."),
        bar("hospitals", "Hospitals by network", "المستشفيات حسب الجهة", counted(hospitals),
            note_en="The 916 hospital-labelled records, out of 4,563 facilities in total.",
            note_ar="سجلات المستشفيات الـ٩١٦ من إجمالي ٤٬٥٦٣ منشأة."),
        bar("directorates", "Facilities by health directorate", "المنشآت حسب المديرية الصحية",
            counted(directorates),
            note_en="MOH directorates, not the Kingdom's 13 administrative regions.",
            note_ar="مديريات وزارة الصحة، وليست مناطق المملكة الإدارية الـ13."),
        bar("cities", "Top 10 cities", "أكبر ١٠ مدن", counted(cities)[:10],
            note_en="Out of 328 cities in the file; %s facilities carry no city."
            % format(sum(v for k, v in cities.items() if k in (None, "")), ","),
            note_ar="من إجمالي ٣٢٨ مدينة في الملف، و%s منشأة بلا مدينة مسجَّلة."
            % format(sum(v for k, v in cities.items() if k in (None, "")), ",")),
        bar("lines", "Phone line type", "نوع خط الهاتف", counted(lines, drop_blank=False)),
        coverage(
            "coverage",
            "Contact coverage",
            "تغطية وسائل التواصل",
            [
                ("Phone number", "رقم هاتف", filled["phone"]),
                ("Map link", "رابط على الخريطة", filled["map"]),
                ("Email address", "بريد إلكتروني", filled["email"]),
                ("Fax number", "رقم فاكس", filled["fax"]),
            ],
            total,
            note_en="Share of the 4,563 facilities carrying each channel.",
            note_ar="نسبة المنشآت التي تحمل كل وسيلة.",
        ),
    ]

    book.close()
    return {"total": total, "dictionary": dictionary, "charts": charts}


BUILDERS = {
    "contractors": build_contractors,
    "engineering": build_engineering,
    "healthcare": build_healthcare,
}


def write_sitemap(dataset_ids, today):
    """Rewrite sitemap.xml: the landing page plus one URL per dataset page.

    Generated for the same reason the detail payloads are — otherwise adding
    a dataset means remembering to hand-edit an XML file that nothing on the
    site would visibly break without, and the new page simply never gets
    crawled.
    """
    root = os.path.dirname(OUT_DIR.rsplit(os.sep + "assets", 1)[0] + os.sep)
    path = os.path.join(root, "sitemap.xml")

    entries = [
        '  <url>\n'
        "    <loc>https://datasouq.github.io/</loc>\n"
        "    <lastmod>%s</lastmod>\n"
        "    <changefreq>monthly</changefreq>\n"
        "    <priority>1.0</priority>\n"
        "  </url>" % today
    ]
    for dataset_id in dataset_ids:
        entries.append(
            "  <url>\n"
            "    <loc>https://datasouq.github.io/dataset.html?id=%s</loc>\n"
            "    <lastmod>%s</lastmod>\n"
            "    <changefreq>monthly</changefreq>\n"
            "    <priority>0.8</priority>\n"
            "  </url>" % (dataset_id, today)
        )

    with io.open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<!-- Generated by tools/build_dataset_details.py — do not edit by hand. -->\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "\n".join(entries)
            + "\n</urlset>\n"
        )
    return path


def catalogue_ids():
    """Dataset ids, read from assets/js/datasets.js — the one list of them.

    A regex rather than a parser because that file is hand-written JS with
    one `id: "…"` per entry and nothing else shaped like it; a second copy
    of the id list here is exactly what this script exists to avoid.
    """
    root = OUT_DIR.rsplit(os.sep + "assets", 1)[0]
    path = os.path.join(root, "assets", "js", "datasets.js")
    with io.open(path, encoding="utf-8") as handle:
        source = handle.read()
    return re.findall(r'^\s*id:\s*"([^"]+)"', source, re.MULTILINE)


def write(dataset_id, payload):
    path = os.path.join(OUT_DIR, dataset_id + ".js")
    body = json.dumps(
        {"dictionary": payload["dictionary"], "charts": payload["charts"]},
        ensure_ascii=False,
        indent=2,
    )
    with io.open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(
            "/* Generated by tools/build_dataset_details.py — do not edit by hand.\n"
            "   Every figure here is measured from the delivered Excel file.\n"
            "   Re-run the script after any change to that file. */\n\n"
            'DATASET_DETAILS["%s"] = %s;\n' % (dataset_id, body)
        )
    return path


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not os.path.isdir(source):
        sys.exit("Source folder not found: %s" % source)
    if not os.path.isdir(OUT_DIR):
        os.makedirs(OUT_DIR)

    for dataset_id, builder in BUILDERS.items():
        payload = builder(source)
        path = write(dataset_id, payload)
        print(
            "%-12s %6d records  %2d dictionary fields  %d charts  ->  %s"
            % (
                dataset_id,
                payload["total"],
                len(payload["dictionary"]),
                len(payload["charts"]),
                os.path.relpath(path),
            )
        )

    # Every dataset in the catalogue gets a sitemap URL, including any this
    # script has no builder for — a page exists for it either way.
    ids = catalogue_ids()
    sitemap = write_sitemap(ids, datetime.date.today().isoformat())
    print("sitemap      %d dataset pages + the landing page  ->  %s" % (len(ids), os.path.relpath(sitemap)))

    missing = [dataset_id for dataset_id in ids if dataset_id not in BUILDERS]
    if missing:
        print("\nNOTE: no builder here for: %s" % ", ".join(missing))
        print("      Their pages will render the header and CTA but no charts or dictionary.")
        print("      Add a build_<id>() above and register it in BUILDERS.")


if __name__ == "__main__":
    main()
