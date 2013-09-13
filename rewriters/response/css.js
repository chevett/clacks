module.exports = function(css, context) {

	return css.replace(/url\s*\(\s*('|")?(.+?)('|")?\s*\)/gi, function(a,b,c,d){
		return 'url(' + (b || '') + context.convert.toProxyUrl(c) + (d || '') +')';
	});
};
