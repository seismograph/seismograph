var input = data.slice(1),
	output = {
		0: ['Black', 'Asian', 'White', 'Hispanic', 'Other']
	},
	setNums = function (val) {
		return val ? parseInt(val, 10) : null;
	},
	buildOther = function (arr, start) {
		var result = 0,
			divisor = 0;
		for (var i = start; i < start + 4; i++) {
			//if (i !== 7 && i !== 8 && i !== 16 && i !== 17) {
				arr[i] = setNums(arr[i]);
				if (typeof arr[i] === 'number') {
					result += arr[i];
					divisor += 1;
				}
			//}
		}
		return (result) ? Math.round(result / divisor) : null;
	};

_.each(input, function (arr, i) {
		var id = (arr.length > 20) ? setNums(arr[19] + arr[20]) : setNums(_.last(arr));
		arr[6] = buildOther(arr, 6);
		arr[15] = buildOther(arr, 15);
		output[id] = {
			title: arr[0],
			popData: {
				total: setNums(arr[1]),
				subPops: [
					setNums(arr[2]),
					setNums(arr[3]),
					setNums(arr[4]),
					setNums(arr[5]),
					arr[6]
				]
			},
			incomeData: {
				total: setNums(arr[10]),
				subPops: [
					setNums(arr[11]),
					setNums(arr[12]),
					setNums(arr[13]),
					setNums(arr[14]),
					arr[15]
				]
			}
		};
	});
output
