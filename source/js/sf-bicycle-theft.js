var VIZ = (function(v) {
  v.sfBicycleTheft = function() {
    var canvas = d3.select('#sfBicycleTheft'), // used to set width & height
        w = parseInt(canvas.style('width')),
        h = w * 0.60,

        map = (function() { // Build map using leaflet
                canvas.style('height', h+'px'); // Set the map height before instantiating it
                return new L.Map('sfBicycleTheft', {center: [37.775, -122.444], zoom: 13})
                    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.i8ahci39/{z}/{x}/{y}.png"));
              }()),
        svg = d3.select(map.getPanes().overlayPane).append("svg"), // Append SVG to map using D3
        g = svg.append("g").attr("class", "leaflet-zoom-hide"); // append 'g' element to the SVG to group data points later on

    d3.json('../data/sf-bike-theft/bike-crime-geo.json', function(error, data) {
      if (error) return console.warn(error);

      var buildVisualizations = ({ // All of the data dependant functionality exists in this object
        prepDataset: function(arr) { // Iterate through all data points, add the radius and remove those set on police station
          var i = 0, max = arr.length, obj = {};
          for (; i < max; i++) {
            if (arr[i].properties.address === '800 Block of BRYANT ST') { // Police station
              arr[i].properties.radius = 0;
              continue;
            }
            if (obj[arr[i].geometry.coordinates]) {
              obj[arr[i].geometry.coordinates] += 5; // If there's already a point on these coordinates, bump up the current point's radius
            } else {
              obj[arr[i].geometry.coordinates] = 5;
            }
            arr[i].properties.radius = obj[arr[i].geometry.coordinates];
          }
        },
        mapPointToSvgPath: function(x,y) { // Here we translate coordinates to map points and them stream them to d3 for projection as paths
          var point = map.latLngToLayerPoint(new L.LatLng(y,x));
          this.stream.point(point.x, point.y);
        },
        formatString: function(string) {
          var string = string.toLowerCase();
          return string.charAt(0).toUpperCase() + string.slice(1);
        },
        formatDate: function(rawDate) {
          var date = new Date(rawDate * 1000);
          return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        },
        formatTime: function(time) {
          var hour = parseInt(time.slice(0, time.indexOf(':')));
          if (hour > 12) return (hour - 12) + time.slice(time.indexOf(':')) + 'pm';
          else return hour + time.slice(time.indexOf(':')) + 'am';
        },
        resetMap: function(path, feature) { // Fired once on load and then each time the map zooms in or out
          var that = this,
              bounds = path.bounds(data),
              topLeft = bounds[0],
              bottomRight = bounds[1]; // These variables will set the SVG boundaries according to the edge of the map

          path.pointRadius(function(d) { // Set the point radius, respective of zoom level
            var zoom = map.getZoom();
            return zoom > 16 ? d.properties.radius * 1.5 : 
                    (zoom > 11 ? d.properties.radius : 
                      (zoom > 9 ? d.properties.radius / 3 : d.properties.radius / 6));
          });

          svg .attr("width", (bottomRight[0] + 10) - (topLeft[0] - 10))
              .attr("height", (bottomRight[1] + 10) - (topLeft[1] - 10))
              .style("left", topLeft[0] + "px")
              .style("top", topLeft[1] + "px");

          g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")"); // Move all the data points with the map

          feature.attr({
            d: function(d) {
              return path(d);
            },
            'fill-opacity': function(d) {
              return d.properties.radius === 5 ? 0.5 : (d.properties.radius <= 10) ? 0.35 : 0.25;
            }
          }).append("title")
            .text(function(d) {
              return 'Crime: ' + that.formatString(d.properties.crime)
                  + '\nDate: ' + that.formatDate(d.properties.date) + ', ' + that.formatTime(d.properties.time)
                  + '\nAddress: ' + that.formatString(d.properties.address);
            });
        },
        timeStolen: function(data) { // This is the second visualization, the bar graph
          var h = 200,
              svg = d3.select('#timeStolen')
                        .append('svg')
                        .attr({
                          width: w,
                          height: h
                        }),
              tArray = (function() { // Return array where index refers to hours of day & values refer to # of bikes stolen in that hour
                var i = 0, max = data.length, result = [];
                for (; i < max; i++) {
                  var time = data[i].properties.time.trim(),
                      time = parseInt(time.slice(0, time.indexOf(':')));

                  (result[time]) ? result[time] += 1 : result[time] = 1;
                }
                return result;
              }()),
              clock = '12am,1am,2am,3am,4am,5am,6am,7am,8am,9am,10am,11am,12pm,1pm,2pm,3pm,4pm,5pm,6pm,7pm,8pm,9pm,10pm,11pm'.split(','); // for the axis
              max = d3.max(tArray),
              yRange = d3.scale.linear() // Set the bar height
                          .domain([0, max])
                          .range([0, h - 30]),
              oRange = d3.scale.linear() // Set the bar opacity
                          .domain([0, max])
                          .range([0.4,1]),
              bWidth = w / tArray.length, // Set the bar width
              hourRange = d3.scale.ordinal() // Set the axis scale
                          .domain(clock)
                          .rangePoints([bWidth/2 + 2, w - (bWidth/2 + 2)]),
              xAxis = d3.svg.axis() // Build the axis based on the above scale
                        .scale(hourRange)
                        .orient('bottom')
                        .tickValues(hourRange.domain());

          svg.selectAll('rect')
              .data(tArray)
              .enter()
              .append('rect')
              .attr({
                width: function() {
                  return bWidth - 4;
                },
                height: function(d) {
                  return yRange(d);
                },
                y: function(d) {
                  return h - yRange(d);
                },
                x: function(d,i) {
                  return bWidth * i;
                },
                'fill-opacity': function(d) {
                  return oRange(d);
                }
              });

          svg.append('g') // Append the axis
            .attr('class', 'axis')
            .call(xAxis);
        }, 
        init: function() {
          var transform, path, feature, that = this;

          that.prepDataset(data.features);

          transform = d3.geo.transform({point: that.mapPointToSvgPath});
          path = d3.geo.path().projection(transform); // Make paths from the coordinates: http://bost.ocks.org/mike/leaflet/
          feature = g.selectAll('path')
                      .data(data.features
                        .sort(function(a, b) { 
                          return b.properties.radius - a.properties.radius; 
                        }))
                      .enter().append('path');

          map.on("viewreset", function() {
            that.resetMap(path, feature);
          });
          that.resetMap(path, feature);
          that.timeStolen(data.features);
        }
      }).init();                   
    });
  };
  return v;
}(VIZ || {}));