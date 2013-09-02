var Context = require('../../../context/');
var settings = require('../../../settings')();
var testHelper = require('../../../test/helper');
var hostHeaderRewriter = require('./host');
var assert = require('assert');


describe('host request header', function(){
	it('should convert to the real host', function  (){
		var context = new Context(testHelper.createSecureRequest('http://www.google.com'));
		var targetHost = hostHeaderRewriter('this value does not matter', context);
		
		assert.equal(targetHost, 'www.google.com');
	});

	it('should convert to the real host when a protocol is included', function  (){
		var context = new Context(testHelper.createSecureRequest('https://www.google.com'));
		var targetHost = hostHeaderRewriter('this value does not matter', context);
		
		assert.equal(targetHost, 'www.google.com');
	});
});
