

var o = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  forceSsl: false,
  showNavBar: true
};

module.exports = function(){return Object.create(o);}