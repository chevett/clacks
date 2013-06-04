var url = require('url'),
    settings = require("../../../settings")(),
    REGEX_DOMAIN = /(Domain\s*=\s*)(.*?)(\s*?(;|$))/i,
    REGEX_PATH = /(Path\s*=\s*)(.*?)(\s*?(;|$))/i,
    REGEX_NAME = /(.*?)\s*?=/i,
    cookieCookiePrefix = settings.cookieCookiePrefix;



function _getDomain(urlRewriter) {
    return url.parse(urlRewriter('/')).pathname.replace(/\//g, '');
}


function _getFromCookie(cookieHeader, regex, index) {
    var o = cookieHeader.match(regex);
    if (typeof index === 'undefined')  {
        index = 2;
    }

    return o && o.length>index ? o[index] : null;
}



function _replaceOrAppend(str, regex, replaceCb, strAppend) {

    if (str.match(regex)){
        str = str.replace(regex, replaceCb);
    }
    else {
        if (!str.match(/;\s*$/i)){
            str += ';';
        }

        str += strAppend;
    }

    return str;
}


module.exports = function(headerValue, urlRewriter) {
    if (!headerValue)
        return null;

    var domain = _getFromCookie(headerValue, REGEX_DOMAIN) || _getDomain(urlRewriter),
        path = _getFromCookie(headerValue, REGEX_PATH) || '/',
        isFullDomain = !domain.match(/^\./),
        newDomain = settings.hostname,
        newPath = url.resolve('http://'+domain, path).replace(/^http:\/\//i,''),
        newHeaderValue,
        cookieCookie
    ;

    if (!isFullDomain){
        // we have a domain wildcard that must be handled

        newPath = '/';

        cookieCookie = (function(){
            var name = cookieCookiePrefix + _getFromCookie(headerValue, /(.*?)\s*?=/i, 1),
                newCookie,
                data = {
                    d: domain,
                    p: path
                };

            newCookie =   name + '=' + encodeURIComponent(JSON.stringify(data)) + '; Path=/';
            return newCookie;
        })();

        // remove domain
        newHeaderValue  = _replaceOrAppend(
            headerValue,
            REGEX_DOMAIN,
            function() { return ''},
            ''
        );

        newHeaderValue = _replaceOrAppend(
            newHeaderValue,
            REGEX_PATH,
            function(a, b, c, d) { return b + '/' + d},
            'Path=/;'
        );

        return [newHeaderValue, cookieCookie];
    }

    newHeaderValue = _replaceOrAppend(
        headerValue,
        REGEX_DOMAIN,
        function(a, b, c, d) { return b + newDomain + d},
        'Domain='+newDomain+';'
    );

    newHeaderValue = _replaceOrAppend(
        newHeaderValue,
        REGEX_PATH,
        function(a, b, c, d) { return b + newPath + d},
        'Path='+newPath+';'
    );

    return newHeaderValue;
}