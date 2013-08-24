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
	if (!req) return false;
	
    return settings.isProduction? req.headers['x-forwarded-proto'] == 'https' : req.secure;
}


function _getTargetUrl(request){
	return function(myUrl){
		if (!myUrl)return null;
		var isSecure = _isRequestSecure(request),
			o;
		
		if (/^/.test(myUrl)){
			myUrl = myUrl.substr(1);
		}
		myUrl = (isSecure ? 'https://' :  'http://') + myUrl;

		o = url.parse(myUrl);
		o.port = isSecure ? settings.sslPort : settings.port;

		return url.format(o);
	};
}

exports.createToProxyUrlFn = function(request){
    var requestTargetUrl = _getTargetUrl(request)(request ? request.url : null);

    return function (originalUrl){
        var o = Object.create(settings);

        if (/^(data:|#)/i.test(originalUrl)) return originalUrl;

        if (_isRelative(originalUrl)){
			if (!requestTargetUrl) return null;

            // we always return absolute urls, so use the current request to resolve any relative urls.
            originalUrl = url.resolve(requestTargetUrl, originalUrl);

            if (_isRequestSecure(request)){
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

exports.createFromProxyUrlFn = _getTargetUrl;
