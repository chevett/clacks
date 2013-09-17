var CookieStore = require('../../../cookie_store/');

module.exports = function(headerValue, context, cb) {
	var cookieStore = new CookieStore({
		userId: context.client.id,
		url: context.target.url
	});

	cookieStore.getCookieHeader(cb);
};
