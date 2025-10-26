mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // **CHANGED: Center coordinates for Nepal [lng, lat]**
    center: coordinates, 
    // **SUGGESTED CHANGE: A lower zoom is better for a country view**
    zoom: 6 
});

//to add marker
// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);