/*

Checklist of what needs to still be done.
----------------------------------------
- insert api calls - status: 0
- adjust the style - status: 0
- test color scale - status: 0

*/

fetch("countries.geojson")
    .then((res) => {
    return res.json();
})
.then((data) => {
    console.log(data);
    createFeatures(data.features);
});

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var map = L.map("map", {
    center: [37.09, 0],
    zoom: 3,
    layers: [streetmap]
});

// Test the colors
function getColor(dataPoint) {
    return dataPoint > 1000 ? '#800026' :
            dataPoint > 500  ? '#BD0026' :
            dataPoint > 200  ? '#E31A1C' :
            dataPoint > 100  ? '#FC4E2A' :
            dataPoint > 50   ? '#FD8D3C' :
            dataPoint > 20   ? '#FEB24C' :
            dataPoint > 10   ? '#FED976' :
                                '#FFEDA0';
}

function createFeatures(countryData) {

    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        layer.bringToFront();
    }

    function resetHighlight(e) {
        countries.resetStyle(e.target);
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    // insert api call here
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Country: ${feature.properties.ADMIN}</h3>`);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    function style(feature) {
        return {
            // fillColor needs to be changed to api call data
            fillColor: getColor(Math.random()*100),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.5
        };
    }

    var countries = L.geoJSON(countryData, {
        onEachFeature: onEachFeature,
        style: style
    }).addTo(map);
}





