define(['wealth-race-gender-modules/buildWealthMap', 'wealth-race-gender-modules/buildNationalOverview'], function (buildWealthMap, overviewBlocks) {
	Object.byString = function(o, s) { // this is used to pass nested object keys around as parameters
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
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

	var vizFactory = function (options) {
			var defaults = {
					dataset: false,
					mapOptions: false,
					barOptions: false,
					cubeOptions: false
				},
				specs = $.extend({}, defaults, options);

			if (!specs.dataset) return false;
			if (specs.mapOptions) buildWealthMap(specs.dataset, specs.mapOptions.elementID, specs.mapOptions.baseColor);
		},

		race = function () {
			return vizFactory({
				dataset: 'race',
				mapOptions: {
					elementID: 'county-wealth-map',
					baseColor: '#36862D'
				}
			});
		};

	return race;
});