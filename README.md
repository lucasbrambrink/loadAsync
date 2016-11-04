# Load Asynchronous Javascript

Loading javascript asynchronously improves performance. Dynamically
adding `<script>` tags into the DOM after page-load (with
javascript) is a robust strategy that works across all browsers. 

However, loading scripts asynchronously does not guarantee
execution order. This library aims to bridge these two constraints:
1) load as much javascript as possible concurrently
2) maintain execution order where necessary

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

 * * * Instead of <script> tags, include them as hidden <div w/ data-attributes * * * *

   <div class="async-script"
        data-key="baseLibrary"
        data-source="/scripts/useful/library.js">
   </div>
   <div class="async-script"
        data-key="specificJavascript"
        data-source="/scripts/pages/ui-components.js"
        data-depends-on="baseLibrary">
   <div>
```