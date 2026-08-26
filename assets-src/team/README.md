Drop the two team photos here as:

  nikhil.jpg
  mousmi.jpg

(.jpeg / .png / .webp also work — the filename before the extension is the slug.)

Then run `npm run assets`. Each is EXIF-rotated, cropped to 4:5 biased toward
the top of the frame, and written to public/media/team/<slug>.webp at 1200px and
600px. src/data/team.ts already points at those paths.
