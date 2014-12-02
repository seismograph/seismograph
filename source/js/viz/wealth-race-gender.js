define(['wealth-race-gender-modules/buildWealthMap'], function (buildWealthMap) {
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
					elementID: 'wealth-race-gender',
					baseColor: '#36862D'
				}
			});
		};

	return race;
});