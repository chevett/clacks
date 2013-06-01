
function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

function doRewrite(f){
    return function (headerValue, urlRewriter) {
        var arr, newHeaders;
        if (!headerValue){
            return headerValue;
        }

        if (isArray(headerValue)) {
            arr = [];

            for (var i = 0, l = headerValue.length; i < l; i++)  {
                newHeaders = f(headerValue[i], urlRewriter);

                if (isArray(newHeaders)){
                    for (var x = 0, l2 = newHeaders.length; x < l2; x++) {
                        arr.push(newHeaders[x]);
                    }
                }
                else {
                    arr.push(newHeaders);
                }
            }

            return arr;
        }

        return f(headerValue, urlRewriter);
    }
}


exports['location'] = doRewrite(require('./location'));
exports['set-cookie'] = doRewrite(require('./set-cookie'));