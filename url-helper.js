var settings = require('./settings')(),
    url = require('url')
    ;

function _isRelative(url){
    return !/^(http:|https:)?\/\//i.test(url);
}

function _getDestinationUrl(request){
    var dest = request.url.substr(1);   // kill the slash

    if (!dest.match(/^(http:|https:)?\/\//i)) {
        dest = "http://" + dest;
    }

    return dest;
}

exports.createProxyUrlRewriter = function(request){

    // we always return absolute urls, so use the request to resolve any relative urls.
    var referrer =  _getDestinationUrl(request);

    return function (originalUrl){
        var o = Object.create(settings);

        if (_isRelative(originalUrl)){
            originalUrl = url.resolve(referrer, originalUrl);
        }

        o.protocol = settings.forceSsl || /https:\/\//.test(originalUrl) ? "https" : "http";

        return url.format(o) +'/'+ originalUrl.replace(/^(http:|https:)?\/\//i, '');
    };
}

exports.getTargetUrl = _getDestinationUrl;
