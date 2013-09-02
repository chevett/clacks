var url = require('url'),
    settings = require("../../../settings")(),
    cookieCookiePrefix = settings.cookieCookiePrefix;



function _getDomain(urlRewriter) {
    return url.parse(urlRewriter('/')).pathname.replace(/\//g, '');
}

function _getPath(urlRewriter) {
    var o = url.parse('http:/'+ url.parse(urlRewriter('temp')).pathname);

    return o.pathname.replace(/temp$/, '');
}

function _shouldSendCookie(domain, path, cookieName, allCookies){
    var cookieCookie;

    if (new RegExp('^'+cookieCookiePrefix, 'i').test(cookieName))
        return false;

    cookieCookie = allCookies[cookieCookiePrefix+cookieName];

    if (!cookieCookie)
        return true;

    var components = cookieCookie.split('/');
    var arr =[components.shift(), components.join('/')];

    if (!domain.match(new RegExp(arr[0] + '$'))){
         return false;
    }

    if (!new RegExp('$'+arr[1]).test(path)) {
        return false;
    }

    return true;

}

module.exports = function(headerValue, context) {
	var urlRewriter = context.convert.toProxyUrl;
    if (!headerValue){
        return headerValue;
    }

    var cookies = {},
        domain = _getDomain(urlRewriter),
        path = _getPath(urlRewriter),
        newHeaderValue = '';

    headerValue.replace(/((.*?)=)*?((.*?)=(.*?))(;|$)/gi, function (a,b,c,d,e,f,g){
    
       cookies[(c || e).trim()] = f;
       return a;
    });

    Object.getOwnPropertyNames(cookies).forEach(function (cookieName) {

        if (_shouldSendCookie(domain, path, cookieName, cookies)) {
            if (newHeaderValue!=='' && !/;\s*$/i.test(newHeaderValue)) {
                newHeaderValue += '; ';
            }
        
            newHeaderValue += cookieName + '=' + cookies[cookieName];
        }        
    });

    return newHeaderValue;
}
