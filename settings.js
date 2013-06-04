

var o = {
  hostname: process.env.MT3_hostname || 'localhost',
  port: process.env.MT3_port || 3000,
  forceSsl: false,
  showNavBar: true,
  lastCommit: process.env.MT3_lastCommit || '2dd0af47bc8586681b48733ec8f27413d0489e6a',
  cookieCookiePrefix: 'mt3___'
};

module.exports = function(){return Object.create(o);}