var http = require('http'),
	https = require('https'), 
	rewriters = require("./rewriters/"), 
	Context = require("./context/"), 
	injectors = require('./injectors/');

function _buildRequester(request, response){
	var requestContext = new Context(request, response),
		options = requestContext.target.oUrl,
        requestHeaders = rewriters.request.headers(request.headers, requestContext),
        f = function(cb){
            var f = /^https/i.test(options.protocol) ? https.request : http.request;
            return f(options, function(proxyResponse){
                var headers = {
                    request: requestHeaders,
                    response: rewriters.response.headers(proxyResponse.headers, requestContext)
                };

                cb(proxyResponse, headers, requestContext);
            });
        }
    ;
    
	options.method = request.method;
    options.headers = requestHeaders.toObject();

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
    var requester =  _buildRequester(request, response);
    
    var proxyRequest = requester(function(proxyResponse, headers, requestContext){
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

                body = rewriter(body, requestContext);

                if (contentType==='text/html'){
                    body = injectors(requestContext, {body: body, headers:headers});
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

};

