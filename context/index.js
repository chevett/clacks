var url = require('url'),
	UrlConvertor = require('./url-convertor'),
	settings = require('../settings')(),
	rewriters = require('../rewriters'),
	serverUrl = settings.createHttpUrl(),
	secureServerUrl = settings.createHttpsUrl(),
	uuid = require('node-uuid'),
	extend = require('node.extend'),
	watch = require('nostalgorithm').watch;

function _id(request, response){
	var id = request.signedCookies[settings.idCookieName];

	if (id) return id;

	id = uuid.v4();
	response.cookie(settings.idCookieName, id, {signed: true});

	return id;
}

function _isClientConnectionSecure(req){
	if (!req) return false;

	return settings.isProduction? req.headers['x-forwarded-proto'] == 'https' : req.secure;
}

function _ipAddress(req){
	if (!req || !req.isProduction) return '127.0.0.1';

	return req.headers['x-forwarded-for'];
}

var Context = function(request, response){
	if (request.url === '/') request.url = '/' + settings.homepage;

	var self = this;
	this.errors = [];
	this.convert =  new UrlConvertor(request);
	this.convert.on('error', function(e){
		// todo: figure out alerts on these
		self.errors.push(e);
	});

	var targetUrl = this.convert.fromProxyUrl(),
		oTargetUrl;

	if (!targetUrl) return;

	this.convert.rewriters = rewriters;
	this.convert = watch(this.convert);

	oTargetUrl = url.parse(targetUrl);


	this.client =  {
		id: _id(request, response),
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
