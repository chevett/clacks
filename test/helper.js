var urlHelper = require('../context/url-convertor');

exports.createSecureRequest = function(url, referer){
	var o = {
		url: '/' + url, 
			secure: true,
			headers:{
				'x-forwarded-proto': 'https'
			}
	};

	if (referer) o.headers.referer = referer;
	return o;
};

exports.createRequest = function(url, referer){
	var o = {
		url: '/' + url, 
			headers:{
			}
	};

	if (referer) o.headers.referer = referer;
	return o;
};

exports.createProxyUrl = function(internetUrl) {
	return urlHelper.createToProxyUrlFn()(internetUrl);
};
