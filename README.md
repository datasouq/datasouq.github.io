# DataSouq · داتا سوق

We turn raw, messy records into clean, structured datasets you can actually use.

نحوّل السجلات الخام والمبعثرة إلى قواعد بيانات نظيفة وجاهزة للعمل بها.

🔗 **https://datasouq.github.io**

---

### What we do · اللي بنعمله

- **Curated datasets** — ready-made, deduplicated, delivered in Excel or CSV
- **Cleaning & structuring** — messy files in, usable data out
- **Custom requests** — tell us what you need

---

### Datasets · قواعد البيانات

Each one has its own page on the site carrying the complete field list,
what every column holds, and charts counted from the delivered file.
Message us for the price.

كل قاعدة لها صفحة على الموقع فيها قائمة الحقول كاملة، وما يحتويه كل
عمود، ورسوم بيانية محسوبة من الملف المُسلَّم. تواصل معنا لمعرفة السعر.

**Contractors in Saudi Arabia** — a structured dataset of contractors
across the Kingdom, cleaned and deduplicated.

**المقاولون في السعودية** — قاعدة بيانات منظّمة للمقاولين في المملكة،
منقّحة وخالية من التكرار، تُسلَّم بالعربية والإنجليزية.

**Engineering Offices in Saudi Arabia** — a structured dataset of
engineering offices and consulting firms across the Kingdom, cleaned
and deduplicated.

**المكاتب الهندسية في السعودية** — قاعدة بيانات منظّمة للمكاتب
الهندسية والشركات الاستشارية في المملكة، منقّحة وخالية من التكرار،
تُسلَّم بالعربية.

**Healthcare Facilities in Saudi Arabia** — a structured dataset of
healthcare facilities across the Kingdom, spanning hospitals, clinics
and health centers, cleaned and deduplicated.

**المنشآت الصحية في السعودية** — قاعدة بيانات منظّمة للمنشآت الصحية
في المملكة، تشمل المستشفيات والعيادات والمراكز الصحية، منقّحة وخالية
من التكرار.

---

### Building this site · بناء الموقع

Adding a dataset is one file: an entry in `assets/js/datasets.js` gives it a
catalogue card, a footer link, a JSON-LD entry and its own page. To measure
its data dictionary and charts from the delivered Excel file, add a builder in
`tools/build_dataset_details.py` and run it — that also refreshes `sitemap.xml`.

```
python tools/build_dataset_details.py
```

How we pick a chart, and where those rules come from, is in
[docs/charts.md](docs/charts.md).

لإضافة قاعدة بيانات: مدخل واحد في `assets/js/datasets.js`، ثم تشغيل السكربت
أعلاه ليقيس القاموس والرسوم من ملف الإكسل المُسلَّم.

---

### Contact · تواصل

- WhatsApp — [@mbi.group](https://wa.me/@mbi.group)
- Email — [mbi.datasouq@gmail.com](mailto:mbi.datasouq@gmail.com)
- Facebook — [DataSouq.page](https://www.facebook.com/DataSouq.page)
- Instagram — [@datasouq](https://www.instagram.com/datasouq)

---

© DataSouq — All rights reserved.
