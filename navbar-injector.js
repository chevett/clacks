var cheerio = require('cheerio'),
    settings = require('./settings')()
    handleBars = require('./node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
    fs = require('fs'),
    navBarTemplate = handleBars.compile(fs.readFileSync('public/templates/navbar.handlebars', {encoding:'utf-8'}))
;


function _objectToArray(o){
    var arr = [];
    for (var prop in o){
        if (o.hasOwnProperty(prop)){
            arr.push({
                'key' : prop,
                'value' : o[prop]
            });
        }
    }

    return arr;
}

module.exports = function(html, data)     {
    if (!settings.showNavBar){
        return html;
    }

    var $ = cheerio.load(html), $body = $('body');



    data.headers.request.original = _objectToArray(data.headers.request.original);
    data.headers.request.rewritten = _objectToArray(data.headers.request.rewritten);
    data.headers.response.original = _objectToArray(data.headers.response.original);
    data.headers.response.rewritten = _objectToArray(data.headers.response.rewritten);

    $body.prepend(navBarTemplate(data));

    return $.html();
}