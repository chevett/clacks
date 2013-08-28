var url = require('url');

module.exports = function(headerValue, urlRewriter) {
	var oUrl = url.parse(urlRewriter('/'));
	oUrl = url.parse(oUrl.pathname.substr(1));

	return oUrl.hostname;
};
