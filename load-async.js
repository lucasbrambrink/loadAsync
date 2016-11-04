/*  Maximize concurrent javascript loading
*   by loading as much javascript in parallel
*   but maintain order of execution if required
*
*
*
*   <style>
*       .async-script {
*           display: none;
*       }
*   </style>
*
* * * * Instead of <script> tags, include them as hidden <div w/ data-attributes * * * *
*
*   <div class="async-script"
*        data-key="baseLibrary"
*        data-source="/scripts/useful/library.js">
*   </div>
*   <div class="async-script"
*        data-key="specificJavascript"
*        data-source="/scripts/pages/ui-components.js"
*        data-depends-on="baseLibrary">
*   <div>
*
* */

var LoadAsync = (function(window) {

    var broadcastReady = function(namespace) {
        var event = new CustomEvent(namespace);
        window.dispatchEvent(event);
    };

    var getScriptData = function(element) {
        var data = {
            key: element.getAttribute("data-key"),
            source: element.getAttribute("data-source"),
            dependsOn: element.getAttribute("data-depends-on")
        };
        data.dispatchReady = function() {
            broadcastReady(data.key);
        };
        data.loadScriptCallback = function() {
            var script = createScript(data);
            document.body.appendChild(script);
        };
        return data;
    };

    var createScriptElement = function(data) {
        var script = document.createElement("script");
        script.src = data.source;

        if (script.readyState){ //IE
            script.onreadystatechange = function(){
                if (script.readyState === "loaded" ||
                        script.readyState === "complete"){
                    script.onreadystatechange = null;
                    data.dispatchReady();
                }
            };
        } else {  // Other browsers
            script.onload = function() {
                data.dispatchReady();
            };
        }
        return script;
    };

    var addDeferredScript = function(scriptElement) {
        if (scriptElement === undefined || scriptElement === null) return;
        var data = getScriptData(scriptElement);
        if (!data.key && !data.source) return;

        if (data.dependsOn === undefined || data.dependsOn === "") {
            var script = createScriptElement(data);
            document.body.appendChild(script);
        } else {
            window.addEventListener(data.dependsOn, data.loadScriptCallback);
        }
    };

    var addScripts = function() {
        var asyncScripts = document.getElementsByClassName('async-script');
        for (var i = 0; i < asyncScripts.length; i++) {
            addDeferredScript(asyncScripts[i]);
        }
        for (var j = 0; j < asyncScripts.length; j++) {
            asyncScripts[j].remove();
        }
    };

    return {
        addScripts: addScripts
    }
})(window);

if (window.addEventListener) {
    window.addEventListener("load", LoadAsync.addScripts, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", LoadAsync.addScripts);
} else {
    window.onload = LoadAsync.addScripts;
}
