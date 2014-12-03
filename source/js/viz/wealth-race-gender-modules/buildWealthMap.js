define(['d3', 'underscore', 'leaflet', '../../tools/mapFactory', '../../tools/barChartFactory'], function (d3, _, L, mapFactory, barChartFactory) {
	return function (dataset, elID, baseColor) {
		var getBaseMap = function () {
			var map = mapFactory({
				id: elID,
				center: [39.215, -96.789],
				zoom: 5,
				g: false
			});
			$('#'+elID).parent().height(map.h);
			return map;
		};

		var findExtremes = function (data, maxOrMin, key) {
			var set = _.map(data, function (county) {
				return Object.byString(county, key);
			});
			if(!_.isArray(set[0])) {
				return d3[maxOrMin](set);
			} else {
				var result = 0;
				_.each(set, function (arr) {
					var curr = d3[maxOrMin](arr);
					if (curr > result) result = curr;
				});
				return result;
			}
		};

		var buildOrdinalScale = function (domainArr, rangeArr) {
			return d3.scale.ordinal().domain(domainArr).range(rangeArr);
		};

		var getBaseBarChart = function (map) {
			var chart = barChartFactory({
				width: map.w * 0.36,
				height: map.h * 0.6,
				class: 'barChart',
				el: '#' + elID + '-bar'
			});
			$('#' + elID + '-bar').css('top', ((map.h - chart.h) / 2 + chart.h) * -1);
			return chart;
		};

		var renderBarChart = function (data) {
			if (!data) return false;
			var chart = this,
			bars = chart.view
				.data(data)
				.enter()
				.append('rect')
				.attr({
					width: function () {
						return chart.w / data.length - 4;
					},
					y: function (d) {
						return (chart.h - chart.scale(d)) - 20;
					},
					x: function (d, i) {
						if (i === 0) return (chart.w / data.length) * i + 2;
						else return (chart.w / data.length) * i;
					},
					class: function (d,i) {
						return chart.titles[i];
					}
				});

			return setTimeout(function () {
				bars.attr('height', function (d) {
					return chart.scale(d);
				});

				chart.svg.selectAll('.wealth text')
					.data(data)
					.enter()
					.append('text')
					.text(function (d, i) {
						if (d === null) return '';
						else {
							var str = d.toString();
							return '$' + str.slice(0, -3) + ',' + str.slice(-3);
						}
					})
					.attr({
						x: function(d, i) {
							return i * (chart.w / data.length) + 6;
						},
						y: function(d) {
							return chart.h - chart.scale(d) - 24;
						},
						"class": "wealth",
						"font-size": "18px",
						"fill": "#222",
					});

				chart.svg.selectAll('.race text')
					.data(data)
					.enter()
					.append('text')
					.text(function (d, i) {
						return chart.titles[i];
					})
					.attr({
						x: function(d, i) {
							var space = (chart.titles[i].length > 5) ? 2 : 14;
							return i * (chart.w / data.length) + space;
						},
						y: function(d) {
							return chart.h - 2;
						},
						"class": "race",
						"font-size": "18px",
						"fill": "#003366"
					});
			}, 100);
		};

		return d3.json('../../data/wealth-gender-race/json/county-' + dataset + '.json', function (err, dataObj) {
			if (err) console.warn(err);

			var titles = dataObj['0'];

			delete dataObj['0']; // Better to remove them all together than have to skip over them when iterating

			var map = getBaseMap(),

				mapColor = d3.rgb(baseColor),

				totalIncomeDomain = (function () {
					var max = findExtremes(dataObj, 'max', 'incomeData.total'),
					min = findExtremes(dataObj, 'min', 'incomeData.total'),
					step = Math.round((max - min) / titles.length);
					return d3.range(min, max, step);
				}());

			map.setCountyFillOpacity = buildOrdinalScale(totalIncomeDomain, d3.range(0.5,1.1,0.1));

			map.setCountyColor = buildOrdinalScale(totalIncomeDomain, [mapColor.brighter(1.5), mapColor.brighter(1), mapColor.brighter(0.5), mapColor.darker(0.5), mapColor.darker(1), mapColor.darker(1.5)]);

			map.bar = getBaseBarChart(map);

			map.bar.scale = map.bar.setLinearScale([0, findExtremes(dataObj, 'max', 'incomeData.subPops')], [0, map.bar.h - 60]);

			map.bar.titles = titles;

			map.bar.view = map.bar.svg.selectAll('rect');

			map.bar.renderChart = renderBarChart;

			map.renderData = function () {
				map.states.attr("d", map.path);
				map.counties
					.attr({
						d: map.path,
						fill: function (d) {
							return (dataObj[d.id]) ? map.setCountyColor(dataObj[d.id].incomeData.total) : 0;
						},
						'fill-opacity': function (d) {
							return (dataObj[d.id]) ? map.setCountyFillOpacity(dataObj[d.id].incomeData.total) : 0;
						}
					})
					.on('mouseover', function (d) {
						var data = (dataObj[d.id]) ? dataObj[d.id].incomeData.subPops : false;
						map.bar.write = map.bar.renderChart(data);
					})
					.on('mouseout', function () {
						clearTimeout(map.bar.write);
						map.bar.svg.selectAll('rect').transition().ease('linear').attr('height', 0).attr('y', map.bar.h).remove();
						map.bar.svg.selectAll('text').remove();
					})
					.append("title")
					.text(function (d) {
						if (!dataObj[d.id]) return false;
						var getPercent = function (val) {
							return Math.round((val / dataObj[d.id].popData.total) * 100) + '%';
						},
						calculateOther = function () {
							var totalPop = dataObj[d.id].popData.total,
							currTotal = _.reduce(dataObj[d.id].popData.subPops, function (m, c, k) {
								return (k !== 4) ? m + c : m;
							});
							return Math.round(((totalPop - currTotal) / totalPop) * 100) + '%';
						};
						return dataObj[d.id].title + '\n'
							+ 'Population: ' + dataObj[d.id].popData.total + '\n'
							+ ' - Black: ' + getPercent(dataObj[d.id].popData.subPops[0])
							+ '\n - Asian: ' + getPercent(dataObj[d.id].popData.subPops[1])
							+ '\n - White: ' + getPercent(dataObj[d.id].popData.subPops[2])
							+ '\n - Hispanic: ' + getPercent(dataObj[d.id].popData.subPops[3])
							+ '\n - Other: ' + calculateOther();
					});
			};

			map.addUSLeafletOverlay({
				states: 'path', // strings refer to type of svg element to be added
				county: 'path',
				onReady: function () { map.reset(map.renderData); } // callback for onReady
			});

			map.view.on('viewreset', function () {
				map.reset(map.renderData);
			});

			return map;
		});
	};
});