
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

require("fs").readdirSync(__dirname).forEach(function(file) {
    if (file!='index.js') {
        exports[file.replace(/\.js$/i, '')] = doRewrite(require("./" + file ));
    }
});