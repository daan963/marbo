(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var r_editorial = {}; // Attempt to export r_editorial to the Window

window.r_editorial = r_editorial;
var _default = r_editorial;
exports.default = _default;

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _jQuery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

_core.default.buhp_navigation = function () {
  (0, _jQuery.default)('.js-buhp-nav-toggle').on('click', function (e) {
    (0, _jQuery.default)('body').addClass('buhp-navigation-is-open');
  });
  (0, _jQuery.default)('.buhp-navigation-wrapper-close').on('click', function (e) {
    (0, _jQuery.default)('body').removeClass('buhp-navigation-is-open');
  });
}();

var _default = _core.default;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],3:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _jQuery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

_core.default.classnotesSlideshow = function () {
  var slideshows;
  /*
  * Find slideshow elements
  */

  var findSlideshows = function findSlideshows() {
    // Reset Slideshows (this runs after ajax fetching of new posts).
    slideshows = false; // Find Slideshows.

    slideshows = (0, _jQuery.default)('.js-classnotes-slideshow');

    if (slideshows.length > 0) {
      setupSlideshows();
    }
  };
  /*
  * Seup each slideshow
  */


  var setupSlideshows = function setupSlideshows() {
    slideshows.each(function () {
      var $images = (0, _jQuery.default)(this).find('.js-classnotes-image');
      var $prev = (0, _jQuery.default)(this).find('.js-classnotes-image-prev');
      var $next = (0, _jQuery.default)(this).find('.js-classnotes-image-next');
      var current = 0;
      var $currentImg = $images.eq(current);
      $prev.prop('disabled', true);
      $prev.on('click', function (e) {
        e.preventDefault();

        if (current - 1 >= 0) {
          $currentImg.hide();
          $currentImg = $images.eq(current - 1);
          $currentImg.show();
          current = current - 1;
        }

        if (current < $images.length) {
          $next.prop('disabled', false);
        }

        if (current === 0) {
          $prev.prop('disabled', false);
        }
      });
      $next.on('click', function (e) {
        e.preventDefault();

        if (current + 1 < $images.length) {
          $currentImg.hide();
          $currentImg = $images.eq(current + 1);
          $currentImg.show();
          current = current + 1;
        }

        if (current > 0) {
          $prev.prop('disabled', false);
        }

        if (current === $images.length) {
          $next.prop('disabled', true);
        }
      });
    });
  };

  var _init = function init() {
    findSlideshows();
  };

  (0, _jQuery.default)(document).ready(function ($) {
    _init();
  });
  return {
    init: function init() {
      return _init();
    },
    getSlideshows: function getSlideshows() {
      return slideshows;
    }
  };
}();

var _default = _core.default;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _core.default;
  }
});
exports.cssHasPolyfill = void 0;

var _core = _interopRequireDefault(require("./_core"));

// cssHasPolyfill.js
var cssHasPolyfill = function cssHasPolyfill(needle) {
  var haystack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var hasClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'has-element';

  // if browser supports :has selector, return
  if (CSS.supports('selector(:has(*))')) {
    return;
  } // if haystack is a string, ie. a selector, convert to HTMLElement


  var haystacks = typeof haystack === 'string' ? document.querySelectorAll(haystack) : haystack; // iterate through haystacks and add hasSelector class to any elements that have the needle

  haystacks.forEach(function (haystackEl) {
    var hasNeedle = haystackEl.querySelector(needle);
    hasNeedle && !haystackEl.classList.contains(hasClass) && haystackEl.classList.add(hasClass);
  });
}; // export to window object


exports.cssHasPolyfill = cssHasPolyfill;
_core.default.utilities = {};
_core.default.utilities.cssHasPolyfill = cssHasPolyfill;

},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],5:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _cssHasPolyfill = require("./cssHasPolyfill.js");

// Import the CSS Has Polyfill.

/**
 * A quick fallback script for the Edition Topics List block.
 *
 * We need the block positioned under the branding and that means detecting
 * when it is inside the first edition-row block on the edition post. the :has()
 * selector works great for that in the latest browsers but FireFox's ESR version does
 * not support that yet. So a fallback using JS is needed for a while. The fallback will
 * add a class to the edition row block so we can collapse the margins and bring the edition
 * row block up tight to the header and branding.
 *
 * This can be removed once the FireFox ESR version adds :has() support. This will only
 * load if :has() is not supported on the browser and will instead add a class to do the same.
 */
_core.default.topicslist = function () {
  var editionPost = document.querySelector('.wp-prepress-layout-edition') !== null;

  if (!editionPost) {
    // not an edition post so exit.
    return false;
  }

  (0, _cssHasPolyfill.cssHasPolyfill)('.wp-block-edition-topics-list', '.wp-prepress-layout-edition-content .wp-block-edition-row.has-one-column:first-child', 'has-topics-list-block');
}();

var _default = _core.default;
exports.default = _default;

},{"./_core":1,"./cssHasPolyfill.js":4,"@babel/runtime/helpers/interopRequireDefault":14}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectFitImages = _interopRequireDefault(require("object-fit-images"));

/**
 * Image functionality
 *
 * @package R2_Brand
 * @since   1.0.0
 */

/**
 * Kick-off object fit images for all images currently on document.
 *
 * @since 1.0.0
 */
function initImages() {
  (0, _objectFitImages.default)();
}

window.addEventListener('DOMContentLoaded', initImages);

},{"@babel/runtime/helpers/interopRequireDefault":14,"object-fit-images":15}],7:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _jQuery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

/*
* These functions are to support content from the Pre-2019 BU Today theme.
*
*
 */
_core.default.legacy_content = function () {
  /*
  * Special Sidebar with Video.
   */
  (0, _jQuery.default)('.special-sidebar.has-video .sidebar-head').one('click', function (e) {
    (0, _jQuery.default)(this).parent().addClass("show-video").removeClass("alignleft alignright sidebar-ready");
    var $vid = (0, _jQuery.default)((0, _jQuery.default)(this).find('.special-sidebar-video-template').html());
    var src = $vid.find('iframe').attr("src");
    $vid.find('iframe').attr("src", src + '&autoplay=true');
    (0, _jQuery.default)(this).append($vid);
    e.preventDefault();
  });
  /**
   *
   * Editorial Audio Player
   * Events and Controls for the Editorial Audio Player shortcode
   *
   */
  // module pattern

  var editorialAudioPlayer = function () {
    var players = (0, _jQuery.default)('.js-legacy-audioplayer');

    var setupPlayer = function setupPlayer() {
      var currentItem = {};
      currentItem.player = (0, _jQuery.default)(this);
      currentItem.audio = currentItem.player.find('audio')[0];
      currentItem.$playBtn = currentItem.player.find('.js-audioplayer-playBtn');
      currentItem.$progressValue = currentItem.player.find('.js-audioplayer-progress .editorial-audioPlayer-controls-progressValue');
      currentItem.$progressBar = currentItem.player.find('.js-audioplayer-progress'); //since we can't progressively enhance (ios does not fire canplay events prior to user input)
      //we are instead checking for old IE and assuming if not that then everything else can play
      //the audio file

      if (isOldBrowser() === false) {
        currentItem.canplay = true;
        currentItem.duration = currentItem.audio.duration;
        showControls(currentItem);
        addEvents(currentItem);
        playBtn(currentItem.$playBtn, currentItem.audio);
      } //window.currentItem = currentItem;

    };

    var addEvents = function addEvents(currentItem) {
      currentItem.audio.addEventListener('canplay', function () {
        currentItem.canplay = true;
        currentItem.duration = currentItem.audio.duration;
      });
      currentItem.audio.addEventListener("canplaythrough", function () {
        currentItem.duration = currentItem.audio.duration;
        showControls(currentItem);
      });
      currentItem.audio.addEventListener('playing', function () {
        toggleBtn('playing', currentItem.$playBtn);
        currentItem.duration = currentItem.audio.duration;

        _gaq.push(['_trackEvent', 'Audio Player', 'Play']);
      });
      currentItem.audio.addEventListener('pause', function () {
        toggleBtn('paused', currentItem.$playBtn);
      });
      currentItem.audio.addEventListener('error', function (e) {
        hideControls(currentItem);
      }); //update progress knob marker as video plays or progress bar changes

      currentItem.audio.addEventListener('timeupdate', function (e) {
        timeUpdate(currentItem);
      }); //progress bar/timeline

      currentItem.$progressBar.on('click', function (e) {
        currentItem.audio.currentTime = currentItem.duration * clickPercent(e, currentItem);
      }); // click and drag events on progress bar

      currentItem.$progressBar.on('mousedown', function (e) {
        currentItem.$progressBar.on('mousemove', throttle(function (e) {
          currentItem.audio.currentTime = currentItem.duration * clickPercent(e, currentItem);
        }, 200));
        jQuery('body').one('mouseup', function (e) {
          //turn off mouse move
          currentItem.$progressBar.off('mousemove');
        });
      });
    };

    var isOldBrowser = function isOldBrowser() {
      if ((0, _jQuery.default)('html').hasClass('lt-ie9')) {
        return true;
      } else {
        return false;
      }
    };

    var showControls = function showControls(currentItem) {
      //audio can play so display controls
      //hide download link
      currentItem.player.addClass('canPlay');
    };

    var hideControls = function hideControls(currentItem) {
      //audio can play so display controls
      //hide download link
      currentItem.player.removeClass('canPlay');
    };

    var playBtn = function playBtn($btn, player) {
      $btn.on('click', function (e) {
        e.preventDefault();

        if (player.paused) {
          player.play();
        } else {
          player.pause();
        }
      });
    };

    var toggleBtn = function toggleBtn(status, $btn) {
      if (status === 'playing') {
        //show paused icon
        $btn.find('.icon').removeClass('icon-play').addClass('icon-pause');
      }

      if (status === 'paused') {
        //show playing icon
        $btn.find('.icon').removeClass('icon-pause').addClass('icon-play');
      }
    };

    var timeUpdate = function timeUpdate(currentItem) {
      var playPercent = 100 * (currentItem.audio.currentTime / currentItem.duration);
      currentItem.$progressValue[0].style.width = playPercent + "%";
    };

    var clickPercent = function clickPercent(e, currentItem) {
      return (e.pageX - currentItem.$progressBar.offset().left) / currentItem.$progressBar.width();
    };

    var throttle = function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last, deferTimer;
      return function () {
        var context = scope || this;
        var now = +new Date(),
            args = arguments;

        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }; //setup player for each audioplayer found


    players.each(setupPlayer);
  }(); // close audio player module

  /*
  * Side drawer
  * From r-Research
  */


  (0, _jQuery.default)('.expanding-side-content').each(function () {
    var $button = (0, _jQuery.default)(this).find('a').first();
    $button.one('click', function (e) {
      e.preventDefault();
      var $aside = (0, _jQuery.default)(this).parents('aside');
      $aside.addClass("is-open");
      var expanding_content = $aside.find('.content-expanding-template').html();
      $aside.html(expanding_content);

      if ($aside.hasClass('has-buniverse')) {
        var $iframe = $aside.find('iframe');
        var src = $iframe.attr("src");
        $iframe.attr('src', src + '&autoplay=true');
      }
    });
  });
}();

var _default = _core.default;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],8:[function(require,module,exports){
"use strict";

jQuery(document).ready(function ($) {
  $('.js-open-publications-menu').on('click', function (e) {
    e.preventDefault();
    var $section = $('.publications-nav nav');
    var isCollapsed = $section.attr('data-collapsed');

    if (isCollapsed === 'true') {
      $('.publications-nav').addClass('is-open');
      $section.attr('aria-hidden', false);
      $section.attr('aria-expanded', true);
      $section.find('a').attr('tabindex', '0');
      $section.attr('data-collapsed', false);
      $(this).attr('aria-expanded', true);
    } else {
      $('.publications-nav').removeClass('is-open');
      $section.attr('aria-hidden', true);
      $section.attr('aria-expanded', false);
      $section.find('a').attr('tabindex', '-1');
      $(this).attr('aria-expanded', false);
      $section.attr('data-collapsed', true);
    }
  });
});

},{}],9:[function(require,module,exports){
"use strict";

/**
 * Toggle behavior for search buttons.
 *
 * @package r-editorial
 */
//ToDo: convert back to es6.
//import $ from 'jquery';
//ToDo: convert back to es6.
//export function toggle() {
jQuery(document).ready(function ($) {
  function toggle() {
    var $prevFocusElement = '';
    var $body = $('body');
    var $searchtoggle = $('.js-bu-prepress-open-search');
    var $closesearchbutton = $('.js-bu-prepress-close-search');
    var $searchitems = $searchtoggle.add('.js-search-overlay'); // Add aria attributes for control/expanded if JS is available

    $searchtoggle.attr('aria-expanded', 'false').attr('aria-controls', 'quicksearch');

    function toggleSearchPanel(focus) {
      if (focus === true && !$(this).hasClass('is-open')) {
        //ToDo: convert back to es6.
        // setTimeout( () => {
        // 	$( '#q' ).focus();
        // }, 100 );
        setTimeout(function () {
          $('#q').focus();
        }, 100);
      }

      if ($searchtoggle.attr('aria-expanded') === 'false') {
        $searchtoggle.attr('aria-expanded', 'true').attr('aria-label', 'Close search');
      } else {
        $searchtoggle.attr('aria-expanded', 'false').attr('aria-label', 'Open search');
      }

      $searchitems.toggleClass('is-open');
      $body.toggleClass('search-open');
    } //ToDo: convert back to es6.
    // $searchtoggle.on( {
    // 	click( e ) {
    // 		e.preventDefault();
    // 		toggleSearchPanel( true );
    // 	},
    // 	keypress( e ) {
    // 		if ( e.keyCode === 13 ) {
    // 			e.preventDefault();
    // 			toggleSearchPanel( false );
    // 		}
    // 	},
    // } );


    $searchtoggle.on('click', function (e) {
      e.preventDefault();
      toggleSearchPanel(true);
    });
    $searchtoggle.on('keypress', function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        $prevFocusElement = $(this);
        toggleSearchPanel(true);
      }
    });
    $closesearchbutton.on('click', function (e) {
      e.preventDefault();
      toggleSearchPanel(false);
      $prevFocusElement.focus();
    });
    $closesearchbutton.on('keypress', function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        toggleSearchPanel(false);
        $prevFocusElement.focus();
      }
    });
  } //ToDo: convert back to es6. (remove)


  toggle();
});

},{}],10:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _jQuery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

_core.default.stickyprogressBar = function () {
  var stickybar = {};
  /*
  * Calculate Scroll Percentage
  *
  */

  var calculateScroll = function calculateScroll() {
    var scrollPos = (0, _jQuery.default)(window).scrollTop(); // Current Scroll Position.

    var $article = (0, _jQuery.default)('.wp-prepress-layout-article-content'); // The article container.

    var elementHeight = $article.height(); // The height of the article container.

    var elementOffsetTop = $article.offset().top; // The distance from the top of the document.

    var distance = elementOffsetTop - scrollPos; // The distance from the top of the viewport.

    var distanceAbs = Math.abs(distance); // The absolute value. Used when article has exceeded top of viewport.

    var scrollPercent = 0; // The initial value of the progress scrolled.

    if (distance > 0) {
      scrollPercent = 0; // Article has not yet reached top of viewport.
    } else if (distanceAbs > elementHeight) {
      scrollPercent = 100; // Bottom of article has exceeded top of viewport (out-of-view).
    } else {
      scrollPercent = 100 - (elementHeight - distanceAbs) / elementHeight * 100;
    }

    return scrollPercent;
  };
  /*
  * Update Progress Bar
  *
  */


  var updateProgressBar = function updateProgressBar() {
    (0, _jQuery.default)(window).on('scroll', function () {
      var newValue = calculateScroll();

      if (newValue) {
        stickybar.$value.width(newValue + '%');
      }
    });
  };
  /*
  * Setup Sticky Progress Bar Waypoint
  *
  */


  var stickyProgressBarInit = function stickyProgressBarInit() {
    stickybar.waypoint = new Waypoint({
      element: stickybar.$trigger[0],
      handler: function handler(direction) {
        stickybar.$stickybar.toggleClass('on-screen');
      }
    });
  };

  (0, _jQuery.default)(document).ready(function ($) {
    stickybar.$stickybar = $('.js-wp-component-article-progressbar');
    stickybar.$trigger = $('.wp-prepress-component-metabar');
    stickybar.$value = $('.js-wp-component-article-progressbar-value');

    if (stickybar.$stickybar.length > 0 && stickybar.$trigger.length > 0) {
      // Setup Waypoints
      stickyProgressBarInit(); // Monitor Scroll Position

      updateProgressBar();
    }
  });
  return {
    getStickyBar: function getStickyBar() {
      return stickybar;
    }
  };
}();

var _default = _core.default;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],11:[function(require,module,exports){
"use strict";

// on press of "tab" key
// add class to body so outlines
// are added to elements on focus
function handleFirstTab(e) {
  if (e.keyCode === 9) {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
} // on mouse down event, remove
// tabbing class from body to hide outlined


function handleMouseDownOnce() {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
}

window.addEventListener('keydown', handleFirstTab);

},{}],12:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./_core"));

var _jQuery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

_core.default.videoLandingPage = function () {
  var videosPage = {
    currentVideo: false,
    videos: []
  };
  /*
  *	For a given BUniverse ID Build an iFrame
  *	embed with autoplay support to bypass autoplay
  *	limits in certain browsers.
  *
  */

  var buniverseEmbed = function buniverseEmbed(buniverse_id) {
    //'<iframe src="//www.bu.edu/buniverse/interface/embed/embed.html?v=CSe7S24N" width="550" height="310" frameborder="0"></iframe>'
    var url = '//www.bu.edu/buniverse/interface/embed/embed.html?v=' + buniverse_id + '&jsapi=1&playsinline=true';
    var iframe = (0, _jQuery.default)('<iframe src="' + url + '" width="550" height="310" frameborder="0" allow="autoplay;fullscreen;"></iframe>');
    return iframe;
  };
  /*
  * When the modal is closed, try to pause
  * the video. Else erase the contents to get
  * it to stop playing.
  */


  var modalCloseCallback = function modalCloseCallback() {
    try {
      videosPage.currentVideo.pause();
    } catch (err) {
      videosPage.$modal_video_container.html('');
    }
  };
  /*
  * Use Modal Library from BU Prepress to
  * display a full window video player.
  */


  var openModal = function openModal() {
    MicroModal.show('video-modal', {
      onClose: modalCloseCallback,
      disableScroll: true
    });
  }; // Fired anytime the video is paused.


  var videoPaused = function videoPaused() {
    videosPage.$modal.addClass('has-video-modal-paused');
  }; // Fired anytime the video is playing.


  var videoPlaying = function videoPlaying() {
    videosPage.$modal.removeClass('has-video-modal-paused');
  };
  /*
  * Update the Modal with the video, title, subtitle and
  * a url to the associated story.
  *
  * Invoked when the user clicks on a video.
  * */


  var updateModal = function updateModal(buniverse, hed, dek, url) {
    var videoPlayer = buniverseEmbed(buniverse);
    videosPage.$modal_video_container.html(videoPlayer);
    videosPage.$modal_hed.html(hed);
    videosPage.$modal_dek.html(dek);
    videosPage.$modal_readbtn.attr('href', url); // Use Try/Catch to see if buniverse functions are available.

    videosPage.buniverse = false;

    try {
      // check if we have access to buniverse already
      videosPage.buniverse = bu_prepress.buniverse;
    } catch (err) {// do nothing
    }

    if (videosPage.buniverse) {
      var video_iframe = videosPage.$modal_video_container.find('iframe')[0]; // Store the returned buniverse video player reference as the currentVideo.

      videosPage.currentVideo = videosPage.buniverse.addIframe(video_iframe);

      if (videosPage.currentVideo) {
        // Setup the new buniverse iframe to activate Buniverse API.
        videosPage.buniverse.setupPlayer(videosPage.currentVideo); // Add onReady callback so video can "autoplay" when ready.

        videosPage.currentVideo.addPrepressOnReadyCallback(function () {
          // Mute the video as iOS and some browsers won't play video
          // with sound turned on.
          videosPage.currentVideo.mute();
          videosPage.currentVideo.play();
        }); // Add onPlay Callback.

        videosPage.currentVideo.addPrepressOnPlayCallback(function () {
          // Ensure the pause overlay is hidden when playing the video.
          videoPlaying();
        }); // Add onPause Callback.

        videosPage.currentVideo.addPrepressOnPauseCallback(function () {
          // On Pause, show the pause overlay content.
          videoPaused();
        }); // Play video when play button in modal overlay content is clicked.

        videosPage.$modal_playbtn.on('click', function () {
          videosPage.currentVideo.play();
        });
      }
    }
  };
  /*
  * Convert Youtube Duration ISO 8601 format to Timecode 00:00:00.
  *
  * time: a youtube ISO 8601 format duration string.
  *
  * Returns: a timecode formatting duration value.
  */


  var convertDurationToTimeCode = function convertDurationToTimeCode(time) {
    // For backwards compatibilty.
    if (!Array.isArray) {
      Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };
    }

    var result = ''; // Regex Match on Time Labels and split into array.

    var a = time.match(/\d+H|\d+M|\d+S/g);

    if (Array.isArray(a)) {
      for (var i = 0; i < a.length; i++) {
        // For each number, slice off the H/M/S label.
        var num = a[i].slice(0, a[i].length - 1); // Make sure each number is 2 digits long.

        if (num.length < 2) {
          // Add a leading 0 to single digits.
          num = '0' + num;
        } // Format the output as 00:00:00.


        if (i === 0) {
          if (a.length === 1) {
            result += "00:";
          }

          result += num;
        } else if (i === 1) {
          result += ":" + num;
        } else if (i === 2) {
          result += ":" + num;
        }
      }
    }

    if (result != '') {
      return result;
    } else {
      return false;
    }
  };

  var numberWithCommas = function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  /*
  * Get all Youtube Data
  *
  * This function uses the Youtube Data API v3 to
  * fetch the duration info and statitics for the given
  * video ideas. To do this we need the youtube ids.
  *
  * The IDs are stored in an array and then turned into a string
  * to send them all in one call to Youtube's API.
  *
  * The response if successful is a json object with video metadata for
  * each video ID sent. In order to match this data up with the elements on
  * the page, we use jQuery to find only the video elements for which we have
  * a successful response providing us with the youtube ID.
  *
  */


  var getYoutubeData = function getYoutubeData(videos) {
    var key = 'AIzaSyBRjzl_c7M7traO5eslz0_nPT63vKMDD9A';
    var youtubeIDs = Array(); // For each video on the landing page, get the youtube id and store.

    videos.each(function () {
      var id = (0, _jQuery.default)(this).attr('data-youtubeid');
      youtubeIDs.push(id);
    }); // Fetch stats & duration info from Youtube for all videos in one XHR call.

    _jQuery.default.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + youtubeIDs.toString() + '&part=contentDetails%2Cstatistics&key=' + key, function (data) {
      if (data) {
        _jQuery.default.each(data.items, function (key, val) {
          var id = val.id;
          var duration = val.contentDetails.duration;
          var views = val.statistics.viewCount; // Convert Youtube's Duration format to a pretty fimecode style.

          duration = convertDurationToTimeCode(duration); // Format view count with commas.

          views = numberWithCommas(views); // Find the video on the page by it's youtube id data attribute.

          var $vid = (0, _jQuery.default)('.js-video-landing-video-item[data-youtubeid=' + id + ']'); // Show and insert the duration string.

          $vid.find('.js-video-landing-video-duration').show().find('.number').text(duration); // Show the views and insert the view count.

          $vid.find('.js-video-landing-video-views').show().find('.number').text(views);
        });
      }
    });
  };
  /*
  * Find all video links
  *
  */


  var findVideos = function findVideos() {
    var videosLinks = (0, _jQuery.default)('.js-video-landing-video-link');
    var videoItems = (0, _jQuery.default)('.js-video-landing-video-item[data-youtubeid]'); // For all videos on the page let's setup
    // an on click to intercept the default action
    // and instead play the video in our video modal.

    videosLinks.each(function () {
      (0, _jQuery.default)(this).on('click', function (e) {
        e.preventDefault();
        var buniverse_id = (0, _jQuery.default)(this).attr('data-buniverseid');
        var hed = (0, _jQuery.default)(this).attr('data-hed');
        var dek = (0, _jQuery.default)(this).attr('data-dek');
        var url = (0, _jQuery.default)(this).attr('data-article');
        updateModal(buniverse_id, hed, dek, url);
        openModal();
      });
    });

    if (videoItems.length) {
      // For all of the videos with youtube id attribute,
      // fetch the duration & view count via Youtube's api.
      getYoutubeData(videoItems);
    }
  };

  (0, _jQuery.default)(document).ready(function ($) {
    videosPage.$modal = $('#video-modal');
    videosPage.$modal_video_container = $('#video-landing-page-modal-thevideo');
    videosPage.$modal_hed = $('#video-landing-page-modal-hed');
    videosPage.$modal_dek = $('#video-landing-page-modal-dek');
    videosPage.$modal_readbtn = $('.js-video-landing-page-modal-readmore');
    videosPage.$modal_playbtn = $('.js-video-landing-modal-play-pause'); // Find videos

    findVideos();
  });
  return {
    getVideosPage: function getVideosPage() {
      return videosPage;
    }
  };
}();

var _default = _core.default;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_core":1,"@babel/runtime/helpers/interopRequireDefault":14}],13:[function(require,module,exports){
"use strict";

var _toggle = require("responsive-foundation/js-dev/dist/toggle");

require("./modules/cssHasPolyfill.js");

require("./modules/buhp-navigation");

require("./modules/publications-menu");

require("./modules/search");

require("./modules/tab-outlines");

require("./modules/sticky-progress-bar");

require("./modules/classnotes-slideshow");

require("./modules/legacy-content");

require("./modules/video-landing-page");

require("./modules/images");

require("./modules/edition-topics-list.js");

/**
 * The entry point for theme scripts.
 *
 * Modules are imported and compiled into one resulting `script.js` file.
 *
 * @package R_Editorial
 */
// Import Foundation scripts.
(0, _toggle.toggle)(); // Import r-editorial scripts.

},{"./modules/buhp-navigation":2,"./modules/classnotes-slideshow":3,"./modules/cssHasPolyfill.js":4,"./modules/edition-topics-list.js":5,"./modules/images":6,"./modules/legacy-content":7,"./modules/publications-menu":8,"./modules/search":9,"./modules/sticky-progress-bar":10,"./modules/tab-outlines":11,"./modules/video-landing-page":12,"responsive-foundation/js-dev/dist/toggle":16}],14:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],15:[function(require,module,exports){
/*! npm.im/object-fit-images 3.2.4 */
'use strict';

var OFI = 'bfred-it:object-fit-images';
var propRegex = /(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g;
var testImg = typeof Image === 'undefined' ? {style: {'object-position': 1}} : new Image();
var supportsObjectFit = 'object-fit' in testImg.style;
var supportsObjectPosition = 'object-position' in testImg.style;
var supportsOFI = 'background-size' in testImg.style;
var supportsCurrentSrc = typeof testImg.currentSrc === 'string';
var nativeGetAttribute = testImg.getAttribute;
var nativeSetAttribute = testImg.setAttribute;
var autoModeEnabled = false;

function createPlaceholder(w, h) {
	return ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'%3E%3C/svg%3E");
}

function polyfillCurrentSrc(el) {
	if (el.srcset && !supportsCurrentSrc && window.picturefill) {
		var pf = window.picturefill._;
		// parse srcset with picturefill where currentSrc isn't available
		if (!el[pf.ns] || !el[pf.ns].evaled) {
			// force synchronous srcset parsing
			pf.fillImg(el, {reselect: true});
		}

		if (!el[pf.ns].curSrc) {
			// force picturefill to parse srcset
			el[pf.ns].supported = false;
			pf.fillImg(el, {reselect: true});
		}

		// retrieve parsed currentSrc, if any
		el.currentSrc = el[pf.ns].curSrc || el.src;
	}
}

function getStyle(el) {
	var style = getComputedStyle(el).fontFamily;
	var parsed;
	var props = {};
	while ((parsed = propRegex.exec(style)) !== null) {
		props[parsed[1]] = parsed[2];
	}
	return props;
}

function setPlaceholder(img, width, height) {
	// Default: fill width, no height
	var placeholder = createPlaceholder(width || 1, height || 0);

	// Only set placeholder if it's different
	if (nativeGetAttribute.call(img, 'src') !== placeholder) {
		nativeSetAttribute.call(img, 'src', placeholder);
	}
}

function onImageReady(img, callback) {
	// naturalWidth is only available when the image headers are loaded,
	// this loop will poll it every 100ms.
	if (img.naturalWidth) {
		callback(img);
	} else {
		setTimeout(onImageReady, 100, img, callback);
	}
}

function fixOne(el) {
	var style = getStyle(el);
	var ofi = el[OFI];
	style['object-fit'] = style['object-fit'] || 'fill'; // default value

	// Avoid running where unnecessary, unless OFI had already done its deed
	if (!ofi.img) {
		// fill is the default behavior so no action is necessary
		if (style['object-fit'] === 'fill') {
			return;
		}

		// Where object-fit is supported and object-position isn't (Safari < 10)
		if (
			!ofi.skipTest && // unless user wants to apply regardless of browser support
			supportsObjectFit && // if browser already supports object-fit
			!style['object-position'] // unless object-position is used
		) {
			return;
		}
	}

	// keep a clone in memory while resetting the original to a blank
	if (!ofi.img) {
		ofi.img = new Image(el.width, el.height);
		ofi.img.srcset = nativeGetAttribute.call(el, "data-ofi-srcset") || el.srcset;
		ofi.img.src = nativeGetAttribute.call(el, "data-ofi-src") || el.src;

		// preserve for any future cloneNode calls
		// https://github.com/bfred-it/object-fit-images/issues/53
		nativeSetAttribute.call(el, "data-ofi-src", el.src);
		if (el.srcset) {
			nativeSetAttribute.call(el, "data-ofi-srcset", el.srcset);
		}

		setPlaceholder(el, el.naturalWidth || el.width, el.naturalHeight || el.height);

		// remove srcset because it overrides src
		if (el.srcset) {
			el.srcset = '';
		}
		try {
			keepSrcUsable(el);
		} catch (err) {
			if (window.console) {
				console.warn('https://bit.ly/ofi-old-browser');
			}
		}
	}

	polyfillCurrentSrc(ofi.img);

	el.style.backgroundImage = "url(\"" + ((ofi.img.currentSrc || ofi.img.src).replace(/"/g, '\\"')) + "\")";
	el.style.backgroundPosition = style['object-position'] || 'center';
	el.style.backgroundRepeat = 'no-repeat';
	el.style.backgroundOrigin = 'content-box';

	if (/scale-down/.test(style['object-fit'])) {
		onImageReady(ofi.img, function () {
			if (ofi.img.naturalWidth > el.width || ofi.img.naturalHeight > el.height) {
				el.style.backgroundSize = 'contain';
			} else {
				el.style.backgroundSize = 'auto';
			}
		});
	} else {
		el.style.backgroundSize = style['object-fit'].replace('none', 'auto').replace('fill', '100% 100%');
	}

	onImageReady(ofi.img, function (img) {
		setPlaceholder(el, img.naturalWidth, img.naturalHeight);
	});
}

function keepSrcUsable(el) {
	var descriptors = {
		get: function get(prop) {
			return el[OFI].img[prop ? prop : 'src'];
		},
		set: function set(value, prop) {
			el[OFI].img[prop ? prop : 'src'] = value;
			nativeSetAttribute.call(el, ("data-ofi-" + prop), value); // preserve for any future cloneNode
			fixOne(el);
			return value;
		}
	};
	Object.defineProperty(el, 'src', descriptors);
	Object.defineProperty(el, 'currentSrc', {
		get: function () { return descriptors.get('currentSrc'); }
	});
	Object.defineProperty(el, 'srcset', {
		get: function () { return descriptors.get('srcset'); },
		set: function (ss) { return descriptors.set(ss, 'srcset'); }
	});
}

function hijackAttributes() {
	function getOfiImageMaybe(el, name) {
		return el[OFI] && el[OFI].img && (name === 'src' || name === 'srcset') ? el[OFI].img : el;
	}
	if (!supportsObjectPosition) {
		HTMLImageElement.prototype.getAttribute = function (name) {
			return nativeGetAttribute.call(getOfiImageMaybe(this, name), name);
		};

		HTMLImageElement.prototype.setAttribute = function (name, value) {
			return nativeSetAttribute.call(getOfiImageMaybe(this, name), name, String(value));
		};
	}
}

function fix(imgs, opts) {
	var startAutoMode = !autoModeEnabled && !imgs;
	opts = opts || {};
	imgs = imgs || 'img';

	if ((supportsObjectPosition && !opts.skipTest) || !supportsOFI) {
		return false;
	}

	// use imgs as a selector or just select all images
	if (imgs === 'img') {
		imgs = document.getElementsByTagName('img');
	} else if (typeof imgs === 'string') {
		imgs = document.querySelectorAll(imgs);
	} else if (!('length' in imgs)) {
		imgs = [imgs];
	}

	// apply fix to all
	for (var i = 0; i < imgs.length; i++) {
		imgs[i][OFI] = imgs[i][OFI] || {
			skipTest: opts.skipTest
		};
		fixOne(imgs[i]);
	}

	if (startAutoMode) {
		document.body.addEventListener('load', function (e) {
			if (e.target.tagName === 'IMG') {
				fix(e.target, {
					skipTest: opts.skipTest
				});
			}
		}, true);
		autoModeEnabled = true;
		imgs = 'img'; // reset to a generic selector for watchMQ
	}

	// if requested, watch media queries for object-fit change
	if (opts.watchMQ) {
		window.addEventListener('resize', fix.bind(null, imgs, {
			skipTest: opts.skipTest
		}));
	}
}

fix.supportsObjectFit = supportsObjectFit;
fix.supportsObjectPosition = supportsObjectPosition;

hijackAttributes();

module.exports = fix;

},{}],16:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = toggle;

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

/**
 * Toggle behavior for navigation / search buttons.
 *
 * @package ResponsiveFoundation
 */
function toggle() {
  var $body = (0, _jquery.default)('body');
  var $toggle = (0, _jquery.default)('.js-nav-toggle');
  var $toggleitems = $toggle.add('nav');
  var $searchtoggle = (0, _jquery.default)('.js-search-toggle');
  var $searchitems = $searchtoggle.add('#quicksearch'); // Add aria attributes for control/expanded if JS is available

  $searchtoggle.attr('aria-expanded', 'false').attr('aria-controls', 'quicksearch');
  $toggle.attr('aria-expanded', 'false').attr('aria-controls', 'primary-nav-menu');
  $toggle.on('click', function (e) {
    e.preventDefault();

    if ($toggle.attr('aria-expanded') === 'false') {
      $toggle.attr('aria-expanded', 'true').attr('aria-label', 'Close menu');
    } else {
      $toggle.attr('aria-expanded', 'false').attr('aria-label', 'Open menu');
    }

    $toggleitems.toggleClass('is-open');
    $searchitems.removeClass('is-open');
    $body.toggleClass('nav-open').removeClass('search-open');
  });

  function toggleSearchPanel(focus) {
    $toggleitems.removeClass('is-open');

    if (focus === true && !(0, _jquery.default)(this).hasClass('is-open')) {
      setTimeout(function () {
        (0, _jquery.default)('#q').focus();
      }, 100);
    }

    if ($searchtoggle.attr('aria-expanded') === 'false') {
      $searchtoggle.attr('aria-expanded', 'true').attr('aria-label', 'Close search');
    } else {
      $searchtoggle.attr('aria-expanded', 'false').attr('aria-label', 'Open search');
    }

    $searchitems.toggleClass('is-open');
    $body.toggleClass('search-open').removeClass('nav-open');
  }

  $searchtoggle.on({
    click: function click(e) {
      e.preventDefault();
      toggleSearchPanel(true);
    },
    keypress: function keypress(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        toggleSearchPanel(false);
      }
    }
  });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/interopRequireDefault":14}]},{},[13]);
