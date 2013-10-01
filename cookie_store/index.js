var settings = require('../settings')(),
	redis = require('redis'),
	Oven = require('oven');

if (settings.redisUrl) {
	var rtg   = require("url").parse(settings.redisUrl);
	redis = require("redis").createClient(rtg.port, rtg.hostname);

	redis.auth(rtg.auth.split(":")[1]);
} else {
	redis = require("redis").createClient();
}

function _getKey(userId){
	return 'cookies-' + userId;
}
var CookieStore = function(options){
	var shortBread = new Oven(options);
	var key = _getKey(options.userId);

	this.setCookies = function(lst){
		for (var i=0; i<lst.length; i++){
			this.setCookie(lst[i]);
		}
	};

	this.setCookie = function(header){
		var oCookie = shortBread.setCookie(header);
		var completedHeader = oCookie.toString();

		redis.rpush(key, completedHeader);
	};

	this.getCookieHeader = function(cb){
		redis.lrange(key, 0, -1, function(err, lst){
			shortBread.setCookies(lst);
			var temp = shortBread.getCookieHeader();
			cb(temp);
		});
	};
};


module.exports = CookieStore;
