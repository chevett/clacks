var http = require('http')
    , url = require('url')
    , $ = require("jquery")
    , settings = require("./settings")()
    , S = require('underscore.string')
    , rewriters = (function(){
        var o={}, html = require('./rewrite/html'), css = require('./rewrite/css'), js = require('./rewrite/js'), json = require('./rewrite/json');

        o['text/html'] = html;

        o['text/javascript'] =
            o['application/javascript'] =
            o['application/x-javascript'] = js;

        o['application/json'] = json;

        o['text/css'] = css;

        return o;
    })()
    ;


function _getDestinationRequestParameters(request){
    var dest = request.url.substr(1),   // kill the slash
        opt;

    if (!S.startsWith(dest, "http://") || S.startsWith(dest, "https://")){
        dest = "http://" + dest;
    }

    opt = url.parse(dest);
    opt.headers = $.extend({}, request.headers);
    delete opt.headers.host;
    delete opt.headers['accept-encoding'];  // TODO: handle gzip

    return opt;
}

function _writeResponseHeaders(request, response, proxyResponse){

    var headers = $.extend({}, proxyResponse.headers);

    switch (proxyResponse.statusCode){
        case 301:
        case 302:
            headers.location =  _createProxiedUrl(proxyResponse.headers.location, request);
        break;
    }

    response.writeHead(proxyResponse.statusCode, headers);

}


function _getRewriter(proxyResponse){
    var contentType = (proxyResponse.headers["content-type"] || "").match(/^([\w\-/]+?)(;|$)+/i);
    return contentType && contentType.length>1 ? rewriters[contentType[1]] : null;
}

function _isRelative(url){
    return !url.match(/^(http:|https:)?\/\//i);
}

function _createProxiedUrl(originalUrl, referrer, forceSsl){
    var o, s;

    originalUrl = typeof originalUrl === 'string' ? originalUrl : url.format(originalUrl);

    if (_isRelative(originalUrl)){
        originalUrl = url.resolve(referrer, originalUrl);
    }




    o = Object.create(settings);
    o.pathname = originalUrl.replace(/http:\/\/|https:\/\//, '');
    o.protocol = forceSsl || settings.forceSsl || originalUrl.match(/https:\/\//) ? "https" : "http";

    s = url.format(o);
    return s;
}



exports.go = function(request, response) {
    var destinationOptions =  _getDestinationRequestParameters(request)
        , html="", encoding;



    var proxy_request = http.request(destinationOptions, function(proxy_response){
        var rewriter = _getRewriter(proxy_response);

        _writeResponseHeaders(request, response, proxy_response);

        if (rewriter){
            encoding = proxy_response.headers["content-type"].match(/charset=(.+)/i)[1];

            proxy_response.addListener('data', function(chunk) {

                html += new Buffer(Array.prototype.slice.call(chunk, 0), encoding).toString(encoding);
            });

            proxy_response.addListener('end', function() {
                response.write(rewriter(html, url.format(destinationOptions)), encoding);
                response.end();
            });

        } else {

            proxy_response.addListener('data', function(chunk) {
                response.write(chunk, 'binary');
            });

            proxy_response.addListener('end', function() {
                response.end();
            });
        }

        proxy_response.addListener('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    });


    proxy_request.addListener('response', function (proxy_response) {


    });

    request.addListener('data', function(chunk) {
        proxy_request.write(chunk, 'binary');
    });

    request.addListener('end', function() {
        proxy_request.end();
    });

}


exports.toProxiedUrl = _createProxiedUrl;

