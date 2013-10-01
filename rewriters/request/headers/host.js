module.exports = function(headerValue, context) {
	return context.target.oUrl.hostname;
};
