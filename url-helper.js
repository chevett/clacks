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
			o,protocolOverride, portOverride;
		
		if (/^/.test(myUrl)){
			myUrl = myUrl.substr(1);
		}

		while (!/^\w\./.test(myUrl)){ // while we are not to the domain name yet
			
			if (/^https\//i.test(myUrl)){
				protocolOverride = 'https';
				myUrl = myUrl.substr(6);
			} else if (/^http\//i.test(myUrl)){
				protocolOverride = 'http';
				myUrl = myUrl.substr(5);
			} else if (/^\d+\//i.test(myUrl)){
				portOverride = myUrl.match(/^\d+/i)[0];
				myUrl = myUrl.replace(/^\d+\//i, '');
			} else {
				break;
			}	
		}

		if (protocolOverride){
			myUrl = protocolOverride + '://' + myUrl;
		} else {
			myUrl = (isSecure ? 'https://' :  'http://') + myUrl;
		}

		o = url.parse(myUrl);
		if (portOverride){
			o.port = portOverride;
			delete o.host;
		}
	
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

		originalUrl = originalUrl.replace(/^(http:|https:)?\/\//i, '');

		// handle moving the port to the front of the url
		if (/:\d+(\/|$)/.test(originalUrl)){
			originalUrl = originalUrl.match(/:(\d+)/)[1] + '/' + originalUrl;
			originalUrl = originalUrl.replace(/:\d+/, '');
		}

        return url.format(o) +'/'+ originalUrl ;
    };
};

exports.createFromProxyUrlFn = _getTargetUrl;
