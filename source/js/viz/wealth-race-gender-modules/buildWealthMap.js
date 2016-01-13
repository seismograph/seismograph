define(['d3', 'underscore', 'leaflet', '../../tools/mapFactory', '../../tools/barChartFactory'], function (d3, _, L, mapFactory, barChartFactory) {
	return function (dataset, elID, baseColor) {
		var getBaseMap = function () {
			var map = mapFactory({ // Pull up a leaflet map
				id: elID,
				center: [39.215, -96.789],
				zoom: 5,
				minZoom: 3,
				maxZoom: 9,
				g: false
			});
			$('#'+elID).parent().height(map.h);
			return map;
		};

		var findExtremes = function (data, maxOrMin, key) { // Will be used to find max and min for scales, etc.
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

		var buildOrdinalScale = function (domainArr, rangeArr) { // Currently using ordinal scale for county total wealth coloring
			console.log(domainArr, rangeArr);
			return d3.scale.ordinal().domain(domainArr).range(rangeArr);
		};

		var getBaseBarChart = function (map) { // Build a d3 base bar chart to be used for displaying county wealth
			var chart = barChartFactory({
				width: map.w * 0.36,
				height: map.h * 0.6,
				class: 'barChart',
				el: '#' + elID + '-bar'
			});
			$('#' + elID + '-bar').css('top', (map.h - chart.h) / 2);
			return chart;
		};

		var renderBarChart = function (wData, pData) {
			if (!wData) return false;
			var chart = this,
			bars = chart.view
				.data(wData)
				.enter()
				.append('rect')
				.attr({
					width: function () {
						return chart.w / wData.length - 4;
					},
					y: function (d) {
						return (chart.h - chart.scale(d)) - 20;
					},
					x: function (d, i) {
						if (i === 0) return (chart.w / wData.length) * i + 2;
						else return (chart.w / wData.length) * i;
					},
					class: function (d,i) {
						return chart.titles[i];
					}
				});

			return setTimeout(function () { // Using a timeout here so that data only reloads after user pauses on hover
				bars.attr('height', function (d, i) {
					if (pData[i] < 500) return 0;
					return chart.scale(d);
				});

				chart.svg.selectAll('.wealth text')
					.data(wData)
					.enter()
					.append('text')
					.text(function (d, i) {
						if (d === null || pData[i] < 500) return '';
						else {
							var str = d.toString();
							return '$' + str.slice(0, -3) + ',' + str.slice(-3);
						}
					})
					.attr({
						x: function(d, i) {
							return i * (chart.w / wData.length) + 6;
						},
						y: function(d) {
							return chart.h - chart.scale(d) - 24;
						},
						"class": "wealth",
						"font-size": "18px",
						"fill": "#222",
					});
			}, 100);
		};

		return d3.json('../../data/wealth-gender-race/json/county-' + dataset + '.json', function (err, dataObj) {
			if (err) console.warn(err);

			var titles = dataObj['0'];

			delete dataObj['0']; // Better to remove them all together than have to skip over them when iterating

			var map = getBaseMap(),

				mapColor = d3.rgb(baseColor),

				cornerNE = [77.542, 3.295],
				cornerSW = [-18.312, -236.799]

				totalIncomeDomain = (function () {
					var max = findExtremes(dataObj, 'max', 'incomeData.total'),
					min = findExtremes(dataObj, 'min', 'incomeData.total'),
					step = Math.round((max - min) / titles.length);
					return d3.range(min, max, step);
				}());

			map.setCountyFillOpacity = buildOrdinalScale(totalIncomeDomain, d3.range(0.6,1.1,0.1));

			map.setCountyColor = buildOrdinalScale(totalIncomeDomain, [mapColor.brighter(1), mapColor.brighter(0.5), mapColor, mapColor.darker(0.5), mapColor.darker(1)]);

			map.bar = getBaseBarChart(map);

			map.bar.scale = map.bar.setLinearScale([0, findExtremes(dataObj, 'max', 'incomeData.subPops')], [0, map.bar.h - 60]);

			map.bar.titles = titles;

			map.bar.view = map.bar.svg.selectAll('rect');

			map.bar.renderChart = renderBarChart;

			map.renderData = function () {
				map.bar.svg.selectAll('text.race')
					.data(map.bar.titles)
					.enter()
					.append('text')
					.text(function (d) {
						return d;
					})
					.attr({
						x: function(d, i) {
							var space = (d.length > 5) ? 2 : 14;
							return i * (map.bar.w / map.bar.titles.length) + space;
						},
						y: function(d) {
							return map.bar.h - 2;
						},
						"class": "race",
						"font-size": "18px",
						"fill": "#003366"
					});
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
						var wData = (dataObj[d.id]) ? dataObj[d.id].incomeData.subPops : false;
						map.bar.write = map.bar.renderChart(wData, dataObj[d.id].popData.subPops);
					})
					.on('mouseout', function () {
						clearTimeout(map.bar.write);
						map.bar.svg.selectAll('rect').transition().ease('linear').attr('height', 0).attr('y', map.bar.h - 20).remove();
						map.bar.svg.selectAll('text.wealth').remove();
					})
					.append("title")
					.text(function (d) {
						if (!dataObj[d.id]) return false;
						var getPercent = function (val) {
							var percent = (val / dataObj[d.id].popData.total) * 100;
							percent = percent.toFixed(2);
							while (percent.charAt(percent.length - 1) === '0') {
								percent = percent.slice(0, -1);
							}
							return (percent.charAt(percent.length - 1) === '.') ? percent.slice(0, -1) + '%' : percent + '%';
						};
						return dataObj[d.id].title + '\n'
							+ 'Population: ' + dataObj[d.id].popData.total
							+ '\n - Black: ' + getPercent(dataObj[d.id].popData.subPops[0])
							+ '\n - Asian: ' + getPercent(dataObj[d.id].popData.subPops[1])
							+ '\n - White: ' + getPercent(dataObj[d.id].popData.subPops[2])
							+ '\n - Hispanic: ' + getPercent(dataObj[d.id].popData.subPops[3])
							+ '\n - Other: ' + getPercent(dataObj[d.id].popData.subPops[4]);
					});
			};

			map.addUSLeafletOverlay({
				states: 'path', // strings refer to type of svg element to be added
				county: 'path',
				onReady: function () { map.reset(map.renderData); } // callback for onReady
			});

			map.view.setMaxBounds([cornerNE, cornerSW]);

			map.view.on('viewreset', function () {
				map.reset(map.renderData);
			});

			return map;
		});
	};
});