# Visit Santa Marta (Astro + Leaflet)

A production-ready baseline for the **Visit Santa Marta** touristic website. The experience is static-first and centered on an interactive Leaflet map with a data-driven sidebar, filters, and a polished Place Card panel.

## Highlights

- **Astro + Leaflet** static-first build with client-only map initialization.
- **Single source of truth** (`src/data/places.json`) for markers, lists, filters, and pages.
- **Place Card UX** replaces Leaflet popups with a responsive side panel / bottom sheet.
- **SEO baseline** with dynamic place pages and basic Open Graph metadata.
- **Scalable content structure** for future Markdown or CMS-based content.

## Project Structure

```
.
├── public/
│   ├── images/
│   ├── favicon.svg
│   └── og-placeholder.svg
├── src/
│   ├── components/
│   ├── data/places.json
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── scripts/
│   └── styles/
├── astro.config.mjs
├── package.json
└── README.md
```

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:4321`.

### Build & Preview

```bash
npm run build
npm run preview
```

## How to Add or Edit Places

All places live in `src/data/places.json`. Add a new object with the required fields:

```json
{
  "id": "example-place",
  "name": "Example Place",
  "slug": "example-place",
  "coords": [11.2408, -74.2119],
  "category": "landmark",
  "shortDescription": "Short teaser for the place.",
  "longDescription": "Optional longer description.",
  "image": "/images/place-placeholder.svg",
  "address": "Optional address",
  "website": "https://example.com",
  "tags": ["optional", "tags"],
  "featured": true
}
```

Categories are inferred automatically from the dataset, so new categories will appear in the filters without additional changes.

## Deployment Notes

- This project is static-first and deploys to any static host (Netlify, Vercel static export, GitHub Pages, Cloudflare Pages).
- Use `npm run build` to generate the production output in `dist/`.

## Scripts

- `npm run dev` – start the Astro dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
