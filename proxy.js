var http = require('http'), url = require('url'), $ = require("jQuery"), S = require('underscore.string');


function _getDestinationRequestParameters(request){
    var dest = request.params.destination, opt;

    if (!S.startsWith(dest, "http://") || S.startsWith(dest, "https://")){
        dest = "http://" + dest;
    }

    var opt = url.parse(dest);
    opt.headers = $.extend({}, request.headers);
    delete opt.headers["host"];

    return opt;
}


exports.go = function(request, response) {
    var destinationOptions =  _getDestinationRequestParameters(request);


    var proxy_request = http.request(destinationOptions, function(proxy_response){

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
