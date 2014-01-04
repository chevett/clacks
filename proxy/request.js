var util = require("util"),
	url = require('url'),
	PassThrough = require('stream').PassThrough,
	http = require('http'),
	https = require('https'),
	TranslatedResponse = require('./response');

function _getRequestor(myUrl){
	var protocol = url.parse(myUrl).protocol;

	switch (protocol){
		case 'https:':
			return https.request;

		case 'http:':
			return http.request;

		default:
			console.log('unrecognized protocol: ' + protocol);
			return http.request;
	}
}

function _sendRequest(self, context, options, newHeaders){
	var outRequestOptions = url.parse(options.url);
	outRequestOptions.headers = newHeaders.toObject();
	outRequestOptions.method = options.method;

	var outRequest = _getRequestor(options.url)(outRequestOptions, function(inResponse){
		self.emit('ready', new TranslatedResponse(context, inResponse));
	});

	outRequest.on('error', function(err){
		var e = new Error();
		e.name = "send_request";
		e.message = err;

		self.emit('error', e);
	});

	self.pipe(outRequest);
}

function TranslatedRequest(context, options){
	PassThrough.call(this);

	var _self = this;

	process.nextTick(function(){
		context.convert.rewriters.request.headers.convert(options.headers, context, function(newHeaders){
			_sendRequest(_self, context, options, newHeaders);
			_self.emit('headers', newHeaders);
		});
	});
}

util.inherits(TranslatedRequest, PassThrough);
module.exports = TranslatedRequest;
