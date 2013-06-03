var lookup = (function(){
        var fs = require('fs'), o = {};

        fs.readdirSync(__dirname).forEach(function(file) {
            if (file!='index.js') {
                o[file.replace(/\.js$/i, '')] = _doRewrite(require("./" + file ));
            }
        });

        return o;
    })
;


function _isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

function _push(arr, v){
    if (v!==null && v!==undefined)
        arr.push(v);
}

function _doRewrite(f){
    return function (headerValue, urlRewriter) {
        var arr, newHeaders;
        if (!headerValue){
            return headerValue;
        }

        if (_isArray(headerValue)) {
            arr = [];

            for (var i = 0, l = headerValue.length; i < l; i++)  {
                newHeaders = f(headerValue[i], urlRewriter);

                if (_isArray(newHeaders)){
                    for (var x = 0, l2 = newHeaders.length; x < l2; x++) {
                       _push(arr, newHeaders[x]);
                    }
                }
                else {
                    _push(arr, newHeaders);
                }
            }

            return arr;
        }

        return f(headerValue, urlRewriter);
    }
}

module.exports = function (oldHeaders, urlRewriter) {
    var headerNames = Object.getOwnPropertyNames(oldHeaders),
        newHeaders = {}
    ;

   headerNames.forEach(function (headerName) {
        if (lookup[headerName]){
            newHeaders[headerName] = lookup[headerName](oldHeaders[headerName], urlRewriter);
        }
        else {
            newHeaders[headerName] = oldHeaders[headerName];
        }
    });

    delete newHeaders['content-length'];
    delete newHeaders['transfer-encoding'];
    newHeaders['transfer-encoding'] = 'chunked';

    return newHeaders;
}


