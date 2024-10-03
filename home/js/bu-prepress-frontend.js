
/*
.matches() polyfill:
https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

//EndsWith pollyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}


// Foreach Polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback/*, thisArg*/) {

    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat while k < len.
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator.
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c.
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined.
  };
}

//Find Index polyfill
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}

//Classlist polyfill
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_"))
    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

    (function (view) {

      "use strict";

      if (!('Element' in view)) return;

      var
        classListProp = "classList"
        , protoProp = "prototype"
        , elemCtrProto = view.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, "");
        }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
          var
            i = 0
            , len = this.length
            ;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        , DOMEx = function (type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        }
        , checkTokenAndGetIndex = function (classList, token) {
          if (token === "") {
            throw new DOMEx(
              "SYNTAX_ERR"
              , "An invalid or illegal string was specified"
            );
          }
          if (/\s/.test(token)) {
            throw new DOMEx(
              "INVALID_CHARACTER_ERR"
              , "String contains an invalid character"
            );
          }
          return arrIndexOf.call(classList, token);
        }
        , ClassList = function (elem) {
          var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
            ;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
          };
        }
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
          return new ClassList(this);
        }
        ;
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
          ;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
          , index
          ;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";

        var
          result = this.contains(token)
          , method = result ?
            force !== true && "remove"
            :
            force !== false && "add"
          ;

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter
          , enumerable: true
          , configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }

    }(self));

  }

  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.

  (function () {
    "use strict";

    var testElement = document.createElement("_");

    testElement.classList.add("c1", "c2");

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
      var createMethod = function (method) {
        var original = DOMTokenList.prototype[method];

        DOMTokenList.prototype[method] = function (token) {
          var i, len = arguments.length;

          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }

    testElement.classList.toggle("c3", false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;

      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };

    }

    testElement = null;
  }());

}

var bu_prepress = {};;
bu_prepress.audio = (function() {

	/*
	*	Global BU Prepress Audio Player/tag API
	*
	* 	This is start at an audio api to smooth over some
	* 	of the difficulties of interacting with audio tags/players
	* 	and all of the events, timing, readyState handling, etc.
	*
	*	It finds all elements with a class of '.js-bu-prepress-audioplayer', a
	*	generic class not tied to a specific Gutenberg Block that indicates there is
	*	and <audio> tag as a child element. This object has functions to
	*	find that tag, and setup basic control functions and callback functions.
	*
	*	It is loosely based on the global buniverse video API but simplified.
	*
	*/


	// Array to store all audio player
	// objects in, including references to the
	// dom element and any callbacks or functions
	var audioPlayers = [];


	/*
	* Adds a single instance of an audio player
	* to the audioPlayers array so we can track
	* all audio tags on the page and access them.
	*/
	var addPlayer = function( player ) {

		var playerInstance = {};

		// For each video found store as property in the object
		// We'll expand this object later with additional properties
		playerInstance.block = player;
		playerInstance.block.bu_prepress = {};
		playerInstance.block.bu_prepress.audio = playerInstance.block.querySelector( 'audio' ); // The audio tag.

		// And last, add it to the audioPlayers array
		var newItem = audioPlayers.push( playerInstance );
		var lastItem = audioPlayers[newItem-1];

		return lastItem;
	};


	/*
	* Find all audio players on the page
	*/
	var findElements = function() {
		//find all the players
		var elements = document.querySelectorAll( '.js-bu-prepress-audioplayer' );
		//if found
		if (elements.length > 0) {

			// Loop through the found elements.
			for ( var i = 0; i < elements.length; i++ ) {

				// Add this player to the Array of players
				addPlayer( elements[i] );
			}
		}
	};


	/*
	* Setup Callbacks and Events
	*
	* For all of the audio players found start
	* the setup of each
	*/
	var setupFoundPlayers = function() {

		if (audioPlayers.length > 0) {

			for ( var i = 0; i < audioPlayers.length; i++ ) {

				var thisPlayer = audioPlayers[i];

				setupPlayer( thisPlayer );
			}
		}
	};


	/*
	* Setup the Callbacks for this single player
	*
	* Add iframe load event for this video
	*/
	var setupPlayer = function( player ) {
		if ( player ) {



			// Setup another layer of callbacks so other JS in
			// BU Prepress, etc can add Callbacks that are
			// fired after when key Audio Events are fired by the
			// audio tag.
			player.block.bu_prepress.audioAPI = {
				'bu_prepress_on_CanPlayCallback' : null,
				'bu_prepress_on_CanPlayThroughCallback' : null,
				'bu_prepress_on_PlayingCallback' : null,
				'bu_prepress_on_PauseCallback' : null,
				'bu_prepress_on_CompleteCallback': null,
				'bu_prepress_on_TimeUpdateCallback': null
			}


			setupAudioEvents( player );
			setupAudioCallbacks( player );


			// Let's add some basic functions for play/pause/stop:

			player.block.bu_prepress.play = function() {
				this.audio.play();
			}

			player.block.bu_prepress.pause = function() {
				this.audio.pause();
			}

			player.block.bu_prepress.stop = function() {
				this.audio.pause();
				this.audio.currentTime = 0;
			}


			// Player may be ready now.
			// May need to switch this all: https://stackoverflow.com/questions/50051639/javascript-html5-video-event-canplay-not-firing-on-safari
			if ( player.block.bu_prepress.audio.readyState >= 3 ) {
				eventCanPlay( player );
				eventCanPlayThrough( player );
			} else {
				player.block.bu_prepress.audio.addEventListener( 'canplay', function() {
					eventCanPlay( player );
				});
				player.block.bu_prepress.audio.addEventListener( 'canplaythrough', function() {
					eventCanPlayThrough( player );
				});
			}


		}
	};


	var eventCanPlay = function( player ) {
		player.canplay = true;

		// Call the Prepress level Can Play Callback if exists.
		if ( player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayCallback != null) {
			player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayCallback();
		}
	};

	var eventCanPlayThrough = function( player ) {

		// Call the Prepress level Can Play Callback if exists.
		if ( player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayThroughCallback != null) {
			player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayThroughCallback();
		}
	};



	/*
	* Setup our main audio tag events
	*
	* Playing: fires when the audio plays
	* Pause: fires every time the audio is paused
	* TimeUpdate: fires countinuously while playing the audio
	* Ended: the end of the audio, we rename this to on_Complete callback.
	*/
	var setupAudioEvents = function( player ) {


		player.block.bu_prepress.audio.addEventListener('playing',function(){

			// Call the Prepress level On Playing Callback if exists.
			if ( player.block.bu_prepress.audioAPI.bu_prepress_on_PlayingCallback != null) {
				player.block.bu_prepress.audioAPI.bu_prepress_on_PlayingCallback();
			}

		});
		player.block.bu_prepress.audio.addEventListener('pause',function(){

			// Call the Prepress level On Pause Callback if exists.
			if ( player.block.bu_prepress.audioAPI.bu_prepress_on_PauseCallback != null) {
				player.block.bu_prepress.audioAPI.bu_prepress_on_PauseCallback();
			}
		});


		player.block.bu_prepress.audio.addEventListener('timeupdate',function(e){
			//player.duration = player.block.bu_prepress.audio.duration;
			currentTime = player.block.bu_prepress.audio.currentTime;

			// Call the Prepress level Time Update Callback if exists.
			if ( player.block.bu_prepress.audioAPI.bu_prepress_on_TimeUpdateCallback != null) {
				player.block.bu_prepress.audioAPI.bu_prepress_on_TimeUpdateCallback( currentTime );
			}

		});

		player.block.bu_prepress.audio.addEventListener('ended', function(e) {
			if ( player.block.bu_prepress.audioAPI.bu_prepress_on_CompleteCallback != null) {
				player.block.bu_prepress.audioAPI.bu_prepress_on_CompleteCallback();
			}
		});

	};


	/*
	* Setup the Callback functions.
	* These can be called from other scripts and blocks in order to
	* attach callback functions to this block/audio instance.
	*/
	var setupAudioCallbacks = function( player ) {


		player.block.bu_prepress.addPrepressCanPlayCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayCallback = cb;
			}
		}

		player.block.bu_prepress.addPrepressCanPlayThroughCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_CanPlayThroughCallback = cb;
			}
		}

		player.block.bu_prepress.addPrepressOnPlayingCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_PlayingCallback = cb;
			}
		}

		player.block.bu_prepress.addPrepressOnPauseCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_PauseCallback = cb;
			}
		}

		player.block.bu_prepress.addPrepressOnCompleteCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_CompleteCallback = cb;
			}
		}

		player.block.bu_prepress.addPrepressOnTimeUpdateCallback = function(cb) {
			if (typeof cb === 'function') {
				player.block.bu_prepress.audioAPI.bu_prepress_on_TimeUpdateCallback = cb;
			}
		}


	}




	/*
	* Initialize audio Functions
	*
	* Start on page load by finding any elements
	* and setting up Event Handlers if any are found.
	*/
	var audioInit = function() {
		//find the elements
		findElements();

		//setup players
		setupFoundPlayers();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {

		audioInit();

	});


	/*
	* Return Public Functions
	*
	* all of the functions above are private and encapsulated in this
	* function/object.
	*
	* In the return we can expose those functions that we want to make
	* public and accessible to other JS on the Window.
	*
	* They can be accessed by calling `bu_prepress.buniverse`
	*
	*/
	return {
		getaudioPlayers: function() {
			return audioPlayers;
		},
		addPlayer: function( player ) {
			if( player ) {
				return addPlayer( player );
			}
		},
		setupPlayer: function( player ) {
			if( player ) {
				setupPlayer( player );
			}
		},

	};
})();;
bu_prepress.buniverse = (function() {
	// Set Domain to bu so client JS can
	// 'talk' to buniverse iframe which is
	// also setting this to bu.edu. This prevents
	// Cross Origin errors across bu subdomains (dev/staging/etc).
	var regex = /bu\.edu$/g;
	if( document.domain.match( regex ) ) {
		document.domain = "bu.edu";
	}

	// Array to store all buniverse video
	// objects in, including references to the
	// dom element and any callbacks or functions
	var buniverseVideos = [];


	/*
	* Adds a single instance of a video iframe
	* to the BuniverseVideos array so we can track
	* all videos on the page and access them.
	*/
	var addIframe = function( iframe ) {

		var video = {};

		// For each video found store as property in the object
		// We'll expand this object later with additional properties
		video.iframe = iframe;

		// And last, add it to the buniverseVideos array
		var newItem = buniverseVideos.push( video );
		var lastItem = buniverseVideos[newItem-1];

		return lastItem;
	};


	/*
	* Find all Buniverse iframes on the page
	* Create a video object and push that
	* to the buniverseVideos array
	*/
	var findElements = function() {
		//find all the videos
		var elements = document.querySelectorAll('iframe[src*="bu.edu/buniverse/interface/embed/embed.html"]');
		//if found
		if (elements.length > 0) {

			// Loop through the found elements.
			for ( var i = 0; i < elements.length; i++ ) {

				// Add this iframe to the Array of videos
				addIframe( elements[i] );
			}
		}
	};


	/*
	* Setup Callbacks and Events
	*
	* For all of the videos found start
	* the setup of each video's callbacks
	*
	*/
	var setupFoundPlayers = function() {

		if (buniverseVideos.length > 0) {

			for ( var i = 0; i < buniverseVideos.length; i++ ) {

				// The Buniverse iframe
				var thisVideo = buniverseVideos[i];

				setupPlayer( thisVideo, true );
			}
		}
	};


	/*
	* Setup the Callbacks for this single video
	*
	* Add iframe load event for this video
	*/
	var setupPlayer = function( video ) {
		if ( video ) {

			// Add the Prepress level of callback functions here
			// so that other blocks/js can start adding Callbacks
			// before the video is completely loaded and ready
			// in the DOM.
			setupbuniverseCallbacks( video );


			// Setup iFrame Load event to wait until buniverse loads.
			addIframeLoadHandler( video );

		}
	};


	/*
	* Buniverse Iframe Load Handler
	*
	* Setup basic Load Event on the iframe to wait
	* for Buniverse iframe to load before trying to
	* setup buniverse / youtube callbacks
	*/
	var addIframeLoadHandler = function( video ) {


		// Use Try/Catch to see if buniverse functions are ready on the iframe.
		var buniverse = false;
		try {
			// check if we have access to buniverse already
		 	var buniverse = video.iframe.contentWindow.buniverse.addOnReadyCallback;

		} catch(err){
			// do nothing
		}


		if ( buniverse ) {
			// Already loaded & ready
			video.iframe.classList.add( 'is-loaded' );

			// Add our Buniverse Events/Callbacks
			// that are called when the Youtube player changes state
			setupbuniverseEvents( video );

		} else {
			// Setup Event Handlers
			video.iframe.addEventListener( "load", function(e) {

				video.iframe.classList.add( 'is-loaded' );

				// Once loaded, add our Buniverse Events/Callbacks
				// that are called when the Youtube player changes state
				setupbuniverseEvents( video );
			});

		}

	};





	/*
	* Setup Buniverse Events and Callbacks
	*
	* Buniverse iframe is loaded enough to be able
	* to start adding callbacks
	*/
	var setupbuniverseEvents = function( video ) {
		var videoClasslist = video.iframe.classList;
		video.buniverse = false;

		// Use Try/Catch to see if buniverse functions are available.
		try {
		  // check if we have access to buniverse already
		  video.buniverse = video.iframe.contentWindow.buniverse;

		} catch(err){
		  // do nothing
		}

		if ( video.buniverse === false ) {
			// Bail if buniverse is not available on the iframe.
			return;
		}
		/*
		* Add "Core" Buniverse iframe Callbacks that
		* are fired by the Youtube Iframe API
		*/

		// Fires when Youtube Player is loaded enough to be played.
		video.buniverse.addOnReadyCallback( function() {

			videoClasslist.add( 'is-ready' );

			// Call the Prepress level on Ready Callback if exists.
			if ( video.videoAPI.bu_prepress_on_readyCallback != null) {
				video.videoAPI.bu_prepress_on_readyCallback();
			}
		});

		// Fires when Youtube Video plays for the first time.
		video.buniverse.addOnFirstPlayCallback( function() {

			// Call the Prepress level on Play Callback if exists.
			if ( video.videoAPI.bu_prepress_on_firstplayCallback != null) {
				video.videoAPI.bu_prepress_on_firstplayCallback();
			}
		});

		// Fires anytime the Youtube video is played.
		video.buniverse.addOnPlayCallback( function() {

			videoClasslist.remove( 'is-paused' );
			videoClasslist.remove( 'is-end' );
			videoClasslist.add( 'is-playing' );

			// Call the Prepress level on Play Callback if exists.
			if ( video.videoAPI.bu_prepress_on_playCallback != null) {
				video.videoAPI.bu_prepress_on_playCallback();
			}

		});

		// Fires anytime the Youtube video is paused.
		video.buniverse.addOnPauseCallback( function() {

			videoClasslist.remove( 'is-playing' );
			videoClasslist.remove( 'is-end' );
			videoClasslist.add( 'is-paused' );

			// Call the Prepress level on Pause Callback if exists.
			if ( video.videoAPI.bu_prepress_on_pauseCallback != null) {
				video.videoAPI.bu_prepress_on_pauseCallback();
			}
		});

		// Fires anytime the Youtube video is complete.
		video.buniverse.addOnCompleteCallback( function() {
			//console.log("Buniverse JS: complete");
			videoClasslist.remove( 'is-playing' );
			videoClasslist.remove( 'is-paused' );
			videoClasslist.add( 'is-end' );

			// Call the Prepress level on Pause Callback if exists.
			if ( video.videoAPI.bu_prepress_on_CompleteCallback != null) {
				video.videoAPI.bu_prepress_on_CompleteCallback();
			}
		});

	};


	/*
	* Prepress Callbacks Setup
	*
	* To make Buniverse videos easier to work with we
	* copy the pattern from Buniverse App and add another
	* layer of Callbacks that can be fired when the Youtube/Buniverse
	* level of Callbacks fire. This lets us add additional
	* functionality easily without messing with the core
	* Buniverse callbacks on every Custom story or Gutenberg block.
	*/
	var setupbuniverseCallbacks = function( video ) {

		// Setup another layer of callbacks so other JS in
		// BU Prepress, etc can add Callbacks that are
		// fired after the Core Buniverse Callbacks added
		// here to the Buniverse iframe
		video.videoAPI = {
			'bu_prepress_on_readyCallback' : null,
			'bu_prepress_on_firstplayCallback' : null,
			'bu_prepress_on_playCallback' : null,
			'bu_prepress_on_pauseCallback' : null,
			'bu_prepress_on_CompleteCallback': null
		}


		// Add Prepress Callback functions. This layer
		// of callbacks are fired AFTER the core
		// Buniverse callbacks in setupbuniverseEvents().
		video.addPrepressOnReadyCallback = function(cb) {
			if (typeof cb === 'function') {
				video.videoAPI.bu_prepress_on_readyCallback = cb;
			}
		}

		video.removePrepressOnReadyCallback = function() {
			video.videoAPI.bu_prepress_on_readyCallback = null;
		}

		video.addPrepressOnFirstPlayCallback = function(cb) {
			if (typeof cb === 'function') {
				video.videoAPI.bu_prepress_on_firstplayCallback = cb;
			}
		}

		video.removePrepressOnFirstPlayCallback = function() {
			video.videoAPI.bu_prepress_on_firstplayCallback = null;
		}

		video.addPrepressOnPlayCallback = function(cb) {
			if (typeof cb === 'function') {
				video.videoAPI.bu_prepress_on_playCallback = cb;
			}
		}

		video.removePrepressOnPlayCallback = function() {
			video.videoAPI.bu_prepress_on_playCallback = null;
		}

		video.addPrepressOnPauseCallback = function(cb) {
			if (typeof cb === 'function') {
				video.videoAPI.bu_prepress_on_pauseCallback = cb;
			}
		}

		video.removePrepressOnPauseCallback = function() {
			video.videoAPI.bu_prepress_on_pauseCallback = null;
		}

		video.addPrepressOnCompleteCallback = function(cb) {
			if (typeof cb === 'function') {
				video.videoAPI.bu_prepress_on_CompleteCallback = cb;
			}
		}

		video.removePrepressOnCompleteCallback = function() {
			video.videoAPI.bu_prepress_on_CompleteCallback = null;
		}




		/*
		* Setup Direct Methods on Video Object.
		*/
		video.play = function() {
			video.buniverse.play();
		}

		video.pause = function() {
			video.buniverse.pause();
		}

		video.stop = function() {
			video.buniverse.stop();
		}

		video.seekVideo = function( seconds ) {
			video.buniverse.seek( seconds );
		}

		video.getPositionVideo = function() {
			return video.buniverse.getPosition();
		}

		video.getDurationVideo = function() {
			return video.buniverse.getDuration();
		}

		video.isMuted = function() {
			return video.buniverse.isMuted();
		}

		video.mute = function() {
			video.buniverse.mute();
		}

		video.unMute = function() {
			video.buniverse.unMute();
		}

		video.getVolume = function() {
			return video.buniverse.getVolume();
		}

		video.setVolume = function( volume ) {
			video.buniverse.setVolume( volume );
		}

		video.captionsOn = function() {
			video.buniverse.captionsOn();
		}

		video.captionsOff = function() {
			video.buniverse.captionsOff();
		}

		video.getPlayerState = function() {
			return video.buniverse.getPlayerState();
		}

		video.getVideoUrl = function() {
			return video.buniverse.getVideoUrl();
		}

	};



	/*
	* Video Control Functions
	*
	* Wrap the calls to buniverse inside the iframe
	* in our own functions to make the calls cleaner
	* and just better organized here.
	*/
	var playVideo = function( video ) {
		video.buniverse.play();
	};

	var pauseVideo = function( video ) {
		video.buniverse.pause();
	};

	var stopVideo = function( video ) {
		video.buniverse.stop();
	};

	var seekVideo = function( video, seconds ) {
		video.buniverse.seek( seconds );
	};

	var getPositionVideo = function( video ) {
		return video.buniverse.getPosition();
	};

	var getDurationVideo = function( video ) {
		return video.buniverse.getDuration();
	};

	var isMuted = function( video ) {
		return video.buniverse.isMuted();
	};

	var mute = function( video ) {
		video.buniverse.mute();
	};

	var unMute = function( video ) {
		video.buniverse.unMute();
	};

	var getVolume = function( video ) {
		return video.buniverse.getVolume();
	};

	var setVolume = function( video, volume ) {
		video.buniverse.setVolume( volume );
	};

	var captionsOn = function( video ) {
		video.buniverse.captionsOn();
	};

	var captionsOff = function( video ) {
		video.buniverse.captionsOff();
	};

	var getPlayerState = function( video ) {
		return video.buniverse.getPlayerState();
	};

	var getVideoUrl = function( video ) {
		return video.buniverse.getVideoUrl();
	};


	/*
	* Get Youtube Video ID
	*
	* Gets the video URL for Youtube.com and splits
	* off the video id to be returned.
	*/
	var getYoutubeID = function( video ) {
		var url = getVideoUrl( video );
		if( url ) {
			url = url.split( '?v=' );
			return url[1];
		}
	};

	/*
	* Convert Seconds to Minutes
	*
	* helpful for displaying timestamps in a
	* pretty format.
	*/
	var secondsToMinutes = function( time ) {
		var minutes = Math.floor( time / 60 );
		var seconds = Math.floor( time - minutes * 60 );


		if( minutes < 10 ) {
			minutes = '0'+minutes;
		}
		return minutes + ":" + seconds;
	};


	/*
	* Initialize Buniverse Functions
	*
	* Start on page load by finding any elements
	* and setting up Event Handlers if any are found.
	*/
	var buniverseInit = function() {
		//find the elements
		findElements();

		//setup players
		setupFoundPlayers();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {

		buniverseInit();

	});


	/*
	* Return Public Functions
	*
	* all of the functions above are private and encapsulated in this
	* function/object.
	*
	* In the return we can expose those functions that we want to make
	* public and accessible to other JS on the Window.
	*
	* They can be accessed by calling `bu_prepress.buniverse`
	*
	*/
	return {
		getbuniverseVideos: function() {
			return buniverseVideos;
		},
		addIframe: function( iframe ) {
			if( iframe ) {
				return addIframe( iframe );
			}
		},
		setupPlayer: function( video ) {
			if( video ) {
				setupPlayer( video );
			}
		},
		play: function( video ) {
			if( video ) {
				playVideo( video );
			}
		},
		pause: function( video ) {
			if( video ) {
				pauseVideo( video );
			}
		},
		stop: function( video ) {
			if( video ) {
				stopVideo( video );
			}
		},
		seek: function( video, seconds ) {
			if( video && seconds ) {
				seekVideo( video, seconds );
			}
		},
		getPosition: function( video ) {
			if( video ) {
				return getPositionVideo( video );
			}
		},
		getDuration: function( video ) {
			if( video ) {
				return getDurationVideo( video );
			}
		},
		isMuted: function( video ) {
			if( video ) {
				return isMuted( video );
			}
		},
		mute: function( video ) {
			if( video ) {
				mute( video );
			}
		},
		unMute: function( video ) {
			if( video ) {
				unMute( video );
			}
		},
		getVolume: function( video ) {
			if( video ) {
				return getVolume( video );
			}
		},
		setVolume: function( video, volume ) {
			if( video ) {
				return setVolume( video, volume );
			}
		},
		captionsOn: function( video ) {
			if( video ) {
				captionsOn( video );
			}
		},
		captionsOff: function( video ) {
			if( video ) {
				captionsOff( video );
			}
		},
		getPlayerState: function( video ) {
			if( video ) {
				return getPlayerState( video );
			}
		},
		getVideoUrl: function( video ) {
			if( video ) {
				return getVideoUrl( video );
			}
		},
		getYoutubeID: function( video ) {
			if( video ) {
				return getYoutubeID( video );
			}
		},
		secondsToMinutes: function( time ) {
			if( time ) {
				return secondsToMinutes( time );
			}
		}
	};
})();
;
bu_prepress.audio_block = ( function() {
	var audioBlocks = []; //stores all of our found blocks
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag

	/*
	* Find all audio player blocks
	* and store in an array.
	*
	* For each found get all of the DOM
	* elements we'll need for click events
	* or progress bar controls.
	*
	*/
	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-block-editorial-audioplayer' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var block = {};

				//get first returned social photo block element
				block.element = elements[i];

				block.audioLength = block.element.querySelector( '.wp-block-editorial-audioplayer-length' );

				block.playbtn = block.element.querySelector( '.wp-prepress-button-play' );
				block.transcriptbtn = block.element.querySelector( '.wp-block-editorial-audioplayer-button-transcript' );
				block.btnIcon = block.element.querySelector( '.icon-play' );

				block.progressbar = block.element.querySelector( '.wp-prepress-component-player-progressbar' );
				block.progressbarValue = block.element.querySelector( '.wp-prepress-component-player-progressbar-progress' );
				block.progressbarKnob = block.element.querySelector( '.wp-prepress-component-player-progressbar-knob' );

				//for each one found store as object in the array
				audioBlocks.push( block );
			}
		}
	};


	/*
	* For Each Audio Player Setup:
	*
	* Play/Pause button events
	* Transcript Toggle btn
	*
	* Then call setupHandlers() to setup
	* remaining event handlers for progress bar, etc
	*
	*/
	var setupBlocks = function() {
		if ( audioBlocks.length > 0 ) {


			// Foreach Block let's setup event handlers for the controls.
			audioBlocks.forEach( function( block, index ) {


				// setup play button.
				block.playbtn.addEventListener( 'click', function() {
					if ( block.element.bu_prepress.audio.playing === true ) {
						// Audio is playing.
						block.element.bu_prepress.audio.playing = false;
						block.element.bu_prepress.audio.pause();

						// Swap play/pause icons.
						block.btnIcon.classList.remove('icon-pause');
						block.btnIcon.classList.add('icon-play');
					} else {
						// Audio not playing.
						block.element.bu_prepress.audio.playing = true;
						block.element.bu_prepress.audio.play();

						// Swap play/pause icons.
						block.btnIcon.classList.remove('icon-play');
						block.btnIcon.classList.add('icon-pause');
					}

				});

				if ( block.transcriptbtn ) {

					block.transcriptbtn.addEventListener( 'click', function(e) {
						e.preventDefault();
						block.element.classList.toggle( 'show-transcript' );
					});

				}


				// Setup this player.
				setupHandlers( block );


			});

		}
	};

	/*
	* Setup remaining Handlers
	* for Progress Bar and Audio Complete Callbacks
	*
	* These use callbacks set in the global Audio API
	*/
	var setupHandlers = function( block ) {

		block.progressbar.addEventListener( 'click', function(e) {
			block.element.bu_prepress.audio.currentTime = block.element.bu_prepress.audio.duration * clickPercent(e, block.progressbar);
		});


		// On Complete, switch up play/pause state.
		block.element.bu_prepress.addPrepressOnCompleteCallback( function(e) {
			block.element.bu_prepress.audio.playing = false;

			// Swap play/pause icons.
			block.btnIcon.classList.remove('icon-pause');
			block.btnIcon.classList.add('icon-play');
		});


		// Update progress bar on every Time Update Event called.
		block.element.bu_prepress.addPrepressOnTimeUpdateCallback( function( time ) {
			timeUpdate( block.progressbarValue, time, block.element.bu_prepress.audio.duration );
		});


		block.progressbar.addEventListener( 'mousedown', function(e) {
			function dragknob(e) {
				throttle( function(e) {
					block.element.bu_prepress.audio.currentTime = block.element.bu_prepress.audio.duration * clickPercent(e, block.progressbar);
				}, 200)
			}
			document.addEventListener( 'mousemove', dragknob );
			document.removeEventListener( 'mouseup', dragknob );

		});
	};



	var throttle = function(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
			deferTimer;
		return function () {
			var context = scope || this;

			var now = +new Date,
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
	}


	// Return an "X Minutes X Seconds" formatted duration string.
	// Not using this currently, may in the future for dynamic audio
	// players that change the source audio.
	var formatDuration = function( duration ) {
		var html = "Audio - ";

		var min = Math.floor( duration / 60 );
		var sec = Math.floor( duration - min * 60 );


		if ( min ) {
			min = min + " Minutes";
			html = html + min;
		}
		if ( sec && sec !== 0 ) {
			if ( min ) {
				sec = " " + sec + " Seconds";
			} else {
				sec = sec + " Seconds";
			}

			html = html + sec;
		}

		return html;
	};

	// Calculate the width of the progress bar fill based on current time & duration.
	var timeUpdate = function( progressBarValue, time, duration ) {
		var playPercent = 100 * ( time / duration );
		progressBarValue.style.width = playPercent + "%";
	}

	// Calculate the % of the width of the progress bar clicked on.
	var clickPercent = function( e, progressBar ) {
		return ( e.pageX - progressBar.getBoundingClientRect().left + document.body.scrollLeft ) / progressBar.clientWidth;
	}


	var audioInit = function() {
		//find the elements
		findElements();

		//setup blocks
		setupBlocks();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		audioInit();

	});

	return {
		getBlocks: function() {
			return audioBlocks;
		},
	};
})();;
bu_prepress.gallerytease = (function() {
	var galleryTeaseBlocks = [];
	var $body = document.getElementsByTagName('body')[0];

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-block-edition-gallery-tease' );

		//if found
		if (elements.length > 0) {
			//for each found block do stuff
			for( i = 0; i < elements.length; i++ ) {

				var block = {};

				//Store the block's DOM element.
				block.element = elements[i];

				//get back btn
				block.backBtn = elements[i].querySelector( '.js-block-edition-gallery-tease-back-btn' );
				//get forward btn
				block.forwardBtn = elements[i].querySelector( '.js-block-edition-gallery-tease-forward-btn' );

				//get media track
				block.mediatrack = elements[i].querySelector( '.js-block-edition-gallery-tease-media-track' );

				//get media items
				block.mediatrackitems = elements[i].querySelectorAll( '.js-block-edition-gallery-tease-media-track-item') ;

				//for each one found store as object in the array
				galleryTeaseBlocks.push(block);
			}

			// set active states on all items to false
			for ( i = 0; i < block.mediatrackitems.length; i++) {
				block.mediatrackitems[i].active = false;
			}
			// set first to active true
			block.mediatrackitems[0].active = true;

			for (var i = block.mediatrackitems.length - 1; i >= 0; i--) {
				// set active classes
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[0].classList.toggle("active");
				}
			}

			// Remove the is-loading which controls the styles of img containers.
			block.element.classList.remove( 'is-loading' );

		}
	};

	/*
	* Basic click handlers for next/prev buttons
	*
	* Calls the appropriate function to find and show the
	* next/prev img in the stack.
	*/
	var setupHandlers = function() {
		if (galleryTeaseBlocks.length > 0) {
			for ( i = 0; i < galleryTeaseBlocks.length; i++ ) {
				var block = galleryTeaseBlocks[i];

				block.backBtn.addEventListener("click", function(e){
					e.preventDefault();
					prevItem( block );
				});
				block.forwardBtn.addEventListener("click", function(e){
					e.preventDefault();
					nextItem( block );
				});
			}
		}
	};



	/*
	* Setup Media Track
	*
	* Sets up the images and their container elements
	* After the first image loads an intrinsic ratio is calculated and
	* added to the container and a class of `is-ready` is added. This class
	* changes the styles to absolutely position the images so they can
	* be faded in/out as they are switched via basic CSS animations.
	 */
	var setupMediaTrack = function() {
		for ( i = 0; i < galleryTeaseBlocks.length; i++ ) {
			var block = galleryTeaseBlocks[i];
			if ( block.mediatrack && block.mediatrackitems ) {
				//set currentItem variable
				block.currentItem = 0;

				//store number of items
				block.itemslength = block.mediatrackitems.length;

				// get the first image in the block.
				var img = block.mediatrackitems[0].querySelector('img');

				function loaded() {
					//setup intrinsic ratio.
					block.mediatrack.style = "padding-top: " + getIntrinsicRatio( block ) + '%';

					//set is-ready to alter styles.
					block.element.classList.add( 'is-ready' );

					// Setup click handlers when the first image is loaded.
					setupHandlers();
				}

				if ( img.complete ) {
					loaded()
				} else {
					img.addEventListener('load', loaded)
					// img.addEventListener('error', function() {
					//	console.log('error');
					// })
				}
			}
		}

	};



	/*
	* Next Item
	*
	* Find and displays the next item, stores the current photo
	* as the "previous item" and sets classes so that the fade effect
	* in CSS will work.
	*/
	var nextItem = function( block ) {
		if( block.currentItem === block.itemslength - 1 ) {
			//can't go next anymore

			block.element.classList.add( 'has-endstate-open' );

		} else {
			if(	block.prevItem ) {
				block.prevItem.classList.remove('previous-img');
			}
			block.currentItem = block.currentItem + 1;

			//move over active states
			for (var i = block.mediatrackitems.length - 1; i >= 0; i--) {
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[i].active = false;
					block.mediatrackitems[i].classList.add( 'previous-img' );
					block.prevItem = block.mediatrackitems[i];
					block.mediatrackitems[i].classList.toggle("active");


					block.mediatrackitems[i + 1].active = true;
					block.mediatrackitems[i + 1].classList.toggle("active");
				}
			}
		}
	};


	/*
	* Prev Item
	*
	* Find and displays the prev item, stores the current photo
	* as the "previous item" and sets classes so that the fade effect
	* in CSS will work.
	*/
	var prevItem = function( block ) {
		if( block.currentItem === 0 ) {
			//do nothing can't go back more
		} else if (block.element.classList.contains( 'has-endstate-open' ) ) {
			block.element.classList.remove( 'has-endstate-open' );
		} else {
			if(	block.prevItem ) {
				block.prevItem.classList.remove('previous-img');
			}

			block.currentItem = block.currentItem - 1;
			//move over active states
			for (var i = 0; i < block.mediatrackitems.length; i++) {
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[i].classList.add( 'previous-img' );
					block.prevItem = block.mediatrackitems[i];
					block.mediatrackitems[i].active = false;
					block.mediatrackitems[i].classList.toggle("active");


					block.mediatrackitems[i - 1].active = true;
					block.mediatrackitems[i - 1].classList.toggle("active");
				}
			}
		}
	};

	// Do some match to calculate an intrinsic ratio.
	var getIntrinsicRatio = function( block ) {
		var width = block.mediatrackitems[0].querySelector( 'img' ).naturalWidth;
		var height = block.mediatrackitems[0].querySelector( 'img' ).naturalHeight;
		var intrinsicRatio = ( ( height / width ) * 100 );

		return intrinsicRatio;
	};


	var galleryInit = function() {
		//find the elements
		findElements();

		setupMediaTrack();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {
  		galleryInit();

	});

	return {
		getgalleryTeaseBlocks: function() {
			return galleryTeaseBlocks;
		}
	};
})();;
bu_prepress.social_photo = ( function() {
	var photoBlocks = []; //stores all of our found blocks
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag


	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-block-edition-social-photo' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var block = {};

				//get first returned social photo block element
				block.element = elements[i];

				block.photos = block.element.querySelectorAll( 'li' );

				block.count = block.photos.length;

				block.lastIndex = block.count - 1;

				block.currentIndex = 0;

				//get next button.
				block.next = block.element.querySelector( '.js-block-edition-social-photo-gallery-nav-next' );
				//get prev button.
				block.prev = block.element.querySelector( '.js-block-edition-social-photo-gallery-nav-prev' );

				//for each one found store as object in the array
				photoBlocks.push( block );
			}
		}
	};

	var setupHandlers = function() {
		if ( photoBlocks.length > 0 ) {

			for ( var i = 0; i < photoBlocks.length; i++ ) {
				//store for loop instance as variable so event handlers
				//can reference element when event fires
				var thisphotoBlock = photoBlocks[i];

				// Initial setup.
				photoBlockReady( thisphotoBlock );

				thisphotoBlock.next.addEventListener( "click", function(e) {
					e.preventDefault();
					nextPhoto( thisphotoBlock );
				});

				thisphotoBlock.prev.addEventListener( "click", function(e) {
					e.preventDefault();
					prevPhoto( thisphotoBlock );
				});
			}
		}
	};

	var photoBlockReady = function( photoBlock ) {
		photoBlock.element.classList.add('is-ready');
		photoBlock.photos[0].classList.add('active');
	};

	var setCurrent = function( photoBlock, newPos ) {
		var cur = photoBlock.currentIndex;
		// Remove current active
		photoBlock.photos[cur].classList.remove('active');

		photoBlock.currentIndex = newPos;

		// Add Active to next photo
		photoBlock.photos[newPos].classList.add('active');
	};

	var nextPhoto = function( photoBlock ) {
		var cur = photoBlock.currentIndex;
		if ( cur < photoBlock.lastIndex ) {
			var next = cur + 1;
			setCurrent( photoBlock, next );
		} else if ( cur === photoBlock.lastIndex ) {
			var next = 0;//Back to start.
			setCurrent( photoBlock, next );
		}
	};

	var prevPhoto = function( photoBlock ) {
		var cur = photoBlock.currentIndex;
		if ( cur > 0 ) {
			var prev = cur - 1;
			setCurrent( photoBlock, prev );
		} else if ( cur === 0 ) {
			var prev = photoBlock.lastIndex; //Back to last/end.
			setCurrent( photoBlock, prev );
		}
	};

	var photoInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		photoInit();

	});

	return {
		getBlocks: function() {
			return photoBlocks;
		},
	};
})();;
bu_prepress.event_details = ( function() {

	/*
	* Find any event details blocks.
	*/
	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.wp-block-editorial-event-details' );

		//if found
		if ( elements.length > 0 ) {

			elements.forEach( function( block, index) {
				setupBlock( block );
			});

		}
	};


	var setupBlock = function( block ) {
		var title, start, duration, end, address, description = '';

		title       = block.querySelector( '.wp-block-editorial-event-details-event-title' );
		start       = block.querySelector( ".wp-block-editorial-event-details-date[itemprop='startDate']");
		duration    = 60;
		end         = block.querySelector( ".wp-block-editorial-event-details-date[itemprop='endDate']");
		address     = block.querySelector( '.wp-block-editorial-event-details-location span' );
		description = block.querySelector( '.wp-block-editorial-event-details-description' );

		if( title ) {
			title = title.innerText;
		}

		if( start ) {
			start = dateFromISO8601( start.getAttribute( 'content' ) );
		}

		if( end ) {
			end = dateFromISO8601( end.getAttribute( 'content' ) );
		}
		if( address ) {
			address = address.innerText;
		}
		if( description ) {
			description = description.innerText;
		}

		if( title && start ) {
			setupButton( block, title, start, duration, end, address, description );
		}

	};


	var setupButton = function( block, eventTitle, eventStart, eventDuration, eventEnd, eventAddress, eventDescription ) {
		var button = block.querySelector( '.wp-block-editorial-event-details-calendar-link' );
		var calendar_button = createCalendar({
			options: {
				//class: button_classes,
				//
				// You can pass an ID. If you don't, one will be generated for you
				//id: 'my-id'
		  	},
			data: {
				// Event title
				title: eventTitle,

				// Event start date
				start: eventStart,

				// Event duration (IN MINUTES)
				duration: eventDuration,

				// You can also choose to set an end time
				// If an end time is set, this will take precedence over duration
				end: eventEnd,

				// Event Address
				address: eventAddress,

				// Event Description
				description: eventDescription
			}
		});

		// Add new calendar button.
		button.appendChild( calendar_button );

		block.classList.add( 'has-calendar-button' );
	};

	/*
	* Converts dates from the ISO 8601 format used in the Schema data attributes
	*/
	var dateFromISO8601 = function( isostr ) {
	    var parts = isostr.match( /\d+/g );
		return new Date( parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] );
	}



	var Init = function() {
		//find the elements
		findElements();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
		Init();

	});

})();;
bu_prepress.parallax = ( function() {


	var setupParallax = function() {
		if ( typeof Rellax != "undefined" ) {
			var rellax = new Rellax('.js-block-editorial-parallax-active', {
				speed: -2,
				center: false,
				wrapper: null,
				round: true,
				vertical: true,
				horizontal: false
			});
		}
	};


	var Init = function() {
		// Setup Parallax Library.
		setupParallax();

	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
		Init();

	});

})();;
bu_prepress.sequential_cards = ( function() {

	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag

	/*
	* Find any sequential card blocks.
	*/
	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-block-editorial-sequential-cards' );

		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			$body.classList.add( 'has-wp-block-sequential-cards' );


			elements.forEach( function( block, index) {
				setupBlock( block );
			});

		}
	};


	var setupBlock = function( block ) {


		block.sequential_cards = {};
		block.sequential_cards.cards = block.querySelectorAll( '.wp-block-sequential-cards-card' );
		block.sequential_cards.cardCount = block.sequential_cards.cards.length;
		block.sequential_cards.backBtn = block.querySelector( '.js-block-sequential-cards-back' );
		block.sequential_cards.forwardBtn = block.querySelector( '.js-block-sequential-cards-forward' );

		// Add an active class to the first card.
		block.sequential_cards.cards[0].classList.add('active');
		setActiveCard( block,  block.sequential_cards.cards, block.sequential_cards.cardCount );

		// Check for any stats and add a donut chart.
		addDonutChart( block );


		block.sequential_cards.forwardBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			var active = block.querySelector( '.wp-block-sequential-cards-card.active' );
			var next = block.querySelector( '.wp-block-sequential-cards-card.active' ).nextElementSibling;

			if ( next !== null ) {
				active.classList.remove( 'active' );
				next.classList.add( 'active' );
				setActiveCard( block,  block.sequential_cards.cards, block.sequential_cards.cardCount );
			}

		});

		block.sequential_cards.backBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			var active = block.querySelector( '.wp-block-sequential-cards-card.active' );
			var prev = block.querySelector( '.wp-block-sequential-cards-card.active' ).previousElementSibling;

			if ( prev !== null && prev.matches( '.wp-block-sequential-cards-card' ) ) {
				active.classList.remove( 'active' );
				prev.classList.add( 'active' );
				setActiveCard( block.sequential_cards.cards, block.sequential_cards.cardCount );
			}
		});
	};

	/*
	* Sets a data attribute on the block wrapper div
	* with the current active card index (zero count).
	*
	 */
	var setActiveCard = function( block, cards, count ) {
		cards = Array.prototype.slice.call( cards );

		var activeIndex = cards.findIndex( function( element ) {
			return element.classList.contains( 'active' );
		});

		block.setAttribute('data-sequential-cards-active', activeIndex );
	}

	/*
	* Add Donut Chart to any block
	* that has a Percent Based Stat Value
	*/
	var addDonutChart = function( block ) {

		// Check each card for a statistic.
		block.sequential_cards.cards.forEach( function(card, index) {
			var stat = card.querySelector( '.wp-block-sequential-cards-stat' );

			if ( stat ) {

				// Get the value
				var $value = stat.querySelector( '.wp-block-sequential-cards-stat-value' );
				var value = $value.getAttribute( 'data-stat' );

				// If it is a percent based stat let's
				// create a donut chart.
				if ( value.endsWith('%') ) {

					// Add Donut Chart
					value = value.split('%')[0];

					// Get Donut Chart
					var el = document.createElement('div');
					el.classList.add( 'wp-block-sequential-cards-stat-chart' );
					el.innerHTML =  donuteTemplate( value );

					// Insert state at begining of dom tree.
					stat.insertBefore( el, $value );

					// Move "Value" element inside stat chart div.
					el.appendChild( $value );
				}
			}
		});
	};






	/*
	* Generate the template for the
	* donut chart SVG.
	*/
	var donuteTemplate = function( percent ) {
		var r = 70;
		var circumference = ( 2 * Math.PI ) * r;
		var offset = percentageToDashOffset( percent, circumference );

		var html = [
			'<svg class="wp-block-sequential-cards-stat-donut" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">',
				'<g>',
					'<title>Donut chart</title>',
					'<circle id="wp-block-sequential-cards-stat-donut-circle1" class="wp-block-sequential-cards-stat-donut-bg" r="' + r + '" cy="81" cx="81" fill="none"/>',
					'<circle id="wp-block-sequential-cards-stat-donut-circle2" class="wp-block-sequential-cards-stat-donut-bar" r="' + r + '" cy="81" cx="81" fill="none" stroke-dashoffset="' + offset + '" transform="rotate(-90 81 81)" />',
				'</g>',
			'</svg>',
		].join("\n");

		return html;
	};

	/*
	* Calculate the Stroke Offset of the SVG
	* based on the percentage the stat is set to.
	*/
	var percentageToDashOffset = function( percent, circumference ) {
	  return ( circumference / 100) * (100 - percent );
	}

	var Init = function() {
		//find the elements
		findElements();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		Init();

	});

	return {

	};
})();;
bu_prepress.video_story = (function() {

	/*
	* Create a Story Object to store selectors,
	* state, transcripts and other data attached
	* to this Video Story Gutenberg Block
	*/
	var story = {
		video: '',
		status: 'teaser',
		teaser: {},
		controls: {},
		transcript: {
			captions: [],
		},
	};


	/*
	* Runs early to find and store all needed DOM selectors on the page
	* If videos are found, it then sets up a couple of the early listeners/callbacks
	* such as VideoReady that fires when the youtube iframe tells the BUnivese iframe
	* that it is loaded and ready for interaction.
	*/
	var findElements = function() {
		// Video Story block
		story.element = document.querySelector( '.js-wp-block-video-story' );

		// We found a Video Story Block
		if( story.element ) {

			story.videoplayer_element = document.querySelector( '.js-block-video-story-videoplayer' );
			story.header = story.element.querySelector( '.wp-block-video-story-header' );

			// Find the Teaser Play Btn.
			story.teaser.playBtn = document.querySelector( '.js-wp-block-video-story-play' );
			story.teaser.playBtnSmallScreen = document.querySelector( '.js-wp-block-video-story-play-smallScreen' );

			// Find the video player controls.
			story.controls.play = document.querySelector('button.wp-block-video-story-videoplayer-playBtn');
			story.controls.pause = document.querySelector('button.wp-block-video-story-videoplayer-pauseBtn');
			story.controls.share = document.querySelector('button.wp-block-video-story-videoplayer-shareBtn');
			story.controls.volume = document.querySelector('button.wp-block-video-story-videoplayer-volumeBtn');
			story.controls.volumerange = document.querySelector('button.wp-block-video-story-videoplayer-volumeBtn input');
			story.controls.captions = document.querySelector('button.wp-block-video-story-videoplayer-captionsBtn');
			story.controls.fullscreen = document.querySelector('button.wp-block-video-story-videoplayer-fullscreenBtn');
			story.controls.rewind = document.querySelector('button.wp-block-video-story-videoplayer-rewindBtn');
			story.controls.forward = document.querySelector('button.wp-block-video-story-videoplayer-forwardBtn');

			// Progress Bar.
			story.controls.progress = document.querySelector('.wp-block-video-story-videoplayer-progress');

			// Progress bar fallback for old browsers.
			story.controls.progressbar = document.querySelector('.wp-block-video-story-videoplayer-progress-bar span');


			// Transcript elements.
			story.tabs = document.querySelector( '.js-block-video-story-tab-container' );
			story.transcript.summaryBtn = document.querySelector( 'button.js-wp-block-video-story-summaryBtn');
			story.transcript.transcriptBtn = document.querySelector( 'button.js-wp-block-video-story-transcriptBtn');
			story.transcript.summaryTab = document.querySelector( '.js-wp-block-video-story-tab-summary' );
			story.transcript.transcriptTab = document.querySelector( '.js-wp-block-video-story-tab-transcript' );

			// End State Content.
			story.endstate = story.element.querySelector( '.js-block-video-story-endstate' );
			story.endstateReplayBtn = story.endstate.querySelector( 'button.wp-block-video-story-videoplayer-replayBtn' );


			// Find all the videos on this page.
			var videoList = bu_prepress.buniverse.getbuniverseVideos();


			// If we found any buniverse videos.
			if (videoList.length > 0) {
				// For each video lets find the Video Story Block specific class
				// to make sure that we always have the proper video.
				for ( var i = 0; i < videoList.length; i++ ) {
					// Only match videos that are in the Video Story Gutenberg Block
					// in case other videos are on the page.
					if( videoList[i].iframe.classList.contains( 'wp-block-video-story-videoplayer-thevideo' ) ) {
						story.video = videoList[i];
					}

				}


			}

			/*
			* Add Click Event for Small Screen's Play Btn that overlays the video element.
			* This just prevents the <a> from navigating to bu.edu/buniverse if JS is present.
			*
			* ToDo: Find a better way to handle this later.
			*/
			story.teaser.playBtnSmallScreen.addEventListener( "click", function(e) {
				e.preventDefault();
				//do nothing as video is not ready, but prevent url from going to Buniverse
			});

			/*
			* Add Click Event for Larger Screen's Play Btn that sits in with the Video Title.
			* This just prevents the <a> from navigating to bu.edu/buniverse if JS is present.
			*
			* ToDo: Find a better way to handle this later.
			*/
			story.teaser.playBtn.addEventListener( "click", function(e) {
				e.preventDefault();
				//do nothing as video is not ready, but prevent url from going to Buniverse
			});

			/*
			* This Callback fires when the Youtube Video tells the BUniverse iframe that it is
			* loaded and ready to interact via JS. Without this, there is no way to know when
			* in the time/load process that the video tag, and iframes are all loaded and available.
			*/
			story.video.addPrepressOnReadyCallback( function() {

				// Video is ready, add a class to the block
				story.element.classList.add( 'has-video-ready' );

				story.status = 'ready';

				// Let's wait until the video is ready to setup handlers
				setupVideoHandlers();

				story.videoduration = bu_prepress.buniverse.getDuration( story.video );

				setupTranscript();
			});

		} else {
			// Exit and do nothing else on this page
		}
	};





	/*
	* Function to switch the visible Tabs of
	* content (summary/transcript) below the video
	*/
	var showTab = function ( tab ) {
		document.querySelector( '.js-block-video-story-tab-container .show-tab' ).classList.remove( 'show-tab' );
		tab.classList.add( 'show-tab' );
	};




	/*
	* Adds Event Listeners to the Summary & Transcript
	* buttons to control show/hiding the tabs. Then
	* fires off call to getTranscript() to start fetching
	* the Transcript feed from Youtube's api.
	*/
	var setupTranscript = function() {

		story.transcript.summaryBtn.addEventListener( "click", function(e) {
			e.preventDefault();
			story.transcript.summaryBtn.classList.add( 'active' );
			story.transcript.transcriptBtn.classList.remove( 'active' );
			showTab( story.transcript.summaryTab );
		});

		story.transcript.transcriptBtn.addEventListener( "click", function(e) {
			e.preventDefault();
			story.transcript.transcriptBtn.classList.add( 'active' );
			story.transcript.summaryBtn.classList.remove( 'active' );
			showTab( story.transcript.transcriptTab );
		});




		getTranscriptList( bu_prepress.buniverse.getYoutubeID( story.video ), foundTranscriptList )

	};


	/*
	* foundTranscripList callback function is called after the xhr request
	* in getTranscriptList() is fired successfully.
	*
	* This function then checks for the existence of a track "name" on
	* the first returned Track in the list. This may have to be expanded in the future to support
	* multiple tracks better, but for now this seems to solve the problem of not finding the "transcript"
	* that is "named" on youtube. These "named" transcripts are created manually and uploaded to Youtube.
	* Without the name the youtube timedtext api can have trouble returning them. Though sometimes it worked.
	* It seems to have to do with cases where the transcript is given a "custom" name when added to the video
	* on the youtube site.
	 */
	var foundTranscriptList = function( transcriptListResponse ) {

		var transcriptname = null;

		if ( transcriptListResponse ) {
			var firstTranscript = transcriptListResponse.querySelector( 'track' );
			transcriptname      = firstTranscript.getAttribute( 'name' );
		}

		/*
		* Start an AJAX call to fetch the transcript in XML
		* from Youtube and then parse into HTML.
		*
		* We pass the youtube video id that we get from calling
		* this function:
		* bu_prepress.buniverse.getYoutubeID( [videoreference] )
		*
		* A callback function: transcriptReady() is passed if successful
		* to continue processing the transcript data.
		*/
		getTranscript( bu_prepress.buniverse.getYoutubeID( story.video ), transcriptname, transcriptReady );
	}



	/*
	* TranscriptReady() function works to add Event Handlers
	* to each Caption Element added to the page. The Click event
	* will let the user seek() the video player to that timestamp.
	*
	* transcriptResponse: a XMLHttpRequest response from Youtube.
	*/
	var transcriptReady = function( transcriptResponse ) {

		// Bail if empty.
		if ( ! transcriptResponse ) {
			return;
		}

		// Parse and append Transcript to the Dom.
		var transcriptItems = processTranscript( transcriptResponse );

		// If has transcript items.
		if (transcriptItems.length > 0) {

			// For each transcript text
			for ( var i = 0; i < transcriptItems.length; i++ ) {

				transcriptItems[i].element.addEventListener( "click", function(e) {
					e.preventDefault();

					// A user may click on a caption text element before
					// the video is playing and teaser img is hidden.
					if( story.status != 'playing' ) {
						openVideo();
					}
					// Seek the video to the start time of the transcript stored on this item.
					bu_prepress.buniverse.seek( story.video, this.transcriptStart );
				});
			}

			// Show the transcript header and tab buttons.
			story.element.classList.add( 'has-transcript' );
		}
	};


	/*
	* Function that via classes, hides any of the teaser/cover image
	* content that is displayed over the video iframe and then
	* calls .play() on the video iframe.
	*/
	var openVideo = function(){
		story.status = 'playing';
		story.element.classList.add( 'has-video-open' );
		bu_prepress.buniverse.play( story.video );
	};

	/*
	* Called after the video iframe is "Ready" and sets up
	* the additional handlers for our custom controls and other
	* functions
	 */
	var setupVideoHandlers = function() {

		// The Play button on the teaser when clicked will hide the
		// teaser and play the video.
		story.teaser.playBtn.addEventListener( "click", function(e) {
			e.preventDefault();
			openVideo();
		});

		// The Play button (shown on small screens) on the video when clicked will hide the
		// teaser and play the video.
		story.teaser.playBtnSmallScreen.addEventListener( "click", function(e) {
			e.preventDefault();
			openVideo();
		});

		/*
		* Play Video Events
		*
		* When the custom play control button, or replay button in the EndState
		* is called we want to call the .play( myvideo ) function.
		*/
		var playVideoHandler = function(e) {
			e.preventDefault();
			bu_prepress.buniverse.play( story.video );
		}
		story.endstateReplayBtn.addEventListener( "click", playVideoHandler );
		story.controls.play.addEventListener( "click", playVideoHandler );


		/*
		* On First Play Callback
		*
		* Fires only the first time the video is played.
		* We'll use this to setup sticky video handling and to switch to
		* the transcript tab on the inital play
		*/
		story.video.addPrepressOnFirstPlayCallback( function() {
			// If Youtube closed captions are on by default, let's turn them off.
			bu_prepress.buniverse.captionsOff( story.video );

			// Setup Sticky Video handling.
			stickyVideo();

			// If transcript is present, switch tab from summary to transcript on play.
			if ( story.transcript.captions.length > 0 ) {
				story.transcript.transcriptBtn.classList.add( 'active' );
				story.transcript.summaryBtn.classList.remove( 'active' );
				showTab( story.transcript.transcriptTab );
			}
		});

		/*
		* On Play Callback
		*
		* Called anytime the video starts playing. We use this callback
		* to call functions that need to happen constantly such as
		* updateOnPlay() which controls the progress bar.
		*/
		story.video.addPrepressOnPlayCallback( function() {
			story.controls.play.classList.remove( 'active' );
			story.controls.pause.classList.add( 'active' );

			// Update Progress Bar & Transcript Position.
			updateOnPlay();

			// Make sure endstate is hidden.
			toggleEndState();
		});

		/*
		* Pause Button Event Handler
		*
		* Pause the video when clicked
		*/
		story.controls.pause.addEventListener( "click", function(e) {
			e.preventDefault();
			bu_prepress.buniverse.pause( story.video );
		});

		/*
		* On Pause Callback
		*
		* Anytime the video pauses, by a click or other reason
		* this callback is fired, allowing us to update the
		* status of our custom controls
		*/
		story.video.addPrepressOnPauseCallback( function() {
			story.controls.pause.classList.remove( 'active' );
			story.controls.play.classList.add( 'active' );
		});

		/*
		* On Complete Callback
		*
		* Fires when the video is ended. We use this to update
		* the proggress bar one last time, and to toggle the
		* visibility of the EndState.
		 */
		story.video.addPrepressOnCompleteCallback( function() {
			story.controls.play.classList.add( 'active' );
			story.controls.pause.classList.remove( 'active' );

			// Update Progress Bar & Transcript Position.
			updateOnPlay();

			toggleEndState();
		});


		/*
		* Rewind Control Event Handler
		*
		* Rewinds the video by 10seconds when clicked
		*/
		story.controls.rewind.addEventListener( "click", function(e) {
			e.preventDefault();

			var currentPos = bu_prepress.buniverse.getPosition( story.video );
			var rewindtime = currentPos - 10;

			if ( rewindtime < 0 ) {
				rewindtime = 0;
			}
			bu_prepress.buniverse.seek( story.video, rewindtime );

		});


		/*
		* FastForward Control Event Handler
		*
		* Skips ahead by 10 seconds when clicked
		*/
		story.controls.forward.addEventListener( "click", function(e) {
			e.preventDefault();

			var currentPos = bu_prepress.buniverse.getPosition( story.video );

			var forwardtime = currentPos + 10;

			if ( forwardtime > story.videoduration ) {
				forwardtime = story.videoduration;
			}
			bu_prepress.buniverse.seek( story.video, forwardtime );

		});

		/*
		* Captions Button Event Handler
		*
		* Calls the captions on/off when toggled.
		*/
		story.controls.captions.addEventListener( "click", function(e) {
			e.preventDefault();

			if( story.controls.captions.classList.contains( 'active' ) ) {
				story.controls.captions.classList.remove( 'active' );
				bu_prepress.buniverse.captionsOff( story.video );
			} else {
				story.controls.captions.classList.add( 'active' );
				bu_prepress.buniverse.captionsOn( story.video );
			}

		});


		/*
		* Fullscreen Button Event Handler
		*
		* If Fullscreen library is ready, call for
		* fullscreen mode when clicked.
		*/
		if ( screenfull.enabled ) {
			story.controls.fullscreen.addEventListener( "click", function(e) {
				e.preventDefault();

				if ( screenfull.enabled ) {

					screenfull.on('change', function() {
						Waypoint.refreshAll()
					});

					if ( story.fullscreen === true ) {
						story.fullscreen = false;
						screenfull.exit(  story.videoplayer_element );
						story.waypoint.enable();
						Waypoint.refreshAll()

						if ( story.sticky === true ) {
							story.videoplayer_element.classList.add( 'is-sticky-video-story' );
							document.body.classList.add( 'has-sticky-video-story' );
						}
					} else {
						story.fullscreen = true;
						screenfull.request( story.videoplayer_element );
						story.waypoint.disable();

						if ( story.sticky === true ) {
							story.videoplayer_element.classList.remove( 'is-sticky-video-story' );
							document.body.classList.remove( 'has-sticky-video-story' );
						}
					}


				}

			});

		} else {
			story.controls.fullscreen.style.display = "none";
		}


		/*
		* Volume Control Event Handler
		*
		* When clicked toggle Muting of the video.
		*/
		story.controls.volume.addEventListener( "click", function(e) {
			e.preventDefault();
			if( e.target !== story.controls.volumerange ) {
				var ismuted = bu_prepress.buniverse.isMuted( story.video );
				if( ismuted ) {
					bu_prepress.buniverse.unMute( story.video );
					story.controls.volume.classList.remove( 'active' );
					story.controls.volumerange.value = 50;
					bu_prepress.buniverse.setVolume( story.video, 50 );
				} else {
					bu_prepress.buniverse.mute( story.video );
					story.controls.volume.classList.add( 'active' );
					story.controls.volumerange.value = 0;
					bu_prepress.buniverse.setVolume( story.video, 0 );
				}
			}

		});


		/*
		ToDo: this needs to be moved elsewhere.

		Sets the volume on load to a default value of 50%
		*/
		story.controls.volumerange.value = 50;
		bu_prepress.buniverse.setVolume( story.video, 50 );

		/*
		* Event/Change handler for the Volume Input Range element.
		* Returns the value between 0-100 and passes that to the
		* video to set the volume
		*/
		onRangeChange( story.controls.volumerange, function(e){
			bu_prepress.buniverse.setVolume( story.video, e.target.value );
		});



		/*
		* Progress Bar Element Seek
		*
		* When clicked calculate the percentage on the horizontal
		* axis of the progress element and jump the video to
		* the corresponding percentage.
		*
		* The math in here appears to be working, but may have cross-browser
		* issues.
		*/
		var progressBarSeek = function ( e ) {

			var x = e.layerX;

			var clickedValue = x * this.max / this.offsetWidth;

			if( clickedValue >= 0 && clickedValue <= 100 ) {
				//(percent / 100) * duration
				var newTime = ( clickedValue / 100 ) * story.videoduration;

				// Update Progress Bar position.
				story.controls.progress.value = clickedValue;

				// Seek the video to the new time.
				bu_prepress.buniverse.seek( story.video, newTime );
			}
		};

		// Add our event listeners
		story.controls.progress.addEventListener('mouseup', progressBarSeek, false);
		story.controls.progress.addEventListener('touchend', progressBarSeek, false);

	};





	/*
	* Sticky Video Setup
	*
	* Called once to setup Waypoints library to make
	* the video sticky when it moves off screen.
	*/
	var stickyVideo = function() {
		story.waypoint = new Waypoint({
			element: story.element, //The main video story block
			handler: function(direction) {
				toggleSticky();
			},
			offset: '-95%'
		})
	};




	/*
	* Toggle Sticky Video
	*
	* Sets the clases to toggle the sticky video element
	* Also we calculate the aspect ratio of the video element
	* and add an intrinsic ratio padding calculation so the
	* video maintains it's size on the page when it is moved out
	* of the document flow. (prevents content from jumping)
	*/
	var toggleSticky = function( x ) {
		if( story.sticky === true ) {

			story.header.style.paddingTop = 'unset';
			story.videoplayer_element.classList.remove( 'is-sticky-video-story' );
			document.body.classList.remove( 'has-sticky-video-story' );
			story.sticky = false;
		} else {
			var width = story.header.offsetWidth;
			var height = story.header.offsetHeight;
			var aspectRatio = (height/width) * 100;
			story.header.style.paddingTop = aspectRatio+'%';

			story.videoplayer_element.classList.toggle( 'is-sticky-video-story' );
			document.body.classList.toggle( 'has-sticky-video-story' );
			story.sticky = true;
		}

	};


	/*
	* Toggle EndState
	*
	* At the end of the video we want to display our own
	* custom End State over the player that displays some controls
	* and displays Related Posts (yarpp)
	*
	* This function is called when the video ends to make that
	* endstate element visible
	*/
	var toggleEndState = function() {
		if( bu_prepress.buniverse.getPlayerState( story.video ) === 0 ) { //ended
			story.element.classList.add( 'has-endstate-open' );
		} else {
			story.element.classList.remove( 'has-endstate-open' );
		}
	};


	/*
	* Update When Video is Playing
	*
	* Called when the video is playing. This function
	* sets repeatedly queries the getPosition() function to
	* find the timestamp of the playhead and then updates
	* the progress bar element with the percentage played.
	*
	* We also loop through all of the Caption Text elements and
	* do some math to figure out if the current timestamp matches
	* or exceeds the Start time in seconds of each caption. Then if
	* the Duration property of the caption (how long to show it) is
	* less than the current play timestamp we add a class to highlight
	* the caption.
	*
	* In addition for highlighted captions we use setTimeout set to the
	* duration property of the individual caption text to set a timer to
	* hide the highlight when the caption no longer matches the speach in
	* the video.
	 */
	var updateOnPlay = function() {
		var captionItems = story.transcript.captions;

		function updateVideo() {
			if ( bu_prepress.buniverse.getPlayerState( story.video ) === 1 ) {

				var currentTime =  parseInt( bu_prepress.buniverse.getPosition( story.video ) );
				var percentageComplete = ( Math.round( currentTime ) / story.videoduration) * 100 ;

				// Update the <progress> element and fallback progress bar with the percent complete.
				story.controls.progress.value = percentageComplete;
				story.controls.progressbar.style.width = percentageComplete + '%';

				// Loop through Caption items and if matches current play position show caption
				for ( var i = 0; i < captionItems.length; i++ ) {
					var start = captionItems[i].start;
					var duration = captionItems[i].duration;
					var end = start + duration;
					var caption = captionItems[i].element;

					if ( currentTime >= start && currentTime <= end ) {

						// If Caption is not already "active" (highlighted)
						// This check is importent to prevent extra setTimeout's
						// from being created.
						if ( ! caption.classList.contains( 'active' ) ) {

							// Add a class of Active to add a visual highlight
							// to the caption entry element.
							caption.classList.add( 'active' );

							// Add a timeout equal to the duration set in the caption
							// so the caption "highlight" style is removed after duration time.
							setTimeout( function( elem ) {
								elem.classList.remove( 'active' );
							}, duration * 100, caption );
						}
					}
				}

				// Run this updateVideo function every 100ms to update captions and progress bar.
				setTimeout( updateVideo, 100 );

			} else if ( bu_prepress.buniverse.getPlayerState( story.video ) === 0 ) { //ended
				// Update the <progress> element and fallback progress bar with the percent complete.
				story.controls.progress.value = 100;
				story.controls.progressbar.style.width = '100%';
			}
		}
		// We need to call this the first time
		updateVideo();
	};






	// https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging
	var onRangeChange = function(rangeInputElmt, listener) {
		var inputEvtHasNeverFired = true;

		var rangeValue = {current: undefined, mostRecent: undefined};

		rangeInputElmt.addEventListener("input", function(evt) {
			inputEvtHasNeverFired = false;
			rangeValue.current = evt.target.value;
			if (rangeValue.current !== rangeValue.mostRecent) {
				listener(evt);
			}
			rangeValue.mostRecent = rangeValue.current;
		});

		rangeInputElmt.addEventListener("change", function(evt) {
			if (inputEvtHasNeverFired) {
			  listener(evt);
			}
		});
	};

	/*
	* Get Transcripts List XMLHttpRequest
	*
	* For a given youtube ID, reach out to youtube's api
	* for TimedText and fetch the XML document with a list of transcripts
	* for that video. This is needed as some videos have more than 1 transcript
	*
	* Run our callback function on success
	*/
	var getTranscriptList = function( youtubeID, callback ) {
		if( youtubeID ) {
		    // Set up our HTTP request
			var xhr = new XMLHttpRequest();

			// Setup our listener to process completed requests
			xhr.onload = function () {

				// Process our return data
				if (xhr.status >= 200 && xhr.status < 300) {
					// What do when the request is successful
					// console.log('success!', xhr);
					// console.log(xhr.responseXML.documentElement.nodeName);
					// console.log(xhr.responseXML);
					callback( xhr.responseXML );

				} else {
					// What do when the request fails
					//console.log('The request failed!');

					// ToDo: better error handling?
				}

			};

			// Create and send a GET request
			// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
			// The second argument is the endpoint URL
			xhr.open('GET', 'https://www.youtube.com/api/timedtext?v=' + youtubeID +'&type=list');
			xhr.responseType = "document";
			xhr.send();
		}
	}


	/*
	* Get Transcript XMLHttpRequest
	*
	* For a given youtube ID, reach out to youtube's api
	* for TimedText and fetch the XML document with transcript
	* and caption data for the video.
	*
	* Run our callback function on success to continue setting
	* up the Transcript on the page (parse and insert in DOM)
	*/
	var getTranscript = function( youtubeID, name, callback ) {
		if( youtubeID ) {
		    // Set up our HTTP request
			var xhr = new XMLHttpRequest();
			var transcriptname = null;

			// Setup our listener to process completed requests
			xhr.onload = function () {

				// Process our return data
				if (xhr.status >= 200 && xhr.status < 300) {
					// What do when the request is successful
					//console.log('success!', xhr);
					// console.log(xhr.responseXML.documentElement.nodeName);
					// console.log(xhr.responseXML);
					//processTranscript( xhr.responseXML );
					callback( xhr.responseXML );

				} else {
					// What do when the request fails
					//console.log('The request failed!');

					// ToDo: better error handling?
				}

			};

			if ( name ) {
				transcriptname = '&name=' + encodeURIComponent( name );
				xhr.open('GET', 'https://www.youtube.com/api/timedtext?v=' + youtubeID +'&lang=en' + transcriptname );
			} else {
				xhr.open('GET', 'https://www.youtube.com/api/timedtext?v=' + youtubeID +'&lang=en' );
			}

			// Create and send a GET request
			// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
			// The second argument is the endpoint URL

			xhr.responseType = "document";
			xhr.send();
		}
	};





	/*
	* Parse Transcript XML from Youtube
	*
	* Takes the returned XMLHttpRequest response and
	* finds all of of the caption text element.
	*
	* For each found, add them to the DOM and to the
	* Story object on bu_prepress.video_story.
	*/
	var processTranscript = function( transcript ) {
		//expected XML markup:
		// <transcript>
		// 	<text start="37.879" dur="1.32">Safety is number one.</text>
		// 	<text start="146.1" dur="2.56">I think I over thought it.</text>
		// 	etc..
		// </transcript>

		if ( ! transcript ) {
			return;
		}

		var transcriptItems = transcript.querySelectorAll( 'text' );

		//if found
		if (transcriptItems.length > 0) {

			for ( var i = 0; i < transcriptItems.length; i++ ) {
				var content = transcriptItems[i].textContent;
				var start = parseInt( transcriptItems[i].getAttribute( 'start' ) );
				start = Math.floor( start );

				var dur = parseInt( transcriptItems[i].getAttribute( 'dur' ) );

				var item = document.createElement( "div" );
				item.classList.add( 'wp-block-video-story-transcript-item' );
				item.transcriptStart = start;
				item.transcriptDuration = dur;

				var timestamp = document.createElement( "span" );
				timestamp.classList.add( 'wp-block-video-story-transcript-timestamp' );
				timestamp.innerHTML = bu_prepress.buniverse.secondsToMinutes( start );

				var text = document.createElement( "span" );
				text.classList.add( 'wp-block-video-story-transcript-text' );
				text.innerHTML = content;

				item.appendChild( timestamp );
				item.appendChild( text );

				story.transcript.transcriptTab.appendChild( item );

				story.transcript.captions.push( {
					'start': start,
					'duration': dur,
					'element': item,
				});

			}

			return story.transcript.captions;
		}

	};





	/*
	* Initialize the Video Story block's functions
	*
	* Starts everything off by calling findElements()
	* on every page to see if there are any Video Story
	* Gutenberg Blocks present.
	*
	*/
	var videostoryInit = function() {
		//find the elements
		findElements();
	};


	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {

		videostoryInit();

	});


	return {
		getStory: function() {
			return story;
		}
	};
})();;
MicroModal.init({
	//onShow: modal => console.info(`${modal.id} is shown`), // [1]
	//onClose: modal => console.info(`${modal.id} is hidden`), // [2]
	//openTrigger: 'data-custom-open', // [3]
	//closeTrigger: 'data-custom-close', // [4]
	disableScroll: true, // [5]
	disableFocus: false, // [6]
	awaitCloseAnimation: false, // [7]
	debugMode: true // [8]
});;
bu_prepress.social_share = (function() {
	var shareTools = [];
	var $body = document.getElementsByTagName('body')[0];
	var $plugin_share_tools = document.querySelector('.js-prepress-component-share-tools');

	var findElements = function() {
		//find all the share tool buttons
		var elements = document.querySelectorAll('.js-bu-prepress-share-tools');
		//if found
		if (elements.length > 0) {
			//for each found share tool button do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				//for each one found store as object in the array
				shareTools.push( elements[i] );
			}
		}
	};


	var getShareTools = function() {
		var el = document.createElement('div');
		var shareTools = document.querySelector('.js-prepress-component-share-tools');
		el.appendChild(shareTools);

		return el;
	};


	var setupTooltip = function() {
		if ( shareTools.length > 0 && $plugin_share_tools ) {

			//for ( var i = 0; i < shareTools.length; i++ ) {
			shareTools.forEach( function( share, index ) {
				//store for loop instance as variable so event handlers
				//can reference element when event fires
				var thisButton = share;


				//the share tools output by the BU Sharing plugin, but cloned to support multiple
				var $thisShareTools = $plugin_share_tools;

				share.tooltip = new Tooltip( share, {
					placement: 'bottom', // or bottom, left, right, and variations
					title: "<div></div>",
					html: true,
					trigger: 'manual',
					closeOnClickOutside: false,
					template: '<div class="tooltip wp-prepress-component-share-tools" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
				});


				share.addEventListener( 'click', function(e){
					e.preventDefault();

					if ( this.classList.contains( 'active' ) ) {
						share.tooltip.hide();
						this.classList.remove('active');
					} else {
						this.classList.add('active');
						share.tooltip.updateTitleContent( getShareTools() );
						share.tooltip.show();

					}
				});



			});


			// the copy button
			var thisCopyButton = document.querySelector( '.js-prepress-component-share-tools' );


			//store a reference to the input field on the button
			//so that it is easier to target in the event listener
			thisCopyButton.inputTarget = thisCopyButton.getElementsByTagName('input')[0];


			thisCopyButton.addEventListener( "click", function(e) {
				e.preventDefault();
				var copyText = this.inputTarget;

				// Select the text field.
				copyText.focus();
				copyText.select();

				// Copy the url inside the text field.
				document.execCommand("copy");

			});


		}
	};

	var sharetoolsInit = function() {
		//find the elements
		findElements();

		//setup tooltip
		setupTooltip();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {

  		sharetoolsInit();

	});

	return {
		getshareTools: function() {
			return shareTools;
		}
	};
})();;
bu_prepress.issues_landing_page = (function() {
	var issueItems = [];
	var $body = document.getElementsByTagName('body')[0];

	var findElements = function() {
		//find all the issue cards
		var elements = document.getElementsByClassName('js-bu-prepress-landing-issue');
		//if found
		if (elements.length > 0) {
			//for each found issue do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				//for each one found store as object in the array
				issueItems.push( elements[i] );
			}
		}
	};

	var setupIssueModals = function() {
		if (issueItems.length > 0) {

			for ( var i = 0; i < issueItems.length; i++ ) {
				//store for loop instance as variable so event handlers
				//can reference element when event fires
				var thisIssue   = issueItems[i];
				var issueButton = thisIssue.querySelector( '.js-bu-prepress-landing-issue-btn' );
				var issueModal  = thisIssue.querySelector( '.js-bu-prepress-landing-issue-modal' );
				var modalNext   = thisIssue.querySelector( '.js-bu-prepress-landing-issue-modal-next' );
				var modalPrev   = thisIssue.querySelector( '.js-bu-prepress-landing-issue-modal-prev' );

				if ( issueButton ) {
					issueButton.addEventListener( "click", function(e) {
						e.preventDefault();
						var issue_id = this.getAttribute( 'data-issue-id' );
						MicroModal.show( 'modal-issue-' + issue_id, {
							disableScroll: true,
						});
						// Scroll window instantly to the top.
						// A quick fix instead of positioning the modal
						// in the center of the current scroll position.
						window.scrollTo( 0, 0 );
					});
				}

				if ( modalNext ) {
					modalNext.addEventListener( "click", function(e) {
						e.preventDefault();
						var issue_id = this.getAttribute( 'data-issue-id' );
						MicroModal.close();
						MicroModal.show( issue_id, {
							disableScroll: true,
						});
					});
				}

				if ( modalPrev ) {
					modalPrev.addEventListener( "click", function(e) {
						e.preventDefault();
						var issue_id = this.getAttribute( 'data-issue-id' );
						MicroModal.close();
						MicroModal.show( issue_id, {
							disableScroll: true,
						} );

					});
				}


			}
		}
	};

	var issuesInit = function() {
		//Find the elements.
		findElements();

		//Setup issues modals.
		setupIssueModals();
	};

	//Start on dom ready (ie8+).
	document.addEventListener("DOMContentLoaded", function() {

  		issuesInit();

	});

	return {
		getIssues: function() {
			return issueItems;
		}
	};
})();