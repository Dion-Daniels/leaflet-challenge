var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 3
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(link, function(data) {
    console.log(data);

function mag_color (magnitude){
    switch(true) {
        case magnitude >= 5:
          return "rgb(204, 0, 0)";
        case magnitude >= 4:
          return "rgb(255, 102, 51)";
        case magnitude >= 3:
          return "rgb(255, 166, 77)";
        case magnitude >= 2:
          return "rgb(255, 217, 102)";
        case magnitude >= 1:
          return "rgb(255, 255, 128)";
        default:
          return "rgb(230, 255, 153)";
      }

}

L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
            {
            radius: (feature.properties.mag) * 4,
            fillColor: mag_color (feature.properties.mag),
            fillOpacity: 1,
            color: "black",
            stroke: true,
            weight: 0.3
          });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place} </h3>
        <p>(latitude:${feature.geometry.coordinates[1]}, longitude: ${feature.geometry.coordinates[0]})</p>
        <hr>
        <p>Date Recorded: ${Date(feature.properties.time)}"</p>
        <hr>
        <p>Magnitude:${feature.properties.mag}</p>`);
      }

}).addTo(myMap);



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        labels = []
        

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + mag_color(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


});

