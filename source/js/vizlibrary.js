//= require 'd3.min'
//= require 'example'

if (typeof VIZ === 'object') {
	(function($, v) {
		var vID = '';
		$('div.canvas').each(function(i,e) {
			vID = $(e).attr('id');
			if (v[vID] && typeof v[vID] === 'function') {
				v[vID]();
			}
		});
		return;
	}(jQuery, VIZ));
}