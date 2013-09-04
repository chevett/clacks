var handleBars = require('../node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
	fs = require('fs'),
	template = handleBars.compile(fs.readFileSync('injectors/google-analytics.handlebars', {encoding:'utf-8'}))
;
module.exports = function($, context, data){
	$('body').append(template({}));
};
