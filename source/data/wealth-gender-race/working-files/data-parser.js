var input = data.variables,
	output = {};

_.each(input, function (v, i) {
		if (v.label.indexOf('Median family income in the past 12 months') !== -1 && v.label.indexOf('Margin of Error') === -1
			&& v.concept.indexOf('Presence') === -1 && v.concept.indexOf('GrndPrnt') === -1) {
			output[i] = v;
		}
	});
output
