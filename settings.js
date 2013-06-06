

var o = {
  hostname: process.env.MT3_hostname || 'localhost',
  port: process.env.MT3_port || 3000,
  sslPort: process.env.MT3_sslPort || 3001,
  forceSsl: true,
  showNavBar: true,
  lastCommit: process.env.MT3_lastCommit || '2dd0af47bc8586681b48733ec8f27413d0489e6a',
  cookieCookiePrefix: 'mt3___',
  isProduction: process.env.NODE_ENV === 'production'
};

module.exports = function(){return Object.create(o);}