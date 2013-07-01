var cheerio = require('cheerio'),
    cssRewriter = require('./css'),
    jsRewriter = require('./js')
    ;

module.exports = function(html, urlRewriter) {

    var $ = cheerio.load(html),
        rewriteUrlAttribute = function (attributeName){
            return function(){
                var $this = $(this);
                $this.attr(attributeName, urlRewriter($this.attr(attributeName)));
            };
        },
        rewriteContent = function (rewriter){
            return function(){
                var $this = $(this);
                var tagName = $this[0].name;
                // we must include the original outer tag, otherwise cheerio doesn't know how to parse it correctly.
                // for example, script content will be parsed as html
                var $new = $('<'+ tagName + '>' + rewriter($this.html(), urlRewriter) + '</'+ tagName + '>');

                $this.after($new);
                $this.remove();
            };
        }
        ;

    $("*[src]").each(rewriteUrlAttribute('src'));
    $("*[href]").each(rewriteUrlAttribute('href'));
    $("form[action]").each(rewriteUrlAttribute('action'));

    $("style:not([src])").each(rewriteContent(cssRewriter));
    $("script:not([src])").each(rewriteContent(jsRewriter));

    $("*[style]").each(function(){
            var $this = $(this),
            content =  $this.attr('style'),
            newContent = cssRewriter(content, urlRewriter);

        $this.attr('style', newContent);
    });

    return $.html();
}