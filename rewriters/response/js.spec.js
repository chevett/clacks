/* global $: false */
var chai = require('chai');
chai.use(require('../../test/chai-code'));

var FakeRequest = require('../../test/fake-request');
var Context = require('../../context/');
var jsRewriter = require('./js');
var home = require('../../settings')().createHttpUrl();
var expect = chai.expect;

describe.skip('js rewriter', function(){
	it('should convert absolute urls in a string assignment', function(){
		var context = new Context(new FakeRequest());

		var newJs = jsRewriter(String(function test(){
			var o = {};
			o.someProperty = 'http://www.google.com';
		}), context);

		var shouldBe = function test(){
			var o = {};
			o.someProperty = 'http://localhost:3000/http://www.google.com';
		};
		expect(newJs).to.be.func(shouldBe);
	});
	it('should convert absolute urls passed to functions', function(){
		var context = new Context(new FakeRequest());

		var newJs = jsRewriter(String(function test(){
			$.ajax('http://what.com', function(data){
					console.log('what');
				});
		}), context);

		var shouldBe = function test(){
			$.ajax('http://localhost:3000/http://what.com', function(data){
					console.log('what');
				});
		};

		expect(newJs).to.be.func(shouldBe);
	});
});
