# City Tourist Map

An interactive **tourist city map** inspired by the classic hotel lobby maps you get in cities like Paris or Rome.  
The app displays an interactive map of the city with **points of interest (POIs)**, organized by categories such as landmarks, food, nightlife, and transport. Users can toggle categories on and off and explore the city visually.

This can be the foundation for a richer city guide with walking tours, transport routes, and advertising spots for local businesses.

---

## Features

- Interactive map built with **Leaflet** and **OpenStreetMap** tiles.
- Custom **category filters** (Landmarks, Food, Nightlife, Transport, etc.).
- Color-coded markers by category.
- Sidebar with:
  - Short intro text.
  - Filter checkboxes.
  - Example **“Featured / Ads”** boxes (e.g., hotels, tours).
- Responsive layout (sidebar + full-height map).

---

## Technologies Used

- **HTML5** – Base structure of the page.
- **CSS3** – Layout and styling (sidebar, map container, markers).
- **Vanilla JavaScript (ES6)** – App logic, markers, filtering.
- **[Leaflet](https://leafletjs.com/)** – JavaScript library for interactive maps.
- **[OpenStreetMap](https://www.openstreetmap.org/)** – Map tiles used as the base map layer.

No build tools or frameworks are required. Everything runs as static files.

---

## Project Structure

```text
city-tourist-map/
├─ index.html      # Main HTML file (layout, sidebar, map container)
├─ style.css       # Styles for layout, sidebar, markers
└─ app.js          # Leaflet map initialization, markers, filters
```
## Next version

- Add multiple language feature.
- Add images to the filters