
var cheerio = require('cheerio'),
    cssRewriter = require('./css'),
    jsRewriter = require('./js'),
    settings = require('../settings')()
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
        $('body').prepend(
            '<div id="mt3-navbar" style="display:none;position: absolute;z-index: 99999;top: 0px;*position: absolute;*z-index: 2;margin-bottom: 20px;overflow: visible;"> \
                <div class="mt3-navbar-inner" style="width:100%;min-height: 40px;padding-right: 20px;padding-left: 20px;background-color: #fafafa;background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);background-repeat: repeat-x;border: 1px solid #d4d4d4;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=&quot;#ffffffff&quot;, endColorstr=&quot;#fff2f2f2&quot;, GradientType=0);*zoom: 1;-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);"> \
                    <button type="button" id="mt3-navbar-close" style="margin-right:6px;margin-top:4px;display: inline-block;*display: inline;padding: 4px 12px;margin-bottom: 0;*margin-left: .3em;font-size: 14px;line-height: 20px;color: #333333;text-align: center;text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);vertical-align: middle;cursor: pointer;background-color: #f5f5f5;*background-color: #e6e6e6;background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat: repeat-x;border: 1px solid #cccccc;*border: 0;border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);border-bottom-color: #b3b3b3;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);*zoom: 1;-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);float:left;">&larr;</button> \
                    <form id="mt3-navbar-form" style="margin: 0 0 20px;float:left;"> \
                        <input type="text" class="mt3-input" id="mt3-btn-nav-value" placeholder="http://www.google.com" style="width: 340px;display: inline-block;margin-bottom: 0px;background-color: #ffffff;border: 1px solid #cccccc;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);-moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);-webkit-transition: border linear 0.2s, box-shadow linear 0.2s;-moz-transition: border linear 0.2s, box-shadow linear 0.2s;-o-transition: border linear 0.2s, box-shadow linear 0.2s;transition: border linear 0.2s, box-shadow linear 0.2s;height: 20px;padding: 4px 6px;font-size: 14px;line-height: 20px;color: #555555;vertical-align: middle;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;margin-top: 5px;"> \
                        <button type="submit" class="mt3-btn" style="display: inline-block;*display: inline;padding: 4px 12px;margin-bottom: 0;*margin-left: .3em;font-size: 14px;line-height: 20px;color: #333333;text-align: center;text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);vertical-align: middle;cursor: pointer;background-color: #f5f5f5;*background-color: #e6e6e6;background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat: repeat-x;border: 1px solid #cccccc;*border: 0;border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);border-bottom-color: #b3b3b3;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);*zoom: 1;-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);">Go</button> \
                    </form> \
                </div> \
            </div> \
            <div id="mt3-btn-nav-tab" style="position:absolute;top:0;left:0;z-index:9999;width:60px;height:40px;background:transparent;"> \
                <button type="button" id="mt3-nav-tab-open" style="display: inline-block;*display: inline;padding: 4px 12px;margin-bottom: 0;*margin-left: .3em;font-size: 14px;line-height: 20px;color: #333333;text-align: center;text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);vertical-align: middle;cursor: pointer;background-color: #f5f5f5;*background-color: #e6e6e6;background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat: repeat-x;border: 1px solid #cccccc;*border: 0;border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);border-bottom-color: #b3b3b3;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);*zoom: 1;-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);float:left;">&rarr;</button> \
            </div> \
            <script src="/scripts/helpers.js"></script>'
        );
    }

//    $("head").prepend("<script type='text/javascript'>\
//        XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send;\
//        XMLHttpRequest.prototype.send = function(body) { \
//        alert('shit');     \
//        this.reallySend(body);\
//    };</script>")


    return $.html();
}