
var cheerio = require('cheerio')
    , url = require('url')
    , proxy = require('./../proxy')   // gross
    ;

module.exports = function(html, url) {


    var $ = cheerio.load(html);


    $("img").each(function(){
        var $this = $(this);
        $this.attr('src', proxy.toProxiedUrl($this.attr('src'), url))
    });

    $("a").each(function(){
        var $this = $(this);
        $this.attr('href', proxy.toProxiedUrl($this.attr('href'), url))
    });

    $("script").each(function(){
        var $this = $(this), scriptBody = $this[0].children[0].data, src = $this.attr('src');

        $this[0].children[0].data = "";

        if (src)  {
            $this.attr('src', proxy.toProxiedUrl(src, url))

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