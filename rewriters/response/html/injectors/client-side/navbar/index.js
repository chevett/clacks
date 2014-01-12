var $ = require('../my-jquery');
var _ = require('lodash');
var vash = require('vash-runtime');
var tmpl = require('./template.vash');
var css = require('./style.scss');

$('head').prepend($('<style></style>').html(css));

vash.helpers.diff = require('../diff');


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
