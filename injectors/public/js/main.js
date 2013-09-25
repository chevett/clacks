/* global URI: false */
(function(open, UriJs) {
	XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

		var targetRoot = window.location.pathname.substr(1);
		var target = UriJs(url).absoluteTo(targetRoot);
		var completeUrl = window.location.origin + '/' + target;

		if (url !== completeUrl){
			console.log('clacks intercepted "'+ url + '" and changed it to "' + completeUrl +'".');
		}

		open.call(this, method, completeUrl, async, user, pass);
	};
})(XMLHttpRequest.prototype.open, URI);

// maybe convert
function _mt3_(value){
	console.log('_mt3_: '+JSON.stringify(value));
	return value;
}

// definitely convert
function __mt3_(value){
	console.log('__mt3_: '+value);
	return value;
}