var Absolurl = require('absolurl');
var absolurl = new Absolurl();

absolurl.on('error', function(e){
	var mt3 = window.mt3 = window.mt3 || {};
	mt3.errors = mt3.errors || [];
	mt3.errors.push(e);
});

module.exports = function(){
	XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
		var currentTarget = window.location.pathname.substr(1);
		var newTarget = absolurl.resolve(url, currentTarget);
		var completeUrl = window.location.origin + '/' + newTarget;

		if (url !== completeUrl){
			window.mt3 = window.mt3 || {};
			window.mt3.xhrInterceptions = window.mt3.xhrInterceptions || [];
			window.mt3.xhrInterceptions.push({
				old: url,
				new: completeUrl
			});
			console.log('clacks intercepted "'+ url + '" and changed it to "' + completeUrl +'".');
		}

		open.call(this, method, completeUrl, async, user, pass);
	};
};
