module.exports = function(css, context) {
	return css.replace(/url\s*\(\s*('|")?(.+?)('|")?\s*\)/gi, function(a,b,c,d){
		if (b !== d) return a;  // if the quotes match
		return 'url(' + (b || '') + context.convert.toProxyUrl(c) + (d || '') +')';
	});
};
