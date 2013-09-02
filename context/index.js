var url = require('url'),
	urlConvertor = require('./url-convertor'),
	settings = require('../settings')(),
	serverUrl = settings.createHttpUrl(),
	secureServerUrl = settings.createHttpsUrl();

function _id(request){
	return 'shit';
}

function _isClientConnectionSecure(req){
	if (!req) return false;

	return settings.isProduction? req.headers['x-forwarded-proto'] == 'https' : req.secure;
}
function _ipAddress(req){
	if (!req || !req.isProduction) return '127.0.0.1';

	return req.headers['x-forwarded-for'];
}

var Context = function(request){
	var fromProxyUrlFn = urlConvertor.createFromProxyUrlFn(request),
	targetUrl = fromProxyUrlFn(request.url.substr(1)),
	oTargetUrl = url.parse(targetUrl);
	
	this.convert =  {
		toProxyUrl: urlConvertor.createToProxyUrlFn(request),
		fromProxyUrl: urlConvertor.createFromProxyUrlFn(request),
	};
	this.client =  {
		id: _id(request),
		isSecure: _isClientConnectionSecure(request),
		ipAddress: _ipAddress(request)
	};
	this.target =  {
		url: targetUrl,
		oUrl: oTargetUrl
	};
};

Context.prototype.server = {
	url: serverUrl,
	oUrl: url.parse(serverUrl),
	secureUrl: secureServerUrl,
	oSecureUrl: url.parse(secureServerUrl)
};

module.exports = Context;
