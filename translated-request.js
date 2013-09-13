var util = require("util"),
	url = require('url'),
	PassThrough = require('stream').PassThrough,
	http = require('http'),
	https = require('https'),
	rewriters = require('./rewriters/').request,
	TranslatedResponse = require('./translated-response')

function _getRequestor(myUrl){
	switch (url.parse(myUrl).protocol){
		case 'https:':
			return https.request;

		case 'http:':
			return http.request;
	}
}

function TranslatedRequest(context, options){
	PassThrough.call(this);

	var _self = this;

	var outRequestOptions = url.parse(options.url);
	outRequestOptions.headers = rewriters.headers(options.headers, context).toObject();
	outRequestOptions.method = options.method;

	var outRequest = _getRequestor(options.url)(outRequestOptions, function(inResponse){
		_self.emit('ready', new TranslatedResponse(context, inResponse));
	});

	outRequest.on('error', function(err){ console.log(err); });

	this.pipe(outRequest);
}

util.inherits(TranslatedRequest, PassThrough);
module.exports = TranslatedRequest;
