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

module.exports = function(headerValue, context, additionalHeaders) {
	var urlRewriter = context.convert.toProxyUrl;
    if (!headerValue)
        return null;

    var domain = _getFromCookie(headerValue, /(Domain\s*=\s*)(.*?)(\s*?(;|$))/i) || _getDomain(urlRewriter),
        path = _getFromCookie(headerValue, REGEX_PATH) || '/',
        expires = _getFromCookie(headerValue, /(expires\s*=\s*)(.*?)(\s*?(;|$))/i) || '/',
        isFullDomain = !domain.match(/^\./),
        newPath = url.resolve('http://'+domain, path)
            .replace(/^http:\/\//i,'/')
            .replace(/\/$/, '')
        ,
        cookieCookie    ,
        newHeaderValue
        ;

    if (headerValue.match(new RegExp('^'+cookieCookiePrefix, 'i'))) {
        return headerValue;  // not sure why this is needed
    }

    if (!isFullDomain){
        // we have a domain wildcard that must be handled
        cookieCookie = (function(){
            var name = cookieCookiePrefix + _getFromCookie(headerValue, /(.*?)\s*?=/i, 1),
                newCookie;

            newCookie =   name + '=' + domain+path +'; Path=/';
            if (expires){
                newCookie += '; expires=' +expires;
            }

            return newCookie;
        })();

        additionalHeaders.push({name: 'set-cookie', value: cookieCookie, state:'added'});
        newHeaderValue = headerValue
            .replace(/Domain\s*=\s*.*?($|;)/i, '')
            .replace(/Path\s*=\s*.*?($|;)/i, '');

        if (!/;\s*$/.test(newHeaderValue))
            newHeaderValue += '; ';

        newHeaderValue += 'path=/';

        return newHeaderValue
    }


    newHeaderValue = _replaceOrAppend(
        headerValue,
        REGEX_DOMAIN,
        '',
        ''
    );

    newHeaderValue = _replaceOrAppend(
        newHeaderValue,
        REGEX_PATH,
        '$1'  + newPath + '$3',
        'path='+newPath+';'
    );


    return newHeaderValue;
}
