var url = require('url');

module.exports = function(headerValue, context) {
	if (!headerValue) return headerValue;
	var oUrl = url.parse(headerValue);

	if (!oUrl || !oUrl.path) return null;

	return oUrl.path.substr(1);
};
