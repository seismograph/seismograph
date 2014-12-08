define(['d3', 'underscore'], function (d3, _) {
	return function (dataSet, elID) {
		var buildSvg = function (w, h) {
			return d3.select('#' + elID)
							.append('svg')
							.attr({
								width: w,
								height: h
							});
		};

		var findMax = function (dataSet) {
			var max = 0;
			_.each(dataSet, function (data) {
				var wealthArr = _.pluck(data.incomeData.subPops, 'value'),
					curr = _.reduce(wealthArr, function (memo, val) {
						return memo + val;
					});
				if (curr > max) max = curr;
			});
			return max;
		}

		var buildLinearScale = function (viz) {
			return d3.scale.linear()
							.domain([0, viz.max])
							.range([0, viz.w - 40 - viz.data[0].incomeData.subPops.length * 2]);
		};

		var buildViz = function () {
			var that = this;
			this.xPos = 0;
			this.yPos = 50;
			this.svg.selectAll('g.stateBarsG')
				.data(this.data)
				.enter()
					.append('g')
					.attr('class', 'stateBarsG')
					.each(function (d, i) {
						var data = d.incomeData.subPops,
							g = d3.select(this);
						if (d.title === 'Puerto Rico') return false;
						that.xPos = 40;
						that.addStateLabel(g, d.title);
						_.each(data, function (obj, key) {
							that.buildBars(g, obj, key, i);
							that.addWealthLabel(g, obj);
						});
						if (i == 24) {
							that.addLegend(that.yPos + 47, 'middleLegend');
							that.yPos += 50
						}
						that.yPos += 45;
					});
		};

		var addLegend = function (top, className) {
			var that = this,
				top = top,
				length = 40;
			this.svg.selectAll('g.' + className)
					.data(this.titles)
					.enter()
					.append('g')
						.attr('class', className)
						.each(function (d, i) {
							var g = d3.select(this);
							g.append('rect')
								.attr({
									x: function () {
										return (length + 120) * i + 42;
									},
									y: top,
									height: length,
									width: length,
									class: function () {
										return d;
									}
								});
							g.append('text')
								.text(function () {
									return ': ' + d;
								})
								.attr({
									x: function () {
										return (length + 120) * i + 44 + length;
									},
									y: top + 25,
									"font-size": "18px",
									"fill": "#222"
								});
						});
		};

		var addStateLabel = function (g, state) {
			var that = this;
			g.append('text')
				.text(function () {
					return state + ':';
				})
				.attr({
					x: 0,
					y: that.yPos + 25,
					"font-size": "18px",
					"fill": "#222"
				});
		};

		var addWealthLabel = function (g, obj) {
			var that = this,
				barSize = this.linearScale(obj.value),
				wealth = obj.value.toString();
			wealth = '$' + wealth.slice(0, -3) + ',' + wealth.slice(-3);
			g.append('text')
				.text(function () {
					return wealth;
				})
				.attr({
					x: function () {
						return that.xPos - (barSize / 2) - ((wealth.length / 2) * 9);
					},
					y: that.yPos + 26,
					"font-size": "16px",
					"fill": "#222"
				});
		};

		var buildBars = function (g, obj, i, stateIndex) {
			var that = this,
				barSize = this.linearScale(obj.value);
			g.append('rect')
				.attr({
					class: obj.title,
					x: function () {
						that.xPos += barSize;
						return that.xPos - barSize;
					},
					y: that.yPos,
					width: barSize,
					height: 40
				});
		};

		var prepDataSet = function (dataObj, titles) {
			return _.chain(dataObj).map(function (state) {
								state.incomeData.subPops = _.map(state.incomeData.subPops, function (val, key) {
									return { title: titles[key], value: val};
								});
								state.incomeData.subPops = _.sortBy(state.incomeData.subPops, function (obj) { return obj.value * -1; });
								return state;
							}).sortBy(function (state) {
								var wealthArr = _.pluck(state.incomeData.subPops, 'value');
								return _.reduce(wealthArr, function (memo, val) {
									return memo + val;
								}) * -1;
							}).value();
		};

		var arrangeTitles = function (titles) {
			return [titles[2], titles[1], titles[4], titles[3], titles[0]];
		};

		d3.json('../../data/wealth-gender-race/json/state-' + dataSet + '.json', function (dataObj) {
			var titles = dataObj['0']; 
			delete dataObj['0']; // Better to remove them all together than have to skip over them when iterating

			var width = $('#' + elID).width(),
				height = _.keys(dataObj).length * 45 + 100,
				data = prepDataSet(dataObj, titles),
				viz = {
					svg: buildSvg(width, height),
					w: width,
					h: height,
					max: findMax(data),
					buildViz: buildViz,
					buildBars: buildBars,
					addStateLabel: addStateLabel,
					addWealthLabel: addWealthLabel,
					addLegend: addLegend,
					titles: arrangeTitles(titles),
					data: data
				};

			viz.linearScale = buildLinearScale(viz);

			viz.addLegend(0, 'topLegend');

			viz.buildViz();

			viz.addLegend(viz.h - 45, 'bottomLegend');
		});
	};
});