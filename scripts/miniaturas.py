"""
Makes the light versions of the show photos for Bairrolog.

For every photo in fotos/<show>/, it writes:
  fotos/<show>/_thumbs/<name>.webp   200 px square crop, for the mosaic and sidebars
  fotos/<show>/_web/<name>.webp      up to 1000 px on the long side, for the big photo

The originals are left untouched. Only missing or outdated versions are
(re)made, so it's quick to run again after adding a show:

    python scripts/miniaturas.py

Needs Pillow (pip install pillow).
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / 'fotos'
PHOTO_TYPES = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
THUMB_SIZE = 200
WEB_SIZE = 1000


def is_outdated(target, source):
    return not target.exists() or target.stat().st_mtime < source.stat().st_mtime


def make_versions(photo):
    thumb = photo.parent / '_thumbs' / f'{photo.stem}.webp'
    web = photo.parent / '_web' / f'{photo.stem}.webp'
    if not (is_outdated(thumb, photo) or is_outdated(web, photo)):
        return False

    with Image.open(photo) as image:
        # Phone photos are often stored sideways with a rotation tag; apply it
        image = ImageOps.exif_transpose(image).convert('RGB')

        thumb.parent.mkdir(exist_ok=True)
        ImageOps.fit(image, (THUMB_SIZE, THUMB_SIZE), Image.LANCZOS).save(thumb, 'WEBP', quality=80)

        web.parent.mkdir(exist_ok=True)
        large = image.copy()
        large.thumbnail((WEB_SIZE, WEB_SIZE), Image.LANCZOS)
        large.save(web, 'WEBP', quality=82)
    return True


def main():
    made = 0
    for show in sorted(path for path in ROOT.iterdir() if path.is_dir()):
        for photo in sorted(show.iterdir()):
            if photo.suffix.lower() in PHOTO_TYPES and make_versions(photo):
                made += 1
                print(f'  {photo.relative_to(ROOT)}')
    print(f'{made} foto(s) processada(s).')


if __name__ == '__main__':
    main()
