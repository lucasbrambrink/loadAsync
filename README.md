# asyncLoad.js

This utility is designed to maximize page load performance
by minimizing the javascript footprint. It loads `<script>` resources
asynchronously (and thereby leverage concurrency in the browser)
but guarantees load order
(in cases where one resource depends on another).

Loading javascript asynchronously improves page performance (often
dramatically). Dynamically adding `<script>` tags into the DOM after
page-load (with javascript) is a robust strategy that works across all
browsers. 

However, loading scripts asynchronously does not guarantee
execution order. This library aims to bridge these two constraints:

1) load as much javascript concurrently as possible

2) await dependency scripts before code execution

Include all `<script>` as `<div class="async-script">` (or any other
hidden element) with `data-key`, `data-source`, and `data-depends-on`
attributes. By assigning each script a name/key, other scripts can
target it as their dependency. Each script broadcasts its load event
in its `data-key` namespace, which other scripts can listen to
in `data-depends-on` value.

Example:
```
   <style>
       div.async-script {
           display: none;
       }
   </style>

 * * * Instead of <script> tags, include them as hidden <div> w/ data-attributes * * * *

   <div class="async-script"
        data-key="baseLibrary"
        data-source="/scripts/useful/library.js">
   </div>
   <div class="async-script"
        data-key="specificJavascript"
        data-source="/scripts/pages/ui-components.js"
        data-depends-on="baseLibrary"> ** await baseLibrary ****
   <div>
```

Simply load the minified library within the DOM (end of `<body>`
is suggested).