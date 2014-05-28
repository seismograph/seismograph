---
title: Where Your Bicycle Is Most Likely To Get Stolen In San Francisco
slug: stolen-bicycle-map-sf
date: 2014-05-24
tags: bicycle, San Francisco, map, leaflet, neighborhood, crime
css: 
 - bicycle-sf.css
---
This map shows every reported bicycle theft in San Francisco in 2013. Each circle represents one theft. Concentric circles mark where multiple bicycles were stolen in one location. The map is built using <a href="https://data.sfgov.org/Public-Safety/SFPD-Incidents-2013/n4e2-etve">SFPD data</a>, <a href="http://mapbox.com">Mapbox</a> tiles, <a href="d3js.org">D3</a> and the <a href="http://leafletjs.com">Leaflet</a> JavaScript API.

<span style="text-decoration: underline;">Total # of bicycles reported stolen: 813</span>

<div class="mapWrap">
	<div class="canvas" id="sfBicycleTheft"></div>
</div>
END_SUMMARY

The trends are somewhat as expected. Market Street between 6th and 4th, the Ferry Building, CCSF, 16th and Mission BART and the general hospital are all popular spots for bike theft. Nonetheless, I still found the dataset interesting.

One of the more confusing things about this project was that, when I originally dropped the data on to the map, it looked like this:

<div class="imgWrap"><img src="http://lukeallanwhyte.com/images/bike-theft-orig.png" width="74%" height="auto"/></div>

It appeared as if dozens of bikes had been stolen from 850 Bryant Street, which didn't make any sense. I then realized that 850 Bryant Street is actually the address of the main SFPD station, which leads me to believe that none of the bikes were actually stolen in that location but, instead, location information just wasn't available for that specific incident and the coordinates of the station were provide as a substitute. Thus, I removed those points from the map.

A couple of tutorials were really helpful in building this project: 
<ul>
	<li><a href="http://leafletjs.com/examples/quick-start.html">The Leaflet quick start guide</a></li>
	<li><a href="http://bost.ocks.org/mike/leaflet/">Mike Bostock's tutorial for layering D3 atop Leaflet</a></li>
	<li><a href="http://bost.ocks.org/mike/bubble-map/">The 'Let's Make A Bubble Map' tutorial by Mike Bostock</a></li>
</ul>

