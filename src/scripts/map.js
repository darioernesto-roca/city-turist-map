import L from "leaflet";
import "leaflet/dist/leaflet.css";

const appRoot = document.querySelector("[data-map-app]");

if (appRoot) {
  const mapEl = appRoot.querySelector("[data-map]");
  const listEl = appRoot.querySelector("[data-place-list]");
  const filtersForm = appRoot.querySelector("[data-filters]");
  const cardPanel = appRoot.querySelector("[data-place-card]");
  const cardOverlay = appRoot.querySelector("[data-place-overlay]");
  const closeButton = appRoot.querySelector("[data-place-close]");
  const photoAltTemplate = appRoot.dataset.photoAltTemplate || "{name}";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const places = JSON.parse(appRoot.dataset.places || "[]");
  const markers = new Map();
  const activeCategories = new Set(
    Array.from(filtersForm?.querySelectorAll('input[type="checkbox"]') || [])
      .filter((input) => input.checked)
      .map((input) => input.value),
  );

  let activePlaceId = null;

  const map = L.map(mapEl, {
    zoomControl: false,
  }).setView([11.2408, -74.2119], 16);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 20,
    },
  ).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  const categoryConfig = {
    landmark:  { emoji: "🏛️", color: "#7c3aed" },
    nightlife: { emoji: "🍻", color: "#db2777" },
    food:      { emoji: "🍽️", color: "#ea580c" },
    transport: { emoji: "🚌", color: "#0891b2" },
    park:      { emoji: "🌿", color: "#16a34a" },
  };

  const createCategoryIcon = (category, isActive = false) => {
    const cfg = categoryConfig[category] || { emoji: "📍", color: "#2563eb" };
    return L.divIcon({
      className: "",
      html: `<div style="background:${isActive ? "#f59e0b" : cfg.color};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid ${isActive ? "#0f172a" : "white"};box-shadow:0 1px 4px rgba(0,0,0,0.35);">${cfg.emoji}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const renderMarker = (place) => {
    const marker = L.marker(place.coords, { icon: createCategoryIcon(place.category) });
    marker.on("click", () => setActivePlace(place.id));
    marker.addTo(map);
    return marker;
  };

  const updateCardContent = (place) => {
    if (!cardPanel) return;

    const nameEl = cardPanel.querySelector("[data-place-name]");
    const categoryEl = cardPanel.querySelector("[data-place-category]");
    const descriptionEl = cardPanel.querySelector("[data-place-description]");
    const addressEl = cardPanel.querySelector("[data-place-address]");
    const imageEl = cardPanel.querySelector("[data-place-image]");
    const websiteEl = cardPanel.querySelector("[data-place-website]");
    const mapsEl = cardPanel.querySelector("[data-place-maps]");

    nameEl.textContent = place.name;
    categoryEl.textContent = place.categoryLabel;
    descriptionEl.textContent = place.longDescription || place.shortDescription;

    if (place.image) {
      if (imageEl.dataset.src !== place.image) {
        imageEl.src = place.image;
        imageEl.dataset.src = place.image;
      }
      imageEl.alt = photoAltTemplate.replace("{name}", place.name);
      imageEl.closest("[data-place-image-wrapper]").hidden = false;
    } else {
      imageEl.closest("[data-place-image-wrapper]").hidden = true;
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
    if (cardPanel?.classList.contains("is-open")) {
      return;
    }
    cardPanel?.classList.add("is-open");
    cardOverlay?.classList.add("is-visible");
    cardPanel?.setAttribute("aria-hidden", "false");
    document.body.classList.add("place-card-open");
    closeButton?.focus();
  };

  const closeCard = () => {
    cardPanel?.classList.remove("is-open");
    cardOverlay?.classList.remove("is-visible");
    cardPanel?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("place-card-open");
    activePlaceId = null;
    markers.forEach((marker, id) => {
      const place = places.find((p) => p.id === id);
      if (place) marker.setIcon(createCategoryIcon(place.category, false));
    });
  };

  const panToPlace = (place) => {
    const targetZoom = 16;
    const isReducedMotion = prefersReducedMotion.matches;
    const isDesktop = window.matchMedia("(min-width: 961px)").matches;
    const desktopOffset =
      cardPanel && isDesktop ? Math.round(cardPanel.offsetWidth * 0.4) : 0;
    const placeLatLng = L.latLng(place.coords[0], place.coords[1]);

    const getTargetCenter = () => {
      if (!desktopOffset) return placeLatLng;
      const pointAtZoom = map.project(placeLatLng, targetZoom);
      const shiftedCenterPoint = L.point(pointAtZoom.x + desktopOffset, pointAtZoom.y);
      return map.unproject(shiftedCenterPoint, targetZoom);
    };

    const targetCenter = getTargetCenter();

    if (isReducedMotion) {
      map.panTo(targetCenter, { animate: false });
      return;
    }

    map.panTo(targetCenter, {
      animate: true,
      duration: 0.6,
      easeLinearity: 0.5,
    });
  };

  const setActivePlace = (placeId) => {
    const place = places.find((item) => item.id === placeId);
    if (!place) return;
    if (placeId === activePlaceId && cardPanel?.classList.contains("is-open"))
      return;

    activePlaceId = placeId;
    updateCardContent(place);
    openCard();

    markers.forEach((marker, id) => {
      const place = places.find((p) => p.id === id);
      if (place) marker.setIcon(createCategoryIcon(place.category, id === placeId));
    });

    panToPlace(place);
  };

  const syncListVisibility = () => {
    listEl?.querySelectorAll("[data-place-id]").forEach((item) => {
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

  appRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-place-id]");
    if (!button) return;
    setActivePlace(button.dataset.placeId);
  });

  filtersForm?.addEventListener("change", () => {
    activeCategories.clear();
    filtersForm
      .querySelectorAll('input[type="checkbox"]')
      .forEach((input) => input.checked && activeCategories.add(input.value));
    syncFilters();
  });

  closeButton?.addEventListener("click", closeCard);
  cardOverlay?.addEventListener("click", closeCard);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCard();
    }
  });

  syncFilters();

  window.setActivePlace = setActivePlace;
}
