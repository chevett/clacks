var url = require('url'),
    settings = require("../../../settings")(),
    REGEX_DOMAIN = /(Domain\s*=\s*)(.*?)(\s*?(;|$))/i,
    REGEX_PATH = /(Path\s*=\s*)(.*?)(\s*?(;|$))/i;


function _getDomain(urlRewriter) {
    return url.parse(urlRewriter('/')).pathname.replace(/\//g, '');
}


function _getDomainFromCookie(cookieHeader) {
    var domain = cookieHeader.match(REGEX_DOMAIN);
    return domain && domain.length>2 ? domain[2] : null;
}

function _getPathFromCookie(cookieHeader){
    var path = cookieHeader.match(REGEX_PATH);
    return path && path.length>2 ? path[2] : null;
}

module.exports = function(headerValue, urlRewriter) {

    var domain = _getDomainFromCookie(headerValue),
        path = _getPathFromCookie(headerValue),
        isFullDomain,
        newHeaderValue
    ;

    if (domain) {
        isFullDomain = !domain.match(/^\./);
    }
    else {
        isFullDomain = true;
        domain = _getDomain(urlRewriter);
    }

    if (!isFullDomain){
        // just punting for now.  will need to create another cookie other something

        return headerValue;
    }

    newHeaderValue = headerValue.replace(REGEX_DOMAIN, function(a, b, c, d){
        return b + settings.hostname + d;
    });

    newHeaderValue = newHeaderValue.replace(REGEX_PATH, function(a, b, c, d){
        return b + url.resolve('http://'+domain, path).replace(/^http:\/\//i,'') +d;
    });

    return newHeaderValue;
}