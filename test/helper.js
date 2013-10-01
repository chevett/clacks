var UrlHelper = require('../context/url-convertor');

exports.createProxyUrl = function(internetUrl) {
	var urlHelper = new UrlHelper();
	return urlHelper.toProxyUrl(internetUrl);
};
