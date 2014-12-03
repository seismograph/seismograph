var input = data.slice(1),
	output = {
		0: ['Black', 'Asian', 'White', 'Hispanic', 'Other']
	},
	setNums = function (val) {
		return val ? parseInt(val, 10) : null;
	},
	buildOther = function (arr, start) {
		var result = 0;
		for (var i = start; i < start + 4; i++) {
			arr[i] = setNums(arr[i]);
			if (arr[i] === null) {
				result = false;
				break;
			} else {
				result += arr[i];
			}
		}
		return (result) ? Math.round(result / 4) : null;
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
