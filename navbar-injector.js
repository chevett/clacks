var cheerio = require('cheerio'),
    diff = require('diff'),
    settings = require('./settings')()
    handleBars = require('./node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
    fs = require('fs'),
    navBarTemplate = handleBars.compile(fs.readFileSync('public/templates/navbar.handlebars', {encoding:'utf-8'}))
;



function _isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

function _writeDiff(a, b){
    var result ='', diffResult;

    try {
        diffResult = diff.diffWords(a, b);
    }
    catch (e) {
        console.log('a=' + a);
        console.log('b=' + b);

    }

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

function _writeHeaderLine(headerName, oldValue, newValue){
    var line;

    if (!newValue){
        line = '<strong>' + headerName + ': </strong>' + oldValue;
        line = _wrapWithDel(line);
    }
    else {
        line = '<strong>' + headerName + ': </strong>' + _writeDiff(oldValue, newValue);
    }

    return line + '<br>';
}

function _wrapWithDel(line){
    return '<del>'+line+'</del>';
}

function _wrapWithIns(line){
    return '<ins>'+line+'</ins>';
}

function _convertHeadersToDiff(originalHeaders, newHeaders){
    var oldValue,newValue, result='', line;

    // todo: figure out how traverse these in the order they are submitted

    for (var p in originalHeaders){
        oldValue =  originalHeaders[p];
        newValue =   newHeaders[p];

        if (_isArray(oldValue) && _isArray(newValue)){

             // todo: should really try to perform the best match before diffing the elements
             for (var i= 0, l=Math.max(oldValue.length, newValue.length); i<l; i++){
                 result += _writeHeaderLine(p, oldValue[i], newValue[i]);
             }

        }
        else if (_isArray(oldValue) || _isArray(newValue)){
            result += '<strong>' + p + ': </strong> error printing value';
        }
        else {
            result += _writeHeaderLine(p, oldValue, newValue);
        }
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