/* var VIZ = (function(v) {
  v.sfBicycleTheft = function() {
    var canvas = d3.select('#sfBicycleTheft'),
        w = parseInt(canvas.style('width')),
        h = w * 0.55,
        tempPoint = {},

        map = (function() {
                canvas.style('height', h+'px'); // Set the map height before instantiating it
                return new L.Map('sfBicycleTheft', {center: [37.775, -122.444], zoom: 13})
                    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.i8ahci39/{z}/{x}/{y}.png"));
              }()),
        svg = d3.select(map.getPanes().overlayPane).append("svg")
                .attr({
                  width: w,
                  height: h
                }),
        g = svg.append("g").attr("class", "leaflet-zoom-hide"),

        crimePoint = function(coords) {
          return map.latLngToLayerPoint(new L.LatLng(coords[0],coords[1]));
        },

        reset = function(feature) {
          console.log(map.getBounds().getCenter());
          feature.attr({
                    cx: function(d) {
                      return crimePoint(d.coordinates).x;
                    },
                    cy: function(d) {
                      return crimePoint(d.coordinates).y;
                    },
                    r: 2
                  });
        };

    d3.json('../data/sf-bike-theft/bike-crime-sm.json', function(error, data) {
      if (error) return console.warn(error);

      var feature = g.selectAll('circle')
                      .data(data.crimes)
                      .enter()
                      .append('circle');

      map.on("viewreset", function() {
        reset(feature)
      });
      reset(feature);                 
    });
  };
  return v;
}(VIZ || {})); */