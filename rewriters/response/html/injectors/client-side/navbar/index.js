var $ = require('../my-jquery');
var _ = require('lodash');
var tmpl = require('./template.hbs');
var css = require('./style.scss');
var diff = require('diff');
$('head').prepend($('<style></style>').html(css));

function _wrapWithDel(line){
    return '<del>'+line+'</del>';
}

function _wrapWithIns(line){
    return '<ins>'+line+'</ins>';
}

var Handlebars = require("handlebars-runtime");
Handlebars.registerHelper("diff", function(a, b) {
	var result ='', diffResult = diff.diffWords(a, b);

	for (var i=0; i < diffResult.length; i++) {

		if (diffResult[i].added && diffResult[i + 1] && diffResult[i + 1].removed) {
			var swap = diffResult[i];
			diffResult[i] = diffResult[i + 1];
			diffResult[i + 1] = swap;
		}

		if (diffResult[i].removed) {
			result += _wrapWithDel(diffResult[i].value);
		} else if (diffResult[i].added) {
			result += _wrapWithIns(diffResult[i].value);
		} else {
			result += diffResult[i].value;
		}
	}

	return result;
});

function getHeaders(data, regex){
	return _.chain(data)
		.filter(function(v){ return regex.test(v.name); })
		.filter(function(v){ return !/convert$/.test(v.name); })
		.filter(function(v){ return v.args[0] || v.value; })
		.map(function(v){
			return {
				name: v.name.match(/([^\.]+)$/)[1],
				oldValue: v.args[0],
				newValue: v.value
			};
		})
		.value();
}

function NavBar(data){
	var requestHeaders = getHeaders(data, /request\.headers\./);
	var responseHeaders = getHeaders(data, /response\.headers\./);
	var $root = $(tmpl({
		headers:{
			request: requestHeaders,
			response: responseHeaders
		}
	}));

	var $form = $root.find('#mt3-navbar-form'),
		$text = $root.find("#mt3-btn-nav-value"),
		$wrapper = $root.find('#mt3-navbar'),
		$tab = $root.find('#mt3-btn-nav-tab'),
		$openBtn = $root.find('#mt3-nav-tab-open'),
		$closeBtn = $root.find('#mt3-navbar-close'),
		$showDebugButton = $root.find('#mt3-show-debug'),
		$hidebugButton = $root.find('#mt3-hide-debug'),
		$debugPanel = $root.find('#mt3-debug-info')
		;

	$form.on('submit', function (evt) {
		evt.preventDefault();
		var dest = $text.value || "";
		window.location = window.location.origin + "/" + dest;
	});

	$openBtn.on('click', function () {
		$wrapper.show();
		$tab.hide();
	});

	$closeBtn.click(function () {
		$wrapper.hide();
		$tab.show();
	});

	$showDebugButton.click(function () {

		if ($debugPanel.is(':visible')){
			$debugPanel.slideUp(150);
		}
		else {
			$debugPanel.slideDown('fast');
			$debugPanel.show();
		}
	});

	$hidebugButton.click(function () {
		$debugPanel.hide();
	});


	this.get$Root = function(){ return $root; };
}

module.exports = NavBar;
