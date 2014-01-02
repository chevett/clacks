var $ = require('../my-jquery');
var _ = require('lodash');
var tmpl = require('./template.hbs');
var css = require('./style.scss');
$('head').prepend($('<style></style>').html(css));

function NavBar(data){
	var requestHeaders = _.chain(data)
		.filter(function(v){ return (/request\.headers\./).test(v.name); })
		.filter(function(v){ return v.args[0] || v.value; })
		.filter(function(v){ return !/convert$/.test(v.name); })
		.map(function(v){
			var o = {
				name: v.name.match(/([^\.]+)$/)[1],
				oldValue: v.args[0],
				newValue: v.value,
				value: v.value || v.args[0]
			};
			
			if (o.oldValue && !o.newValue){
				o.removed = true;
			} else if (!o.oldValue && o.newValue){
				o.added = true;
			} else if (o.oldValue === o.newValue){
				o.unchanged = true;
			} else {
				o.changed = true;
			}

			return o;
		})
		.value();

	var $root = $(tmpl({
		headers:{
			request: requestHeaders
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
