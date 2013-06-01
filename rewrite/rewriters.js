

var html = require('./response/html'),
    css = require('./response/css'),
    js = require('./response/js'),
    json = require('./response/json'),
    headers = require('./response/headers/rewriters')
    ;

exports.headers = headers;

exports['text/html']  = html;
exports['text/css'] = css;
exports['application/json'] = json;

exports['text/javascript'] =  js;
exports['application/javascript'] = js;
exports['application/x-javascript'] = js;


