var ToProxyUrlFn = require('../context/url-convertor').ToProxyUrlFn;

exports.createProxyUrl = function(internetUrl) {
	var toProxyUrlFn = new ToProxyUrlFn();
	return toProxyUrlFn(internetUrl);
};
