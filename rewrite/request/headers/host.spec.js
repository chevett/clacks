var urlHelper = require('../../../url-helper');
var settings = require('../../../settings')();
var testHelper = require('../../../test/helper');
var hostHeaderRewriter = require('./host');
var assert = require('assert');


describe('host request header', function(){
	it('should convert to the real host', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn(testHelper.createSecureRequest('/www.google.com'));
		var targetHost = hostHeaderRewriter('this value does not matter', toProxyUrlFn);
		
		assert(targetHost, 'www.google.com');
	});

	it('should convert to the real host when a protocol override is used', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn(testHelper.createSecureRequest('/www.google.com'));
		var targetHost = hostHeaderRewriter('this value does not matter', toProxyUrlFn);
		
		assert(targetHost, 'www.google.com');
	});
});
