// underscore-min.map

(function ($) {
	var consts = ['d3', 'underscore'],
		getCurrentVisualizations = function () {
			var result = [];
			$('div.external').each(function () {
				var vizID = $(this).attr('id');
				result.push(vizID);
			});
			return result;
		},
		curr = getCurrentVisualizations();

	requirejs.config({
		baseUrl: 'js/viz',
		paths: {
			leaflet: '../lib/leaflet',
			topojson: '../lib/topojson.v1.min',
			d3: '../lib/d3.min',
			underscore: '../lib/underscore.min'
		},
		shim: {
			leaflet: { exports: 'L' },
			topojson: { exports: 'topojson' },
			d3: { exports: 'd3' },
			underscore: { exports: '_' }
		}
	});

	requirejs(consts.concat(curr), function (d3, _) {
		var args = Array.prototype.slice.call(arguments, consts.length);
		_.each(args, function (viz) {
			if (typeof viz === 'function') {
				viz(d3, _);
			}
		});
	}, function (err) {
		requirejs.undef(err.requireModules[0]);
	});
}(jQuery));