define(['d3', 'underscore', 'leaflet', '../../tools/mapFactory', '../../tools/barChartFactory'], function (d3, _, L, mapFactory, barChartFactory) {
	return function (dataset, elID, baseColor) {
		var getBaseMap = function () {
				return mapFactory({
					id: elID,
					center: [39.215, -96.789],
					zoom: 5,
					g: false
				});
			},

			mapTotals = function (dataArr, category) {
				var result = d3.map();
				_.each(dataArr, function (d) {
					result.set(d.geo.id, d[category].total);
				});
				return result;
			},

			setOrdinalScaleDomain = function (dataArr) {
				var max = d3.max(dataArr, function (county) {
						return county.incomeData.total;
					}),
					min = d3.min(dataArr, function (county) {
						return county.incomeData.total;
					}),
					step = Math.round((max - min) / 5);
				return d3.range(min, max, step);
			},

			buildOrdinalScale = function (domainArr, rangeArr) {
				return d3.scale.ordinal().domain(domainArr).range(rangeArr);
			},

			buildBarChart = function (map, dataArr) {
				var barChart = barChartFactory({
						width: map.w * 0.36,
						height: map.h * 0.6,
						class: 'barChart',
						el: '#' + elID + '-bar'
					}),
					writeDataArr = function () {
						var result = {};
						_.each(dataArr, function (county) {
							result[county.geo.id] = _.pluck(county.incomeData.subPops, 'value');
						});
						return result;
					},
					setMax = function (data) {
						var maxArr = [];
						_.each(barChart.data, function (county) {
							maxArr.push(d3.max(county));
						});
						return d3.max(maxArr);
					};

				$('#' + elID + '-bar').parent().height(map.h);
				barChart.data = writeDataArr();
				barChart.max = setMax(barChart.data);
				barChart.titles = _.pluck(dataArr[0].incomeData.subPops, 'title');
				barChart.view = barChart.svg.selectAll('rect');
				barChart.scale = barChart.setLinearScale([0, barChart.max], [0, barChart.h - 60])
				return barChart;
			},

			renderBarChart = function (bar, data) {
				var bars = bar.view
									.data(data)
									.enter()
									.append('rect')
									.attr({
										width: function () {
											return bar.w / data.length - 4;
										},
										y: function (d) {
											return (bar.h - bar.scale(d)) - 20;
										},
										x: function (d, i) {
											if (i === 0) return (bar.w / data.length) * i + 2;
											else return (bar.w / data.length) * i;
										},
										class: function (d,i) {
											return bar.titles[i];
										}
									});

				return setTimeout(function () {
					bars.attr('height', function (d) {
						if (typeof d === 'undefined') return 0;
						return bar.scale(d);
					});
					bar.svg
						.selectAll('.wealth text')
						.data(data).enter().append('text')
						.text(function (d, i) {
							if (d === null) return '';
							else {
								var str = d.toString();
								return '$' + str.slice(0, -3) + ',' + str.slice(-3);
							}
						})
						.attr({
							x: function(d, i) {
						    return i * (bar.w / data.length) + 6;
						  },
					  	y: function(d) {
						    return bar.h - bar.scale(d) - 24;
						  },
						  "class": "wealth",
					  	"font-size": "18px",
					  	"fill": "#222",
					  });
					bar.svg.selectAll('.race text')
							.data(data).enter().append('text')
							.text(function (d, i) {
								return bar.titles[i];
							})
							.attr({
								x: function(d, i) {
									var space = (bar.titles[i].length > 5) ? 2 : 14;
							    return i * (bar.w / data.length) + space;
							  },
						  	y: function(d) {
							    return bar.h - 2;
							  },
							  "class": "race",
						  	"font-size": "18px",
						  	"fill": "#003366"
						  });
				}, 100);
			};

		return d3.json('../../data/wealth-gender-race/json/county-' + dataset + '.json', function (err, dataArr) {
			if (err) console.warn(err);

			var mapColor = d3.rgb(baseColor),
				ordinalDomain = setOrdinalScaleDomain(dataArr);

			var map = getBaseMap();

			map.medianTotalWealthMap = mapTotals(dataArr, 'incomeData');

			map.medianTotalPopMap = mapTotals(dataArr, 'popData');

			map.setCountyFillOpacity = buildOrdinalScale(ordinalDomain, d3.range(0.5,1.1,0.1));

			map.setCountyColor = buildOrdinalScale(ordinalDomain, [mapColor.brighter(1.5), mapColor.brighter(1), mapColor.brighter(0.5), mapColor.darker(0.5), mapColor.darker(1), mapColor.darker(1.5)]);
			
			map.bar = buildBarChart(map, dataArr);

			map.renderData = function () {
				map.states.attr("d", map.path);
				map.counties
					.attr({
						d: map.path,
						fill: function (d) {
							return map.setCountyColor(map.medianTotalWealthMap.get(d.id));
						},
						'fill-opacity': function (d) {
							return map.setCountyFillOpacity(map.medianTotalWealthMap.get(d.id));
						}
					})
					.on('mouseover', function (d) {
						var data = map.bar.data[d.id];
						map.bar.write = renderBarChart(map.bar, data);
					})
					.on('mouseout', function () {
						clearTimeout(map.bar.write);
						map.bar.svg.selectAll('rect').transition().ease('linear').attr('height', 0).attr('y', map.bar.h).remove();
						map.bar.svg.selectAll('text').remove();
					})
					.append("title")
            .text(function (d) {
              return map.medianTotalPopMap.get(d.id);
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