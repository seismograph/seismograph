define(["d3","underscore","leaflet","../../tools/mapFactory","../../tools/barChartFactory"],function(t,e,r,n,a){return function(r,o,i){var l=function(){var t=n({id:o,center:[39.215,-96.789],zoom:5,minZoom:3,maxZoom:9,g:!1});return $("#"+o).parent().height(t.h),t},u=function(r,n,a){var o=e.map(r,function(t){return Object.byString(t,a)});if(e.isArray(o[0])){var i=0;return e.each(o,function(e){var r=t[n](e);r>i&&(i=r)}),i}return t[n](o)},c=function(e,r){return t.scale.ordinal().domain(e).range(r)},s=function(t){var e=a({width:.36*t.w,height:.6*t.h,"class":"barChart",el:"#"+o+"-bar"});return $("#"+o+"-bar").css("top",(t.h-e.h)/2),e},d=function(t,e){if(!t)return!1;var r=this,n=r.view.data(t).enter().append("rect").attr({width:function(){return r.w/t.length-4},y:function(t){return r.h-r.scale(t)-20},x:function(e,n){return 0===n?r.w/t.length*n+2:r.w/t.length*n},"class":function(t,e){return r.titles[e]}});return setTimeout(function(){n.attr("height",function(t,n){return e[n]<500?0:r.scale(t)}),r.svg.selectAll(".wealth text").data(t).enter().append("text").text(function(t,r){if(null===t||e[r]<500)return"";var n=t.toString();return"$"+n.slice(0,-3)+","+n.slice(-3)}).attr({x:function(e,n){return n*(r.w/t.length)+6},y:function(t){return r.h-r.scale(t)-24},"class":"wealth","font-size":"18px",fill:"#222"})},100)};return t.json("../../data/wealth-gender-race/json/county-"+r+".json",function(e,r){e&&console.warn(e);var n=r["0"];delete r["0"];var a=l(),o=t.rgb(i),h=[77.542,3.295],p=[-18.312,-236.799];return totalIncomeDomain=function(){var e=u(r,"max","incomeData.total"),a=u(r,"min","incomeData.total"),o=Math.round((e-a)/n.length);return t.range(a,e,o)}(),a.setCountyFillOpacity=c(totalIncomeDomain,t.range(.5,1.1,.1)),a.setCountyColor=c(totalIncomeDomain,[o.brighter(1.5),o.brighter(1),o.brighter(.5),o.darker(.5),o.darker(1),o.darker(1.5)]),a.bar=s(a),a.bar.scale=a.bar.setLinearScale([0,u(r,"max","incomeData.subPops")],[0,a.bar.h-60]),a.bar.titles=n,a.bar.view=a.bar.svg.selectAll("rect"),a.bar.renderChart=d,a.renderData=function(){a.bar.svg.selectAll("text.race").data(a.bar.titles).enter().append("text").text(function(t){return t}).attr({x:function(t,e){var r=t.length>5?2:14;return e*(a.bar.w/a.bar.titles.length)+r},y:function(){return a.bar.h-2},"class":"race","font-size":"18px",fill:"#003366"}),a.states.attr("d",a.path),a.counties.attr({d:a.path,fill:function(t){return r[t.id]?a.setCountyColor(r[t.id].incomeData.total):0},"fill-opacity":function(t){return r[t.id]?a.setCountyFillOpacity(r[t.id].incomeData.total):0}}).on("mouseover",function(t){var e=r[t.id]?r[t.id].incomeData.subPops:!1;a.bar.write=a.bar.renderChart(e,r[t.id].popData.subPops)}).on("mouseout",function(){clearTimeout(a.bar.write),a.bar.svg.selectAll("rect").transition().ease("linear").attr("height",0).attr("y",a.bar.h-20).remove(),a.bar.svg.selectAll("text.wealth").remove()}).append("title").text(function(t){if(!r[t.id])return!1;var e=function(e){var n=e/r[t.id].popData.total*100;for(n=n.toFixed(2);"0"===n.charAt(n.length-1);)n=n.slice(0,-1);return"."===n.charAt(n.length-1)?n.slice(0,-1)+"%":n+"%"};return r[t.id].title+"\nPopulation: "+r[t.id].popData.total+"\n - Black: "+e(r[t.id].popData.subPops[0])+"\n - Asian: "+e(r[t.id].popData.subPops[1])+"\n - White: "+e(r[t.id].popData.subPops[2])+"\n - Hispanic: "+e(r[t.id].popData.subPops[3])+"\n - Other: "+e(r[t.id].popData.subPops[4])})},a.addUSLeafletOverlay({states:"path",county:"path",onReady:function(){a.reset(a.renderData)}}),a.view.setMaxBounds([h,p]),a.view.on("viewreset",function(){a.reset(a.renderData)}),a})}});