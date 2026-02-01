# Visit Santa Marta (Astro + Leaflet)

A production-ready baseline for the **Visit Santa Marta** touristic website. The experience is static-first and centered on an interactive Leaflet map with a data-driven sidebar, filters, and a polished Place Card panel.

## Highlights

- **Astro + Leaflet** static-first build with client-only map initialization.
- **Single source of truth** (`src/data/places.json`) for markers, lists, filters, and pages.
- **Place Card UX** replaces Leaflet popups with a responsive side panel / bottom sheet.
- **Path-prefixed i18n** with explicit user language selection (no redirects).
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

## Internationalization (i18n)

This project uses **path prefixes** for stable, indexable URLs (e.g. `/en`, `/es`) with **no language-based redirects**. The language switcher stores the user choice in `localStorage`, but navigation only changes when a user explicitly selects a language.
The root `/` page is a lightweight language chooser that links into the localized routes.

### How to add a new language

1. Open `src/lib/i18n.js` and add the locale code to `locales` and `localeNames`.
2. Add translations in the `translations` object for all UI keys.
3. Add category translations in `categoryLabels`.
4. Astro will build new static pages under `src/pages/[lang]/...` automatically for the new locale.

### How to translate new UI strings

1. Add a new key to `translations.en` and `translations.es` in `src/lib/i18n.js`.
2. Use `t(lang, 'yourKey')` in Astro components to render the translated string.

### How to add multilingual place descriptions

Place data is language-neutral by default. If you want localized place content, add locale-suffixed fields in `src/data/places.json`, for example:

```json
{
  "name": "Historic Center",
  "name_es": "Centro Histórico",
  "shortDescription": "Colorful streets...",
  "shortDescription_es": "Calles coloridas...",
  "longDescription": "A walkable district...",
  "longDescription_es": "Un distrito caminable..."
}
```

The helper `getPlaceField(place, field, lang)` (in `src/lib/i18n.js`) will pick the localized version when available and fall back to the default field.

## Deployment Notes

- This project is static-first and deploys to any static host (Netlify, Vercel static export, GitHub Pages, Cloudflare Pages).
- Use `npm run build` to generate the production output in `dist/`.

## Scripts

- `npm run dev` – start the Astro dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
