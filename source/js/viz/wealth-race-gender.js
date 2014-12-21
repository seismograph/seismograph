define(['wealth-race-gender-modules/buildWealthMap', 'wealth-race-gender-modules/buildNationalOverview', 'wealth-race-gender-modules/buildStateBar'], function (buildWealthMap, overviewBlocks, buildStateBar) {
	Object.byString = function(o, s) { // this is used to pass nested object keys around as parameters
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');           
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
	}

	var vizFactory = function (options) { // B/c I hope to use this code/post-format for multiple datasets/visualizations, here's a factory...
			var defaults = {
					dataset: false,
					mapOptions: false,
					barOptions: false,
					cubeOptions: false
				},
				specs = $.extend({}, defaults, options);

			if (!specs.dataset) return false;
			if (specs.cubeOptions && $('#'+specs.cubeOptions.elementID).length > 0) overviewBlocks(specs.dataset, specs.cubeOptions.elementID);
			if (specs.mapOptions && $('#'+specs.mapOptions.elementID).length > 0) buildWealthMap(specs.dataset, specs.mapOptions.elementID, specs.mapOptions.baseColor);
			if (specs.cubeOptions && $('#'+specs.barOptions.elementID).length > 0) buildStateBar(specs.dataset, specs.barOptions.elementID);
		},

		race = function () {
			return vizFactory({
				dataset: 'race',
				mapOptions: {
					elementID: 'county-wealth-map',
					baseColor: '#36862D' // The map will use as the median total wealth by county color (wealthier counties will be darker, poorer lighter)
				},
				cubeOptions: {
					elementID: 'wealth-race-gender'
				},
				barOptions: {
					elementID: 'state-bar-chart'
				}
			});
		};

	return race;
});