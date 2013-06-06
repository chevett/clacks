var settings = require('./settings')(),
    url = require('url')
    ;

function _isRelative(url){
    return !/^(http:|https:)?\/\//i.test(url);
}

function _isSecure(url){
    return /^https:\/\//.test(url);
}

function _isRequestSecure(req){
    if (settings.isProduction){
        return req.headers['x-forwarded-proto'] == 'https';
    }
    else {
        return req.secure;
    }
}


function _getTargetUrl(request){
    var myUrl = request.url.substr(1),
        isSecure = _isRequestSecure(request),
        o;

    myUrl = (isSecure ? 'https://' :  'http://') + myUrl;

    o = url.parse(myUrl)
    o.port = isSecure ? settings.sslPort : settings.port;

    return url.format(o);
}

exports.createProxyUrlRewriter = function(request){
    var requestTargetUrl = _getTargetUrl(request);

    return function (originalUrl){
        var o = Object.create(settings);

        // we always return absolute urls, so use the current request to resolve any relative urls.
        if (_isRelative(originalUrl)){
            originalUrl = url.resolve(requestTargetUrl, originalUrl);

            if (request.isSecure){
                o.protocol = 'https:';
                o.port = settings.sslPort;
            }
            else {
                o.protocol = 'http:';
                o.port = settings.port;
            }
        }
        else if (_isSecure(originalUrl)){
           o.protocol = 'https:';
           o.port = settings.sslPort;
        }
        else {
            o.protocol = 'http:';
            o.port = settings.port;
        }

        return url.format(o) +'/'+ originalUrl.replace(/^(http:|https:)?\/\//i, '');
    };
}

exports.getTargetUrl = _getTargetUrl;
