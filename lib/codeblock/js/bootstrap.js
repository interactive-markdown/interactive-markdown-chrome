;(function () {
    'use strict';

    var injectScripts = function inject (scripts) {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL(scripts[0]);
        s.onload = function () {
            this.parentNode.removeChild(this);
            if (scripts.length > 1) {
                inject(scripts.slice(1));
            }
        };
        (document.head || document.documentElement).appendChild(s);
    };

    // injectScripts([
    //     '/lib/codeblock/vendor/ace/ace.js',
    //     '/lib/codeblock/vendor/ace/theme-dawn.js',
    //     '/lib/codeblock/vendor/ace/mode-javascript.js',
    //     '/lib/codeblock/vendor/jquery-textrange.js',
    //     '/lib/codeblock/js/linked-editor.js'
    // ]);
}());