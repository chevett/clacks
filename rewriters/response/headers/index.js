var o = {};
function _deleteHeader(value, context, cb){cb(null);}

module.exports = require('../../header-converter').create(__dirname, o);


// just kill it for now.  should rewrite this later.
// http://en.wikipedia.org/wiki/Content_Security_Policy
o['content-security-policy'] = _deleteHeader;
o['x-webkit-csp'] = _deleteHeader;
o['x-forwarded-for'] = _deleteHeader;
o['x-frame-options'] = _deleteHeader;
o['x-xss-protection'] = _deleteHeader;
