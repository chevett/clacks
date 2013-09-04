module.exports = function(headerValue, context, cb) {
	cb(context.target.oUrl.hostname);
};
