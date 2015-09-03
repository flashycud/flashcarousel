
[view Demo](http://flashycud.com/assets/flashcarousel/index.html).

##Installation
FlashCarousel.js has a dependency on jQuery.

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="[your/path/to]/flashcarousel.js"></script>
<link rel="stylesheet" type="text/css" href="[your/path/to]/flashcarousel.css">
```

##Usage
Simply put `<img ... >` tag in a placeholder.
```html
<div class="target">
  <img src="your/image/source">
  <img src="your/image/source">
  <img src="your/image/source">
  ......
</div>
```
Then, in a `<script>`, either use selector string or use jQuery object to pass as a parameter through `FlashCarousel( [ PLACEHOLDER ] );`. Just like in the example:
```javascript
// Use as a selector
FlashCarousel(".target");

// Use with jQuery object
FlashCarousel($(".target"));
```

##Options
FlashCarousel.js right now has 6 options that are configurable.

* zIndexBase: allows user to adjust zIndex of the carousel
* fixHeight: whether the carousel will have fixed height or depend on image height
* height: when fixHeight is true, carousel hight will be adjusted with this property.
* imgSize: 'contain' or 'cover'
* gap: a gap between images
* loop: make carousel slide in a loop

```javascript
var options = {
      zIndexBase: 0,
      fixHeight: true,
      height: 200,
      imgSize: 'contain',
      gap: 10,
      loop: true
}
FlashCarousel(".target", options);
```
