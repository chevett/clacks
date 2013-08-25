var settings = require('./settings')(),
    url = require('url')
    ;

function _isRelative(url){
    return !_isAbsolute(url);
}

function _isAbsolute(url){
	return /^(http:|https:)?\/\//i.test(url);
}
function _isSecure(url){
    return /^https:\/\//.test(url);
}

function _stripOverrides(myUrl){
	var o = {
		url: myUrl
	};

	if (/^\//.test(myUrl)){
		o.url = myUrl.substr(1);
	}

	while (!/^\w\./.test(o.url)){ // while we are not to the domain name yet

		if (/^https\//i.test(o.url)){
			o.protocol = 'https';
			o.url = o.url.substr(6);
		} else if (/^http\//i.test(o.url)){
			o.protocol = 'http';
			o.url = o.url.substr(5);
		} else if (/^\d+\//i.test(o.url)){
			o.port = o.url.match(/^\d+/i)[0];
			o.url = o.url.replace(/^\d+\//i, '');
		} else {
			break;
		}
	}

	return o;
}


function _isConversionContextSecure(req){
	if (!req) return false;
	
    return settings.isProduction? req.headers['x-forwarded-proto'] == 'https' : req.secure;
}

function _getTargetUrl(request){
	return function(myUrl){
		if (!myUrl)return null;
		var isSecure = _isConversionContextSecure(request),
			o;
		

		var overrides = _stripOverrides(myUrl);
		myUrl = overrides.url;

		if (overrides.protocol){
			myUrl = overrides.protocol + '://' + myUrl;
		} else {
			myUrl = (isSecure ? 'https://' :  'http://') + myUrl;
		}

		o = url.parse(myUrl);
		if (overrides.port){
			o.port = overrides.port;
			delete o.host;
		}
	
		return url.format(o);
	};
}

exports.createToProxyUrlFn = function(request){
    var conversionContextUrl = _getTargetUrl(request)(request ? request.url : null);
	var contextOverrides = _stripOverrides(request ? request.url : null);
	var contextClientProtocol = _isConversionContextSecure(request);
	var contextServerProtocol = contextOverrides.protocol || contextClientProtocol;

    return function (originalUrl, omitProtocol){
        var o = Object.create(settings);

        if (/^(data:|#)/i.test(originalUrl)) return originalUrl;

        if (_isRelative(originalUrl)){
			if (!conversionContextUrl) return null;

            // we always return absolute urls, so use the current request to resolve any relative urls.
            originalUrl = url.resolve(conversionContextUrl, originalUrl);

            if (_isConversionContextSecure(request)){
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

		if (contextClientProtocol!==contextServerProtocol){
			originalUrl = contextServerProtocol + '/' + originalUrl;
		}

        var newUrl = url.format(o) +'/'+ originalUrl ;
		return omitProtocol? newUrl.match(/^\w+:(.*)$/)[1] : newUrl;
	};
};

exports.createFromProxyUrlFn = _getTargetUrl;
