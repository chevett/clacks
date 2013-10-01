var _ = require('underscore');
var m = require('merle');

module.exports = function($, context){
	var $body = $('head meta:last-child'),
		viewModel = {
			headers:{}
		},
	fnAppend;

	if ($body && $body.length){
		fnAppend = $body.append.bind($body);
	} else {

		$body = $('head');
		fnAppend = $body.prepend.bind($body);
	}

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
		.html('_mt3_= __mt3_ = function(v){return v;};console.log("running data");var mt3 = mt3 || {}; mt3.debug = '+ JSON.stringify(allCalls) + ';');

	fnAppend($script);
};
