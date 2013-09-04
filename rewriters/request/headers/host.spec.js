var Context = require('../../../context/');
var FakeRequest = require('../../../test/fake-request');
var FakeResponse = require('../../../test/fake-response');
var hostHeaderRewriter = require('./host');
var assert = require('assert');

describe('host request header', function(){
	it('should convert to the real host', function(done){
		var context = new Context(new FakeRequest(), new FakeResponse());

		hostHeaderRewriter('this value does not matter', context, function(targetHost){
			assert.equal(targetHost, 'www.google.com');
			done();
		});
	});

	it('should convert to the real host when a protocol is included', function(done){
		var context = new Context(new FakeRequest(), new FakeResponse());

		hostHeaderRewriter('this value does not matter', context, function(targetHost){
			assert.equal(targetHost, 'www.google.com');
			done();
		});
	});
});
