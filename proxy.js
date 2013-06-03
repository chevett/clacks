var http = require('http')
    , url = require('url')
    , $ = require("jquery")
    , settings = require("./settings")()
    , rewriters = require("./rewrite/")
    ;


function _getDestinationUrl(request){
    var dest = request.url.substr(1);   // kill the slash

    if (!dest.match(/^(http:|https:)?\/\//i)) {
        dest = "http://" + dest;
    }

    return dest;
}


function _getDestinationRequestParameters(request){
    var dest = _getDestinationUrl(request), opt;

    opt = url.parse(dest);
    opt.method = request.method;
    opt.headers = $.extend({}, request.headers);
    delete opt.headers.host;
    delete opt.headers['accept-encoding'];  // TODO: handle gzip

    return opt;
}

function _writeResponseHeaders(response, proxyResponse, urlRewriter){
    var headers = $.extend({}, proxyResponse.headers);

    for (var header in headers) {
        if (rewriters.headers[header]){
            headers[header] = rewriters.headers[header](headers[header], urlRewriter);
        }
    }


    // todo: maybe handle these with individual header rewriters?
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    headers['transfer-encoding'] = 'chunked';

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
    //o.pathname = originalUrl.replace(/http:\/\/|https:\/\//, '');
    o.protocol = forceSsl || settings.forceSsl || originalUrl.match(/https:\/\//) ? "https" : "http";

    s = url.format(o) +'/'+ originalUrl.replace(/^(http:|https:)?\/\//i, '');
    return s;
}

function _getContentEncoding(repsonse){
    var matches = (repsonse.headers["content-type"] || '').match(/charset=(.+)/i),
        encoding =   matches && matches.length>1 ? matches[1] : 'utf-8';

    switch (encoding){
        case 'iso-8859-1':
           return 'utf-8';

        default:
            return encoding;

    }

}

exports.go = function(request, response) {
    var destinationOptions =  _getDestinationRequestParameters(request)
        , html="", encoding;

    var proxy_request = http.request(destinationOptions, function(proxy_response){
        var requestUrl = url.format(destinationOptions),
            rewriter = _getRewriter(proxy_response),
            urlRewriter = function(originalUrl){
                return _createProxiedUrl(originalUrl, requestUrl);
            }
        ;

        _writeResponseHeaders(response, proxy_response, urlRewriter);

        if (rewriter){
            encoding = _getContentEncoding(proxy_response);

            proxy_response.addListener('data', function(chunk) {

                html += new Buffer(Array.prototype.slice.call(chunk, 0), encoding).toString(encoding);
            });

            proxy_response.addListener('end', function() {
                response.write(rewriter(html, urlRewriter), encoding);
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


    proxy_request.on('error', function (err) {
        console.log(err);
        response.writeHead(500);
        response.end();
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

