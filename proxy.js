var http = require('http')
    ,https = require('https')
    , url = require('url')
    , settings = require("./settings")()
    , rewriters = require("./rewrite/")
    , urlHelper = require('./url-helper')
    ;

function _buildRequester(request){
    var options = url.parse(urlHelper.getTargetUrl(request)), 
        urlRewriter = urlHelper.createProxyUrlRewriter(request),
        f = function(cb){
            var f = /^https/i.test(options.protocol) ? https.request : http.request;
            return f(options, function(proxyResponse){

                var headers = {
                    sourceToMt3: request.headers,
                    mt3ToTarget: rewriters.request.headers(request.headers, urlRewriter),
                    targetToMt3: proxyResponse.headers,
                    mt3ToSource: rewriters.response.headers(proxyResponse.headers, urlRewriter)
                };

                cb(proxyResponse, headers, urlRewriter);
            });
        }
    ;
    
    options.method = request.method;
    f.options = options;

    return f;
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
    var requester =  _buildRequester(request);
    
    var proxyRequest = requester(function(proxyResponse, headers, urlRewriter){
        var rewriter = _getRewriter(proxyResponse),
            body='',
            encoding
        ;

        response.writeHead(proxyResponse.statusCode, headers.mt3ToSource);

        if (rewriter){
            encoding = _getContentEncoding(proxyResponse);

            proxyResponse.on('data', function(chunk) {

                body += new Buffer(Array.prototype.slice.call(chunk, 0), encoding).toString(encoding);
            });

            proxyResponse.on('end', function() {
                response.write(rewriter(body, urlRewriter), encoding);
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
        console.log('proxyRequest error: '+err);
        response.writeHead(500);
        //response.write(err.toString());
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

