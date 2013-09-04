var settings = require('../settings')(),
	redis = require('redis'),
	ShortBread = require('short-bread');

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
	var shortBread = new ShortBread(options);
	var key = _getKey(options.userId);

	this.set = function(header){
		redis.rpush(key, header);
	};	

	this.get = function(cb){
		redis.lrange(key, 0, -1, function(err, lst){
			for (var i=0; i<lst.length; i++){
				shortBread.setCookie(lst[i]);
			}

			cb(shortBread.getCookieHeader());
		});
	};
};

module.exports = CookieStore;
