# FlashCarousel
JavaScript Image Carousel

[view Demo](http://flashycud.com/assets/flashcarousel/index.html).

##Installation
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="[your/path/to]/flashcarousel.js"></script>
<link rel="stylesheet" type="text/css" href="[your/path/to]/flashcarousel.css">
```

##Usage
```html
<div class="target">
  <img src="your/image/source">
  <img src="your/image/source">
  <img src="your/image/source">
  ......
</div>
```
```javascript
// Use as a selector
FlashCarousel(".target");

// Use with jQuery object
FlashCarousel($(".target"));
```
