var _ = require('lodash');

module.exports = function($, context){
	var $body = $('body'),
		viewModel = {
			headers:{}
		},
	fnAppend;

	var allCalls = _.chain(context.convert.nostalgorithm.calls)
		.filter(function(v){ return (/headers/).test(v.name);}) // need this because on google.com there are urls that break json encoding // need this because on google.com there are urls that break json encoding
		.map(function(v){
			return {
				name: v.name,
				args: [v.arguments[0]],
				value: v.value
			};
		})
		.value();

	var $script = $('<script></script>')
		.html('var mt3 = mt3 || {}; mt3.debug = '+ JSON.stringify(allCalls) + ';');

	$body.append($script);
};
