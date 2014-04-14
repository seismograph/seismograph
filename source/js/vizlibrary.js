//= require 'd3.min'
//= require 'example'
//= require 'example2'

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