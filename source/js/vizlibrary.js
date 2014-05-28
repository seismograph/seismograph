//= require 'd3.min'
//= require 'leaflet'
//= require 'example'
//= require 'example2'
//= require 'sf-bicycle-theft'

if (typeof VIZ === 'object') {
	(function($, v) {
		var vID = '';
		$('div.canvas').each(function(i,e) {
			vID = $(e).attr('id');
			if (typeof v[vID] === 'function') {
				v[vID]();
			}
		});
		return;
	}(jQuery, VIZ));
}