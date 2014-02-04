/* global $: false  */
/* global _mt3_: false */
/* global __mt3_: false */
/* global fakeVar: false */

var chai = require('chai');
chai.use(require('../../../test/chai-code'));

var FakeRequest = require('../../../test/fake-request');
var Context = require('../../../context');
var jsRewriter = require('./index');
var expect = chai.expect;

describe.skip('js rewriter', function(){
	var context = new Context(new FakeRequest());
	describe('assignment expressions', function(){

		it('should convert absolute urls', function(){
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

		it('should convert suspicious string literals', function(){
			var newJs = jsRewriter(String(function test(){
				var o = {};
				o.src = 'home/index';
			}), context);

			var shouldBe = function test(){
				var o = {};
				o.src = 'http://localhost:3000/http://www.google.com/home/index';
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should "strong wrap" non-literal with suspicious targets', function(){
			var newJs = jsRewriter(String(function test(){
				var o = {};
				o.src = 'home/index' + '?' + fakeVar;
			}), context);

			var shouldBe = function test(){
				var o = {};
				o.src = __mt3_('home/index' + '?' + fakeVar);
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should "weak wrap" non-literal', function(){
			var newJs = jsRewriter(String(function test(){
				var o = {};
				o.value = 'home/index' + '?' + fakeVar;
			}), context);

			var shouldBe = function test(){
				var o = {};
				o.value = _mt3_('home/index' + '?' + fakeVar);
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should not change number assignments', function(){
			var newJs = jsRewriter(String(function test(){
				var o = {};
				o.src = 666;
			}), context);

			var shouldBe = function test(){
				var o = {};
				o.src = 666;
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should not change object assignments', function(){
			var newJs = jsRewriter(String(function test(){
				var o = {};
				o.src = {id: 666};
			}), context);

			var shouldBe = function test(){
				var o = {};
				o.src = {id: 666};
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should convert suspicious values in an object literal', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				var o = {
					src: 'home/pics'
				};
				it(o);
			}), context);

			var shouldBe = function test(){
				var o = {
					src: 'http://localhost:3000/http://www.google.com/home/pics'
				};
				it(_mt3_(o));
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should convert absolute urls in an object literal', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				var o = {
					value: 'http://yahoo.com'
				};
				it(o);
			}), context);

			var shouldBe = function test(){
				var o = {
					value: 'http://localhost:3000/http://yahoo.com'
				};
				it(_mt3_(o));
			};
			expect(newJs).to.be.func(shouldBe);
		});
	});

	describe('function parameters', function(){

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

		it('should convert suspicious values', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				$.ajax('home/hi?p=1', function(data){
					console.log('what');
				});
			}), context);

			var shouldBe = function test(){
				$.ajax('http://localhost:3000/http://www.google.com/home/hi?p=1', function(data){
					console.log('what');
				});
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should not convert numbers', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				$.ajax(555, function(data){
					console.log('what');
				});
			}), context);

			var shouldBe = function test(){
				$.ajax(555, function(data){
					console.log('what');
				});
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should not convert css selectors', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				$.ajax('body#main td', function(data){
					console.log('what');
				});
			}), context);

			var shouldBe = function test(){
				$.ajax('body#main td', function(data){
					console.log('what');
				});
			};
			expect(newJs).to.be.func(shouldBe);
		});

		it('should wrap non-literals', function(){
			var context = new Context(new FakeRequest());

			var newJs = jsRewriter(String(function test(){
				$.ajax('h'+'t'+'t'+'p:/' + '/' + fakeVar, function(data){
					console.log('what');
				});
			}), context);

			var shouldBe = function test(){
				$.ajax(_mt3_('h'+'t'+'t'+'p:/' + '/' + fakeVar), function(data){
					console.log('what');
				});
			};
			expect(newJs).to.be.func(shouldBe);
		});
	});
});
