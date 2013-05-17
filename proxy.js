var http = require('http')
    , url = require('url')
    , $ = require("jquery")
    , settings = require("./settings")()
    , S = require('underscore.string');


function _getDestinationRequestParameters(request){
    var dest = request.params.destination, opt;

    if (!S.startsWith(dest, "http://") || S.startsWith(dest, "https://")){
        dest = "http://" + dest;
    }

    opt = url.parse(dest);
    opt.headers = $.extend({}, request.headers);
    delete opt.headers.host;

    return opt;
}

function _handleRedirect(response, proxyResponse){

    response.writeHead(proxyResponse.statusCode, {'Location':_createProxiedUrl(proxyResponse.headers.location)});
    response.end();
}

function _createProxiedUrl(originalUrl, forceSsl){
    var o, s;

    originalUrl = typeof originalUrl === 'string' ? originalUrl : url.format(originalUrl);

    o = Object.create(settings);
    o.pathname = encodeURIComponent(originalUrl.replace(/http:\/\/|https:\/\//, ''));
    o.protocol = forceSsl || settings.forceSsl || originalUrl.match(/https:\/\//) ? "https" : "http";

    s = url.format(o);
    return s;
}



exports.go = function(request, response) {
    var destinationOptions =  _getDestinationRequestParameters(request);


    var proxy_request = http.request(destinationOptions, function(proxy_response){



        switch (proxy_response.statusCode){
            case 301:
            case 302:
                return _handleRedirect(response, proxy_response);
        }


        proxy_response.addListener('data', function(chunk) {
            response.write(chunk, 'binary');
        });

        proxy_response.addListener('end', function() {
            response.end();
        });

        response.writeHead(proxy_response.statusCode, proxy_response.headers);

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

