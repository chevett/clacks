var url = require('url'),
    settings = require("../../settings")();

module.exports = function(headerValue, urlRewriter) {

    var domain, path, isFullDomain, newHeaderValue;


    domain = headerValue.match(/Domain\s*=\s*(.*?);/i);
    domain = domain && domain.length>1 ? domain[1] : null;

    if (!domain){
        domain = urlRewriter('/');
    }



    isFullDomain = !domain.match(/^\./);

    path = headerValue.match(/Path\s*=\s*(.*?);/i);
    path = path && path.length>1 ? path[1] : null;


    if (!isFullDomain){
        // just punting for now.  will need to create another cookie other something

        return headerValue;
    }

    path = url.resolve(domain, path);

    newHeaderValue = headerValue.replace(/(Domain\s*=\s*)(.*?)(\s*?;)/i, function(a, b, c, d){
        return b+settings.hostname+d;
    });

    newHeaderValue = newHeaderValue.replace(/(Path\s*=\s*)(.*?)(\s*?;)/i, function(a, b, c, d){
        return b+path+d;
    });

    return newHeaderValue;
}