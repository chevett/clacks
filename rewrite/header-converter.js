var fs = require('fs')
;


function _extend(from){
    var props = Object.getOwnPropertyNames(from);
    var dest = {};

    props.forEach(function(name) {
        dest[name] = from[name];
    });

    return dest;
}

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

function _buildConverter(dir) {
    var lookup = {};

    fs.readdirSync(dir).forEach(function(file) {
        if (file!='index.js') {
            lookup[file.replace(/\.js$/i, '')] = _doRewrite(require(dir + '/' + file ));
        }
    });

    return function (oldHeaders, urlRewriter) {
        var headerNames = Object.getOwnPropertyNames(lookup),
            newHeaders = _extend(oldHeaders)
            ;

        headerNames.forEach(function (headerName) {
            var oldHeaderValue = oldHeaders[headerName],
                newHeaderValue = lookup[headerName](oldHeaderValue, urlRewriter)
            ;

            if (newHeaderValue) {
                newHeaders[headerName] = newHeaderValue;
            }
            else if (oldHeaderValue) {
                delete newHeaders[headerName];
            }
        });

        return newHeaders;
    }
}

exports.create = _buildConverter







