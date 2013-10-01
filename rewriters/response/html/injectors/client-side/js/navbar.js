var $ = require('jquery-browserify');
var _ = require('underscore');
var tmpl = require('../hbs/navbar.hbs');
var css = require('../sass/navbar.scss');
$('head').prepend($('<style></style>').html(css));

console.log('running navbar!');
$(function () {

	console.log('loaded navbar');

	var requestHeaders = _.chain(window.mt3.debug)
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

	$('body').append(tmpl({
		headers:{
			request: requestHeaders
		}
	}));

    var $form = $('#mt3-navbar-form'),
        $text = $("#mt3-btn-nav-value"),
        $wrapper = $('#mt3-navbar'),
        $tab = $('#mt3-btn-nav-tab'),
        $openBtn = $('#mt3-nav-tab-open'),
        $closeBtn = $('#mt3-navbar-close'),
        $showDebugButton = $('#mt3-show-debug'),
        $hidebugButton = $('#mt3-hide-debug'),
        $debugPanel = $('#mt3-debug-info')
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
}());
