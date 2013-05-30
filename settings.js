

var o = {
  hostname: 'localhost',
  port: process.env.PORT || 1234,
  forceSsl: false,
  showNavBar: true
};

module.exports = function(){return Object.create(o);}