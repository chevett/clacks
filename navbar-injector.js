var cheerio = require('cheerio'),
    diff = require('diff'),
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

function _writeDiff(a, b){
    var result ='', diffResult = diff.diffLines(a, b);;
    for (var i=0; i < diffResult.length; i++) {

        if (diffResult[i].added && diffResult[i + 1] && diffResult[i + 1].removed) {
            var swap = diffResult[i];
            diffResult[i] = diffResult[i + 1];
            diffResult[i + 1] = swap;
        }

        if (diffResult[i].removed) {
            result += '<del>'+diffResult[i].value+'</del>'
        } else if (diffResult[i].added) {
            result += '<ins>'+diffResult[i].value+'</ins>'
        } else {
            result += diffResult[i].value;
        }
    }

    return result;
}

function _wrapWithDel(line){
    return '<del>'+line+'</del>';
}

function _wrapWithIns(line){
    return '<ins>'+line+'</ins>';
}

function _convertHeadersToDiff(originalHeaders, newHeaders){
    var a='',b='', result='', line;

    // todo: figure out how traverse these in the order they are submitted

    for (var p in originalHeaders){
        a = '<strong>' + p + ': </strong>' + originalHeaders[p];

        if (!newHeaders.hasOwnProperty(p)){
            line = _wrapWithDel(a);
        }
        else {
            line = '<strong>' + p + ': </strong>' + _writeDiff(originalHeaders[p], newHeaders[p]);
        }

        result += line + '<br>';
    }

    for (var p in newHeaders){
        if (!originalHeaders[p]){
            line = '<strong>' + p + ': </strong>' + newHeaders[p] + '<br>';
            line = _wrapWithIns(line);
            result += line + '<br>';
        }
    }

    return result;
}

module.exports = function(html, data)     {
    if (!settings.showNavBar){
        return html;
    }

    var $ = cheerio.load(html), $body = $('body'), viewModel = {};


    viewModel.requestHeadersHtml = _convertHeadersToDiff(data.headers.request.original, data.headers.request.rewritten);
    viewModel.responseHeadersHtml = _convertHeadersToDiff(data.headers.response.original, data.headers.response.rewritten);

    $body.prepend(navBarTemplate(viewModel));

    return $.html();
}