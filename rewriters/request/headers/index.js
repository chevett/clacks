var o = {};
function _deleteHeader(headerValue, context, cb){ return null; }


o['accept-encoding'] = _deleteHeader;
//
// delete some heroku headers
o['x-request-start'] = _deleteHeader;
o['x-forwarded-proto'] = _deleteHeader;
o['x-forwarded-port'] = _deleteHeader;
o['x-forwarded-for'] = _deleteHeader;

module.exports = require('../../header-converter').create(__dirname, o);


