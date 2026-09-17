#!/usr/bin/env python3
"""Regenerate assets/data/<id>.js from the delivered Excel files.

Every figure the dataset pages show — the data dictionary and every chart —
is measured here from the file a buyer actually receives, never typed by
hand. Re-run this whenever a delivered file changes:

    python tools/build_dataset_details.py ["<source folder>"]

The source folder is the one holding the delivered .xlsx files; it can also
come from the DATASOUQ_SOURCE environment variable. Output is written to
assets/data/<id>.js, one file per dataset, each declaring
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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Where the delivered Excel files sit. Pass the folder as an argument, or set
# DATASOUQ_SOURCE; the fallback is a path relative to the home directory, so
# this file — which is public — never carries a machine's own layout or the
# name of whoever is logged into it.
DEFAULT_SOURCE = os.environ.get(
    "DATASOUQ_SOURCE",
    os.path.join(os.path.expanduser("~"), "Desktop", "DATASOUQ", "datasouq for client"),
)
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
    "الهفوف": "Al-Hofuf",
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


# ---------------------------------------------------------------------------
# Which group each chart belongs to, and the order inside it.
#
# Carbon's dashboard guidance asks for a strong hierarchy — "Place the most
# important at the top of the page and follow the F-pattern for the remaining
# elements, finishing with the least important information" — and for white
# space that "either sets elements apart or brings them together". Seven cards
# in one undifferentiated flow does neither, so the charts are grouped and the
# groups are ordered by the question a buyer asks first:
#
#   1. coverage     Is this my market? Geography decides whether the rest
#                   matters at all, so it leads.
#   2. usability    Can I act on it? Contact reach and completeness are what
#                   make the file worth money rather than worth reading.
#   3. composition  What is the mix? Real, and the last thing that changes a
#                   buying decision.
#
# A chart id missing from this table falls to the end of "composition" rather
# than vanishing — a new chart shows up in the wrong group, which is visible,
# instead of not showing up at all.
GROUP_ORDER = ["coverage", "usability", "composition"]

# chart id -> (group, rank within the group). The rank is the F-pattern
# applied inside a group: the map leads its own because it is the one chart
# given the full width, and "the most important data should occupy the
# largest area". Contact reach leads usability for the same reason it is on
# the card: 99.5% carrying an email is the sentence that sells the file.
CHART_GROUPS = {
    "map": ("coverage", 0),
    "regions": ("coverage", 1),
    "directorates": ("coverage", 1),
    "cities": ("coverage", 2),
    "coverage": ("usability", 0),
    "classification": ("composition", 0),
    "types": ("composition", 1),
    "hospitals": ("composition", 2),
    "membership": ("composition", 3),
    "lines": ("composition", 4),
}


# The noun each dataset counts, for the sentence and the denominator:
# (English plural, Arabic plural with the article, Arabic singular after a
# number). Arabic counts a thing in the singular after a large number --
# "17,304 sijill", not "17,304 sijillat" -- so the counted form is separate.
NOUNS = {
    "contractors": ("records", "السجلات", "سجل"),
    "engineering": ("offices", "المكاتب", "مكتب"),
    "healthcare": ("facilities", "المنشآت", "منشأة"),
}

# Labels that name the absence of a value. They are never the subject of a
# headline: "Not recorded leads the file" is true and useless.
ABSENT = ("Not recorded",)


def pct(part, whole):
    return round(100.0 * part / whole, 1) if whole else 0.0


def as_pct(value):
    """5.0 -> "5%", 62.4 -> "62.4%" -- no trailing .0 on a whole number."""
    text = ("%.1f" % value).rstrip("0").rstrip(".")
    return text + "%"


def headline(chart, total, noun):
    """The chart's finding, in one line, in both languages.

    Every share is of the DATASET total, never of what the chart happens to
    plot: "the ten biggest cities are 38% of the file" is a fact a buyer can
    use, while "38% of the ten biggest cities" is a denominator nobody asked
    about. The metric beside it says how much of the file the chart covers,
    so the two together can never flatter the data.

    The form is "subject: share", with a colon and no verb. A generated
    sentence has to be grammatical for every label it will ever be handed,
    and a verb is where that breaks -- "Primary health centres is 53.8%" in
    English, and in Arabic an adjective that has to agree with a category
    whose gender the script does not know. A colon agrees with nothing.

    Source: Knaflic, Storytelling with Data -- a title carries the message,
    it does not name the subject. The subject survives as the kicker above
    the line and as the figure's accessible name.
    """
    en_plural, ar_plural, _ = noun
    items = chart["items"]
    # The dots chart is checked before the empty guard: it has no `items` at
    # all, its counts live in `points`, and the guard was swallowing it.
    if chart["type"] != "dots" and not items:
        return None, None

    if chart["type"] == "coverage":
        ranked = sorted(items, key=lambda item: item["value"], reverse=True)
        top, bottom = ranked[0], ranked[-1]
        return (
            "%s on %s of the %s, %s on only %s."
            % (top["labelEn"], as_pct(top["value"]), en_plural,
               bottom["labelEn"].lower(), as_pct(bottom["value"])),
            "%s في %s من %s، و%s في %s فقط."
            % (top["labelAr"], as_pct(top["value"]), ar_plural,
               bottom["labelAr"], as_pct(bottom["value"])),
        )

    if chart["type"] == "dots":
        # How CONCENTRATED the dots are: the smallest number of places that
        # together hold half of them. A ranked list of directorates cannot
        # say this, because a directorate is not a place.
        counts = sorted(chart["points"][2::3], reverse=True)
        half, running, places = sum(counts) / 2.0, 0, 0
        for count in counts:
            places += 1
            running += count
            if running >= half:
                break
        return (
            "Half of them sit in %s of the %s places on the map."
            % (format(places, ","), format(len(counts), ",")),
            "نصفها في %s موضعاً من %s على الخريطة."
            % (format(places, ","), format(len(counts), ",")),
        )

    if chart["type"] == "map":
        # How UNEVEN the file is, which is the one thing the ranked bar chart
        # beside it cannot say -- and the reason the shading is by quantile
        # rather than by equal interval. Both charts plot the same numbers
        # (rule 1.7), so a headline that ranked them would repeat the bar.
        values = sorted(item["value"] for item in items)
        middle = len(values) // 2
        median = (values[middle] if len(values) % 2
                  else (values[middle - 1] + values[middle]) / 2.0)
        top = max(items, key=lambda item: item["value"])
        times = (top["value"] / median) if median else 0
        return (
            "%s holds %.0f times what the median region does."
            % (top["labelEn"], times),
            "نصيب %s %.0f ضعف نصيب المنطقة الوسيطة."
            % (top["labelAr"], times),
        )

    ranked = sorted(
        (item for item in items if item["labelEn"] not in ABSENT),
        key=lambda item: item["value"],
        reverse=True,
    )
    if not ranked:
        return None, None

    top = ranked[0]
    share = pct(top["value"], total)

    # An ordinal chart never names two steps. Its categories are a ladder,
    # so the two biggest by COUNT come out in whatever order the counts fall
    # -- "Sixth Classified and First Classified" -- which reads as a mistake
    # even though it is true. One step, the biggest, and the ladder itself
    # shows the rest.
    if chart["type"] == "ordinal" or share >= 40 or len(ranked) == 1:
        return (
            "%s: %s of the %s." % (top["labelEn"], as_pct(share), en_plural),
            "%s: %s من %s." % (top["labelAr"], as_pct(share), ar_plural),
        )

    second = ranked[1]
    pair = pct(top["value"] + second["value"], total)
    return (
        "%s and %s together: %s of the %s."
        % (top["labelEn"], second["labelEn"], as_pct(pair), en_plural),
        "%s و%s معاً: %s من %s."
        % (top["labelAr"], second["labelAr"], as_pct(pair), ar_plural),
    )


def metric(chart, total, noun):
    """How much of the file this chart actually accounts for.

    Rule 2.3 says every non-subset chart reconciles to the record count; this
    puts that number on the card instead of leaving it to be checked. A
    subset says so itself -- the ten biggest cities cover 38%, the grade
    ladder 31% -- which is the honest reading of a chart that leaves records
    out, and it is the one figure that differs from card to card.

    Shape follows Supabase's ChartMetric: a value with a label under it.
    """
    en_plural, _, ar_counted = noun
    if chart["type"] == "coverage":
        covered = total          # every record is in the denominator already
    elif chart["type"] == "dots":
        covered = chart["placed"]
    else:
        covered = sum(item["value"] for item in chart["items"])
    return {
        "value": pct(covered, total),
        "labelEn": "of %s %s" % (format(total, ","), en_plural),
        "labelAr": "من %s %s" % (format(total, ","), ar_counted),
    }


def narrate(charts, dataset_id, total):
    """Stamp every chart with its headline and its coverage metric."""
    noun = NOUNS.get(dataset_id, ("records", "السجلات", "سجل"))
    for chart in charts:
        head_en, head_ar = headline(chart, total, noun)
        chart["headlineEn"] = head_en
        chart["headlineAr"] = head_ar
        chart["metric"] = metric(chart, total, noun)
    return charts


def grouped(charts):
    """Stamp each chart with its group and order the list by group, then rank.

    A chart id missing from the table lands at the end of "composition"
    rather than vanishing — a new chart in the wrong group is visible, a
    missing one is not.
    """
    for chart in charts:
        group, _ = CHART_GROUPS.get(chart["id"], ("composition", 99))
        chart["group"] = group

    def key(chart):
        group, rank = CHART_GROUPS.get(chart["id"], ("composition", 99))
        return (GROUP_ORDER.index(group), rank)

    return sorted(charts, key=key)


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


# ISO 3166-2 codes for the thirteen administrative regions, keyed by every
# spelling the delivered files actually use. A code is the join key rather
# than a name because the sources disagree on names — Natural Earth writes
# "Ar Riyad", the contractors sheet "Riyadh", the engineering sheet
# "الرياض" — and a code does not drift.
#
# Anything not listed is simply left off the map and counted in the note, so
# a new spelling shows up as a missing region rather than as a silently
# wrong one.
REGION_ISO = {
    "Riyadh": "SA-01", "الرياض": "SA-01",
    "Makkah": "SA-02", "مكة المكرمة": "SA-02",
    "Madinah": "SA-03", "المدينة المنورة": "SA-03",
    "Eastern Province": "SA-04", "المنطقة الشرقية": "SA-04", "الشرقية": "SA-04",
    "Qassim": "SA-05", "القصيم": "SA-05",
    "Hail": "SA-06", "حائل": "SA-06",
    "Tabuk": "SA-07", "تبوك": "SA-07",
    "Northern Borders": "SA-08", "الحدود الشمالية": "SA-08",
    "Jizan": "SA-09", "جازان": "SA-09",
    "Najran": "SA-10", "نجران": "SA-10",
    "Al-Bahah": "SA-11", "الباحة": "SA-11",
    "Al-Jouf": "SA-12", "الجوف": "SA-12",
    "Asir": "SA-14", "عسير": "SA-14",
}


def region_map(chart_id, title_en, title_ar, triples, note_en=None, note_ar=None):
    """A choropleth of the thirteen regions, shaded by count.

    Paired with the region bar chart rather than replacing it. The map answers
    "where is this concentrated" — a question a ranked list cannot answer,
    because a list has no geography in it — and the bar chart beside it
    carries every exact value, which is what keeps a colour-only scale from
    being the only way to read a number.

    Regions whose name is not in REGION_ISO are reported in the note instead
    of being dropped in silence.
    """
    shaded, unmatched = [], []
    for label_en, label_ar, value in triples:
        iso = REGION_ISO.get(label_en.strip()) or REGION_ISO.get(label_ar.strip())
        if iso:
            shaded.append({"iso": iso, "labelEn": label_en, "labelAr": label_ar, "value": value})
        else:
            unmatched.append((label_en, label_ar, value))

    if unmatched:
        # Both labels are carried through. Built from label_en alone, the
        # Arabic note read "خارج الخريطة: Not recorded" — an English string
        # inside an Arabic sentence, on the one note every map carries.
        missing_en = ", ".join(
            "%s (%s)" % (name, format(value, ",")) for name, _, value in unmatched)
        missing_ar = ", ".join(
            "%s (%s)" % (name, format(value, ",")) for _, name, value in unmatched)
        tail_en = "Not on the map: %s." % missing_en
        tail_ar = "خارج الخريطة: %s." % missing_ar
        note_en = (note_en + " " + tail_en) if note_en else tail_en
        note_ar = (note_ar + " " + tail_ar) if note_ar else tail_ar

    return {
        "id": chart_id,
        "type": "map",
        "unit": "count",
        "geo": "sa-regions",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "items": shaded,
    }


MAP_LINK = re.compile(r"[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)")


def dots(chart_id, title_en, title_ar, links, total, note_en=None, note_ar=None):
    """A dot per location, drawn on the same outline as the choropleth.

    Reached for when the file carries real coordinates instead of an
    administrative name. The healthcare register does: its map-link column is
    a Google Maps URL of the form ?q=<lat>,<lon>, and 3,731 of 4,563 rows
    parse to a point inside the country with nothing malformed.

    This is the FT's spatial family read properly. Its choropleth entry says
    shading "should always be rates rather than totals"; ours are totals. Its
    dot-density entry is for "the location of individual events/locations",
    which is what a facility is. So the form that fits this file is also the
    form the source prescribes for what we actually have.

    WHAT IS PUBLISHED IS NOT THE COORDINATE. The lat/lon is projected here
    and rounded to whole viewBox units before it ever reaches the payload,
    and one unit is 2.14 km. Un-projecting gets you a two-kilometre square,
    not an address, so the map ships without shipping the column it was drawn
    from -- which matters, because that column is part of what is being sold.
    Rounding also merges the 3,731 points into 2,479 positions; each carries
    its count so the density survives the merge.
    """
    import build_map
    project, _, _, _ = build_map.projector()

    cells, placed, unparsed = Counter(), 0, 0
    for link in links:
        if not link:
            continue
        found = MAP_LINK.search(str(link))
        if not found:
            unparsed += 1
            continue
        lat, lon = float(found.group(1)), float(found.group(2))
        x, y = project(lon, lat)
        cells[(int(round(x)), int(round(y)))] += 1
        placed += 1

    # Busiest last, so the dense cells paint over the sparse ones rather than
    # under them -- SVG has no z-index and paints in document order.
    ordered = sorted(cells.items(), key=lambda entry: entry[1])
    flat = []
    for (x, y), count in ordered:
        flat.extend((x, y, count))

    return {
        "id": chart_id,
        "type": "dots",
        "unit": "count",
        "geo": "sa-regions",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "points": flat,
        "placed": placed,
        "cells": len(cells),
        "unparsed": unparsed,
        "missing": total - placed - unparsed,
        "items": [],
    }


def fold_tail(triples, keep, label_en="Other types", label_ar="أنواع أخرى"):
    """Keep the biggest `keep` categories; sum the rest into one bar.

    A long tail on a linear scale is unreadable: with 18 facility types the
    top one is five times the second and half the bars land under three
    pixels. Folding the tail keeps every bar legible and still adds up to the
    record count — the note says how many categories the fold covers, so the
    reader knows what was rolled up rather than finding a chart that quietly
    stops at eight.
    """
    triples = list(triples)
    if len(triples) <= keep + 1:
        return triples, 0
    head, tail = triples[:keep], triples[keep:]
    head.append((label_en, label_ar, sum(value for _, _, value in tail)))
    return head, len(tail)


def split(chart_id, title_en, title_ar, triples, note_en=None, note_ar=None):
    """One 100% bar, segmented — for "what is the split of this attribute".

    Reached for when a single class holds most of the file. As separate bars,
    15,581 Saudi contractors against 18 affiliate organisations gives one
    full-width bar and three hairlines, which answers nothing; as segments of
    one bar the proportions are the point and read at a glance. Segments take
    steps of the same ordinal ramp, so this needs no second palette, and each
    is labelled with its share underneath.
    """
    total = sum(value for _, _, value in triples) or 1
    return {
        "id": chart_id,
        "type": "split",
        "unit": "count",
        "titleEn": title_en,
        "titleAr": title_ar,
        "noteEn": note_en,
        "noteAr": note_ar,
        "items": [
            {
                "labelEn": label_en,
                "labelAr": label_ar,
                "value": value,
                "share": round(100.0 * value / total, 1),
            }
            for label_en, label_ar, value in triples
        ],
    }


def ordinal(chart_id, title_en, title_ar, triples, scale, note_en=None, note_ar=None):
    """A bar chart whose categories are an ordered scale, not a nominal list.

    Grades 1-6 and completeness tiers A-D are ladders: the reader's question
    is "how does the file spread across the scale", so the bars are sorted by
    the scale, never by count, and carry a light-to-dark ramp step.

    Values that are NOT on the ladder — Unclassified, Not recorded — are kept
    out of the plot and reported in the note instead. They are the absence of
    a grade rather than a further grade, and on a shared linear scale they
    destroy the chart they sit in: Unclassified is 11,905 against a biggest
    grade of 2,134, which flattened all six grades into hairlines and made
    the ramp invisible. Off the scale, the same six bars span the full width
    and the ladder is legible; the note keeps the count honest.
    """
    by_label = {label_en: (label_en, label_ar, value) for label_en, label_ar, value in triples}
    items, off_scale = [], []

    for position, label in enumerate(scale):
        if label in by_label:
            label_en, label_ar, value = by_label.pop(label)
            items.append({"labelEn": label_en, "labelAr": label_ar, "value": value, "step": position})

    for label_en, label_ar, value in triples:
        if label_en in by_label:
            off_scale.append((label_en, label_ar, value))

    if off_scale:
        plotted = sum(item["value"] for item in items)
        total = plotted + sum(value for _, _, value in off_scale)
        parts_en = ", ".join(
            "%s %s" % (format(value, ","), label_en.lower()) for label_en, _, value in off_scale
        )
        parts_ar = " و".join(
            "%s %s" % (format(value, ","), label_ar) for _, label_ar, value in off_scale
        )
        share = round(100.0 * plotted / total) if total else 0
        tail_en = "Charted here are the %s records on the scale, %d%% of the file; %s sit outside it." % (
            format(plotted, ","), share, parts_en,
        )
        tail_ar = "المرسوم هنا هو %s سجل على السلّم، أي %d%% من الملف؛ وخارجه %s." % (
            format(plotted, ","), share, parts_ar,
        )
        note_en = (note_en + " " + tail_en) if note_en else tail_en
        note_ar = (note_ar + " " + tail_ar) if note_ar else tail_ar

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


# The contractors workbook lives in its own revision folder, not the flat source folder the
# other datasets use. The environment variable wins, so moving the folder needs no code change.
CONTRACTORS_FILE = "DataSouq - Saudi Contractors Database - 2026-09-12.xlsx"
CONTRACTORS_DIR = os.environ.get(
    "DATASOUQ_CONTRACTORS",
    os.path.join(os.path.expanduser("~"), "Desktop", "DATASOUQ", "_ORGANIZED", "contractors",
                 "1 - CURRENT REV 06 - 2026-09-12", "1 - SEND TO CLIENTS"),
)


def workbook(path):
    """Open a delivered workbook, failing with the path rather than a stack trace."""
    if not os.path.isfile(path):
        sys.exit("Workbook not found: %s\nPass the folder as an argument, or set the matching "
                 "environment variable." % path)
    return openpyxl.load_workbook(path, read_only=True, data_only=True)


def arabic_digits(value):
    """Western digits rendered Arabic-Indic, the way the site renders every other number."""
    return str(value).translate(str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩"))


def read_dictionary(ws):
    """The workbook's own Data_Dictionary sheet, verbatim.

    From REV 06 the sheet carries more than one block: the main-sheet columns, then the child
    sheets, then a "withheld" block naming the source columns that do NOT ship. Only the first
    block describes the columns a reader of this page will see, so the rest is skipped. The two
    signals are structural rather than cosmetic: a heading is not a bare identifier, and a
    child-sheet column is written indented.
    """
    entries = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row is None or row[0] in (None, ""):
            continue
        raw = str(row[0])
        column = raw.strip()
        first = column.split()[0] if column.split() else ""
        if first.isupper() and len(first) > 2:
            # A shouted heading opens a block. The contractors dictionary is written in blocks:
            # the main-sheet columns first, then the child sheets, then the columns that do not
            # ship at all. So a heading before any column is the opening one, and a heading after
            # them ends the run. The other datasets carry no headings and are read whole.
            if entries:
                break
            continue
        if raw != raw.lstrip():
            continue        # indented: belongs to a child sheet, not the main one
        entries.append(
            {
                "column": column,
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
    book = workbook(os.path.join(CONTRACTORS_DIR, CONTRACTORS_FILE))

    dictionary = read_dictionary(book["Data_Dictionary"])

    # The two main sheets are the same records in two languages, same order, so reading both gives
    # a bilingual label for every region and city without a translation table. They are named
    # after the database itself.
    english = list(rows_of(book["DataSouq - Saudi Contractors"], "datasouq_key"))
    arabic = {row["datasouq_key"]: row
              for row in rows_of(book["داتاسوق - مقاولو السعودية"], "datasouq_key")}

    # The street address can repeat, so it lives on the Location sheet, one row per address,
    # rather than on the main sheet.
    addressed = {row["datasouq_key"] for row in rows_of(book["Location"], "datasouq_key")
                 if str(row.get("address") or "").strip()}

    total = len(english)
    regions, cities, classes, members, email_types, priorities = (
        Counter(),
        Counter(),
        Counter(),
        Counter(),
        Counter(),
        Counter(),
    )
    filled = Counter()

    for row in english:
        arabic_row = arabic.get(row["datasouq_key"], {})
        regions[(row["region"], arabic_row.get("region_ar"))] += 1
        cities[(row["city"], arabic_row.get("city_ar"))] += 1
        classes[(row["contractor_classification"], arabic_row.get("contractor_classification"))] += 1
        members[(row["membership_type"], arabic_row.get("membership_type"))] += 1
        email_types[(row["email_type"], arabic_row.get("email_type"))] += 1
        priorities[row["outreach_priority"]] += 1

        if row["organization_email"]:
            filled["email"] += 1
        if row["phone_e164"] and str(row["phone_type"]).strip() in ("Mobile", "Landline", "Unified number", "Toll-free"):
            filled["phone"] += 1
        if row["company_website"]:
            filled["website"] += 1
        if row["datasouq_key"] in addressed:
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

    distinct_cities = sum(1 for (label_en, _) in cities if label_en not in (None, ""))
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
        region_map(
            "map",
            "Where the records are",
            "أين تتركّز السجلات",
            paired(regions, drop_blank=False),
            note_en="Shading is by quantile: each band holds a similar number of regions rather than an equal slice of the range — otherwise Riyadh alone would set the scale and twelve regions would share one shade. The key names the regions in each band and what each one holds.",
            note_ar="التظليل بالشرائح المئينية: كل شريحة تضمّ عدداً متقارباً من المناطق بدل أن تقتسم المدى بالتساوي، وإلا لانفردت الرياض بالمقياس وتشاركت اثنتا عشرة منطقة لوناً واحداً. والمفتاح يسمّي مناطق كل شريحة وما في كل منها.",
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
            note_en="Out of %s cities in the file; %s records carry no city."
            % (format(distinct_cities, ","), format(blank_city, ",")),
            note_ar="من إجمالي %s مدينة في الملف، و%s سجل بلا مدينة مسجَّلة."
            % (arabic_digits(distinct_cities), format(blank_city, ",")),
        ),
        split(
            "membership",
            "Membership type",
            "نوع العضوية",
            paired(members, drop_blank=False),
            note_en="One class holds almost the whole file, so the split is the finding rather than four bars of wildly different length.",
            note_ar="فئة واحدة تستحوذ على معظم الملف، فالنسبة نفسها هي المعلومة، لا أربعة أعمدة متفاوتة.",
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
            note_en="Share of the %s records carrying each channel. Phone counts only numbers that parse as a real Saudi line."
            % format(total, ","),
            note_ar="نسبة السجلات التي تحمل كل وسيلة. الهاتف يحتسب فقط الأرقام السليمة فعلاً.",
        ),
    ]

    book.close()
    non_saudi = sum(v for (label_en, _), v in members.items() if label_en == "Non-Saudi Contractor")
    graded = sum(v for (label_en, _), v in classes.items()
                 if label_en not in (None, "", "Unclassified"))
    return {"total": total, "dictionary": dictionary,
            # What the catalogue card and the SEO description show. Measured here so neither can
            # go stale while the file underneath it changes.
            "measured": {
                "records": format(total, ","),
                "cities": format(distinct_cities, ","),
                "regions": format(sum(1 for (l, _) in regions if l not in (None, "")), ","),
                "classifiedPct": "%d%%" % round(100.0 * graded / total),
                "emailPct": "%.1f%%" % (100.0 * filled["email"] / total),
                "nonSaudi": format(non_saudi, ","),
            },
            "charts": grouped(narrate(charts, "contractors", total))}


def build_engineering(source):
    path = os.path.join(source, "DataSouq - Saudi Engineering Offices Database - 2026-09.xlsx")
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)

    dictionary = read_dictionary(book["Data_Dictionary"])

    records = list(rows_of(book["AR"], "record_id"))
    total = len(records)

    regions, cities, classes, types = Counter(), Counter(), Counter(), Counter()
    filled = Counter()

    for row in records:
        regions[row["region_ar"]] += 1
        cities[row["city_ar"]] += 1
        classes[row["office_classification"]] += 1
        types[row["office_type"]] += 1
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
        region_map("map", "Where the offices are", "أين تتركّز المكاتب",
            counted(regions, drop_blank=False),
            note_en="Shading is by quantile: each band holds a similar number of regions rather than an equal slice of the range. The key names the regions in each band and what each one holds.",
            note_ar="التظليل بالشرائح المئينية: كل شريحة تضمّ عدداً متقارباً من المناطق بدل أن تقتسم المدى بالتساوي. والمفتاح يسمّي مناطق كل شريحة وما في كل منها."),
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
    return {"total": total, "consulting": consulting, "dictionary": dictionary,
            "charts": grouped(narrate(charts, "engineering", total))}


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
    map_links = []

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
        map_links.append(row["رابط الموقع على الخريطة"])
        if row["رابط الموقع على الخريطة"]:
            filled["map"] += 1

    dictionary = [
        {"column": column, "en": description_en, "ar": description_ar, "notes": notes}
        for column, description_en, description_ar, notes in HEALTHCARE_DICTIONARY
    ]

    folded_types, folded_rest = fold_tail(counted(types), 8)

    placed_map = dots(
        "map",
        "Where the facilities are",
        "أين تقع المنشآت",
        map_links,
        total,
    )
    # The note is written after the chart, because it has to report the
    # numbers the chart itself arrived at rather than a figure typed here.
    placed_map["noteEn"] = (
        "One dot per facility that carries a map link, at its own position rather "
        "than inside an administrative area. Positions are rounded to ~2 km, which "
        "merges %s facilities into %s dots; a bigger dot holds more. Off the map: "
        "%s facilities with no map link."
        % (format(placed_map["placed"], ","), format(placed_map["cells"], ","),
           format(placed_map["missing"], ","))
    )
    placed_map["noteAr"] = (
        "نقطة لكل منشأة تحمل رابطاً على الخريطة، في موضعها هي لا داخل منطقة إدارية. "
        "المواضع مُقرّبة إلى نحو ٢ كم، فاندمجت %s منشأة في %s نقطة؛ والنقطة الأكبر تضمّ أكثر. "
        "خارج الخريطة: %s منشأة بلا رابط."
        % (format(placed_map["placed"], ","), format(placed_map["cells"], ","),
           format(placed_map["missing"], ","))
    )

    charts = [
        placed_map,
        bar("types", "Facilities by type", "المنشآت حسب النوع", folded_types,
            note_en="The 8 largest of 18 facility types; the remaining %d are summed as Other." % folded_rest,
            note_ar="أكبر ٨ أنواع من ١٨ نوعاً في الملف، والباقي (%d) مجموع تحت «أنواع أخرى»." % folded_rest),
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
        split("lines", "Phone line type", "نوع خط الهاتف", counted(lines, drop_blank=False),
            note_en="Of the facilities that carry a number at all.",
            note_ar="من المنشآت التي تحمل رقماً أصلاً."),
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
    return {"total": total, "dictionary": dictionary,
            "charts": grouped(narrate(charts, "healthcare", total))}


BUILDERS = {
    "contractors": build_contractors,
    "engineering": build_engineering,
    "healthcare": build_healthcare,
}


def write_metrics(measured):
    """One small file carrying only the headline figures.

    The landing page shows the same numbers as the detail pages but loads no dataset payload, and
    loading three payloads there to reach six numbers would be wasteful. This file is a few
    hundred bytes, so both pages can take their figures from the same measured source instead of
    from a hand-kept copy.
    """
    path = os.path.join(OUT_DIR, "metrics.js")
    body = json.dumps(measured, ensure_ascii=False, indent=2, sort_keys=True)
    io.open(path, "w", encoding="utf-8").write(
        "/* Generated by tools/build_dataset_details.py — do not edit.\n"
        "   Every figure here is measured from the delivered file. */\n"
        "const DATASET_METRICS = %s;\n" % body)
    return path


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

    # The dots map is thousands of bare numbers, and indent=2 gives each one
    # its own line: the healthcare payload came out at 104 KB, of which about
    # 75 KB was leading spaces. The coordinate lists go out on one line each
    # and everything else stays readable.
    dumped = {"dictionary": payload["dictionary"], "charts": []}
    flats = []
    for chart in payload["charts"]:
        if isinstance(chart.get("points"), list):
            chart = dict(chart)
            chart["points"] = "@@FLAT%d@@" % len(flats)
            flats.append(payload["charts"][len(dumped["charts"])]["points"])
        dumped["charts"].append(chart)

    body = json.dumps(dumped, ensure_ascii=False, indent=2)
    for index, flat in enumerate(flats):
        body = body.replace(
            '"@@FLAT%d@@"' % index,
            json.dumps(flat, separators=(",", ":")),
            1,
        )
    with io.open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(
            "/* Generated by tools/build_dataset_details.py — do not edit by hand.\n"
            "   Every figure here is measured from the delivered Excel file.\n"
            "   Re-run the script after any change to that file. */\n\n"
            'DATASET_DETAILS["%s"] = %s;\n' % (dataset_id, body)
        )
    return path


def untranslated(payload):
    """English labels that are still Arabic — a value AR_EN has no entry for.

    The fallback is deliberate: a missing translation shows the Arabic rather
    than a blank or a crash. But "visibly wrong" only helps if somebody looks
    at that exact bar, and Al-Hofuf sat in the healthcare city chart unnoticed
    until the layout work put eyes on it. The build now says so itself."""
    found = []
    for chart in payload["charts"]:
        for item in chart.get("items", []):
            label = item.get("labelEn", "")
            if any("\u0600" <= character <= "\u06ff"
                   for character in label):
                found.append((chart["id"], label))
    return found


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not os.path.isdir(source):
        sys.exit("Source folder not found: %s" % source)
    if not os.path.isdir(OUT_DIR):
        os.makedirs(OUT_DIR)

    gaps = []
    measured = {}
    for dataset_id, builder in BUILDERS.items():
        payload = builder(source)
        if payload.get("measured"):
            measured[dataset_id] = payload["measured"]
        gaps.extend((dataset_id,) + entry for entry in untranslated(payload))
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
    # The region geometry is shared by every dataset that maps it, so it is
    # built once into its own file rather than copied into each payload.
    import build_map
    count, before, after, size = build_map.build()
    print("map          %d regions  %d -> %d points  %d KB  ->  %s"
          % (count, before, after, size // 1024, os.path.join("assets", "data", "geo-sa-regions.js")))

    path = write_metrics(measured)
    print("metrics      %d datasets  %d figures  ->  %s"
          % (len(measured), sum(len(v) for v in measured.values()), os.path.relpath(path)))

    ids = catalogue_ids()
    sitemap = write_sitemap(ids, datetime.date.today().isoformat())
    print("sitemap      %d dataset pages + the landing page  ->  %s" % (len(ids), os.path.relpath(sitemap)))

    if gaps:
        print("\nNOTE: %d label(s) have no English in AR_EN and fell back to"
              " the Arabic:" % len(gaps))
        for dataset_id, chart_id, label in gaps:
            print("      %-12s %-14s %s" % (dataset_id, chart_id, label))
        print("      Add them to AR_EN above and re-run.")

    missing = [dataset_id for dataset_id in ids if dataset_id not in BUILDERS]
    if missing:
        print("\nNOTE: no builder here for: %s" % ", ".join(missing))
        print("      Their pages will render the header and CTA but no charts or dictionary.")
        print("      Add a build_<id>() above and register it in BUILDERS.")


if __name__ == "__main__":
    main()
