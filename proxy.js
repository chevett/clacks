var http = require('http')
    , url = require('url')
    , settings = require("./settings")()
    , rewriters = require("./rewrite/")
    , urlHelper = require('./url-helper')
    ;

function _getDestinationRequestParameters(request){
    var dest = urlHelper.getTargetUrl(request),
        opt = url.parse(dest)
    ;

    opt.method = request.method;

    return opt;
}

function _getRewriter(proxyResponse){
    var contentType = (proxyResponse.headers["content-type"] || "").match(/^([\w\-/]+?)(;|$)+/i);
    return contentType && contentType.length>1 ? rewriters.response[contentType[1]] : null;
}



function _getContentEncoding(repsonse){
    var matches = (repsonse.headers["content-type"] || '').match(/charset=(.+)/i),
        encoding =   matches && matches.length>1 ? (matches[1] || '').toLowerCase() : 'utf-8';

    switch (encoding){
        case 'iso-8859-1':
           return 'utf-8';

        default:
            return encoding;
    }
}

exports.go = function(request, response) {
    var destinationOptions =  _getDestinationRequestParameters(request),
        html='',
        encoding,
        urlRewriter = urlHelper.createProxyUrlRewriter(request);

    destinationOptions.headers = rewriters.request.headers(request.headers, urlRewriter);

    var proxyRequest = http.request(destinationOptions, function(proxyResponse){
        var rewriter = _getRewriter(proxyResponse);

        response.writeHead(proxyResponse.statusCode, rewriters.response.headers(proxyResponse.headers, urlRewriter));

        if (rewriter){
            encoding = _getContentEncoding(proxyResponse);

            proxyResponse.on('data', function(chunk) {

                html += new Buffer(Array.prototype.slice.call(chunk, 0), encoding).toString(encoding);
            });

            proxyResponse.on('end', function() {
                response.write(rewriter(html, urlRewriter), encoding);
                response.end();
            });

        } else {

            proxyResponse.on('data', function(chunk) {
                response.write(chunk, 'binary');
            });

            proxyResponse.on('end', function() {
                response.end();
            });
        }

        proxyResponse.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    });

    proxyRequest.on('error', function (err) {
        console.log(err);
        response.writeHead(500);
        response.end();
    });

    request.pipe(proxyRequest);

    request.on('data', function(chunk) {
        proxyRequest.write(chunk, 'binary');
    });

    request.on('end', function() {
        proxyRequest.end();
    });

}

