// 1. Initialize the map
const map = L.map("map").setView([11.2408, -74.199], 13); // Santa Marta example

// 2. Add tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// 3. Data: points of interest
const places = [
  {
    name: "Cathedral Basilica",
    coords: [11.2433, -74.2111],
    category: "landmark",
    description: "Historic cathedral in the city center.",
  },
  {
    name: "Popular Seafood Restaurant",
    coords: [11.2415, -74.2152],
    category: "food",
    description: "Fresh fish and local dishes near the bay.",
  },
  {
    name: "Night Bar & Lounge",
    coords: [11.2402, -74.2135],
    category: "nightlife",
    description: "Cocktails, music, and a great view.",
  },
  {
    name: "Main Bus Terminal",
    coords: [11.2145, -74.1887],
    category: "transport",
    description: "Intercity buses and regional transport.",
  },
  {
    name: "Central Park",
    coords: [11.242, -74.205],
    category: "park",
    description: "A green oasis in the heart of the city.",
  },
];

// 4. Marker icons per category (optional)
const iconColors = {
  landmark: "blue",
  food: "red",
  nightlife: "purple",
  transport: "green",
  park: "yellow",
};

function createCategoryIcon(category) {
  const color = iconColors[category] || "gray";
  return L.divIcon({
    className: "custom-marker",
    html: `<span class="marker-dot marker-${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// 4b. Add CSS for the divIcon markers
const styleEl = document.createElement("style");
styleEl.innerHTML = `
  .marker-dot {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid #111827;
  }
  .marker-blue { background: #3b82f6; }
  .marker-red { background: #ef4444; }
  .marker-purple { background: #8b5cf6; }
  .marker-green { background: #10b981; }
  .marker-yellow { background: #facc15; }
  .marker-gray { background: #6b7280; }
`;
document.head.appendChild(styleEl);

// 5. Create markers and store references
const markers = [];

places.forEach((place) => {
  const marker = L.marker(place.coords, {
    icon: createCategoryIcon(place.category),
  }).addTo(map);

  marker.bindPopup(`
    <strong>${place.name}</strong><br/>
    <small>${place.description}</small><br/>
    <em>${place.category}</em>
  `);

  markers.push({ marker, data: place });
});

// 6. Filter logic
const checkboxes = document.querySelectorAll('.filters input[type="checkbox"]');

function updateMarkersVisibility() {
  const activeCategories = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.getAttribute("data-category"));

  markers.forEach(({ marker, data }) => {
    if (activeCategories.includes(data.category)) {
      marker.addTo(map);
    } else {
      map.removeLayer(marker);
    }
  });
}

checkboxes.forEach((cb) =>
  cb.addEventListener("change", updateMarkersVisibility)
);

// Initial update
updateMarkersVisibility();
