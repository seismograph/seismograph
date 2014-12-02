define(['leaflet', 'd3', './addUSLeafletOverlay'], function (L, d3, addUSLeafletOverlay) {
	var defaults = {
			id: 'map',
			width: null,
			height: null,
			center: [37.545, -97.383],
			zoom: 4,
			tile: 'http://{s}.tiles.mapbox.com/v3/lukewhyte.iho02bc8/{z}/{x}/{y}.png',
			g: true
		},

		MapFactory = function (options) {
			this.options = $.extend({}, defaults, options);
			this.canvas = d3.select('#' + this.options.id);
			return this.init();
		};

	MapFactory.prototype = {
		setDimensions: function (canvas) {
			var w = (!this.options.width) ? parseInt(this.canvas.style('width')) : this.options.width,
				h = (!this.options.height) ? w * 0.60 : this.options.height;
			return { w: w, h: h };
		},

		buildMap: function (dimensions) { // Build map using leaflet
      this.canvas.style('height', dimensions.h+'px'); // Set the map height before instantiating it
      return new L.Map(this.options.id, {center: this.options.center, zoom: this.options.zoom})
          .addLayer(new L.TileLayer(this.options.tile));
    },

		init: function () {
			var opts = this.options,
				dimensions = this.setDimensions(),
				map = this.buildMap(dimensions),
				svg = d3.select(map.getPanes().overlayPane).append("svg"),
				g = (opts.g) ? svg.append("g").attr("class", "leaflet-zoom-hide") : null;

			return {
				w: dimensions.w,
				h: dimensions.h,
				view: map,
				svg: svg,
				g: g
			};
		}
	},

	mapAPI = function (options) {
		var map = new MapFactory(options);

		map.addUSLeafletOverlay = addUSLeafletOverlay(map);

		return map;
	}

	return mapAPI;
});