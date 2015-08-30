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

      attachImg,
      attachNav,
      attachPage,
      applyOptions,

      checkImgLoad,
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

      heightBasedClass = "height-based",
      widthBasedClass = "width-based",

      arrZIndexOffest = 2,

      _o;

  _o = {
    zIndexBase: 0,
    fixHeight: true,
    height: 200,
    imgSize: 'contain'
  }

  FlashCarousel = function (t, options) {
    t = $(t);
    t.each(function(){
      new Instance($(this), options);
    });
  };


  Instance = function(t, options) {
    this.target = t;
    this.options = {};
    this.items = [];
    this.pos = [];
    this.curr = 0;

    $.extend(this.options, _o, options);
    
    attachImg.call(this);
    attachNav.call(this);    
    attachPage.call(this); 

    applyOptions.call(this);   

  }

  Instance.prototype.navigateTo = function(page) {
    var i, l=this.items.length;
    
    this.pages[this.curr].removeClass("active");
    this.curr = (page < 0)? l-1: (page >= l)? 0: page;
    this.pages[this.curr].addClass("active");

    for (i=0; i<l; i++) {
      this.pos[i] = this.target.width() * (i - this.curr);
      this.items[i].css("left", this.pos[i]);
      this.items[i].css('z-index', this.options.zIndexBase);
    }

    this.items[this.curr].css("z-index", this.options.zIndexBase + 1);
  }

  attachImg = function() {
    'use strict'
    var wrapper, el, holder,
        self = this;

    this.target.addClass(mainClass);
    wrapper = $('<div>').addClass(slidesClass);
    el = this.target.children();

    el.each(function (i) {
      var $this = $(this);
      $this.detach();

      holder = $('<div>').addClass(slideClass).addClass(imgLoadingClass);
      holder.append($this);

      // checking loading status
      checkImgLoad.call(self, $this);

      wrapper.append(holder);

      self.pos.push(self.target.width() * i);
      holder.css("left", self.pos[i]);

      self.items.push(holder);
    });
    self.target.append(wrapper);
  }

  attachNav = function() {
    var left = $('<div>').addClass(navLeftClass),
        right = $('<div>').addClass(navRightClass),
        self = this;

    left.css("z-index", this.options.zIndexBase + arrZIndexOffest)
      .append($("<div>Previous</div>").addClass(navLeftArrClass))
      .click(function () {
        self.navigateTo(self.curr - 1);
      });
    right.css("z-index", this.options.zIndexBase + arrZIndexOffest)
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

    this.pages = [];

    for (var i=0, l=this.items.length; i<l; i++) {
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
    var self = this;

    // Height
    if (self.options.fixHeight) {
      self.target.css('height', self.options.height);
    }

    // Image Size
  }

  checkImgLoad = function($img) {
    var self = this,
        resizeTimeout;
    $img.one('load', function () {
      adjustImgSize.call(self, $img);
      
      // Set event for img
      var resizeTimeout;
      $(window).resize(function() {
        self.target.find("."+slidesClass).addClass('hide');
        adjustImgSize.call(self, $img);
        self.navigateTo(self.curr);
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          self.target.find("."+slidesClass).removeClass('hide');
        }, 300);

      });
    }).each(function(){
      if (this.complete) $img.load();
    });
  }

  adjustImgSize = function($img) {
    var self = this,
        ratio = $img.height()/$img.width(),
        targetRatio = self.target.height()/self.target.width();
    if (self.options.imgSize === 'contain') {
      if (ratio <= targetRatio) {
        $img.addClass(widthBasedClass);
      } else {
        $img.addClass(heightBasedClass);
      }
    } else if (self.options.imgSize == 'cover') {
      if (ratio <= targetRatio) {
        $img.addClass(heightBasedClass);
      } else {
        $img.addClass(widthBasedClass);
      }
    }
    $img.css('margin-top', -$img.height()/2);
    $img.css('margin-left', -$img.width()/2);
    $img.parent().removeClass(imgLoadingClass);
  }

  onAdjust = function() {
    var self = this,
        wrapper = self.target.find(slidesClass);
  }


  return FlashCarousel;

});