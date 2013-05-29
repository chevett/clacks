
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

    $('body').attr('style', 'margin-top:20px');
    $('body').prepend(
        '<form onsubmit="__handleIt__();return false;" style="position:relative;z-index:99999;background:#f5f5f5;top:-20px;"> \
          <input type="text" id="miketown3-btn-nav-value"> \
          <button type="submit">Submit</button> \
        </form> \
        <script> \
            function __handleIt__() { \
                var dest = document.getElementById("miketown3-btn-nav-value").value || ""; \
                window.location = window.location.origin + "/" + dest; \
            } \
        </script>'
    );

//    $("head").prepend("<script type='text/javascript'>\
//        XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send;\
//        XMLHttpRequest.prototype.send = function(body) { \
//        alert('shit');     \
//        this.reallySend(body);\
//    };</script>")


    return $.html();
}