(function(open) {
	XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {


		console.log('currentUrl: ' + window.location);
		console.log('intercepted: ' + url);
		open.call(this, method, url, async, user, pass);
	};

})(XMLHttpRequest.prototype.open);
