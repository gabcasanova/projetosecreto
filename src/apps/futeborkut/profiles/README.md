# futeborkut profiles

Each folder here is one band member's profile. The site picks them up
automatically (`import.meta.glob` in `../data/database.js`), so adding a member
is just adding a folder.

## People and ids

Everywhere the data mentions a person (fans, who wrote a testimonial, a
community's owner, moderators, members, forum posts), it uses their **id**:

- a band member's id is their **folder name** here, e.g. `"marcio"`;
- `"visitante"` is the visitor (the account that is "logged in", in
  `../data/visitor.json`);
- everyone else (fans, testimonial authors...) is in `../people/people.json`:

  ```json
  {
    "juliana": { "name": "Juliana", "friends": 512 },
    "dona-cida": { "name": "Dona Cida" }
  }
  ```

  `friends` is the count shown as "Juliana (512)"; leave it out and a number is
  made up. A photo is optional: put it in `../people/` named after the id, e.g.
  `../people/juliana.jpg` (`.jpg`, `.jpeg`, `.png`, `.gif` or `.webp`). Without
  one the grey silhouette is used. People without a profile open an
  "Este perfil é privado" page.

An id that is in neither place still shows (under the id itself), and the
browser console warns about it, so typos are easy to find.

## Adding a member

1. Copy `marcio/` to a new folder, e.g. `bruno/`. The folder name is Bruno's id.
2. In `bruno/profile.json`, change at least:
   - `uid`: any long number as a string, unique per profile (orkut used ~20
     digits). It only appears in the page addresses ("Profile.aspx?uid=...").
   - `name`, and the rest of the content.
3. Optionally add `bruno/photo.jpg` (or `photo.png`). Without it the grey
   silhouette is used.

The visitor's friends are the band members, automatically. Band members'
profiles don't show friends or communities (only the visitor's own pages do),
so a member only has a friend count, for captions like "Marcio (15)".

If someone in `people.json` becomes a band member, remove them from there and
give their folder the same id, so every mention of them now links to the profile.

## profile.json

| Field | What it is |
|---|---|
| `uid`, `name` | Required. |
| `sex`, `city`, `country`, `status` | Left-column details and the status next to the name. |
| `instagram` | Optional. The handle (`"itsmarcxii"` or `"@itsmarcxii"`) or the full profile URL. Shows a big Instagram button under the name, on every page about the member, that opens the real profile in a new tab. |
| `social`, `professional`, `personal` | The three profile tabs. Keys and their pt-BR labels are in `../data/fields.js`; empty or missing fields are hidden. `social.birthday` is `"YYYY-MM-DD"` (shown as "Março 1", and the age is worked out from it). Text fields accept `[b]`, `[i]`, `[u]`, colour tags like `[red]…[/red]`, smiley codes and `\n`. |
| `ratings` | `trust` / `cool` / `sexy` from 0 to 3 (halves allowed): confiável, legal, sexy. |
| `videoCount` | Number shown in the "vídeos" counter (there is no videos page). |
| `friends` | A number: how many friends the member has, shown next to their name ("Marcio (15)"). Made up if missing. |
| `fans` | Ids of people, shown on the "fãs" page. |
| `albums` | `{ "title", "description", "fromReleases": ["Futebol de Bairro Vol. 1"], "photos": [{ "file": "show.jpg", "caption": "…" }] }`. `fromReleases` pulls the cover, back cover, disc and booklet from the music library by release title; `photos` are image files in the profile folder. |
| `testimonials` | The depoimentos, written only here (visitors can't write anything on the site): `{ "from": "juliana", "date": "2026-11-11T22:47", "text": "…" }`. |
| `updates` | `{ "date", "text" }` for the visitor's home page ("Marcio *adicionou novas fotos…*"). |
