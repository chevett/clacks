var settings = require('../settings')(),
    url = require('url'),
	absolurl = require('absolurl');

var httpBaseUrl = absolurl.ensureComplete(settings.createHttpUrl()),
	httpsBaseUrl = absolurl.ensureComplete(settings.createHttpsUrl()),
	httpBaseRegex = new RegExp('^' + httpBaseUrl.replace('.', '\\.').replace('/', '\\/'), 'i'),
	httpsBaseRegex = new RegExp('^' + httpsBaseUrl.replace('.', '\\.').replace('/', '\\/'), 'i');

function _createAbsolurlDefaults(request){
	return {
		protocol: _isClientConnectionSecure(request) ? 'https:' : 'http:',
		port: _isClientConnectionSecure(request) ? 443 : 80
	};
}

function _isClientConnectionSecure(req){
	if (!req) return false;

	return settings.isProduction? req.headers['x-forwarded-proto'] == 'https' : req.secure;
}

function _shouldProxy(myUrl){
	return !/^\s*(mailto|data|javascript):/i.test(myUrl);
}


function _getRequestUrl(request){
	var conversionOptions =_createAbsolurlDefaults(request); 
    var requestUrl = request ? request.url.substr(1) : null;
    var refererUrl = request && request.headers ? request.headers.referer : null;

	if (refererUrl){
		refererUrl = url.parse(refererUrl).pathname.substr(1);
	}

	var conversionContextUrl = absolurl.ensureComplete(requestUrl, refererUrl, conversionOptions);

	return conversionContextUrl;
}
exports.ToProxyUrlFn = function(request){
	var requestUrl = _getRequestUrl(request);
	var isClientConnectionSecure = _isClientConnectionSecure(request);
	var isHttpDowngrade = isClientConnectionSecure && !/^https/.test(requestUrl);

    return function (internetUrl){
		if (!internetUrl) return internetUrl;
		if (httpBaseRegex.test(internetUrl)) return internetUrl;
		if (httpsBaseRegex.test(internetUrl)) return internetUrl;

		var conversionOptions =_createAbsolurlDefaults(request);
		var clacksHomeUrl = httpBaseUrl;

		internetUrl = absolurl.ensureComplete(internetUrl, requestUrl, conversionOptions);

		if (!internetUrl) return internetUrl;
		if (!_shouldProxy(internetUrl)) return internetUrl;

		if (/^https/.test(internetUrl) || isHttpDowngrade) {
			clacksHomeUrl = httpsBaseUrl;
		}

		return clacksHomeUrl + internetUrl ;
	};
};

exports.FromProxyUrlFn = function (request){
	var requestUrl = _getRequestUrl(request);
	return function(myUrl){
		if (myUrl === undefined) return requestUrl;
		if (!myUrl) return null;

		var conversionoptions = _createAbsolurlDefaults(request);
		var internetUrl = absolurl.ensureComplete(myUrl, requestUrl, conversionoptions);

		return internetUrl;
	};
}
