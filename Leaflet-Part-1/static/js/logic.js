// Define the URL for the earthquake data.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create a new Leaflet map.
let myMap = L.map("map", {
center: [37.0902, -95.7129],
zoom: 2,
});

// Create a tile layer for the base map.
let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
}).addTo(myMap);


// Define the magnitude colors and corresponding ranges.
let magnitudeColors = {
  0: "#ffffcc",
  1: "#c2e699",
  2: "#78c679",
  3: "#31a354",
  4: "#006837",
  5: "#8c2d04",
  6: "#f768a1",
  7: "#ae017e",
  8: "#7a0177"
};


// Define the function to create circle markers with appropriate colors.
// Define the function to create circle markers with appropriate colors.
function createMarker(feature, latlng) {
  let magnitude = feature.properties.mag;
  let color = magnitudeColors[Math.floor(magnitude)];
  return L.circleMarker(latlng, {
    radius: 8,
    fillColor: color,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  });
}





// Use D3 to load the earthquake data.
d3.json(queryUrl).then(function (data) {
  // Create a GeoJSON layer for the earthquake data.
  let earthquakes = L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`, {
        sticky: true,
        direction: 'top'
      });
    },
    pointToLayer: createMarker
  }).addTo(myMap);

  // Create the legend control and add it to the map.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    let grades = Object.keys(magnitudeColors).map(Number);
    let labels = [];
    // Loop through the intervals and generate a label with a colored square for each interval.
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + magnitudeColors[grades[i]] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});

