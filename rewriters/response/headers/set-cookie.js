var CookieStore = require('../../../cookie_store');
var q = require('q');

module.exports = function(headerValue, context) {
	if (!headerValue) return;

	var cookieStore = new CookieStore({
		userId: context.client.id,
		url: context.target.url
	});

	cookieStore.setCookie(headerValue);
};
