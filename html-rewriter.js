
var cheerio = require('cheerio');


module.exports = function(html) {

    var $ = cheerio.load(html);

    return $.html();
}