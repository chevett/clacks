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
