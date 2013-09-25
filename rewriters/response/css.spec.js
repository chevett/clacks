var expect = require('chai').expect;
var util = require('util');
var cssRewriter = require('./css');
var Context = require('../../context/');
var FakeRequest = require('../../test/fake-request');

describe('css header rewriter', function(){
	describe('should convert urls', function(){
		it('should convert urls with no quotes', function(){
			var context = new Context(new FakeRequest());
			var css = '#id { background-image: url(img/a.png); }';
			var expectedCss = util.format('#id { background-image: url(%s); }', context.convert.toProxyUrl('img/a.png'));
			css = cssRewriter(css, context);
			expect(css).to.be.equal(expectedCss);
		});
		it('should convert urls with single quotes', function(){
			var context = new Context(new FakeRequest());
			var css = '#id { background-image: url(\'img/a.png\'); }';
			var expectedCss = util.format('#id { background-image: url(\'%s\'); }', context.convert.toProxyUrl('img/a.png'));
			css = cssRewriter(css, context);
			expect(css).to.be.equal(expectedCss);
		});
		it('should convert urls with double quotes', function(){
			var context = new Context(new FakeRequest());
			var css = '#id { background-image: url("img/a.png"); }';
			var expectedCss = util.format('#id { background-image: url("%s"); }', context.convert.toProxyUrl('img/a.png'));
			css = cssRewriter(css, context);
			expect(css).to.be.equal(expectedCss);
		});
		it('should ignore urls with mismatched quotes', function(){
			var context = new Context(new FakeRequest());
			var expectedCss = '#id { background-image: url(\'img/a.png"); }';
			var css = cssRewriter(expectedCss, context);
			expect(css).to.be.equal(expectedCss);
		});
	});
});
