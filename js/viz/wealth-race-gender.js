define(["wealth-race-gender-modules/buildWealthMap","wealth-race-gender-modules/buildNationalOverview"],function(e){Object.byString=function(e,t){t=t.replace(/\[(\w+)\]/g,".$1"),t=t.replace(/^\./,"");for(var a=t.split(".");a.length;){var n=a.shift();if(!(n in e))return;e=e[n]}return e};var t=function(t){var a={dataset:!1,mapOptions:!1,barOptions:!1,cubeOptions:!1},n=$.extend({},a,t);return n.dataset?(n.mapOptions&&e(n.dataset,n.mapOptions.elementID,n.mapOptions.baseColor),void 0):!1},a=function(){return t({dataset:"race",mapOptions:{elementID:"county-wealth-map",baseColor:"#36862D"}})};return a});