

function doRewrite(f){
    return function (headerValue, urlRewriter) {
        var arr;
        if (!headerValue){
            return headerValue;
        }

        if (Object.prototype.toString.call(headerValue) === '[object Array]' ) {
            arr = [];
            for (var i = 0, l = headerValue.length; i < l; i++)  {
                arr.push(f(headerValue[i], urlRewriter));
            }

            return arr;
        }

        return f(headerValue, urlRewriter);
    }
}


exports['location'] = doRewrite(require('./location'));
exports['set-cookie'] = doRewrite(require('./set-cookie'));