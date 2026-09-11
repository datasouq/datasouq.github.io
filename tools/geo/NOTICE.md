# Map data

`sa-admin1.geojson` is the thirteen administrative regions of Saudi Arabia,
extracted from **Natural Earth**'s `ne_10m_admin_1_states_provinces` dataset —
every feature whose country is Saudi Arabia, with only the fields this site
joins on kept (`iso` = ISO 3166-2 code, `name`, `name_ar`).

Natural Earth is **public domain**:

> All versions of Natural Earth raster + vector map data found on this website
> are in the public domain. You may use the maps in any manner, including
> modifying the content and design, electronic dissemination, and offset
> printing. The primary authors, Tom Patterson and Nathaniel Vaughn Kelso, and
> all other contributors renounce all financial claim to the maps and invites
> you to use them for personal, educational, and commercial purposes.
>
> No permission is needed to use Natural Earth. Crediting the authors is
> unnecessary.

— <https://www.naturalearthdata.com/about/terms-of-use/>

Crediting is not required, and the site credits it anyway: the map's own note
reads "Made with Natural Earth."

The file is vendored rather than fetched so that
`tools/build_dataset_details.py` never needs the network. It is the source the
script simplifies and projects into the SVG paths in
`assets/data/geo-sa-regions.js` — edit neither of those by hand; re-run the
script.

To refresh it from upstream:

```
curl -L -o ne.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
# then keep the features whose admin is "Saudi Arabia", with iso/name/name_ar only
```
