var fs = require('fs')
;

function _isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

function _headerObjectToArray(headers){
    var arr = [], v;

    Object.defineProperty(arr, "toObject", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(){
            var o = {};

            this.forEach(function(header){

                if (header.state!=='removed'){

                    if (!o[header.name]){
                        o[header.name] = header.value;
                    }
                    else if (_isArray(o[header.name])){
                        o[header.name].push(header.value);
                    }
                    else {
                        o[header.name] = [o[header.name], header.value];
                    }
                }
            });

            return o;
        }
    });

    for (var headerName in headers){
        v = headers[headerName];

        if (_isArray(v)){
            v.forEach(function(v2){
                arr.push({name:headerName, value: v2});
            });
        }
        else {
            arr.push({name:headerName, value: headers[headerName]});
        }

    }                                                 0

    return arr;
}

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
        if (file!='index.js' && !/\.spec\.js$/i.test(file)) {
            lookup[file.replace(/\.js$/i, '')] = require(dir + '/' + file );
        }
    });

    return function (headers, urlRewriter) {
        var requiredHeaderHandlers = _extend(lookup), val, additionalHeaders = [];

        if (!_isArray(headers))
            headers = _headerObjectToArray(headers);

        // first convert any header we've received.
        headers.forEach(function (header) {
            header.originalValue = header.value;

            if (lookup[header.name]){
                header.value = lookup[header.name](header.value, urlRewriter, additionalHeaders);
            }

            delete requiredHeaderHandlers[header.name];

            if (header.value === header.originalValue) {
                header.state = 'unchanged';
            }
            else if (header.value){
                header.state = 'changed';
            }
            else {
                header.state = 'removed';
            }
        });

        // next, run any un-run header handlers
        for (var headerName in requiredHeaderHandlers) {
            val = requiredHeaderHandlers[headerName](undefined, urlRewriter);

            if (val){
                headers.push({
                    name: headerName,
                    value : requiredHeaderHandlers[headerName](undefined, urlRewriter),
                    state :'added'
                });
            }
        }

        // finally, add any additional headers created during the process
        additionalHeaders.forEach(function(header){
            header.state = 'added';
            headers.push(header);
        })

        return headers;
    }
}

exports.create = _buildConverter







