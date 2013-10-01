var fs = require('fs'),
	q = require('q'), 
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

	var o = Object.create(lookup);
	var lookupKeys = Object.keys(lookup);

    o.convert = function (headers, context, cb) {
		var self = this;
		var convertValueFn = function(header){
			var defered = q.defer();
			var fn = o[header.name];
			header.originalValue = header.value;
			
			if (fn){
				
				var v = fn.call(self, header.value, context);
				
				if (!v || !v.then){
					header.value = v;
					defered.resolve(v);
				} else {
					v.then(function(result){
						header.value = result;
						defered.resolve(result);
					});
				}
			} else {
				defered.resolve();
			}

			return defered.promise;
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

		q.all(headers.map(function(h){ return convertValueFn(h); }))
			.done(function(){
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
					return !(h.state === 'added' && !h.value && !h.originalValue);
				});

				_addToObjectMethod(headers);
				cb(headers);
		});
    };

	return o;
}

exports.create = _buildConverter;







