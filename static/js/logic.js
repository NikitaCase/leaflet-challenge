//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl, function(data) {



    creatFeatures(data);

})

function colorMarker(depth) {
    if (depth <= 10) { return "green" } else if (depth <= 30) { return "yellow-green" } else if (depth <= 50) { return "yellow" } else if (depth <= 70) { return "orange" } else if (depth <= 90) { return "red-orange" } else { return "red" };
};


function creatFeatures(earthquakeData) {


    // Defines marker style
    function circleStyle(feature) {
        // 3rd item in coordinates is depth, colour of marker based on depth
        var col = colorMarker(feature.geometry.coordinates[2])
            // Marker radius based on earthquake magnitude   
        var rad = feature.properties.mag * 2.5

        return {
            opacity: 0.8,
            color: col,
            fillColor: col,
            radius: rad
        };
    }



    function onEachFeature(feature, layer) {
        layer.bindPopup("<p><b>" + feature.properties.place + "</b><hr>" + new Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag + "</p>");
    }



    var earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature: onEachFeature,

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: circleStyle
    });



    createMap(earthquakes);

}



function createMap(earthquakes) {

    var satellite_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
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
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var base_maps = {
        "Satellite": satellite_map,
        "Greyscale": greyscale_map,
        "Outdoors": outdoor_map
    };


    var overlay_maps = {
        Earthquakes: earthquakes
    };

    //Arica: 18.4783° S, 70.3126° W 
    //Laguna Salada: -23.68443,-68.13913
    //Tabubil, Papua New Guinea: 5.2690° S, 141.2281° E


    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("plot-area", {
        center: [5.3, 141.2],
        zoom: 4,
        layers: [satellite_map, earthquakes]
    });


    // Create a layer control

    L.control.layers(base_maps, overlay_maps, {
        collapsed: false
    }).addTo(myMap);


};