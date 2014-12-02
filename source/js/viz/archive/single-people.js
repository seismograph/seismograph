var VIZ = (function(v) {
  v.singlePeople = function() {
    var canvas = d3.select('#singlePeople'), // used to set width & height
        w = parseInt(canvas.style('width')),
        h = w * 0.60,

        map = (function() { // Build map using leaflet
                canvas.style('height', h + 'px'); // Set the map height before instantiating it
                return new L.Map('singlePeople', {center: [37.545, -97.383], zoom: 4})
                    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.iho02bc8/{z}/{x}/{y}.png"));
              }()),

        svg = d3.select(map.getPanes().overlayPane).append("svg"), // Append SVG to map using D3
        g = svg.append("g").attr("class", "leaflet-zoom-hide"), // append 'g' element to the SVG to group data points later on
        fillById = d3.map(), // Used to match singles data to county IDs
        radiusById = d3.map();

    queue()
      .defer(d3.json, '../data/single-percentage/us.json')
      .defer(d3.json, '../data/single-percentage/singles2.json')
      .await(ready);

    function ready(error, topology, singles) {
      var bindData = {
        connectCountyIds: function(d) {
          var curr, i = 0, max = d.singlesData.length, obj = {};
          for (; i < max; i++) {
            curr = d.singlesData[i];
            obj = {
              percentMen: curr.cPercentMen,
              percentWomen: curr.cPercentWomen
            };
            fillById.set(+d.singlesData[i].id, obj);
            radiusById.set(+d.singlesData[i].id, curr.cTotal);
          }
        },

        buildScales: function() {
          return {
            linear: function(d, r) {
              return d3.scale.linear().clamp(true).domain(d).range(r);
            },
            sqrt: function(d,r) {
              return d3.scale.sqrt().domain(d).range(r);
            },
            featureFill: function(input) {
              var result = [],
                  dom = [50, 60],
                  colors = {
                    men: {
                      r: this.linear(dom, [107,8]),
                      g: this.linear(dom, [174,81]),
                      b: this.linear(dom, [214,156])
                    },
                    women: {
                      r: this.linear(dom, [251,165]),
                      g: this.linear(dom, [106,15]),
                      b: this.linear(dom, [74,21])
                    }
                  };

              if (typeof input === 'undefined') return false;
              else if (input.percentMen > input.percentWomen) {
                result = [
                  colors.men.r(input.percentMen),
                  colors.men.g(input.percentMen),
                  colors.men.b(input.percentMen)
                ];
              } else {
                result = [
                  colors.women.r(input.percentWomen),
                  colors.women.g(input.percentWomen),
                  colors.women.b(input.percentWomen)
                ];
              }
              return result;
            },
            radius: function(radius, range) {
              var scale = this.sqrt([0, 1e6], range);
              if (typeof radius === 'undefined') return false;
              else return scale(radius);
            }
          };
        },

        reset: function(feature, state) {
          var that = this,
              transform = d3.geo.transform({point: that.projectPoint}),
              path = d3.geo.path().projection(transform),
              scales = that.buildScales();
              bounds = path.bounds(topojson.feature(topology, topology.objects.counties)),
              topLeft = bounds[0],
              bottomRight = bounds[1],
              range = (function() {
                var zoom = map.getZoom();
                if (zoom >= 7) return [6, 22];
                else if (zoom > 4 && zoom < 7) return [4, 18];
                else if (zoom == 4) return [2,15];
                else if (zoom == 3) return [1, 12];
                else if (zoom < 3) return [0, 5];
                else return [0, 0];
              }());

          that.connectCountyIds(singles);

          svg .attr("width", bottomRight[0] - topLeft[0])
              .attr("height", bottomRight[1] - topLeft[1])
              .style("left", topLeft[0] + "px")
              .style("top", topLeft[1] + "px");

          g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")"); // Move all the features (wrapped in 'g') as the map zooms
          
          feature.attr({
            transform: function(d) { return "translate(" + path.centroid(d) + ")"; },
            r: function(d) {
              var radius = scales.radius(radiusById.get(d.id), range);
              return radius ? radius : 0;
            },
            fill: function(d) {
              var rgb = scales.featureFill(fillById.get(d.id));
              if (rgb) return 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
              else return 'white';
            }
          });
          state.attr("d", path);
          map.off('viewreset');
          map.on('viewreset', function() { that.reset(feature, state); });
        },

        projectPoint: function(x,y) { // Here we translate coordinates to map points and them stream them to d3 for projection as paths
          var point = map.latLngToLayerPoint(new L.LatLng(y,x));
          this.stream.point(point.x, point.y);
        },

        init: function() {
          var feature, state, that = this;

          feature = g.selectAll('circle')
                      .data(topojson.feature(topology, topology.objects.counties).features)
                      .enter()
                        .append("circle");

          state = g.selectAll('path')
                    .data(topojson.feature(topology, topology.objects.states).features)
                    .enter()
                      .append('path')
                      .attr("class", "states");

          that.reset(feature, state);
        }
      };

      if (error) return console.warn(error);
      else bindData.init();
    }
  };
  return v;
}(VIZ || {}));