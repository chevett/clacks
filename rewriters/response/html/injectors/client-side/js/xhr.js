var $ = require('jquery-browserify');
var absolurl = require('absolurl');

XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
	var currentTarget = window.location.pathname.substr(1);
	var newTarget = absolurl.ensureComplete(url, currentTarget);
	var completeUrl = window.location.origin + '/' + newTarget;

	if (url !== completeUrl){
		console.log('clacks intercepted "'+ url + '" and changed it to "' + completeUrl +'".');
	}

	open.call(this, method, completeUrl, async, user, pass);
};
