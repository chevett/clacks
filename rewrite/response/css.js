module.exports = function(css, urlRewriter) {
    return css.replace(/url\s*\(\s*('|")?(.+?)('|")?\s*\)/gi, function(a,b,c,d){
        if (c.match(/^data:image/i))
            return a;

        return 'url(' + (b || '') + urlRewriter(c) + (d || '') +')';
    });
}
