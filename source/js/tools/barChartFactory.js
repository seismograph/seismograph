define(['d3'], function (d3) {
	var defaults = {
			el: '#bar',
			width: null,
			height: null,
			class: null
		},

		BarChartFactory = function (options) {
			this.options = $.extend({}, defaults, options);
			this.canvas = d3.select(this.options.el);
			return this.init();
		};

	BarChartFactory.prototype = {
		setDimensions: function (canvas) {
			this.width = (!this.options.width) ? parseInt(this.canvas.style('width')) : this.options.width,
			this.height = (!this.options.height) ? this.width * 0.60 : this.options.height;
		},

		buildBackPlate: function () {
			return d3.select(this.options.el).append('svg')
								.attr({
									width: this.width,
									height: this.height,
								});
		},

		setLinearScale: function (domainArr, rangeArr) {
			return d3.scale.linear().domain(domainArr).range(rangeArr);
		},

		setAxis: function (domainArr, rangeArr, orientation, tickValues) {
			var scale = d3.scale.ordinal().domain(domainArr).rangePoints(rangeArr),
				axis = d3.svg.axis().scale(scale).orient(orientation).tickValues(scale.domain());
			return this.svg.append('g').attr('class', 'axis').call(axis);
		},

		init: function () {
			this.setDimensions();
			this.svg = this.buildBackPlate();
			if (this.options.class) this.svg.attr('class', this.options.class);

			return {
				h: this.height,
				w: this.width,
				svg: this.svg,
				setAxis: this.setAxis,
				setLinearScale: this.setLinearScale
			};
		}
	},
	api = function (options) {
		return new BarChartFactory(options);
	};
	return api;
});