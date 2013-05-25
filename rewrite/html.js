
var cheerio = require('cheerio'),
    cssRewriter = require('./css'),
    jsRewriter = require('./js')
    ;

module.exports = function(html, urlRewriter) {


    var $ = cheerio.load(html);


    $("img").each(function(){
        var $this = $(this);
        $this.attr('src', urlRewriter($this.attr('src')))
    });

    $("a").each(function(){
        var $this = $(this);
        $this.attr('href', urlRewriter($this.attr('href')))
    });

    $("form[action]").each(function(){
        var $this = $(this);
        $this.attr('action', urlRewriter($this.attr('action')))
    });

    $("link[href]").each(function(){
        var $this = $(this);
        $this.attr('href', urlRewriter($this.attr('href')))
    });

    $("script").each(function(){
        var $this = $(this),
            src = $this.attr('src'),
            content
        ;

        if (src)  {
            $this.attr('src', urlRewriter(src))
        } else {
            content =  $this[0].children[0].data;
            $this[0].children[0].data = jsRewriter(content, urlRewriter);
        }
    });


    $("*[style]").each(function(){
        var $this = $(this),
            content =  $this.attr('style'),
            newContent = cssRewriter(content, urlRewriter);

        $this.attr('style',newContent);
    });

    $("style").each(function(){
        var $this = $(this),
            src = $this.attr('src')
        ;

        if (src)  {
            $this.attr('src', urlRewriter(src))
        } else {
            $this.html(cssRewriter($this.html(), urlRewriter));
        }
    });


//    $("head").prepend("<script type='text/javascript'>\
//        XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send;\
//        XMLHttpRequest.prototype.send = function(body) { \
//        alert('shit');     \
//        this.reallySend(body);\
//    };</script>")


    return $.html();
}