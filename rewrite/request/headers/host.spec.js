var urlHelper = require('../../../url-helper');
var settings = require('../../../settings')();
var hostHeaderRewriter = require('./host');
var assert = require('assert');


describe('host request header', function(){
	it('should convert to the real host', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn({
			url: '/www.google.com',
			secure: true, 
			headers: {
				'x-forwarded-proto': 'https'
			}
		});
		
		var targetHost = hostHeaderRewriter('this value does not matter', toProxyUrlFn);
		
		assert(targetHost, 'www.google.com');
	});

	it('should convert to the real host when a protocol override is used', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn({
			url: '/http/www.google.com',
			secure: true, 
			headers: {
				'x-forwarded-proto': 'https'
			}
		});
		
		var targetHost = hostHeaderRewriter('this value does not matter', toProxyUrlFn);
		
		assert(targetHost, 'www.google.com');
	});
});
