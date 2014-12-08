define(["d3","underscore"],function(t,e){return function(n,a){var i=function(e,n){return t.select("#"+a).append("svg").attr({width:e,height:n})},r=function(t){var n=0;return e.each(t,function(t){var a=e.pluck(t.incomeData.subPops,"value"),i=e.reduce(a,function(t,e){return t+e});i>n&&(n=i)}),n},s=function(e){return t.scale.linear().domain([0,e.max]).range([0,e.w-40-2*e.data[0].incomeData.subPops.length])},u=function(){var n=this;this.xPos=0,this.yPos=50,this.svg.selectAll("g.stateBarsG").data(this.data).enter().append("g").attr("class","stateBarsG").each(function(a,i){var r=a.incomeData.subPops,s=t.select(this);return"Puerto Rico"===a.title?!1:(n.xPos=40,n.addStateLabel(s,a.title),e.each(r,function(t,e){n.buildBars(s,t,e,i),n.addWealthLabel(s,t)}),24==i&&(n.addLegend(n.yPos+47,"middleLegend"),n.yPos+=50),n.yPos+=45,void 0)})},o=function(e,n){var e=e,a=40;this.svg.selectAll("g."+n).data(this.titles).enter().append("g").attr("class",n).each(function(n,i){var r=t.select(this);r.append("rect").attr({x:function(){return(a+120)*i+42},y:e,height:a,width:a,"class":function(){return n}}),r.append("text").text(function(){return": "+n}).attr({x:function(){return(a+120)*i+44+a},y:e+25,"font-size":"18px",fill:"#222"})})},c=function(t,e){var n=this;t.append("text").text(function(){return e+":"}).attr({x:0,y:n.yPos+25,"font-size":"18px",fill:"#222"})},l=function(t,e){var n=this,a=this.linearScale(e.value),i=e.value.toString();i="$"+i.slice(0,-3)+","+i.slice(-3),t.append("text").text(function(){return i}).attr({x:function(){return n.xPos-a/2-i.length/2*9},y:n.yPos+26,"font-size":"16px",fill:"#222"})},d=function(t,e){var n=this,a=this.linearScale(e.value);t.append("rect").attr({"class":e.title,x:function(){return n.xPos+=a,n.xPos-a},y:n.yPos,width:a,height:40})},f=function(t,n){return e.chain(t).map(function(t){return t.incomeData.subPops=e.map(t.incomeData.subPops,function(t,e){return{title:n[e],value:t}}),t.incomeData.subPops=e.sortBy(t.incomeData.subPops,function(t){return-1*t.value}),t}).sortBy(function(t){var n=e.pluck(t.incomeData.subPops,"value");return-1*e.reduce(n,function(t,e){return t+e})}).value()},h=function(t){return[t[2],t[1],t[4],t[3],t[0]]};t.json("../../data/wealth-gender-race/json/state-"+n+".json",function(t){var n=t["0"];delete t["0"];var p=$("#"+a).width(),v=45*e.keys(t).length+100,g=f(t,n),x={svg:i(p,v),w:p,h:v,max:r(g),buildViz:u,buildBars:d,addStateLabel:c,addWealthLabel:l,addLegend:o,titles:h(n),data:g};x.linearScale=s(x),x.addLegend(0,"topLegend"),x.buildViz(),x.addLegend(x.h-45,"bottomLegend")})}});