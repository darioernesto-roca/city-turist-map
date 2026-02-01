import places from '../data/places.json';
import { getCategoryLabel } from './i18n.js';

export const allPlaces = places;

export const categories = Array.from(new Set(places.map((place) => place.category)));

export const getLocalizedCategoryLabel = (category, lang) => getCategoryLabel(category, lang);

export const featuredPlaces = places.filter((place) => place.featured).slice(0, 2);

export const buildGoogleMapsLink = (coords) =>
  `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
