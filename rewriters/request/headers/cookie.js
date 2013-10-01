var CookieStore = require('../../../cookie_store');
var q = require('q');

module.exports = function(headerValue, context) {
	var d = q.defer();

	var cookieStore = new CookieStore({
		userId: context.client.id,
		url: context.target.url
	});

	cookieStore.getCookieHeader(function(v){
		d.resolve(v);
	});

	return d.promise;
};
