var url = require('url');

module.exports = function(headerValue, context, cb) {
	if (!headerValue) return cb(headerValue);
	var oUrl = url.parse(headerValue);

	if (!oUrl || !oUrl.path) return cb(null);

	cb(oUrl.path.substr(1));
};
