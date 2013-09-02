module.exports = function(headerValue, context) {
	return headerValue ? context.convert.toProxyUrl(headerValue) : null;
};
