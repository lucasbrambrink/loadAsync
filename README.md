# orderedAsync.js

This library is loads `<script>` resources
asynchronously (and thereby leverages concurrency in the browser)
but still guarantees load order
(in cases where one resource depends on another). It is designed to maximize page performance
by removing javascript from the initial page load. 

It is well established that loading javascript asynchronously
improves page performance. Dynamically adding `<script>` tags
into the DOM after page-load (with javascript) is a robust
strategy that works across all modern browsers. 

However, loading scripts asynchronously does not guarantee
execution order. This library aims to bridge these two constraints:

1. load as many `<script>` concurrently as possible
2. defer `<script>` with other js dependencies until those have loaded

### Implementation
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

    *  *  *  *  *  *  *  *  *  *  *  *  *
    Instead of <script> tags, include them 
    as hidden <div>'s w/ data-attributes 
        -key
        -source
        -depends-on (optional)
    *  *  *  *  *  *  *  *  *  *  *  *  *
    
    <div class="async-script"
        data-key="baseLibrary"
        data-source="/scripts/useful/library.js">
    </div>
    <div class="async-script"
        data-key="specificJavascript"
        data-source="/scripts/pages/ui-components.js"
        data-depends-on="baseLibrary"> *await baseLibrary*
    <div>
```

Simply load the minified library within the DOM (end of `<body>`
is suggested).