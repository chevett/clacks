var url = require('url'),
    settings = require("../../../settings")(),
    REGEX_DOMAIN = /(Domain\s*=\s*)(.*?)(\s*?(;|$))/i,
    REGEX_PATH = /(Path\s*=\s*)(.*?)(\s*?(;|$))/i,
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

function _setDomainAndPath(headerValue, domain, path){
    var newHeaderValue = headerValue;

    newHeaderValue = _replaceOrAppend(
        newHeaderValue,
        REGEX_DOMAIN,
        '$2'  + domain + '$4',
        'Domain='+domain+';'
    );

    newHeaderValue = _replaceOrAppend(
        newHeaderValue,
        REGEX_PATH,
        '$2'  + path + '$4',
        'Path='+path+';'
    );

    return newHeaderValue;
}

module.exports = function(headerValue, urlRewriter, additionalHeaders) {
    if (!headerValue)
        return null;

    var domain = _getFromCookie(headerValue, REGEX_DOMAIN) || _getDomain(urlRewriter),
        path = _getFromCookie(headerValue, REGEX_PATH) || '/',
        isFullDomain = !domain.match(/^\./),
        newDomain = settings.hostname == 'localhost' ? '' : settings.hostname,
        newPath = url.resolve('http://'+domain, path)
            .replace(/^http:\/\//i,'/')
            .replace(/\/$/, '')
        ,
        cookieCookie
        ;

    if (headerValue.match(new RegExp('^'+cookieCookiePrefix, 'i'))) {
        return headerValue;  // not sure why this is needed
    }

    if (!isFullDomain){
        // we have a domain wildcard that must be handled

        newPath = '/';
        newDomain = '';

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

        additionalHeaders.push({name: 'set-cookie', value: cookieCookie, state:'added'});
        return _setDomainAndPath(headerValue, '', '/');
    }

    return _setDomainAndPath(headerValue, newDomain, newPath);
}