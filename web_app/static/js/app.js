/*

Checklist of what needs to still be done.
----------------------------------------
- insert api calls - status: 0
- adjust the style - status: 0
- test color scale - status: 0

*/

var mapColor = document.querySelector('#map-color');
document.querySelector('#btnApply').addEventListener('click', layerColor);

function init() {
    fetch("countries.geojson")
        .then((res) => {
        return res.json();
    })
    .then((data) => {
        // console.log(data);
        createFeatures(data.features);
    });
}
init();

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var mapLayer = L.layerGroup()
var map = L.map("map", {
    center: [37.09, 0],
    zoom: 3,
    layers: [streetmap, mapLayer]
});


// Test the colors
function layerColor() {

    mapLayer.clearLayers()

    var url = 'http://localhost:5000/api/' + mapColor.value

    fetch(url)
        .then(res => res.json())
        .then(apiData => {
            fetch('countries.geojson')
                .then(res => res.json())
                .then(data => {
                    console.log(apiData)
                    console.log(data.features)

                    if (mapColor.value == 'population') {
                        for (var i = 0; i < apiData.length; i++) {
                            var apiFeatures = apiData[i];
                            for (var j = 0; j < data.features.length; j++) {
                                var features = data.features[j];
                                if (apiFeatures.country == features.properties.ADMIN) {
                                    features.properties.dataPoint = apiFeatures.population
                                }
                            } 
                            } 
                        }
                    if (mapColor.value == 'population_density') {
                        for (var i = 0; i < apiData.length; i++) {
                            var apiFeatures = apiData[i];
                            for (var j = 0; j < data.features.length; j++) {
                                var features = data.features[j];
                                if (apiFeatures.country == features.properties.ADMIN) {
                                    features.properties.dataPoint = apiFeatures.density_p_km2
                                }
                            } 
                            } 
                        }
                        console.log(data)
                    // function getColor(d) {
                    //     if (mapColor.value == 'population') {
                    //         data.forEach(data => {
                    //         if (data.country == d) {
                    //             console.log(data.country, data.population)
                    //             // return countryData.population > 1000000000 ? '#800026' :
                    //             // countryData.population > 500  ? '#BD0026' :
                    //             // countryData.population > 200  ? '#E31A1C' :
                    //             // countryData.population > 100  ? '#FC4E2A' :
                    //             // countryData.population > 50   ? '#FD8D3C' :
                    //             // countryData.population > 20   ? '#FEB24C' :
                    //             // countryData.population > 10   ? '#FED976' :
                    //                                 // '#FFEDA0';
                    //         }
                    //     })} 
                    // }

                    // function onEachFeature(feature, layer) {
                    //     feature = layer.feature = layer.feature || {}; // Initialize feature
                    //     feature.type = feature.type || "Feature"; // Initialize feature.type
                    //     var props = feature.properties = feature.properties || {}; // Initialize feature.properties
                    //     layer.feature.properties.population = population;
                    // }

                    function style(feature) {
                        return {
                            fillColor: colorScale(feature.properties.dataPoint),
                            weight: 1,
                            opacity: 1,
                            color: 'black',
                            fillOpacity: 0.5
                        };
                        // if (mapColor.value == 'population_density') {
                        //     return {
                        //         fillColor: colorScale(feature.properties.density_p_km2),
                        //         weight: 1,
                        //         opacity: 1,
                        //         color: 'black',
                        //         fillOpacity: 0.5
                        //     };}
                        // else return;
                    }
                    mapLayer = L.geoJSON(data.features, {
                        // onEachFeature: onEachFeature,
                        style: style
                    }).addTo(mapLayer)
                
                
            })
        })
}

function colorScale(dataPoint) {
    if (mapColor.value == 'population_density') {
        dataPoint = dataPoint*10000000;

    }
    return dataPoint > 1000000000 ? '#800026' :
            dataPoint > 500000000  ? '#BD0026' :
            dataPoint > 200000000  ? '#E31A1C' :
            dataPoint > 100000000  ? '#FC4E2A' :
            dataPoint > 50000000   ? '#FD8D3C' :
            dataPoint > 20000000   ? '#FEB24C' :
            dataPoint > 10000000   ? '#FED976' :
                                '#FFEDA0';
}

function createFeatures(countryData) {

    function highlightFeature(e) {
        
        // Highlight Feature
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

    // Zoom Feature
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    // Apply to each country
    function onEachFeature(feature, layer) {
        var country = feature.properties.ADMIN;
        countryApi(country, layer);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        
    }

    function style(feature) {
        return {
            // fillColor needs to be changed to api call data
            fillColor: 'orange',
            weight: 1,
            opacity: 0,
            color: 'black',
            fillOpacity: 0
        };
    }
    
    var countries = L.geoJSON(countryData, {
        onEachFeature: onEachFeature,
        style: style
    }).addTo(map);
}

function countryApi(country, layer) {
    var url = 'http://localhost:5000/api/countries/' + country;
    fetch(url)
        .then(res => res.json())
        .then(apiData => {
            layer.bindPopup(
                `<h2>Country: ${apiData.country}</h3>
                <h4>Capital City: ${apiData.capital_major_city}</h4>
                <h4>Largest City: ${apiData.largest_city}</h4>
                <ul>Official Language: ${apiData.official_language}</ul>
                <ul>Population: ${apiData.population}</ul>
                <ul>Person per km<sup>2</sup>: ${apiData.density_p_km2}</ul>
                <ul>GDP: ${apiData.gdp}</ul>
                <ul>Gas Price: ${apiData.gasoline_price}</ul>
                <ul>Minimum Wage: ${apiData.minimum_wage}</ul>
                <ul>Land Area (km<sup>2</sup>): ${apiData.land_area_km2}</ul>`
                );
        });
}
