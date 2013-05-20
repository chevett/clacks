
var cheerio = require('cheerio')
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

    $("script").each(function(){
        var $this = $(this), src = $this.attr('src');



        if (src)  {
            $this.attr('src', urlRewriter(src))
        } else {
            $this[0].children[0].data = "";
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