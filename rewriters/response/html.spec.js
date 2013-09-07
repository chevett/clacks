var fs = require('fs');
var assert = require('assert');
var FakeRequest = require('../../test/fake-request');
var Context = require('../../context/');
var cheerio = require('cheerio');
var htmlRewriter = require('./html');

describe('html response rewriter', function(){

	function _getFruitsString(){
		return fs.readFileSync('test/fruits.html');
    }


	function _shouldConvertElementAttributeUrl(elementName, attributeName){
		var context = new Context(new FakeRequest());

		var toProxyUrlFn = context.convert.toProxyUrl;
		var $fruits = cheerio.load(_getFruitsString());
		var $elements = $fruits(elementName + '['+ attributeName + ']');
		
		var $newFruits = cheerio.load(htmlRewriter($fruits.html(), context));
		var $newElements = $newFruits(elementName + '['+ attributeName + ']');
	
		var $element, $newElement;

		assert.notEqual($elements.length, 0);
		assert.equal($elements.length, $newElements.length);

		for (var i=0; i<$elements.length; i++){
			$element = $fruits($elements[i]);
			$newElement = $newFruits($newElements[i]);

			assert.equal(toProxyUrlFn($element.attr(attributeName)), $newElement.attr(attributeName));
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
});
