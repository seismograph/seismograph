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
			//if (i !== 7 && i !== 16) {
				arr[i] = setNums(arr[i]);
				if (typeof arr[i] === 'number') {
					result += arr[i];
					divisor += 1;
				}
			//}
		}
		return (result) ? Math.round(result / divisor) : null;
	},
	abbrvIfState = function (location) {
    var name = location.toUpperCase();
    var states = [
  		{'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},						{'name':'District of Columbia', 'abbrev':'DC'},
      {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
      {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'},
      {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
      {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
      {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
      {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
      {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
      {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
      {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
      {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
      {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
      {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
      {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
      {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
      {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
      {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'}
    ];
    var returnthis = location;
    _.each(states, function(value, index){
      if (value.name.toUpperCase() == name){
        returnthis = value.abbrev;
        return false;
      }
    });
    return returnthis;
	};

_.each(input, function (arr, i) {
		var id = (arr.length > 20) ? setNums(arr[19] + arr[20]) : setNums(_.last(arr));
		arr[6] = buildOther(arr, 6);
		arr[15] = buildOther(arr, 15);
		output[id] = {
			title: abbrvIfState(arr[0]),
			popData: {
				total: setNums(arr[1]),
				subPops: [
					setNums(arr[2]),
					setNums(arr[3]),
					setNums(arr[4]),
					setNums(arr[5]),
					//setNums(arr[7]),
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
					//setNums(arr[16]),
					arr[15]
				]
			}
		};
	});
output
