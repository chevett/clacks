var url = require('url'),
    settings = require("../../../settings")(),
    cookieCookiePrefix = settings.cookieCookiePrefix;



function _getDomain(urlRewriter) {
    return url.parse(urlRewriter('/')).pathname.replace(/\//g, '');
}

function _shouldSendCookie(domain, cookieName, allCookies){
    var cookieCookie, objFromCookie;

    if (new RegExp('^'+cookieCookiePrefix, 'i').test(cookieName))
        return false;

    cookieCookie = allCookies[cookieCookiePrefix+cookieName]

    if (!cookieCookie)
        return true;

    objFromCookie = JSON.parse(decodeURIComponent(cookieCookie));


    // todo: need to handle path.  don't feel like it now.

    return domain.match(new RegExp(objFromCookie.d + '$'));
}

module.exports = function(headerValue, urlRewriter) {

    if (!headerValue){
        return headerValue;
    }

    var cookies = {},
        domain = _getDomain(urlRewriter),
        newHeaderValue = '';

    headerValue.replace(/((.*?)=)*?((.*?)=(.*?))(;|$)/gi, function (a,b,c,d,e,f,g){
    
       cookies[(c || e).trim()] = f;
       return a;
    });

    Object.getOwnPropertyNames(cookies).forEach(function (cookieName) {

        if (_shouldSendCookie(domain, cookieName, cookies)) {
            if (newHeaderValue!=='' && !/;\s*$/i.test(newHeaderValue)) {
                newHeaderValue += '; ';
            }
        
            newHeaderValue += cookieName + '=' + cookies[cookieName];
        }        
    });

    return newHeaderValue;
}
