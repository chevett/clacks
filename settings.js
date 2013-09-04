var url = require('url');

var o = {
  hostname: process.env.MT3_hostname || 'localhost',
  port: process.env.MT3_port || 3000,
  sslPort: process.env.MT3_sslPort || 3001,
  forceSsl: true,
  showNavBar: true,
  lastCommit: process.env.MT3_lastCommit || '2dd0af47bc8586681b48733ec8f27413d0489e6a',
  isProduction: process.env.NODE_ENV === 'production',
  homepage: 'http://about.miketown3.com',
  cookieSecret: process.env.MT3_cookieSecret || 'you have gross feet',
  idCookieName: 'chocolate',
  redisUrl:  process.env.REDISTOGO_URL
};

o.createHttpsUrl = function(){
	return url.format({
		port: o.sslPort,
		hostname: o.hostname,
		protocol: 'https:',
		slashes: true,
		pathname:'/'
	});
};
o.createHttpUrl = function(){
	return url.format({
		port: o.port,
		hostname: o.hostname,
		protocol: 'http:',
		slashes: true,
		pathname:'/'
	});
};


module.exports = function(){return Object.create(o);}
