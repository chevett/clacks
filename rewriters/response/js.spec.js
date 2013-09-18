var expect = require('chai').expect;
var FakeRequest = require('../../test/fake-request');
var Context = require('../../context/');
var jsRewriter = require('./js');
var home = require('../../settings')().createHttpUrl();


describe('js rewriter', function(){
	it('should convert absolute urls in a string', function(){
		var context = new Context(new FakeRequest());
		var newJs = jsRewriter("var o = {}; o.someProperty = \"http://www.google.com\";", context);
			
		expect(newJs).to.be.equal("var o = {};\no.someProperty = '"+home+"http://www.google.com';");
	});
});
