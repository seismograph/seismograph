define(['d3', 'underscore'], function (d3, _) {
	return function (dataset, elID) {
		var buildSvg = function (w, h) {
			return d3.select('#' + elID)
				.append('svg')
				.attr({
					width: w,
					height: h
				});
		};

		var buildLinearScale = function (viz) {
			return d3.scale.linear()
							.domain([0, viz.max])
							.range([0, viz.h * 0.5]);
		};

		var sortArrays = function (dataObj) {
			var tempArr = [], i = 0;
			for (; i < dataObj['0'].length; i++) {
				tempArr.push({title: dataObj['0'][i], value: dataObj['1'].incomeData.subPops[i]});
			}
			tempObj = _.sortBy(tempArr, function (obj) {
				return -obj.value;
			});
			dataObj['0'] = _.pluck(tempObj, 'title');
			dataObj['1'].incomeData.subPops = _.pluck(tempObj, 'value');
		};

		var buildBase = function () {
			var top = this.linearScale(d3.max(this.data.incomeData.subPops));
			this.svg.append('line')
					.attr({
						class: 'base',
						x1: 0,
						y1: top,
						x2: this.w / 2,
						y2: top
					});
		};

		var setRectAttr = function (g, d, i, className) {
			var that = this;
				rectSize = this.linearScale(d);
			g.append('rect')
				.attr({
					class: className + ' ' + this.titles[i],
					x: function () {
						that.xBase += (className === 'back') ? rectSize * 0.6 : 0;
						return (className === 'back') ? that.xBase - rectSize : (that.xBase - rectSize) + 40;
					},
					y: function () {
						that.yBase += 15;
						return that.yBase - rectSize;
					},
					width: rectSize,
					height: rectSize
				});
		};

		var setPathPointMap = function (d, poly) {
			var rectSize = this.linearScale(d);
			switch (poly) {
				case 'bottom': 
					return [
						{'x': this.xBase - rectSize, 'y': this.yBase}, {'x': this.xBase, 'y': this.yBase},
						{'x': this.xBase + 40, 'y': this.yBase + 15}, {'x': (this.xBase - rectSize) + 40, 'y': this.yBase + 15}
					];
				case 'right':
					return [
						{'x': this.xBase, 'y': this.yBase - rectSize}, {'x': this.xBase, 'y': this.yBase},
						{'x': this.xBase + 40, 'y': this.yBase + 15}, {'x': this.xBase + 40, 'y': this.yBase + 15 - rectSize}
					];
				case 'top':
					return [
						{'x': this.xBase - rectSize, 'y': this.yBase - rectSize}, {'x': this.xBase, 'y': this.yBase - rectSize},
						{'x': this.xBase + 40, 'y': this.yBase + 15 - rectSize}, {'x': (this.xBase - rectSize) + 40, 'y': this.yBase + 15 - rectSize}
					];
				case 'left':
					return [
						{'x': this.xBase - rectSize, 'y': this.yBase - rectSize}, {'x': this.xBase - rectSize, 'y': this.yBase},
						{'x': this.xBase + 40 - rectSize, 'y': this.yBase + 15}, {'x': this.xBase + 40 - rectSize, 'y': this.yBase + 15 - rectSize}
					];
			}
		};

		var setPathAttr = function (g, d, i, rect) {
			var that = this,
				pointMap = this.setPathPointMap(d, rect),
				polyFunc = d3.svg.line()
											.x(function (d) { return d.x; })
											.y(function (d) { return d.y; })
											.interpolate('linear-closed');

			g.append('path')
				.attr({
					d: polyFunc(pointMap),
					class: this.titles[i]
				});
		};

		var buildCubes = function () {
			var that = this;
			this.xBase = 140;
			this.yBase = that.linearScale(d3.max(that.data.incomeData.subPops));

			this.svg.selectAll('g.cubes')
				.data(that.data.incomeData.subPops)
				.enter()
					.append('g')
					.attr('class', 'cubes')
					.each(function (d, i) {
						var g = d3.select(this);
						that.setRectAttr(g, d, i, 'back');
						that.setPathAttr(g, d, i, 'bottom');
						that.setPathAttr(g, d, i, 'right');
						that.setPathAttr(g, d, i, 'top');
						that.setPathAttr(g, d, i, 'left');
						that.setRectAttr(g, d, i, 'front');
					});
		};

		var buildLegend = function () {
			var that = this,
				top = 50,
				length = 50;
			this.svg.selectAll('g.legend')
					.data(this.titles)
					.enter()
					.append('g')
						.attr('class', 'legend')
						.each(function (d, i) {
							var g = d3.select(this);
							g.append('rect')
								.attr({
									x: that.w - (that.w * 0.35),
									y: top + (i * (5 + length)),
									height: length,
									width: length,
									class: function (d) {
										return d;
									}
								});
							g.append('text')
								.text(function (d) {
									var wealth = that.data.incomeData.subPops[i].toString();
									return '– ' + d + ': $' + wealth.slice(0, -3) + ',' + wealth.slice(-3);
								})
								.attr({
									x: (that.w - (that.w * 0.35 - 20)) + length,
									y: top + (i * (5 + length)) + (length / 2 + 4),
									"font-size": "20px",
									"fill": "#222"
								});
						});
		};

		d3.json('../../data/wealth-gender-race/json/us-' + dataset + '.json', function (dataObj) {
			sortArrays(dataObj);

			var width = $('#' + elID).width(),
				height = Math.round(width * 0.3),
				viz = { 
					svg: buildSvg(width, height),
					data: dataObj['1'],
					titles: dataObj['0'],
					w: width,
					h: height,
					buildBase: buildBase,
					buildCubes: buildCubes,
					setRectAttr: setRectAttr,
					setPathAttr: setPathAttr,
					setPathPointMap: setPathPointMap,
					buildLegend: buildLegend
				};

			viz.max = d3.max(viz.data.incomeData.subPops);
			viz.linearScale = buildLinearScale(viz);

			viz.buildBase();
			viz.buildCubes();
			viz.buildLegend();
		})
	};
});