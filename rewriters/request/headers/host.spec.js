var Context = require('../../../context/');
var FakeRequest = require('../../../test/fake-request');
var FakeResponse = require('../../../test/fake-response');
var hostHeaderRewriter = require('./host');
var assert = require('assert');

describe('host request header', function(){
	it('should convert to the real host', function(){
		var context = new Context(new FakeRequest(), new FakeResponse());

		var targetHost = hostHeaderRewriter('this value does not matter', context);
		assert.equal(targetHost, 'www.google.com');
	});

	it('should convert to the real host when a protocol is included', function(){
		var context = new Context(new FakeRequest(), new FakeResponse());

		var targetHost = hostHeaderRewriter('this value does not matter', context);
		assert.equal(targetHost, 'www.google.com');
	});
});
