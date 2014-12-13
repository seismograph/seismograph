---
title: Racial Wealth Disparities in the US
slug: mapping-wealth-race
date: 2014-11-29
tags: map, leaflet, wealth, race, USA
---
<a href="http://www.pewresearch.org/fact-tank/2013/08/30/black-incomes-are-up-but-wealth-isnt/" target="_blank">Recent reports</a> show that, though US minority wages are on the rise, minority wealth isn't rising with them. To put this in perspective, the following visualizations use <a href="http://www.census.gov/data/developers/data-sets/acs-survey-5-year-data.html" target="_blank">2013 census data</a> to shed light on median wealth distribution in respect to race on the national, state and county level. Specifically, they visualize what the census defines as, _Total Wealth: the sum of the amounts reported separately for wage or salary income; net self-employment income; interest, dividends, or net rental or royalty income or income from estates and trusts; Social Security or Railroad Retirement income; Supplemental Security Income (SSI); public assistance or welfare payments; retirement, survivor, or disability pensions; and all other income_, in respect to family households.

<strong>Wealth Across the US</strong><br />
First, these cubes show median wealth by race on a national level. The 'other' category includes Pacific Islanders, Native Americans and what the census calls, people of 'some other race'.

<div class="nationalCubes external" id="wealth-race-gender"></div>

<strong>Wealth by County</strong><br />
This map visualizes median wealth by race on the county level. Counties painted darker shades of green have a higher median wealth for all races combined. Roll over any county to see specific wealth data on the bar chart. Also, take note, in some counties the sample sizes for individual races get pretty small, which can create some skewed perspectives.

<div class="mapWrap">
	<div class="canvas" id="county-wealth-map"></div>
	<span id="county-wealth-map-bar"></span>
</div>
END_SUMMARY

<strong>Welath by State</strong><br />
Finally, the following bar charts show median wealth distribution by state in order of wealthiest state to poorest state and wealthiest race to poorest race.

<div class="stateBar" id="state-bar-chart"></div>

All of these visualizations are built using the <a href="d3js.org" target="_blank">D3</a> library and the map is rendered with the help of the <a href="http://leafletjs.com/" target="_blank">Leaflet</a> library using <a href="https://www.mapbox.com/" target="_blank">Mapbox</a> tiles.