var http = require('http')
    ,https = require('https')
    , url = require('url')
    , settings = require("./settings")()
    , rewriters = require("./rewrite/")
    , urlHelper = require('./url-helper')
    , navbarBuilder = require('./navbar-injector')
    ;


function _buildRequester(request){
    var fromProxyUrl = urlHelper.createFromProxyUrlFn(request),
        toProxyUrl = urlHelper.createToProxyUrlFn(request),
		options = url.parse(fromProxyUrl(request.url.substr(1))),
        requestHeaders = rewriters.request.headers(request.headers, toProxyUrl),
        f = function(cb){
            var f = /^https/i.test(options.protocol) ? https.request : http.request;
            return f(options, function(proxyResponse){
                var headers = {
                    request: requestHeaders,
                    response: rewriters.response.headers(proxyResponse.headers, toProxyUrl)
                };

                cb(proxyResponse, headers, toProxyUrl);
            });
        }
    ;
    
   console.log(url.format(options)); 
//	delete options.headers
//	console.log(options);
	options.method = request.method;
    options.headers = requestHeaders.toObject();
	//options.host = options.headers.host;
	console.log(options);
    return f;
}

function _getContentType(proxyResponse){
    var contentType = (proxyResponse.headers['content-type'] || '').match(/^([\w\-/]+?)(;|$)+/i);
    return contentType && contentType.length>1 ? contentType[1] : null;
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
        var contentType = _getContentType(proxyResponse),
            rewriter = rewriters.response[contentType],
            body='',
            encoding
        ;

        response.writeHead(proxyResponse.statusCode, headers.response.toObject());

        if (rewriter){
            encoding = _getContentEncoding(proxyResponse);

            proxyResponse.on('data', function(chunk) {

                body += new Buffer(Array.prototype.slice.call(chunk, 0), encoding).toString(encoding);
            });

            proxyResponse.on('end', function() {

                body = rewriter(body, urlRewriter);

                if (contentType==='text/html'){
                    body = navbarBuilder(body, {headers:headers});
                }

                response.write(body, encoding);
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
        //response.writeHead(500);
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

