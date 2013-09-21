var fs = require('fs'),
	async = require('async'), 
	_ = require('underscore');

function _addToObjectMethod(headers){
	Object.defineProperty(headers, "toObject", {
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
					else if (_.isArray(o[header.name])){
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
}

function _headerObjectToArray(headers){
	var arr = [], v;
	var push = function(v2){
		arr.push({name:headerName, value: v2});
	};

	for (var headerName in headers){
		v = headers[headerName];

		if (_.isArray(v)){
			v.forEach(push);
		}
		else {
			arr.push({name:headerName, value: headers[headerName]});
		}
	}

    return arr;
}

function _buildConverter(dir, lookup) {
	lookup = lookup || {};

	fs.readdirSync(dir).forEach(function(file) {
		if (/\.js$/i.test(file) && file!='index.js' && !/\.spec\.js$/i.test(file)) {
			lookup[file.replace(/\.js$/i, '')] = require(dir + '/' + file );
		}
	});

	var lookupKeys = Object.keys(lookup);

    return function (headers, context, cb) {
		var convertValueFn = function(header, cb){
			var fn = lookup[header.name];
			header.originalValue = header.value;
			
			if(fn){
				fn(header.value, context, function(value){
					header.value  = value;
					cb(null, header);
				});
			} else {
				cb(null, header);
			}
		};

        if (!_.isArray(headers))
            headers = _headerObjectToArray(headers);

		_.difference(lookupKeys, _.map(headers, function(h){ return h.name; }))
			.forEach(function(headerName){
				headers.push({
					name: headerName,
					state :'added'
				});
			});

		async.map(headers, convertValueFn, function(){
			headers.forEach(function (header) {
				if (!header.state){
					if (header.value === header.originalValue) {
						header.state = 'unchanged';
					} else if (header.value){
						header.state = 'changed';
					} else {
						header.state = 'removed';
					}
				}
			});

			headers = _.filter(headers, function(h){
				return h.state !== 'added' || h.originalValue !== undefined;
			});

			_addToObjectMethod(headers);
			cb(headers);
		});
    };
}

exports.create = _buildConverter;







