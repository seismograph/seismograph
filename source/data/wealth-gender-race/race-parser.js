var input = data.slice(1),
	output = [],
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
		arr[6] = buildOther(arr, 6);
		arr[15] = buildOther(arr, 15);
		output.push({
			geo: {
				title: arr[0],
				id: (arr.length > 20) ? setNums(arr[19] + arr[20]) : setNums(_.last(arr))
			},
			popData: {
				total: setNums(arr[1]),
				subPops: [
					{
						title: 'Black',
						value: setNums(arr[2])
					},
					{
						title: 'Asian',
						value: setNums(arr[3])
					},
					{
						title: 'White',
						value: setNums(arr[4])
					},
					{
						title: 'Hispanic',
						value: setNums(arr[5])
					},
					{
						title: 'Other',
						value: arr[6]
					}
				]
			},
			incomeData: {
				total: setNums(arr[10]),
				subPops: [
					{
						title: 'Black',
						value: setNums(arr[11])
					},
					{
						title: 'Asian',
						value: setNums(arr[12])
					},
					{
						title: 'White',
						value: setNums(arr[13])
					},
					{
						title: 'Hispanic',
						value: setNums(arr[14])
					},
					{
						title: 'Other',
						value: arr[15]
					}
				]
			}
		});
	});
output
