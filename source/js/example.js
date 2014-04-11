(function() {
    var dataset = [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]],
        h = 500, w = 800, svg = [], pad = 20, xMax = d3.max(dataset, function(d) { return d[0]; }),
        yMax = d3.max(dataset, function(d) { return d[1]; });

    function setRange(d, r) {
      return d3.scale.linear().domain(d).range(r);
    }

    var xRange = setRange([0, xMax], [pad, w - pad * 2]),
        yRange = setRange([0, yMax], [h - pad, pad]),
        rRange = setRange([0, yMax], [2, 12]),
        fRange = setRange([0, xMax], [0, 255]);

    svg = d3.select('#canvas')
            .append('svg')
            .attr({
              width: w,
              height: h
            });

    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr({
          cx: function(d) { return xRange(d[0]); },
          cy: function(d) { return yRange(d[1]); },
          r: function(d) { return rRange(d[1]); },
          fill: function(d) { return 'rgb(0, 123, ' + d3.round(fRange(d[0]), 0) + ')'; }
       });

    svg.selectAll('text')
       .data(dataset)
       .enter()
       .append('text')
       .text(function(d) { return d[0] + ', ' + d[1]; })
       .attr({
          'font-size': '12px',
          'font-family': 'sans-serif',
          fill: 'red',
          x: function(d) { return xRange(d[0]); },
          y: function(d) { return yRange(d[1]); }
       });
  }());