# Load Asynchronous Javascript

Loading javascript asynchronously improves performance. Dynamically
adding `<script>` tags on the page using vanilla javascript is
considered good practice as it works across browsers. 

Instead, include them as `<div class="async-script">` (or any other
hidden element) with `data-key`, `data-source`, and `data-depends-on` attributes. By
assigning each script a name/key, other scripts can target it as their
dependency. This maintains execution consistency where necessary.

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