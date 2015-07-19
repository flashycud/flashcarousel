;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Attach function to root
    root.FlashCarousel = factory();
  }

})(this, function () {

  var FlashCarousel,
      _options;

  _options = {
    
  }

  FlashCarousel = function (t, options) {
    t = $(t);
    $.extend(_options, options);

    var el = t.children(),
        holder; 

    t.addClass('flash-carousel');
    el.each(function (i) {
      var $this = $(this);
      
      $this.detach();
      holder = $('<div class="flash-carousel-slide">')
      holder.append($this);
      t.append(holder);
    })
  };

  return FlashCarousel;

});