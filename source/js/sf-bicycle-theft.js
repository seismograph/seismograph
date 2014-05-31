var VIZ = (function(v) {
  v.sfBicycleTheft = function() {
    var canvas = d3.select('#sfBicycleTheft'),
        w = parseInt(canvas.style('width')),
        h = w * 0.60,

        map = (function() {
                canvas.style('height', h+'px'); // Set the map height before instantiating it
                return new L.Map('sfBicycleTheft', {center: [37.775, -122.444], zoom: 13})
                    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.i8ahci39/{z}/{x}/{y}.png"));
              }()),
        svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json('http://seismograph.github.io/seismograph/data/sf-bike-theft/bike-crime-geo.json', function(error, data) {
      if (error) return console.warn(error);

      prepDataset(data.features);

      var transform = d3.geo.transform({point: crimePoint}),
          path = d3.geo.path().projection(transform),
          feature = g.selectAll('path')
                      .data(data.features
                        .sort(function(a, b) { 
                          return b.properties.radius - a.properties.radius; 
                        }))
                      .enter().append('path');

      map.on("viewreset", reset);
      reset();
      timeStolen(data.features);                    

      function prepDataset(arr) {
        var i = 0, max = arr.length, obj = {};
        for (; i < max; i++) {
          if (arr[i].properties.address === '800 Block of BRYANT ST') { // Police station
            arr[i].properties.radius = 0;
            continue;
          }
          if (obj[arr[i].geometry.coordinates]) {
            obj[arr[i].geometry.coordinates] += 5;
          } else {
            obj[arr[i].geometry.coordinates] = 5;
          }
          arr[i].properties.radius = obj[arr[i].geometry.coordinates];
        }
      }

      function crimePoint(x,y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y,x));
        this.stream.point(point.x, point.y);
      }

      function formatString(string) {
        var string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function formatDate(rawDate) {
        var date = new Date(rawDate * 1000);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      }

      function formatTime(time) {
        var hour = parseInt(time.slice(0, time.indexOf(':')));
        if (hour > 12) return (hour - 12) + time.slice(time.indexOf(':')) + 'pm';
        else return hour + time.slice(time.indexOf(':')) + 'am';
      }

      function reset() {
        var bounds = path.bounds(data),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        path.pointRadius(function(d) {
          return map.getZoom() < 16 ? d.properties.radius : d.properties.radius * 1.5;
        });

        svg .attr("width", (bottomRight[0] + 10) - (topLeft[0] - 10))
            .attr("height", (bottomRight[1] + 10) - (topLeft[1] - 10))
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr({
          d: function(d) {
            return path(d);
          },
          'fill-opacity': function(d) {
            return d.properties.radius === 5 ? 0.5 : (d.properties.radius <= 10) ? 0.35 : 0.25;
          }
        }).append("title")
          .text(function(d) {
            return 'Crime: ' + formatString(d.properties.crime)
                + '\nDate: ' + formatDate(d.properties.date) + ', ' + formatTime(d.properties.time)
                + '\nAddress: ' + formatString(d.properties.address);
          });
      }

      function timeStolen(data) {
        var h = 200,
            svg = d3.select('#timeStolen')
                      .append('svg')
                      .attr({
                        width: w,
                        height: h
                      }),
            tArray = (function() {
              var i = 0, max = data.length, result = [];
              for (; i < max; i++) {
                var time = data[i].properties.time.trim(),
                    time = parseInt(time.slice(0, time.indexOf(':')));

                (result[time]) ? result[time] += 1 : result[time] = 1;
              }
              return result;
            }()),
            clock = '12am,1am,2am,3am,4am,5am,6am,7am,8am,9am,10am,11am,12pm,1pm,2pm,3pm,4pm,5pm,6pm,7pm,8pm,9pm,10pm,11pm'.split(',');
            max = d3.max(tArray),
            yRange = d3.scale.linear()
                        .domain([0, max])
                        .range([0, h - 30]),
            oRange = d3.scale.linear()
                        .domain([0, max])
                        .range([0.4,1]),
            bWidth = w / tArray.length,
            hourRange = d3.scale.ordinal()
                        .domain(clock)
                        .rangePoints([bWidth/2 + 2, w - (bWidth/2 + 2)]),
            xAxis = d3.svg.axis()
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

      svg.append('g')
        .attr('class', 'axis')
        .call(xAxis);
      }
    });
  };
  return v;
}(VIZ || {}));