(function (window) {
    function addListener(element, eventName, handler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + eventName, handler);
        }
        else {
            element['on' + eventName] = handler;
        }
    }

    function removeListener(element, eventName, handler) {
        if (element.addEventListener) {
            element.removeEventListener(eventName, handler, false);
        }
        else if (element.detachEvent) {
            element.detachEvent('on' + eventName, handler);
        }
        else {
            element['on' + eventName] = null;
        }
    }

    window.mt3 = {
      on: addListener,
      off: removeListener
    };
}(window));

/* global mt3: false */
(function () {
    var form = document.getElementById('mt3-navbar-form'),
        text = document.getElementById("mt3-btn-nav-value"),
        wrapper = document.getElementById('mt3-navbar'),
        tab = document.getElementById('mt3-btn-nav-tab'),
        openBtn = document.getElementById('mt3-nav-tab-open'),
        closeBtn = document.getElementById('mt3-navbar-close'),
        showDebugButton = document.getElementById('mt3-show-debug'),
        hidebugButton = document.getElementById('mt3-hide-debug'),
        debugPanel = document.getElementById('mt3-debug-info')
        ;

    mt3.on(form, 'submit', function (evt) {
        evt.preventDefault();
        var dest = text.value || "";
        window.location = window.location.origin + "/" + dest;
    });

    mt3.on(openBtn, 'click', function () {
        wrapper.style.display = "block";
        tab.style.display = "none";
    });

    mt3.on(closeBtn, 'click', function () {
        wrapper.style.display = "none";
        tab.style.display = "block";
    });

    mt3.on(showDebugButton, 'click', function () {

        if (debugPanel.style.display=="block"){
            debugPanel.style.display = "none";
        }
        else {
        debugPanel.style.display = "block";
        }
    });

    mt3.on(hidebugButton, 'click', function () {
        debugPanel.style.display = "none";
    });
}());
