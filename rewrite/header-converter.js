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



function _buildConverter(dir, lookup) {
    lookup = lookup || {};

    fs.readdirSync(dir).forEach(function(file) {
        if (file!='index.js') {
            lookup[file.replace(/\.js$/i, '')] = require(dir + '/' + file );
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







