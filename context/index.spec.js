var Context = require('./index');
var expect = require('chai').expect;
var FakeRequest = require('../test/fake-request');
var httpBaseUrl = require('../settings')().createHttpUrl();

describe('the context', function(){
	it('it should add a conversion object when a conversion is performed', function(){
		var ctx = new Context(new FakeRequest());
		var newUrl = ctx.convert.toProxyUrl('www.google.com');

		expect(ctx.convert.nostalgorithm.calls).to.have.length.of(1);
		
		var o = ctx.convert.nostalgorithm.calls[0];
		expect(o.arguments[0]).to.be.equal('www.google.com');
		expect(o.value).to.be.equal(httpBaseUrl+ 'http://www.google.com');
	});
});
