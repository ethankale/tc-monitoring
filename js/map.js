
var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap() {
    // set up the map
    map = new L.Map('mapid');

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 12, attribution: osmAttrib});        

    // start the map in Thurston County
    map.setView(new L.LatLng(46.9, -122.75),10);
    map.addLayer(osm);
}

initmap();

var stations = {};

// Using fetch; maybe plus polyfill?
//   http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
// This will only work on a server (cross-site scripting).

// Also, see http://leafletjs.com/examples/geojson/


var opts = {
  method: 'GET'
};

fetch('data/stations.geojson', opts).then(function (response) {
  return response.json();
})
.then(function (body) {
  console.log(body);
});


// Some default values for all of the station markers
var geojsonMarkerOptions = {
    color: "#000000",
    radius: 6,
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

// What to do when you click on a station marker.
function onEachStation(feature, layer) {
    if (feature.properties && feature.properties["SITE NAME"]) {
        var baseURL = "http://www.co.thurston.wa.us/monitoring/";
        var link = "";
        switch (feature.properties["SITE CODE"]) {
            case '13u': link = '<a href="' + baseURL + 'precip/precip-lawrence.html">Details</a>'; break;
            case '11w': link = '<a href="' + baseURL + 'precip/precip-Rainier.htm">Details</a>'; break;
            case '05u': link = '<a href="' + baseURL + 'precip/precip-yelm.htm">Details</a>'; break;
            case '23u': link = '<a href="' + baseURL + 'precip/precip-percival.htm">Details</a>'; break;
            case '27u': link = '<a href="' + baseURL + 'precip/precip-bostonharbor.html">Details</a>'; break;
            case '32u': link = '<a href="' + baseURL + 'precip/precip-greencove.html">Details</a>'; break;
            case '45u': link = '<a href="' + baseURL + 'precip/precip-blackriver.html">Details</a>'; break;
            case '45w': link = '<a href="' + baseURL + 'precip/precip-rochester.htm">Details</a>'; break;
            case '55u': link = '<a href="' + baseURL + 'precip/precip-tenino.html">Details</a>'; break;
            case '59u': link = '<a href="' + baseURL + 'precip/precip-skookumchuck.html">Details</a>'; break;
            case '60u': link = '<a href="' + baseURL + 'precip/precip-skookumchuck.html">Details</a>'; break;
            case '65u': link = '<a href="' + baseURL + 'precip/precip-grandmound.html">Details</a>'; break;
            case '69u': link = '<a href="' + baseURL + 'precip/precip-summit.html">Details</a>'; break;
        }
        layer.bindPopup('<strong>' + 
                        feature.properties["SITE CODE"] + ": " +
                        feature.properties["SITE NAME"] + 
                        '</strong>' + "</br>" +
                        link);
    }
}

// Control station marker fill in the map, and the color in the legend
function stationColor(type) {
    switch (type) {
        case 'Rain': return "#1b9e77";
        case 'Ground': return "#d95f02";
        case 'Stream/Lake': return "#7570b3";
    }
}

// Add stations to map.  Also, color them based on their type
var stationsLayer = L.geoJSON(stations, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    style: function(feature) {
        return {fillColor: stationColor(feature.properties.Type)};
    },
    onEachFeature: onEachStation
}).addTo(map);

// Add a legend to the map; see http://leafletjs.com/examples/choropleth/
var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'legend'),
        types = ["Rain", "Ground", "Stream/Lake"];
    
    var content = '<h4>Stations</h4>'
    
    for (var i = 0; i < types.length; i++) {
        content += '<li style="color:' + stationColor(types[i]) + '">' + types[i] + '</li>';
    }
    this._div.innerHTML = content;
    
    return this._div;
};

legend.addTo(map);


