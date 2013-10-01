var cheerio = require('cheerio'),
	cssRewriter = require('./../css/index'),
	jsRewriter = require('./../js/index'),
	injectors = require('./injectors')
	;

module.exports = function(html, context) {
	var $ = cheerio.load(html),
		rewriteUrlAttribute = function (attributeName){
			return function(){
				var $this = $(this);
				$this.attr(attributeName, context.convert.toProxyUrl($this.attr(attributeName)));
			};
		},
		rewriteContent = function (rewriter){
			return function(){
				var $this = $(this);
				var tagName = $this[0].name;
				// we must include the original outer tag, otherwise cheerio doesn't know how to parse it correctly.
				// for example, script content will be parsed as html
				var $new = $('<'+ tagName + '>' + rewriter($this.html(), context) + '</'+ tagName + '>');

				$this.after($new);
				$this.remove();
			};
		}
		;

	$("*[src]").each(rewriteUrlAttribute('src'));
	$("*[href]").each(rewriteUrlAttribute('href'));
	$("form[action]").each(rewriteUrlAttribute('action'));

	$("style:not([src])").each(rewriteContent(cssRewriter));
	
	var scripts = $("script:not([src])");
	scripts.each(rewriteContent(jsRewriter));

	$("*[style]").each(function(){
		var $this = $(this),
		content =  $this.attr('style'),
		newContent = cssRewriter(content, context);

		$this.attr('style', newContent);
	});

	console.log('running injectors');
	injectors($, context);

	console.log('running injectors done');
	return $.html();
};
