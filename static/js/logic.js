// Add URL of data to query
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a get request on the url
d3.json(queryUrl, function(data) {
    // Pass the data from the request to first function 
    creatFeatures(data);
});

// Assigns colour to the markers
function colorMarker(depth) {
    if (depth <= 10) { return "green" } else if (depth <= 30) { return "#a3f600" } else if (depth <= 50) { return "yellow" } else if (depth <= 70) { return "orange" } else if (depth <= 90) { return "#ff5500" } else { return "red" };
};

//==============================================================================
// Creates earthquake layer, markers and tooltips 
function creatFeatures(earthquakeData) {

    // Defines marker style
    function circleStyle(feature) {
        // 3rd item in coordinates is depth, colour of marker based on depth
        var col = colorMarker(feature.geometry.coordinates[2])
            // Marker radius based on earthquake magnitude   
        var rad = feature.properties.mag * 2.5
            // Circular marker properties 
        return {
            opacity: 0.2,
            color: "black",
            fillColor: col,
            radius: rad,
            fillOpacity: 0.7
        };
    };

    // Creates Tooltips
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" +
            new Date(feature.properties.time) +
            "<br>Magnitude: " + feature.properties.mag + "</p>");
    };

    // Creates earthquake layer using markers and 
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle
    });

    // Initates Function which builds the map adding the features above 
    createMap(earthquakes);

}


//==============================================================================
// Creates map, map views, 
function createMap(earthquakes) {

    // Create map views
    var satellite_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    var greyscale_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    var outdoor_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Define base maps 
    var base_maps = {
        "Satellite": satellite_map,
        "Greyscale": greyscale_map,
        "Outdoors": outdoor_map
    };

    // define overlap maps
    var overlay_maps = {
        Earthquakes: earthquakes
    };

    // Some ring of fire locations
    //Arica: 18.4783° S, 70.3126° W 
    //Laguna Salada: -23.68443,-68.13913
    //Tabubil, Papua New Guinea: 5.2690° S, 141.2281° E

    // Creates map!
    var myMap = L.map("plot-area", {
        center: [5.3, 141.2],
        zoom: 4,
        layers: [outdoor_map, earthquakes]
    });

    // Controls 
    L.control.layers(base_maps, overlay_maps, {
        collapsed: false
    }).addTo(myMap);

    // Create and add legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 30, 50, 70, 90]
        div.innerHTML = "<h3>Earthquake Depth</h3>"

        // Generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorMarker(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
};