var cheerio = require('cheerio'),
    diff = require('diff'),
    settings = require('./settings')()
    handleBars = require('./node_modules/connect-handlebars/node_modules/handlebars/lib/handlebars'),
    fs = require('fs'),
    navBarTemplate = handleBars.compile(fs.readFileSync('public/templates/navbar.handlebars', {encoding:'utf-8'}))
;



function _writeDiff(a, b){
    var result ='', diffResult = diff.diffWords(a, b);

    for (var i=0; i < diffResult.length; i++) {

        if (diffResult[i].added && diffResult[i + 1] && diffResult[i + 1].removed) {
            var swap = diffResult[i];
            diffResult[i] = diffResult[i + 1];
            diffResult[i + 1] = swap;
        }

        if (diffResult[i].removed) {
            result += _wrapWithDel(diffResult[i].value);
        } else if (diffResult[i].added) {
            result += _wrapWithIns(diffResult[i].value);
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

function _adaptHeaders(headers){
    var arr = [];

    headers.forEach(function(header){
        var headerViewModel = Object.create(header);
        headerViewModel.added = (headerViewModel.state === 'added');
        headerViewModel.removed = (headerViewModel.state === 'removed');
        headerViewModel.changed = (headerViewModel.state === 'changed');
        headerViewModel.unchanged = (headerViewModel.state === 'unchanged');

        if (headerViewModel.changed){
            headerViewModel.valueDiff = _writeDiff(headerViewModel.originalValue, headerViewModel.value);
        }

        arr.push(headerViewModel);
    });

    return arr;
}

module.exports = function(html, data)     {
    if (!settings.showNavBar){
        return html;
    }

    var $ = cheerio.load(html),
        $body = $('body'),
        viewModel = {
            headers:{}
        }
        ;

    viewModel.headers.response = _adaptHeaders(data.headers.response)
    viewModel.headers.request = _adaptHeaders(data.headers.request)

    $body.prepend(navBarTemplate(viewModel));

    return $.html();
}