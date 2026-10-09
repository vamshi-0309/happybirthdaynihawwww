# Happy Birthday Nihawww ♡

A romantic, mobile-friendly birthday website. Pure HTML + CSS + JS — no build step.

## Folder structure

```
nihawww-birthday/
├── index.html
├── style.css
├── script.js
├── images/          <- put her photos here
└── README.md
```

## 1. Add your photos

Put your pictures inside the `images/` folder, then open `index.html` and fill each empty `src=""`:

| Spot | Find in index.html | Example |
|------|--------------------|---------|
| Diary polaroid | `photo1` | `src="images/photo1.jpg"` |
| Envelope photo | `photo2` | `src="images/photo2.jpg"` |
| Taped polaroid | `photo3` | `src="images/photo3.jpg"` |
| Photobooth strip (5 frames) | `booth1` … `booth5` | `src="images/booth1.jpg"` |
| Music stamp polaroid | `photo4` | `src="images/photo4.jpg"` |

Tip: use portrait photos (4:5) for polaroids; compress them (under 300 KB each) so the site loads fast on mobile.

## 2. Add your song (optional)

Put an mp3 in the project folder, e.g. `images/song.mp3`, then in `index.html` change:

```html
<audio id="song" src="images/song.mp3" loop preload="none"></audio>
```

She taps the cassette to play / pause.

## 3. Edit your words

All messages are plain text inside `index.html`. Change the age (`id="age"`, default 20) and any message you like.

## 4. Deploy (GitHub + Vercel)

1. Create a new GitHub repo and upload all files (keep the `images` folder).
2. Go to vercel.com, click **Add New → Project**, import the repo.
3. Framework Preset: **Other**. Leave build command and output directory empty. Click **Deploy**.
4. Share the Vercel link with her.
