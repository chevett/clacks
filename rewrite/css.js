var proxy = require('./../proxy')   // gross

module.exports = function(css, url) {
    return css.replace(/url\s*\(\s*('|")?(.+?)('|")?\s*\)/i, function(a,b,c,d){alert('url('+b+proxy.toProxiedUrl(c, url)+d+')');})
}
