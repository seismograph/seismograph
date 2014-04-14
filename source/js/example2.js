var VIZ = (function(v) {
  v.example2 = function() {
    var dataset = [5, 10, 14, 37, 20, 48, 16, 37, 12, 28],
        w = 800, h = 400, pad = 20, xScale = 0,
        total = (function() {
          var result = 0;
          for (var i = 0; i < dataset.length; i++) {
            result += dataset[i];
          }
          return result;
        }()),
        svg = d3.select('div.canvas#example2')
                .append('svg')
                .attr({
                  width: w,
                  height: h
                }),
        rRange = d3.scale.linear()
                         .domain([0, total])
                         .range([0, w/2]);

        svg.selectAll('circle')
           .data(dataset)
           .enter()
           .append('circle')
           .attr({
              cx: function(d) {
                xScale += rRange(d) * 2;
                return xScale - rRange(d);
              },
              cy: h/2,
              r: function(d) {
                return rRange(d) - ((rRange(d) / 10) / 2) - 1;
              },
              fill: 'yellow',
              stroke: 'orange',
              'stroke-width': function(d) {
                return rRange(d) / 10;
              }
           });
  };
  return v;
}(VIZ || {}));