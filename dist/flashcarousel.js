/*! FlashCarousel - v0.0.1 - 2015-09-01
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
  'use strict'
  var FlashCarousel,

      Instance,

      ensureLoaded,

      init,

      attachLoading,
      attachImg,
      attachNav,
      attachPage,
      applyOptions,
      bindImgEvents,

      bindImgLoad,
      bindWindowResize,

      adjustImgSize,
      onAdjust,

      mainClass = "flash-carousel",
      prefix = mainClass + "--",
      slidesClass = prefix + "slides",
      slideClass = prefix + "slide",
      imgLoadingClass = prefix + "img-loading",
      navLeftClass = prefix + "nav-left",
      navRightClass = prefix + "nav-right",
      navLeftArrClass = navLeftClass + "-arrow",
      navRightArrClass = navRightClass + "-arrow",
      dotsClass = prefix + "dots",
      dotClass = prefix + "dot",
      loadingSVGClass = prefix + "loading",
      loadingPathClass = prefix + "loading-path",

      heightBasedClass = "height-based",
      widthBasedClass = "width-based",

      arrZIndexOffset = 2,

      _o;

  _o = {
    zIndexBase: 0,
    fixHeight: true,
    height: 200,
    imgSize: 'contain',
    gap: 10,
    loop: true
  }

  FlashCarousel = function (t, options) {
    t = $(t);
    t.each(function(){
      new Instance($(this), options);
    });
  };


  Instance = function(t, options) {
    var self = this;

    self.target = t;
    self.options = {};
    self.holders = [];
    self.wrapper = undefined;
    self.imgs = undefined;
    self.loading = undefined;
    self.pos = [];
    self.curr = 0;
    self.pages = [];

    $.extend(self.options, _o, options);
    
    // Initially attach components
    init.call(self);

    $(window).load(function () {
      self.navigateTo(0);
      bindImgEvents.call(self);

      if (self.options.loop) {
        self._holders = [];
        for (var i in self.holders) {
          self._holders.push(self.holders[i].clone(true).addClass('cloned'));
        }
      }

    });

  }

  Instance.prototype.navigateTo = function(page) {
    var i, l=this.holders.length
        self = this;
    
    if (typeof(page) === "number" && this.pages.length > 0) {
      
      this.pages[this.curr].removeClass("active");
      this.curr = (page < 0)? l-1: (page >= l)? 0: page;
      this.pages[this.curr].addClass("active");

      if (self.options.loop 
        && (page < 0 || page > self.pages.length - 1) ) {
        var t = self.holders;
        $(self._holders).detach().each(function (i) {

          if (page < 0) {
            self.holders[i].css('left', (self.target.width() + self.options.gap) * (i +1));
            $(this).css('left', -(self.target.width() + self.options.gap) * (self.pages.length - i));
          } else if (page > self.pages.length - 1) {
            self.holders[i].css('left', -(self.target.width() + self.options.gap) * (self.pages.length - i));
            $(this).css('left', (self.target.width() + self.options.gap) * (i + 1));
          }

          self.wrapper.append($(this));
        });
        self.holders = self._holders;
        self._holders = t;
      }

      for (i=0; i<l; i++) {
        this.pos[i] = (this.target.width() + this.options.gap) * (i - this.curr);
        this.holders[i].css("left", this.pos[i]);
        this.holders[i].css('z-index', 0);
      }

      this.holders[this.curr].css("z-index", 1);
    }
  }

  init = function () {
    attachImg.call(this);
    attachLoading.call(this);
    attachNav.call(this);    
    attachPage.call(this); 
    applyOptions.call(this);
  }

  attachLoading = function () {
    var self = this, svg, path;

    self.loading = svg = $('<svg class="'+loadingSVGClass+'" >'
      + '<path class="'+loadingPathClass+'" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path>'
      + '<svg>');

    svg.css({
      zIndex: self.options.zIndexBase,
      opacity: 0
    });

    self.target.append(svg);
  }

  attachImg = function() {
    var wrapper, holder,
        self = this;

    self.target.addClass(mainClass);
    self.wrapper = wrapper = $('<div>').addClass(slidesClass);
    wrapper.css('z-index', self.options.zIndexBase + 1);
    self.imgs = self.target.children();

    self.imgs.each(function (i) {
      var $this = $(this);
      $this.detach();

      holder = $('<div>').addClass(slideClass).addClass(imgLoadingClass);

      holder.append($this);
      wrapper.append(holder);
      self.holders.push(holder);
    });

    self.target.append(wrapper);
  }

  attachNav = function() {
    var left = $('<div>').addClass(navLeftClass),
        right = $('<div>').addClass(navRightClass),
        self = this;

    left.css("z-index", this.options.zIndexBase + arrZIndexOffset)
      .append($("<div>Previous</div>").addClass(navLeftArrClass))
      .click(function () {
        self.navigateTo(self.curr - 1);
      });
    right.css("z-index", this.options.zIndexBase + arrZIndexOffset)
      .append($("<div>Next</div>").addClass(navRightArrClass))
      .click(function () {
        self.navigateTo(self.curr + 1);
      });

    this.target.append(left).append(right);
  }

  attachPage = function() {
    var holder = $('<div>').addClass(dotsClass),
        page,
        self = this;

    for (var i=0, l=this.holders.length; i<l; i++) {
      page = $('<div>').addClass(dotClass);
      if (i == 0) {
        page.addClass('active');
      }
      this.pages.push(page);
      holder.append(page);
    }
    $(this.pages).each(function (i) {
      $(this).click(function () {
        self.navigateTo(i);
      });
    });

    holder.css("z-index", this.options.zIndexBase+2);
    
    this.target.append(holder);
  }

  applyOptions = function() {
    var self = this, i;

    // Carousel height
    if (self.options.fixHeight) {
      self.target.css('height', self.options.height);
    }

  }

  bindImgEvents = function () {
    var self = this;

    bindImgLoad.call(self, self.imgs);
    bindWindowResize.call(self, self.imgs);
  }

  bindImgLoad = function($img) {
    var self = this;

    $img.one('load', function () {
      adjustImgSize.call(self, $(this));
    }).each(function(){
      if (this.complete) $(this).load();
    });
  }

  bindWindowResize = function($img) {
    var self = this;

    $img.each(function () {
      var resizeTimeout, $this = $(this);
      $(window).resize(function () {
        self.target.find("."+slidesClass).addClass('hide');
        self.loading.css('opacity', 1);
        adjustImgSize.call(self, $this);
        self.navigateTo(self.curr);
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          self.target.find("."+slidesClass).removeClass('hide');
          self.loading.css('opacity', 0);
        }, 300);
      });
    });
  }

  adjustImgSize = function($img) {
    var self = this,
        ratio = $img.height()/$img.width(),
        targetRatio = self.target.height()/self.target.width();


    if (self.options.imgSize === 'contain') {
      if (ratio <= targetRatio) {
        $img.addClass(widthBasedClass).removeClass(heightBasedClass);
      } else {
        $img.addClass(heightBasedClass).removeClass(widthBasedClass);
      }
    } else if (self.options.imgSize === 'cover') {
      if (ratio <= targetRatio) {
        $img.addClass(heightBasedClass).removeClass(widthBasedClass);
      } else {
        $img.addClass(widthBasedClass).removeClass(heightBasedClass);
      }
    }
    // $img.css('margin-top', -$img.height()/2);
    // $img.css('margin-left', -$img.width()/2);
    $img.parent().removeClass(imgLoadingClass);
  }

  onAdjust = function() {
    var self = this,
        wrapper = self.target.find(slidesClass);
  }


  return FlashCarousel;

});