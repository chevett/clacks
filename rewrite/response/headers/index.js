
function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

function push(arr, v){
    if (v!==null && v!==undefined)
        arr.push(v);
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
                       push(arr, newHeaders[x]);
                    }
                }
                else {
                    push(arr, newHeaders);
                }
            }

            return arr;
        }

        return f(headerValue, urlRewriter);
    }
}

require("fs").readdirSync(__dirname).forEach(function(file) {
    if (file!='index.js') {
        exports[file.replace(/\.js$/i, '')] = doRewrite(require("./" + file ));
    }
});