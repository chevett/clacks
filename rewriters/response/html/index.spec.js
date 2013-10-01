var fs = require('fs');
var expect = require('chai').expect;
var FakeRequest = require('../../../test/fake-request');
var Context = require('../../../context/');
var cheerio = require('cheerio');
var htmlRewriter = require('./index');

describe('html response rewriter', function(){

	function _getFruitsString(){
		return fs.readFileSync('test/fruits.html');
	}

	var context = new Context(new FakeRequest());
	var toProxyUrlFn = context.convert.toProxyUrl;

	function _convertFruits(){
		var $fruits = cheerio.load(_getFruitsString());
		var $newFruits = cheerio.load(htmlRewriter($fruits.html(), context));
	
		return {
			old: $fruits,
			new: $newFruits
		};
	}
	function _shouldConvertElementAttributeUrl(elementName, attributeName){
		var $fruits = _convertFruits();
		var $elements = $fruits.old(elementName + '['+ attributeName + ']');
		var $newElements = $fruits.new(elementName + '['+ attributeName + ']');
	
		var $element, $newElement;

		expect($elements.length).to.not.equal(0);

		// sometimes we add elements during the conversion process.
		expect($newElements).to.have.length.of.at.least($elements.length);

		for (var i=0; i<$elements.length; i++){
			$element = $fruits.old($elements[i]);
			$newElement = $fruits.new($newElements[i]);

			expect($newElement.attr(attributeName)).to.be.equal(toProxyUrlFn($element.attr(attributeName)));
		}
	}

	it('should convert image src attributes', function (){
		_shouldConvertElementAttributeUrl('img', 'src');
	});

	it('should convert script src attributes', function (){
		_shouldConvertElementAttributeUrl('script', 'src');
	});
	
	it('should convert style src attributes', function (){
		_shouldConvertElementAttributeUrl('style', 'src');
	});

	it('should convert anchor href attributes', function (){
		_shouldConvertElementAttributeUrl('a', 'href');
	});
	
	it('should convert form action attributes', function (){
		_shouldConvertElementAttributeUrl('form', 'action');
	});
	it('should handle elements that have attributes with lame casing', function (){
		var $fruits = _convertFruits();
		var originalUrl = $fruits.old('#upper-case-href').attr('href');
		var newUrl = $fruits.new('#upper-case-href').attr('href');

		expect(originalUrl).to.be.ok;
		expect(newUrl).to.be.equal(toProxyUrlFn(originalUrl));
	});
});
