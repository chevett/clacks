var urlHelper = require('../context/url-convertor');

exports.createProxyUrl = function(internetUrl) {
	return urlHelper.createToProxyUrlFn()(internetUrl);
};
