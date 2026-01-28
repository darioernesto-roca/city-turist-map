import places from '../data/places.json';

export const allPlaces = places;

export const categoryLabels = {
  landmark: 'Landmarks',
  food: 'Food',
  nightlife: 'Nightlife',
  transport: 'Transport',
  park: 'Parks',
};

export const categories = Array.from(new Set(places.map((place) => place.category)));

export const getCategoryLabel = (category) => categoryLabels[category] ?? category;

export const featuredPlaces = places.filter((place) => place.featured).slice(0, 2);

export const buildGoogleMapsLink = (coords) =>
  `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
