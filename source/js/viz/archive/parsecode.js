var VIZ = (function(v) {
  v.singlePeople = function() {
  	queue()
   		.defer(d3.json, '../data/single-percentage/raw-data-sm.json')
   		.defer(d3.tsv, '../data/single-percentage/county-names.tsv')
   		.await(ready);

		function ready(error, data, geo) {
      if (error) return console.warn(error);
      var people = data.data, 
      result = [];
      for (var i = 1; i < people.length; i++) {
      	var p = people[i],
      			men = p[0] - p[1] - p[2] - p[3] - p[4] - p[10],
      			women = p[5] - p[6] - p[7] - p[8] - p[9] - p[10],
      			total = men + women,
      			cMen = men - (parseInt(p[11]) * 2 + parseInt(p[12]) + parseInt(p[14])),
      			cWomen = women - (parseInt(p[13]) * 2 + parseInt(p[12]) + parseInt(p[14])),
      			cTotal = cMen + cWomen,
      			id = +(p[15] + p[16]),
      			county, state;

      	for (var j = 0; j < geo.length; j++) {
      		if (geo[j].id == id) {
      			county = geo[j].name;
      			break;
      		} 
      	}

      	for (var k = 0; k < geo.length; k++) {
      		if (geo[k].id == (Math.round(id/1000) * 1000)) {
      			state = geo[k].name;
      			break;
      		}
      	}
     
      	result.push({
      		total: total,
      		cTotal: cTotal,
      		percentMen: (men / total) * 100,
      		cPercentMen: (cMen / cTotal) * 100,
      		percentWomen: (women / total) * 100,
      		cPercentWomen: (cWomen / cTotal) * 100,
      		id: p[15] + p[16],
      		county: county,
      		state: state
      	});
      }
      var obj = {
      	'singlesData': result
      };
      var test = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
      $('<a href="data:' + test + '" download="data.json">download JSON</a>').appendTo('.canvas');
      //console.log(obj);
     }
	};
  return v;
}(VIZ || {}));