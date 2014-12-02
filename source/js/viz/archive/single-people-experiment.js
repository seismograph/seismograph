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
        dataById = d3.map(); // Used to match singles data to county IDs

   	queue()
   		.defer(d3.json, '../data/single-percentage/us.json')
   		.defer(d3.json, '../data/single-percentage/singles.json')
   		.await(ready);

   	function ready(error, topology, singles) {
   		var bindData = {
   			connectCountyIds: function(d) {
   				var curr, i = 0, max = d.singlesData.length, obj = {};
	 				for (; i < max; i++) {
	 					curr = d.singlesData[i];
	 					obj = {
	 						total: curr.total,
	 						percentMen: curr.percentMen,
	 						percentWomen: curr.percentWomen
	 					};
	 					dataById.set(+d.singlesData[i].id, obj);
	 				}
   			},

   			buildScales: function() {
   				return {
   					linear: function(r) {
   						return d3.scale.linear().clamp(true).domain([50, 60]).range([r[0], r[1]]);
   					},
   					featureFill: function(input) {
   						var that = this,
   								result = [],
   								colors = {
   									men: {
   										r: this.linear([247,8]),
   										g: this.linear([251,48]),
   										b: this.linear([255,107])
   									},
   									women: {
   										r: this.linear([255,103]),
   										g: this.linear([245,0]),
   										b: this.linear([240,13])
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
						}
   				};
   			},

   			reset: function(path, feature, state) {
   				var bounds = path.bounds(topojson.feature(topology, topology.objects.counties)),
							topLeft = bounds[0],
							bottomRight = bounds[1];

					svg .attr("width", bottomRight[0] - topLeft[0])
	            .attr("height", bottomRight[1] - topLeft[1])
	            .style("left", topLeft[0] + "px")
	            .style("top", topLeft[1] + "px");

	         g  .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")"); // Move all the features (wrapped in 'g') as the map zooms
					
					feature.attr('d', path);
					state.attr("d", path);
   			},

   			projectPoint: function(x,y) { // Here we translate coordinates to map points and them stream them to d3 for projection as paths
	        var point = map.latLngToLayerPoint(new L.LatLng(y,x));
	        this.stream.point(point.x, point.y);
	      },

	      init: function() {
	      	var transform, path, scales, feature, state, that = this;

	      	that.connectCountyIds(singles);

	      	transform = d3.geo.transform({point: that.projectPoint}),
					path = d3.geo.path().projection(transform),
					scales = that.buildScales();

   				feature = g.selectAll('circle')
											.data(topojson.feature(topology, topology.objects.counties).features)
											.enter()
												.append("circle")
										    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
										    .attr("r", 1.5)
												.attr('fill', function(d) {
													var rgb = scales.featureFill(dataById.get(d.id));
													if (rgb) return 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
													else return 'white';
												});

					state = g.append('path')
										.datum(topojson.mesh(topology, topology.objects.states, function(a, b) { return a !== b; }))
							      .attr("class", "states");

					map.on('viewreset', function() { that.reset(path, feature, state); });
					that.reset(path, feature, state);
	      }
   		};

   		if (error) return console.warn(error);
   		else bindData.init();
  	}
  };
  return v;
}(VIZ || {}));

var VIZ = (function(v) {
  v.singlePeople = function() {
    var canvas = d3.select('#singlePeople'), // used to set width & height
        w = parseInt(canvas.style('width')),
        h = w * 0.625,

        projection = d3.geo.albersUsa().scale(1280).translate([w / 2, h / 2]),

			  path = d3.geo.path().projection(projection),

    		svg = canvas.append("svg").attr("width", w).attr("height", h),

			  g = svg.append('g').attr('class', 'counties'),

        dataById = d3.map(); // Used to match singles data to county IDs

   	queue()
   		.defer(d3.json, '../data/single-percentage/us.json')
   		.defer(d3.json, '../data/single-percentage/singles.json')
   		.await(ready);

   	function ready(error, topology, singles) {
   		var bindData = {
   			connectCountyIds: function(d) {
   				var curr, i = 0, max = d.singlesData.length, obj = {};
	 				for (; i < max; i++) {
	 					curr = d.singlesData[i];
	 					obj = {
	 						total: curr.total,
	 						percentMen: curr.percentMen,
	 						percentWomen: curr.percentWomen
	 					};
	 					dataById.set(+d.singlesData[i].id, obj);
	 				}
   			},

   			buildScales: function() {
   				return {
   					linear: function(r) {
   						return d3.scale.linear().clamp(true).domain([50, 60]).range([r[0], r[1]]);
   					},
   					featureFill: function(input) {
   						var that = this,
   								result = [],
   								colors = {
   									men: {
   										r: this.linear([247,8]),
   										g: this.linear([251,48]),
   										b: this.linear([255,107])
   									},
   									women: {
   										r: this.linear([255,103]),
   										g: this.linear([245,0]),
   										b: this.linear([240,13])
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
						}
   				};
   			},

   			reset: function(path, feature, state) {
					feature.attr('d', path);
					state.attr("d", path);
   			},

	      init: function() {
	      	var scales, feature, state, that = this;

	      	that.connectCountyIds(singles);

					scales = that.buildScales();

   				feature = g.selectAll('path')
											.data(topojson.feature(topology, topology.objects.counties).features)
											.enter()
												.append('path')
												.attr('fill', function(d) {
													var rgb = scales.featureFill(dataById.get(d.id));
													if (rgb) return 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
													else return 'white';
												});

					state = g.append('path')
										.datum(topojson.mesh(topology, topology.objects.states, function(a, b) { return a !== b; }))
							      .attr("class", "states");

					// map.on('viewreset', function() { that.reset(path, feature, state); });
					that.reset(path, feature, state);
	      }
   		};

   		if (error) return console.warn(error);
   		else bindData.init();
  	}
  };
  return v;
}(VIZ || {}));

var VIZ = (function(v) {
  v.singlePeople = function() {
    var canvas = d3.select('#singlePeople'), // used to set width & height
        w = parseInt(canvas.style('width')),
        h = w * 0.625,

        projection = d3.geo.albers().scale(100000).translate([35650, 3600]);

			  path = d3.geo.path().projection(projection),

    		svg = canvas.append("svg"),

			  g = svg.append('g').attr('class', 'counties').attr({width: w, height: h}),

        dataById = d3.map(); // Used to match singles data to county IDs

   	queue()
   		.defer(d3.json, '../data/single-percentage/sf.json')
   		.defer(d3.json, '../data/single-percentage/singles.json')
   		.await(ready);

   	function ready(error, topology, singles) {
   		var bindData = {
   			connectCountyIds: function(d) {
   				var curr, i = 0, max = d.singlesData.length, obj = {};
	 				for (; i < max; i++) {
	 					curr = d.singlesData[i];
	 					obj = {
	 						total: curr.total,
	 						percentMen: curr.percentMen,
	 						percentWomen: curr.percentWomen
	 					};
	 					dataById.set(+d.singlesData[i].id, obj);
	 				}
   			},

   			buildScales: function() {
   				return {
   					linear: function(r) {
   						return d3.scale.linear().clamp(true).domain([50, 60]).range([r[0], r[1]]);
   					},
   					featureFill: function(input) {
   						var that = this,
   								result = [],
   								colors = {
   									men: {
   										r: this.linear([247,8]),
   										g: this.linear([251,48]),
   										b: this.linear([255,107])
   									},
   									women: {
   										r: this.linear([255,103]),
   										g: this.linear([245,0]),
   										b: this.linear([240,13])
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
						}
   				};
   			},

   			reset: function(path, feature, state) {
					feature.attr('d', path);
					// state.attr("d", path);
   			},

	      init: function() {
	      	var scales, feature, state, that = this;

	      	// that.connectCountyIds(singles);

					// scales = that.buildScales();

   				feature = g.selectAll('path')
											.data(topojson.feature(topology, topology.objects['sf-geo']).features)
											.enter()
												.append('path');
												feature.attr('d', path);

					// map.on('viewreset', function() { that.reset(path, feature, state); });
					// that.reset(path, feature);
	      }
   		};

   		if (error) return console.warn(error);
   		else bindData.init();
  	}
  };
  return v;
}(VIZ || {}));