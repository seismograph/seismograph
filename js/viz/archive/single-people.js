var VIZ=function(e){return e.singlePeople=function(){function e(e,t,n){var r={connectCountyIds:function(e){for(var t,n=0,r=e.singlesData.length,o={};r>n;n++)t=e.singlesData[n],o={percentMen:t.cPercentMen,percentWomen:t.cPercentWomen},s.set(+e.singlesData[n].id,o),c.set(+e.singlesData[n].id,t.cTotal)},buildScales:function(){return{linear:function(e,t){return d3.scale.linear().clamp(!0).domain(e).range(t)},sqrt:function(e,t){return d3.scale.sqrt().domain(e).range(t)},featureFill:function(e){var t=[],n=[50,60],r={men:{r:this.linear(n,[107,8]),g:this.linear(n,[174,81]),b:this.linear(n,[214,156])},women:{r:this.linear(n,[251,165]),g:this.linear(n,[106,15]),b:this.linear(n,[74,21])}};return"undefined"==typeof e?!1:t=e.percentMen>e.percentWomen?[r.men.r(e.percentMen),r.men.g(e.percentMen),r.men.b(e.percentMen)]:[r.women.r(e.percentWomen),r.women.g(e.percentWomen),r.women.b(e.percentWomen)]},radius:function(e,t){var n=this.sqrt([0,1e6],t);return"undefined"==typeof e?!1:n(e)}}},reset:function(e,r){var l=this,u=d3.geo.transform({point:l.projectPoint}),p=d3.geo.path().projection(u),d=l.buildScales();bounds=p.bounds(topojson.feature(t,t.objects.counties)),topLeft=bounds[0],bottomRight=bounds[1],range=function(){var e=o.getZoom();return e>=7?[6,22]:e>4&&7>e?[4,18]:4==e?[2,15]:3==e?[1,12]:3>e?[0,5]:[0,0]}(),l.connectCountyIds(n),a.attr("width",bottomRight[0]-topLeft[0]).attr("height",bottomRight[1]-topLeft[1]).style("left",topLeft[0]+"px").style("top",topLeft[1]+"px"),i.attr("transform","translate("+-topLeft[0]+","+-topLeft[1]+")"),e.attr({transform:function(e){return"translate("+p.centroid(e)+")"},r:function(e){var t=d.radius(c.get(e.id),range);return t?t:0},fill:function(e){var t=d.featureFill(s.get(e.id));return t?"rgb("+Math.round(t[0])+","+Math.round(t[1])+","+Math.round(t[2])+")":"white"}}),r.attr("d",p),o.off("viewreset"),o.on("viewreset",function(){l.reset(e,r)})},projectPoint:function(e,t){var n=o.latLngToLayerPoint(new L.LatLng(t,e));this.stream.point(n.x,n.y)},init:function(){var e,n,r=this;e=i.selectAll("circle").data(topojson.feature(t,t.objects.counties).features).enter().append("circle"),n=i.selectAll("path").data(topojson.feature(t,t.objects.states).features).enter().append("path").attr("class","states"),r.reset(e,n)}};return e?console.warn(e):(r.init(),void 0)}var t=d3.select("#singlePeople"),n=parseInt(t.style("width")),r=.6*n,o=function(){return t.style("height",r+"px"),new L.Map("singlePeople",{center:[37.545,-97.383],zoom:4}).addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.iho02bc8/{z}/{x}/{y}.png"))}(),a=d3.select(o.getPanes().overlayPane).append("svg"),i=a.append("g").attr("class","leaflet-zoom-hide"),s=d3.map(),c=d3.map();queue().defer(d3.json,"../data/single-percentage/us.json").defer(d3.json,"../data/single-percentage/singles2.json").await(e)},e}(VIZ||{});