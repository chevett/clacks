module.exports = function(headerValue, context, cb) {
	if (!headerValue) return headerValue;

	return context.convert.toProxyUrl(headerValue);
};
