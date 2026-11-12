# futeborkut profiles

Each folder here is one band member's profile. The site picks them up
automatically (`import.meta.glob` in `../data/database.js`), so adding a member
is just adding a folder.

## Adding a member

1. Copy `marcio/` to a new folder, e.g. `bruno/`.
2. In `bruno/profile.json`, change at least:
   - `uid`: any long number as a string, unique per profile (orkut used ~20 digits).
   - `name`, and the rest of the content.
3. Optionally add `bruno/photo.jpg` (or `photo.png`). Without it the grey
   silhouette is used.
4. To make band members friends of each other, list them in `friends` by uid:
   `{ "uid": "…", "name": "Bruno" }`. People given only by name (`"Ricardo"` or
   `{ "name": "Ricardo", "friends": 324 }`) have no profile; their links show
   "Este perfil é privado". The visitor account is automatically a friend of
   every member.

## profile.json

| Field | What it is |
|---|---|
| `uid`, `name` | Required. |
| `sex`, `city`, `country`, `status` | Left-column details and the status next to the name. |
| `social`, `professional`, `personal` | The three profile tabs. Keys and their pt-BR labels are in `../data/fields.js`; empty or missing fields are hidden. `social.birthday` is `"YYYY-MM-DD"` (shown as "Março 1", and the age is worked out from it). Text fields accept `[b]`, `[i]`, `[u]`, colour tags like `[red]…[/red]`, smiley codes and `\n`. |
| `ratings` | `trust` / `cool` / `sexy` from 0 to 3 (halves allowed): confiável, legal, sexy. |
| `videoCount` | Number shown in the "vídeos" counter (there is no videos page). |
| `friends` | People (see above). The first 9 show in the "amigos" box, band members first. |
| `fans` | People, shown on the "fãs" page. |
| `communities` | Community names. Known ones (with picture, counts, forum…) live in `../data/communities.js`; unknown names still work with the default picture. |
| `albums` | `{ "title", "description", "fromReleases": ["Futebol de Bairro Vol. 1"], "photos": [{ "file": "show.jpg", "caption": "…" }] }`. `fromReleases` pulls the cover, back cover, disc and booklet from the music library by release title; `photos` are image files in the profile folder. |
| `scraps`, `testimonials` | `{ "from": person, "date": "2026-11-11T22:47", "text": "…" }`. |
| `updates` | `{ "date", "text" }` for the visitor's home page ("Marcio *adicionou novas fotos…*"). |

The visitor account (who is "logged in") is in `../data/visitor.json`.
Scraps the visitor writes are kept in the browser's localStorage.
