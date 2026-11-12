# futeborkut communities

Each folder here is one community, picked up automatically like the profiles
(`import.meta.glob` in `../data/database.js`). The folder name is the
community's **id**.

## Adding a community

1. Create a folder, e.g. `shows-da-banda/`, with a `community.json`:

   ```json
   {
     "cmm": "48210377",
     "name": "Shows da banda",
     "category": "Música",
     "description": "Fotos e relatos dos shows!",
     "members": ["marcio", "yuri", "visitante"]
   }
   ```

2. Optionally add a picture named `image.jpg` (or `.png`, `.gif`, `.webp`),
   or use a CD cover with `"imageFromRelease": "Futebol de Bairro Vol. 1"`.
   Without either, the default community picture is used.

## Members

`members` lists who is in the community, by person id: a profile folder name
(`"marcio"`), `"visitante"` for the visitor, or an id from
`../people/people.json`. The members box shows them in that order, and the
member count is how many there are. A profile's communities are simply the
ones that list it; the visitor's show on their home page.

## community.json

| Field | What it is |
|---|---|
| `cmm` | orkut's community number, used in the page address ("Community.aspx?cmm=..."). Unique per community; made up from the id if missing. |
| `name` | Required. |
| `category`, `description`, `language`, `location`, `created` (`"YYYY-MM-DD"`, year first, optionally with `THH:MM`) | The info list. `description` accepts `[b]`, `[i]`, `[u]`, colour tags, smiley codes and `\n`. |
| `type`, `contentPrivacy`, `forumType` | More of the info list; orkut's usual values are shown when missing. |
| `members` | People ids (see above). |
| `owner`, `moderators` | People ids (a profile folder name, `"visitante"`, or an id from `../people/people.json`). |
| `imageFromRelease` | A release title from the music library whose cover is the picture (when there's no `image.*`). |
| `topics` | The forum: `[{ "title", "messages": [{ "from": "<person id>", "date", "text" }] }]`, oldest message first. |
| `polls` | `[{ "question", "options": [{ "text", "votes" }] }]`. |
