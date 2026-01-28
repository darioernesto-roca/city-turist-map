import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const appRoot = document.querySelector('[data-map-app]');

if (appRoot) {
  const mapEl = appRoot.querySelector('[data-map]');
  const listEl = appRoot.querySelector('[data-place-list]');
  const filtersForm = appRoot.querySelector('[data-filters]');
  const cardPanel = appRoot.querySelector('[data-place-card]');
  const cardOverlay = appRoot.querySelector('[data-place-overlay]');
  const closeButton = appRoot.querySelector('[data-place-close]');

  const places = JSON.parse(appRoot.dataset.places || '[]');
  const markers = new Map();
  const activeCategories = new Set(
    Array.from(filtersForm?.querySelectorAll('input[type="checkbox"]') || [])
      .filter((input) => input.checked)
      .map((input) => input.value)
  );

  let activePlaceId = null;

  const map = L.map(mapEl, {
    zoomControl: false,
  }).setView([11.2408, -74.2119], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const markerStyles = {
    default: {
      radius: 8,
      color: '#2563eb',
      weight: 2,
      fillColor: '#60a5fa',
      fillOpacity: 0.85,
    },
    active: {
      radius: 10,
      color: '#0f172a',
      weight: 2,
      fillColor: '#f59e0b',
      fillOpacity: 1,
    },
  };

  const renderMarker = (place) => {
    const marker = L.circleMarker(place.coords, markerStyles.default);
    marker.on('click', () => setActivePlace(place.id));
    marker.addTo(map);
    return marker;
  };

  const updateCardContent = (place) => {
    if (!cardPanel) return;

    cardPanel.querySelector('[data-place-name]').textContent = place.name;
    cardPanel.querySelector('[data-place-category]').textContent = place.categoryLabel;
    cardPanel.querySelector('[data-place-description]').textContent =
      place.longDescription || place.shortDescription;

    const addressEl = cardPanel.querySelector('[data-place-address]');
    const imageEl = cardPanel.querySelector('[data-place-image]');
    const websiteEl = cardPanel.querySelector('[data-place-website]');
    const mapsEl = cardPanel.querySelector('[data-place-maps]');

    if (place.image) {
      imageEl.src = place.image;
      imageEl.alt = `${place.name} photo`;
      imageEl.closest('[data-place-image-wrapper]').hidden = false;
    } else {
      imageEl.closest('[data-place-image-wrapper]').hidden = true;
    }

    if (place.address) {
      addressEl.textContent = place.address;
      addressEl.hidden = false;
    } else {
      addressEl.hidden = true;
    }

    if (place.website) {
      websiteEl.href = place.website;
      websiteEl.hidden = false;
    } else {
      websiteEl.hidden = true;
    }

    mapsEl.href = `https://www.google.com/maps/search/?api=1&query=${place.coords[0]},${place.coords[1]}`;
  };

  const openCard = () => {
    cardPanel?.classList.add('is-open');
    cardOverlay?.classList.add('is-visible');
    cardPanel?.setAttribute('aria-hidden', 'false');
    closeButton?.focus();
  };

  const closeCard = () => {
    cardPanel?.classList.remove('is-open');
    cardOverlay?.classList.remove('is-visible');
    cardPanel?.setAttribute('aria-hidden', 'true');
    activePlaceId = null;
    markers.forEach((marker, id) => {
      marker.setStyle(markerStyles.default);
    });
  };

  const setActivePlace = (placeId) => {
    const place = places.find((item) => item.id === placeId);
    if (!place) return;

    activePlaceId = placeId;
    updateCardContent(place);
    openCard();

    markers.forEach((marker, id) => {
      marker.setStyle(id === placeId ? markerStyles.active : markerStyles.default);
    });

    map.flyTo(place.coords, 14, { duration: 0.6 });
  };

  const syncListVisibility = () => {
    listEl?.querySelectorAll('[data-place-id]').forEach((item) => {
      const category = item.dataset.placeCategory;
      const visible = activeCategories.has(category);
      item.hidden = !visible;
    });
  };

  const syncMarkersVisibility = () => {
    places.forEach((place) => {
      const marker = markers.get(place.id);
      if (!marker) return;
      const isActive = activeCategories.has(place.category);
      if (isActive && !map.hasLayer(marker)) {
        marker.addTo(map);
      }
      if (!isActive && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
  };

  const syncFilters = () => {
    syncListVisibility();
    syncMarkersVisibility();

    if (activePlaceId) {
      const activePlace = places.find((place) => place.id === activePlaceId);
      if (activePlace && !activeCategories.has(activePlace.category)) {
        closeCard();
      }
    }
  };

  places.forEach((place) => {
    const marker = renderMarker(place);
    markers.set(place.id, marker);
  });

  appRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-place-id]');
    if (!button) return;
    setActivePlace(button.dataset.placeId);
  });

  filtersForm?.addEventListener('change', () => {
    activeCategories.clear();
    filtersForm
      .querySelectorAll('input[type="checkbox"]')
      .forEach((input) => input.checked && activeCategories.add(input.value));
    syncFilters();
  });

  closeButton?.addEventListener('click', closeCard);
  cardOverlay?.addEventListener('click', closeCard);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCard();
    }
  });

  syncFilters();

  window.setActivePlace = setActivePlace;
}
