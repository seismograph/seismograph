var VIZ = (function(v) {
  v.singlePeople = function() {
    var canvas = d3.select('#singlePeople'), // used to set width & height
        w = parseInt(canvas.style('width')),
        h = w * 0.60,

        map = (function() { // Build map using leaflet
                canvas.style('height', h+'px'); // Set the map height before instantiating it
                return new L.Map('singlePeople', {center: [37.545, -97.383], zoom: 4})
                    .addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.iho02bc8/{z}/{x}/{y}.png"));
              }()),
        svg = d3.select(map.getPanes().overlayPane).append("svg"), // Append SVG to map using D3
        g = svg.append("g").attr("class", "leaflet-zoom-hide"); // append 'g' element to the SVG to group data points later on

   	queue()
   		.defer(d3.json, '../data/single-percentage/singles.json')
   		.await(ready);

   	function ready(e, file) {
   		console.log(file);
   	}     
  };
  return v;
}(VIZ || {}));