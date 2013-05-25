

var html = require('./html'),
    css = require('./css'),
    js = require('./js'),
    json = require('./json');


exports['text/html']  = html;
exports['text/css'] = css;
exports['application/json'] = json;

exports['text/javascript'] =  js;
exports['application/javascript'] = js;
exports['application/x-javascript'] = js;


