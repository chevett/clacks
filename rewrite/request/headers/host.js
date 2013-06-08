module.exports = function(headerValue, urlRewriter) {
    var o = urlRewriter('/').match(/^(\w*:\/\/)?.+?\/(.+?)(\/|$)/i); // get the target hostname, ex www.wwwwwwwwwwwwwwwww.com
    if (o && o.length > 2){
        return o[2];
    }

    return null;
}