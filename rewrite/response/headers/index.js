var lookup = (function(){
        var fs = require('fs'), o = {};

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

        fs.readdirSync(__dirname).forEach(function(file) {
            if (file!='index.js') {
                o[file.replace(/\.js$/i, '')] = _doRewrite(require("./" + file ));
            }
        });

        return o;
    })()
;

function _extend(from){
    var props = Object.getOwnPropertyNames(from);
    var dest = {};

    props.forEach(function(name) {
        dest[name] = from[name];
    });

    return dest;
}

module.exports = function (oldHeaders, urlRewriter) {
    var headerNames = Object.getOwnPropertyNames(lookup),
        newHeaders = _extend(oldHeaders)
    ;

   headerNames.forEach(function (headerName) {
        var temp = lookup[headerName](oldHeaders[headerName], urlRewriter);

        if (temp!==null && temp!==undefined) {
            newHeaders[headerName] = temp;
        }
    });

    return newHeaders;
}


