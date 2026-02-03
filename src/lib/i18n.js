export const locales = ['en', 'es'];

export const defaultLocale = 'en';

export const localeNames = {
  en: 'English',
  es: 'Español',
};

export const translations = {
  en: {
    siteName: 'Visit Santa Marta',
    navMap: 'Map',
    navPlaces: 'Places',
    navNews: 'News',
    languageLabel: 'Language',
    mapPageTitle: 'Visit Santa Marta | Interactive Map',
    mapPageDescription: 'Plan your Santa Marta trip with filters, featured highlights, and detailed place cards.',
    mapHeading: 'Visit Santa Marta',
    mapIntro: 'Discover landmarks, food, nightlife, transport hubs, and parks around the city.',
    filtersTitle: 'Filters',
    featuredTitle: 'Featured',
    placesTitle: 'Places',
    viewDetails: 'View details',
    placeCardTitle: 'Place',
    placeCardCategory: 'Category',
    close: 'Close',
    openMaps: 'Open in Google Maps',
    visitWebsite: 'Visit website',
    bookBuy: 'Book / Buy',
    placePhotoAlt: 'Photo of {name}',
    placesPageTitle: 'Places',
    placesPageDescription: 'Browse all Santa Marta places and plan your next stop.',
    backToPlaces: '← Back to places',
    addressLabel: 'Address:',
    newsPageTitle: 'News',
    newsPageDescription: 'Latest updates and travel notes for Santa Marta.',
    newsHeading: 'News',
    newsBody: 'Coming soon. This space will host updates, seasonal tips, and local announcements.',
    languageLandingTitle: 'Choose your language',
    languageLandingDescription: 'Select a language to explore the interactive map and curated places.',
    languageLandingHint: 'Your selection is saved for future visits.',
    footerNotice:
      'A Local Atlas city guide. Verify details locally before visiting. Contact: info@visitsantamarta.com',
  },
  es: {
    siteName: 'Visita Santa Marta',
    navMap: 'Mapa',
    navPlaces: 'Lugares',
    navNews: 'Noticias',
    languageLabel: 'Idioma',
    mapPageTitle: 'Visita Santa Marta | Mapa interactivo',
    mapPageDescription: 'Planifica tu viaje a Santa Marta con filtros, destacados y tarjetas detalladas.',
    mapHeading: 'Visita Santa Marta',
    mapIntro:
      'Descubre sitios emblemáticos, gastronomía, vida nocturna, transporte y parques en la ciudad.',
    filtersTitle: 'Filtros',
    featuredTitle: 'Destacados',
    placesTitle: 'Lugares',
    viewDetails: 'Ver detalles',
    placeCardTitle: 'Lugar',
    placeCardCategory: 'Categoría',
    close: 'Cerrar',
    openMaps: 'Abrir en Google Maps',
    visitWebsite: 'Visitar sitio web',
    bookBuy: 'Reservar / Comprar',
    placePhotoAlt: 'Foto de {name}',
    placesPageTitle: 'Lugares',
    placesPageDescription: 'Explora todos los lugares de Santa Marta y planifica tu próxima parada.',
    backToPlaces: '← Volver a lugares',
    addressLabel: 'Dirección:',
    newsPageTitle: 'Noticias',
    newsPageDescription: 'Actualizaciones y notas de viaje para Santa Marta.',
    newsHeading: 'Noticias',
    newsBody:
      'Próximamente. Este espacio tendrá novedades, consejos de temporada y anuncios locales.',
    languageLandingTitle: 'Elige tu idioma',
    languageLandingDescription: 'Selecciona un idioma para explorar el mapa interactivo y los lugares destacados.',
    languageLandingHint: 'Guardamos tu selección para futuras visitas.',
    footerNotice:
      'Una guía de Local Atlas. Verifica la información localmente antes de visitar. Contacto: info@visitsantamarta.com',
  },
};

export const categoryLabels = {
  en: {
    landmark: 'Landmarks',
    food: 'Food',
    nightlife: 'Nightlife',
    transport: 'Transport',
    park: 'Parks',
  },
  es: {
    landmark: 'Lugares emblemáticos',
    food: 'Gastronomía',
    nightlife: 'Vida nocturna',
    transport: 'Transporte',
    park: 'Parques',
  },
};

export const getLocaleFromParams = (params = {}) =>
  locales.includes(params.lang) ? params.lang : defaultLocale;

export const normalizePath = (path = '/') => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

export const stripLangFromPath = (path = '/') => {
  const normalized = normalizePath(path);
  const match = normalized.match(/^\/(\w{2})(?:\/|$)/);
  if (!match) return normalized;
  const lang = match[1];
  if (!locales.includes(lang)) return normalized;
  const rest = normalized.replace(`/${lang}`, '');
  return rest === '' ? '/' : rest;
};

export const buildLocalizedPath = (lang, path = '/') => {
  const normalized = stripLangFromPath(path);
  const suffix = normalized === '/' ? '' : normalized;
  return `/${lang}${suffix}`;
};

export const t = (lang, key) =>
  translations[lang]?.[key] ?? translations[defaultLocale]?.[key] ?? key;

export const getCategoryLabel = (category, lang) =>
  categoryLabels[lang]?.[category] ?? categoryLabels[defaultLocale]?.[category] ?? category;

export const getPlaceField = (place, field, lang) => {
  const localizedKey = `${field}_${lang}`;
  if (place && place[localizedKey]) {
    return place[localizedKey];
  }
  return place?.[field];
};

// Using path prefixes keeps every language on a stable, indexable URL
// without user-agent or geo-based redirects, which is clearer for SEO at scale.
