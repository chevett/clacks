module.exports = function(headerValue, context, cb) {
	cb(headerValue ? context.convert.toProxyUrl(headerValue) : null);
};
