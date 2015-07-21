/*! FlashCarousel - v0.0.1 - 2015-07-21
* https://github.com/flashycud/flashcarousel
* Copyright (c) 2015 Flash <me@flashycud.com>; Licensed MIT */
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

      Instance,
      attachNav,
      attachPage,

      _o;

  _o = {
    zIndexBase: 0
  }

  FlashCarousel = function (t, options) {
    t = $(t);
    new Instance(t, options);
  };


  Instance = function(t, options) {
    var wrapper, el, holder,
        _this = this;
    
    this.target = t;
    this.options = {};
    this.items = [];
    this.pos = [];
    this.curr = 0;

    $.extend(this.options, _o, options);
    
    this.target.addClass('flash-carousel');
    wrapper = $('<div class="flash-carousel-slides">');
    el = this.target.children();

    el.each(function (i) {
      var $this = $(this);
      $this.detach();
      holder = $('<div class="flash-carousel-slide">')
      holder.append($this);
      wrapper.append(holder);
      _this.pos.push(_this.target.width() * i);
      holder.css("left", _this.pos[i]);
      _this.items.push(holder);
    });

    this.target.append(wrapper);

    attachNav.call(this);    
    attachPage.call(this);    

  }

  Instance.prototype.navigateTo = function(page) {
    for (var i=0, l=this.items.length; i<l; i++) {
      this.pages[this.curr].removeClass("active");
      this.curr = (page < 0)? l-1: (page >= l)? 0: page;
      this.pages[this.curr].addClass("active");
      this.pos[i] = this.target.width() * (i - this.curr);
      this.items[i].css("left", this.pos[i]);
    }
  }

  attachNav = function() {
    var left = $('<div class="flash-carousel-nav-left">'),
        right = $('<div class="flash-carousel-nav-right">'),
        _this = this;

    left.css("z-index", this.options.zIndexBase+1)
      .append($("<div class='flash-carousel-nav-left-arrow'>Previous</div>"))
      .click(function () {
        _this.navigateTo(_this.curr - 1);
      });
    right.css("z-index", this.options.zIndexBase+1)
      .append($("<div class='flash-carousel-nav-right-arrow'>next</div>"))
      .click(function () {
        _this.navigateTo(_this.curr + 1);
      });

    this.target.append(left).append(right);
  }

  attachPage = function() {
    var holder = $('<div class="flash-carousel-dots">'),
        page,
        _this = this;

    this.pages = [];

    for (var i=0, l=this.items.length; i<l; i++) {
      page = $('<div class="flash-carousel-dot">');
      if (i == 0) {
        page.addClass('active');
      }
      this.pages.push(page);
      holder.append(page);
    }
    $(this.pages).each(function (i) {
      $(this).click(function () {
        _this.navigateTo(i);
      });
    });

    holder.css("z-index", this.options.zIndexBase+2);
    
    this.target.append(holder);
  }


  return FlashCarousel;

});