module.exports = function(headerValue, urlRewriter) {
	return headerValue ? urlRewriter(headerValue) : null;
};
