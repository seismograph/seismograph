var VIZ=function(e){return e.sfBicycleTheft=function(){var e=d3.select("#sfBicycleTheft"),t=parseInt(e.style("width")),r=.6*t,a=function(){return e.style("height",r+"px"),new L.Map("sfBicycleTheft",{center:[37.775,-122.444],zoom:13}).addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/lukewhyte.i8ahci39/{z}/{x}/{y}.png"))}(),n=d3.select(a.getPanes().overlayPane).append("svg"),i=n.append("g").attr("class","leaflet-zoom-hide");d3.json("../data/sf-bike-theft/bike-crime-geo.json",function(e,r){if(e)return console.warn(e);({prepDataset:function(e){for(var t=0,r=e.length,a={};r>t;t++)"800 Block of BRYANT ST"!==e[t].properties.address?(a[e[t].geometry.coordinates]?a[e[t].geometry.coordinates]+=5:a[e[t].geometry.coordinates]=5,e[t].properties.radius=a[e[t].geometry.coordinates]):e[t].properties.radius=0},mapPointToSvgPath:function(e,t){var r=a.latLngToLayerPoint(new L.LatLng(t,e));this.stream.point(r.x,r.y)},formatString:function(e){var e=e.toLowerCase();return e.charAt(0).toUpperCase()+e.slice(1)},formatDate:function(e){var t=new Date(1e3*e);return t.getMonth()+1+"/"+t.getDate()+"/"+t.getFullYear()},formatTime:function(e){var t=parseInt(e.slice(0,e.indexOf(":")));return t>12?t-12+e.slice(e.indexOf(":"))+"pm":t+e.slice(e.indexOf(":"))+"am"},resetMap:function(e,t){var o=this,s=e.bounds(r),p=s[0],m=s[1];e.pointRadius(function(e){var t=a.getZoom();return t>16?1.5*e.properties.radius:t>11?e.properties.radius:t>9?e.properties.radius/3:e.properties.radius/6}),n.attr("width",m[0]+10-(p[0]-10)).attr("height",m[1]+10-(p[1]-10)).style("left",p[0]+"px").style("top",p[1]+"px"),i.attr("transform","translate("+-p[0]+","+-p[1]+")"),t.attr({d:function(t){return e(t)},"fill-opacity":function(e){return 5===e.properties.radius?.5:e.properties.radius<=10?.35:.25}}).append("title").text(function(e){return"Crime: "+o.formatString(e.properties.crime)+"\nDate: "+o.formatDate(e.properties.date)+", "+o.formatTime(e.properties.time)+"\nAddress: "+o.formatString(e.properties.address)})},timeStolen:function(e){var r=200,a=d3.select("#timeStolen").append("svg").attr({width:t,height:r}),n=function(){for(var t=0,r=e.length,a=[];r>t;t++){var n=e[t].properties.time.trim(),n=parseInt(n.slice(0,n.indexOf(":")));a[n]?a[n]+=1:a[n]=1}return a}(),i="12am,1am,2am,3am,4am,5am,6am,7am,8am,9am,10am,11am,12pm,1pm,2pm,3pm,4pm,5pm,6pm,7pm,8pm,9pm,10pm,11pm".split(",");max=d3.max(n),yRange=d3.scale.linear().domain([0,max]).range([0,r-30]),oRange=d3.scale.linear().domain([0,max]).range([.4,1]),bWidth=t/n.length,hourRange=d3.scale.ordinal().domain(i).rangePoints([bWidth/2+2,t-(bWidth/2+2)]),xAxis=d3.svg.axis().scale(hourRange).orient("bottom").tickValues(hourRange.domain()),a.selectAll("rect").data(n).enter().append("rect").attr({width:function(){return bWidth-4},height:function(e){return yRange(e)},y:function(e){return r-yRange(e)},x:function(e,t){return bWidth*t},"fill-opacity":function(e){return oRange(e)}}),a.append("g").attr("class","axis").call(xAxis)},init:function(){var e,t,n,o=this;o.prepDataset(r.features),e=d3.geo.transform({point:o.mapPointToSvgPath}),t=d3.geo.path().projection(e),n=i.selectAll("path").data(r.features.sort(function(e,t){return t.properties.radius-e.properties.radius})).enter().append("path"),a.on("viewreset",function(){o.resetMap(t,n)}),o.resetMap(t,n),o.timeStolen(r.features)}}).init()})},e}(VIZ||{});