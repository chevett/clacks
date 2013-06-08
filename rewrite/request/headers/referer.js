var url = require('url'),
    settings = require('../../../settings')(),
    dropMikeTown3Regex  = new RegExp(settings.hostname+'(:('+settings.port+'|'+settings.sslPort+'))?\\/', 'i');
;

module.exports = function(headerValue, urlRewriter) {
    return headerValue ? headerValue.replace(dropMikeTown3Regex, '') : null;

}