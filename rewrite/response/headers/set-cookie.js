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

    var domain = _getDomainFromCookie(headerValue) || _getDomain(urlRewriter),
        path = _getPathFromCookie(headerValue) || '/',
        isFullDomain = !domain.match(/^\./),
        newDomain = settings.hostname,
        newPath = url.resolve('http://'+domain, path).replace(/^http:\/\//i,''),
        newHeaderValue
    ;

    if (!isFullDomain){
        // just punting for now.  will need to create another cookie or something

        return null;
    }

    newHeaderValue = headerValue.replace(REGEX_DOMAIN, function(a, b, c, d){
        return b + newDomain + d;
    });

    if (newHeaderValue==headerValue){
        if (newHeaderValue.match(/;\s*$/i)) {
            newHeaderValue += ';';
        }

        newHeaderValue += 'Domain='+newDomain+';';
    }

    headerValue = newHeaderValue;

    newHeaderValue = newHeaderValue.replace(REGEX_PATH, function(a, b, c, d){
        return b + newPath +d;
    });

    if (newHeaderValue==headerValue){
        if (newHeaderValue.match(/;\s*$/i)) {
            newHeaderValue += ';';
        }

        newHeaderValue += 'Path='+newPath+';';
    }


    return newHeaderValue;
}