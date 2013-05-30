module.exports = function(headerValue, urlRewriter) {

    // todo: parse the path and domain

    return urlRewriter(headerValue);
}