var input = data.slice(1),
	output = [];

_.each(input, function (arr, i) {
		output.push({
			geo: {
				title: arr[0],
				id: (arr.length > 8) ? arr[7] + arr[8] : _.last(arr)
			},
			popData: {
				total: parseInt(arr[1], 10),
				subPops: [
					{
						title: 'Men',
						value: parseInt(arr[2], 10)
					},
					{
						title: 'Women',
						value: parseInt(arr[3], 10)
					}
				]
			},
			incomeData: {
				total: parseInt(arr[4], 10),
				subPops: [
					{
						title: 'Men',
						value: parseInt(arr[5], 10)
					},
					{
						title: 'Women',
						valuse: parseInt(arr[6], 10)
					}
				]
			}
		});
	});
output
