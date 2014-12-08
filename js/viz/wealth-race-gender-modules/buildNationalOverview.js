define(["d3","underscore"],function(t,e){return function(s,a){var i=function(e,s){return t.select("#"+a).append("svg").attr({width:e,height:s})},n=function(e){return t.scale.linear().domain([0,e.max]).range([0,.42*e.h])},r=function(t){for(var s=[],a=0;a<t["0"].length;a++)s.push({title:t["0"][a],value:t["1"].incomeData.subPops[a]});tempObj=e.sortBy(s,function(t){return-t.value}),t["0"]=e.pluck(tempObj,"title"),t["1"].incomeData.subPops=e.pluck(tempObj,"value")},h=function(){var e=this.linearScale(t.max(this.data.incomeData.subPops));this.svg.append("line").attr({"class":"base",x1:0,y1:e,x2:this.w/2,y2:e})},c=function(t,e,s,a){var i=this;rectSize=this.linearScale(e),t.append("rect").attr({"class":a+" "+this.titles[s],x:function(){return i.xBase+="back"===a?.6*rectSize:0,"back"===a?i.xBase-rectSize:i.xBase-rectSize+40},y:function(){return i.yBase+=15,i.yBase-rectSize},width:rectSize,height:rectSize})},u=function(t,e){var s=this.linearScale(t);switch(e){case"bottom":return[{x:this.xBase-s,y:this.yBase},{x:this.xBase,y:this.yBase},{x:this.xBase+40,y:this.yBase+15},{x:this.xBase-s+40,y:this.yBase+15}];case"right":return[{x:this.xBase,y:this.yBase-s},{x:this.xBase,y:this.yBase},{x:this.xBase+40,y:this.yBase+15},{x:this.xBase+40,y:this.yBase+15-s}];case"top":return[{x:this.xBase-s,y:this.yBase-s},{x:this.xBase,y:this.yBase-s},{x:this.xBase+40,y:this.yBase+15-s},{x:this.xBase-s+40,y:this.yBase+15-s}];case"left":return[{x:this.xBase-s,y:this.yBase-s},{x:this.xBase-s,y:this.yBase},{x:this.xBase+40-s,y:this.yBase+15},{x:this.xBase+40-s,y:this.yBase+15-s}]}},l=function(e,s,a,i){var n=this.setPathPointMap(s,i),r=t.svg.line().x(function(t){return t.x}).y(function(t){return t.y}).interpolate("linear-closed");e.append("path").attr({d:r(n),"class":this.titles[a]})},o=function(){var e=this;this.xBase=140,this.yBase=e.linearScale(t.max(e.data.incomeData.subPops)),this.svg.selectAll("g.cubes").data(e.data.incomeData.subPops).enter().append("g").attr("class","cubes").each(function(s,a){var i=t.select(this);e.setRectAttr(i,s,a,"back"),e.setPathAttr(i,s,a,"bottom"),e.setPathAttr(i,s,a,"right"),e.setPathAttr(i,s,a,"top"),e.setPathAttr(i,s,a,"left"),e.setRectAttr(i,s,a,"front")})},x=function(){var e=this,s=30,a=50;this.svg.selectAll("g.legend").data(this.titles).enter().append("g").attr("class","legend").each(function(i,n){var r=t.select(this);r.append("rect").attr({x:e.w-.35*e.w,y:s+n*(5+a),height:a,width:a,"class":function(t){return t}}),r.append("text").text(function(t){var s=e.data.incomeData.subPops[n].toString();return"– "+t+": $"+s.slice(0,-3)+","+s.slice(-3)}).attr({x:e.w-(.35*e.w-20)+a,y:s+n*(5+a)+(a/2+4),"font-size":"20px",fill:"#222"})})};t.json("../../data/wealth-gender-race/json/us-"+s+".json",function(e){r(e);var s=$("#"+a).width(),y=Math.round(.3*s),B={svg:i(s,y),data:e["1"],titles:e["0"],w:s,h:y,buildBase:h,buildCubes:o,setRectAttr:c,setPathAttr:l,setPathPointMap:u,buildLegend:x};B.max=t.max(B.data.incomeData.subPops),B.linearScale=n(B),B.buildBase(),B.buildCubes(),B.buildLegend()})}});