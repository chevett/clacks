module.exports = function(css, urlRewriter) {
    return css.replace(/url\s*\(\s*('|")?(.+?)('|")?\s*\)/i, function(a,b,c,d){return 'url('+b+urlRewriter(c)+d+')';})
}
