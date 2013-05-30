

var o = {
  hostname: process.env.MT3_hostname || 'localhost',
  port: process.env.MT3_port || 3000,
  forceSsl: false,
  showNavBar: true
};

module.exports = function(){return Object.create(o);}