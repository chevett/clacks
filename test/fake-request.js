var settings = require('../settings')();

module.exports = function FakeRequest(options){
	options = options || {};
	options.url = options.url || 'www.google.com';

	this.url = '/' + options.url;
	this.headers = {};
	this.signedCookies = { };
	this.signedCookies[settings.idCookieName] = "1234";
	if (options.secure){
		this.secure = true;
		this.headers['x-forwarded-proto'] = 'https';
	}

	if (options.referer) this.headers.referer = options.referer;
};
