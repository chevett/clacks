var cheerio = require('cheerio'),
    settings = require('./settings')()
    handleBars = require('node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
    fs = require('fs'),
    navBarTemplate = handleBars.compile(fs.readFileSync('public/templates/navbar.handlebars', {encoding:'utf-8'})),
    debugInfoTemplate = handleBars.compile(fs.readFileSync('public/templates/debugInfo.handlebars', {encoding:'utf-8'}))
;

module.exports = function(html, data)     {
    if (!settings.showNavBar){
        return false;
    }

    var $ = cheerio.load(html), $body = $('body');



    $body.prepend(debugInfoTemplate(data));
    $body.prepend(navBarTemplate(data));


}