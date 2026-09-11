# DataSouq · داتا سوق

Source for **https://datasouq.github.io**

---

### Working on this site · العمل على الموقع

Static HTML, CSS and JS — no build step, no dependencies. Open `index.html`,
or serve the folder to test the dataset pages, which read a `?id=` parameter.

Adding a dataset is one file: an entry in `assets/js/datasets.js` gives it a
catalogue card, a footer link, a JSON-LD entry and its own page. To measure
its data dictionary and charts from the delivered Excel file, add a builder in
`tools/build_dataset_details.py` and run it — that also refreshes `sitemap.xml`.

```
python tools/build_dataset_details.py "<folder holding the Excel files>"
```

How a chart gets picked, and where those rules come from, is in
[docs/charts.md](docs/charts.md).

لإضافة قاعدة بيانات: مدخل واحد في `assets/js/datasets.js`، ثم تشغيل السكربت
أعلاه ليقيس القاموس والرسوم من ملف الإكسل المُسلَّم.

---

© DataSouq — All rights reserved.
