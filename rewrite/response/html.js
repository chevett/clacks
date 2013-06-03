
var cheerio = require('cheerio'),
    cssRewriter = require('./css'),
    jsRewriter = require('./js'),
    settings = require('../../settings')(),
    handleBars = require('../../node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
    fs = require('fs'),
    navBarTemplate = handleBars.compile(fs.readFileSync('public/templates/navbar.handlebars', {encoding:'utf-8'}))
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
                $this.html(rewriter($this.html(), urlRewriter));
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

    if (settings.showNavBar) {
        $('body').prepend(navBarTemplate({}));
    }

//    $("head").prepend("<script type='text/javascript'>\
//        XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send;\
//        XMLHttpRequest.prototype.send = function(body) { \
//        alert('shit');     \
//        this.reallySend(body);\
//    };</script>")


    return $.html();
}