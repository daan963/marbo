/*
Custom Event Polyfill
https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
*/
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/*
.matches() polyfill:
https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

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


// Matches polyfill.
if (!Element.prototype.matches) {
	Element.prototype.matches =
	  Element.prototype.msMatchesSelector ||
	  Element.prototype.webkitMatchesSelector;
}
// element.closest() polyfill.
if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
	  var el = this;

	  do {
		if (Element.prototype.matches.call(el, s)) return el;
		el = el.parentElement || el.parentNode;
	  } while (el !== null && el.nodeType === 1);
	  return null;
	};
}

// Foreach NodeList Polyfill for IE.
if ('NodeList' in window && !NodeList.prototype.forEach) {
    console.info('polyfill for IE11');
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
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

const bu_blocks = {};
;;bu_blocks.clicktotweet = ( function() {
	var tweetBlocks = []; //stores all of our found blocks
	var tweetLabel = "Tweet this";

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.wp-block-bu-clicktotweet' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			elements.forEach( function( theBlock, item ) {

				var block = {};

				// Get DOM element.
				block.element = theBlock;

				// Check if this block has a highlight subsection of text
				if ( theBlock.classList.contains('has-format-highlight') ) {
					block.highlight = theBlock.querySelector( '.wp-block-bu-clicktotweet-highlight');

					// Get and store the highlighted text as our text to tweet.
					block.tweet_text = block.highlight.innerText;
				} else {
					// Get the entire paragraph's text to tweet.
					block.tweet_text = theBlock.innerText;
				}

				//for each one found store as object in the array
				tweetBlocks.push( block );
			});
		}
	};

	/*
	Setup click handlers for these blocks
	*/
	var setupHandlers = function() {
		if ( tweetBlocks.length > 0 ) {

			// Loop through all found Tweet Blocks
			tweetBlocks.forEach( function( theBlock, item ) {
				var btn;

				// If has subtext highlighted to tweet use that.
				if ( theBlock.highlight ) {
					btn = theBlock.highlight;
				} else {
					// Otherwise append the tweet button for the whole <p>.
					btn = document.createElement( 'button' );
					btn.appendChild( document.createTextNode( tweetLabel ) );
					btn.classList.add( 'wp-block-bu-clicktotweet-action' );
					btn.classList.add( 'js-wp-block-clicktotweet-action' );
					theBlock.element.appendChild( btn );

					// Store reference to the btn.
					theBlock.btn = btn;
				}

				// If we have a button element, setup click handler
				// to open Tweet window.
				if ( btn ) {
					btn.addEventListener( "click", function(e) {
						e.preventDefault();
						openTweet( theBlock.tweet_text );
					});
				}

			});
		}
	};

	/*
	Opens a small window with
	the Twitter Link Sharing Tool open and
	passes the text of the tweet and url
	of the post	to Twitter.
	*/
	var openTweet = function( text ) {
		var tweetedLink = window.location.href;

  		window.open(
  			"http://twitter.com/intent/tweet?url=" + tweetedLink +
  			"&text=" + text +
  			"&",
  			"twitterwindow",
  			"height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0"
  		);

	};

	/*
	Helper function to set the Button text
	to a new value on new and existing blocks.
	 */
	var setButtonText = function( str ) {
		tweetLabel = str;

		tweetBlocks.forEach( function( theBlock, item ) {
			if( theBlock.btn ) {
				theBlock.btn.innerText = tweetLabel;
			}
		});
	};

	var tweetInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		tweetInit();

	});

	return {
		gettweetBlocks: function() {
			return tweetBlocks;
		},
		settweetButtonText: function( str ) {
			setButtonText( str );
		}
	};
})();;bu_blocks.collapsibleControl = ( function() {

	// Store all Control blocks
	var collapsibleControlBlocks = [];
	var allCollapsibleBlocks = [];
	var allBlocksOpen = false;
	var collapsibleOpenClass = 'is-open';
	var collapsibleCloseClass = 'is-closed';

	/**
	 * Open or close a group of collapsible blocks
	 *
	 * @param array collapsible blocks
	 * @param bool true to open set of collapsible blocks, false to close
	 */
	var controlCollapsibleBlocks = function( collapsibleBlocks, open ) {

		if ( open === undefined ) {
			open = true;
		}

		collapsibleBlocks.forEach( function( collapsible, i ) {
			const container = collapsible.container;
			const toggle = collapsible.toggle;
			const panel = collapsible.panel;

			if ( open ) {
				container.classList.add( collapsibleOpenClass );
				container.classList.remove( collapsibleCloseClass );
				toggle.setAttribute( 'aria-expanded', true );
				panel.setAttribute( 'aria-hidden', false );
			} else {
				container.classList.remove( collapsibleOpenClass );
				container.classList.add( collapsibleCloseClass );
				toggle.setAttribute( 'aria-expanded', false );
				panel.setAttribute( 'aria-hidden', true );
			}

		} );

	}

	/**
	 * Toggle all Collapsible blocks
	 */
	var toggleAll = function( control ) {

		if ( 0 === allCollapsibleBlocks.length ) {
			return;
		}

		controlCollapsibleBlocks( allCollapsibleBlocks, !allBlocksOpen );
		allBlocksOpen = ( allBlocksOpen ) ? false : true;
	};

	/**
	 * Toggle Collapsible blocks in control's group
	 */
	var toggleGroup = function( control ) {
		const groupIsOpen = control.groupIsOpen;
		const collapsibleBlocks = control.collapsibleBlocks

		controlCollapsibleBlocks( collapsibleBlocks, !groupIsOpen );
		control.groupIsOpen = ( groupIsOpen ) ? false : true;
	};

	/**
	 * Find all Collapsible blocks on a page
	 */
	var findAllCollapsibleBlocks = function() {
		var containers = document.querySelectorAll( '.js-wp-block-bu-collapsible' );

		// Don't coninue if no Collapsible blocks exist
		if ( containers.length === 0 ) {
			return;
		}

		containers.forEach( function( element, i ) {
			var block = {};

			block.container = element;
			block.toggle = element.querySelector( '.js-bu-block-collapsible-toggle' );
			block.panel = element.querySelector( '.js-bu-block-collapsible-content' );
			allCollapsibleBlocks.push( block );
		} );

	};

	/**
	 * Return all Collapsible blocks in the group with a Control
	 *
	 * @param object control
	 *
	 * @return array list of all collapsible blocks in group
	 */
	var getGroupCollapsibleBlocks = function( control ) {

		var blocks = [];
		var group = control.closest( '.wp-block-group' );
		if ( ! group ) {
			return blocks;
		}
		var containers = group.querySelectorAll( '.js-wp-block-bu-collapsible' );

		containers.forEach( function( element, i ) {
			var block = {};

			block.container = element;
			block.toggle = element.querySelector( '.js-bu-block-collapsible-toggle' );
			block.panel = element.querySelector( '.js-bu-block-collapsible-content' );
			blocks.push( block );
		} );

		return blocks;
	}

	/**
	 * Find all Controls and Collapsible blocks
	 */
	var findElements = function() {

		var controls = document.querySelectorAll( '.bu-collapsible-control-toggle' );
		var allCollapsibleBlocksFound = false;

		// Don't coninue if no Controls are found
		if ( controls.length === 0 ) {
			return;
		}

		// Store all controls
		controls.forEach( function( control, i ) {
			var block = {};

			block.toggle = control;

			// Check if Control targets all blocks or blocks in its group
			if ( control.classList.contains( 'js-bu-collapsible-control-target-group' ) ) {
				block.targetGroup = true;
				block.collapsibleBlocks = getGroupCollapsibleBlocks( control );
				block.groupIsOpen = false;
			} else {
				block.targetGroup = false;

				if ( ! allCollapsibleBlocksFound ) {
					findAllCollapsibleBlocks();
				}

				allCollapsibleBlocksFound = true;
			}

			collapsibleControlBlocks.push( block );
		} );

	};

	/**
	 * Set up handlers, aria, and other functionality
	 */
	var setupCollapsibleControlBlocks = function() {
		if ( collapsibleControlBlocks.length === 0 ) {
			return;
		}

		collapsibleControlBlocks.forEach( function( control, i ) {
			const toggle = control.toggle;
			const targetGroup = control.targetGroup;

			toggle.addEventListener( 'click', function( e ) {
				e.preventDefault();
				if ( targetGroup ) {
					toggleGroup( control );
				} else {
					toggleAll( control );
				}
			} );
		} );

	};

	/**
	 * Init
	 */
	var collapsibleControlInit = function() {
		findElements();
		setupCollapsibleControlBlocks();
	};

	// Start things on dom ready.
	document.addEventListener( "DOMContentLoaded", function() {
		collapsibleControlInit();
	} );

} )();
;bu_blocks.collapsible = ( function() {

	// Store all collapsible block
	var collapsibleBlocks = [];
	var collapsibleOpenClass = 'is-open';
	var collapsibleClosedClass = 'is-closed';
	var eventOpen = new CustomEvent('bu-blocks-collapsible-open');
	var eventClose = new CustomEvent('bu-blocks-collapsible-close');




	/**
	 * Check if a Collapsible block is set to open by default by user.
	 *
	 * @param object collapsible block
	 * @return bool
	 */
	var isOpenDefault = function( collapsible ) {
		const container = collapsible.container;

		if ( 'true' === container.getAttribute("data-default-open") ) {
			return true;
		}

		return false;
	};

	/**
	 * Check if a Collapsible block is open.
	 *
	 * @param object collapsible block
	 * @return bool
	 */
	var isOpen = function( collapsible ) {
		const container = collapsible.container;

		if ( container.classList.contains ( collapsibleOpenClass ) ) {
			return true;
		}

		return false;
	};

	/**
	 * Open Collapsible block
	 *
	 * @param object collapsible block
	 */
	var openCollapsible = function( collapsible ) {
		const container = collapsible.container;
		const toggle = collapsible.toggle;
		const panel = collapsible.panel;

		container.classList.add( collapsibleOpenClass );
		container.classList.remove( collapsibleClosedClass );

		toggle.setAttribute( 'aria-expanded', true );
		panel.setAttribute( 'aria-hidden', false );

		if ( container.classList.contains( 'is-style-preview' ) ) {
			toggle.innerHTML = toggle.getAttribute("data-close-text");
		}
		//dispatch the event on the dom element
		container.dispatchEvent( eventOpen );
	};

	/**
	 * Close Collapsible block
	 *
	 * @param object collapsible block
	 */
	var closeCollapsible = function( collapsible ) {
		const container = collapsible.container;
		const toggle = collapsible.toggle;
		const panel = collapsible.panel;

		container.classList.remove( collapsibleOpenClass );
		container.classList.add( collapsibleClosedClass );
		toggle.setAttribute( 'aria-expanded', false );
		panel.setAttribute( 'aria-hidden', true );

		if ( container.classList.contains( 'is-style-preview' ) ) {
			toggle.innerHTML = toggle.getAttribute("data-open-text");
		}
		//dispatch the event on the dom element
		container.dispatchEvent( eventClose );
	};

	/**
	 * Toggle collapsible block
	 *
	 * @param element collapsible block
	 */
	var toggleCollapsible = function( collapsible ) {
		if ( isOpen( collapsible ) ) {
			closeCollapsible( collapsible );
		} else {
			openCollapsible( collapsible );
		}
	};

	/**
	 * Find all Collapsible blocks
	 */
	var findElements = function() {
		var containers = document.querySelectorAll( '.js-wp-block-bu-collapsible' );

		// Don't coninue if no Collapsible blocks exist
		if ( containers.length === 0 ) {
			return;
		}

		containers.forEach( function( element, i ) {
			var block = {};

			block.container = element;
			block.toggle = element.querySelector( '.js-bu-block-collapsible-toggle' );
			block.panel = element.querySelector( '.js-bu-block-collapsible-content' );
			collapsibleBlocks.push( block );
		} );
	};

	/**
	 * Set up handlers, aria, and other functionality
	 */
	var setupCollapsibleBlocks = function() {
		if ( collapsibleBlocks.length === 0 ) {
			return;
		}

		collapsibleBlocks.forEach( function( collapsible, i ) {
			const container = collapsible.container;
			const toggle = collapsible.toggle;
			const panel = collapsible.panel;

			// Add toggle event
			toggle.addEventListener( 'click', function( e ) {
				e.preventDefault();
				toggleCollapsible( collapsible );
			} );

			// Set ARIA attributes
			toggle.setAttribute( 'aria-controls', panel.id );
			panel.setAttribute( 'aria-labelledby', toggle.id );

			// Setup initial state of each block.
			if ( isOpenDefault( collapsible ) ) {
				openCollapsible( collapsible );
			} else {
				closeCollapsible( collapsible );
			}

			if ( isOpen( collapsible ) ) {
				toggle.setAttribute( 'aria-expanded', true );
				panel.setAttribute( 'aria-hidden', false );
			} else {
				toggle.setAttribute( 'aria-expanded', false );
				panel.setAttribute( 'aria-hidden', true );
			}
		} );
	};

	/**
	 * Init
	 */
	var collapsibleInit = function() {
		findElements();
		setupCollapsibleBlocks();
	};

	// Start things on dom ready.
	document.addEventListener( "DOMContentLoaded", function() {
		collapsibleInit();
	});

	return {
		getcollapsibleBlocks: function() {
			return collapsibleBlocks;
		},
		toggleCollapsible: function( collapsible ) {
			if( collapsible ) {
				toggleCollapsible( collapsible );
			}
		}
	};

} )();
;bu_blocks.drawer = ( function() {
	var drawerBlocks = []; //stores all of our found blocks
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag
	var eventOpen = new CustomEvent( 'bu-blocks-drawer-open' );
	var eventClose = new CustomEvent( 'bu-blocks-drawer-close' );

	var toggleDrawer = function( drawer ) {

		// Using an if statement to check the class
		if ( drawer.classList.contains( 'show-drawer' ) ) {
			drawer.classList.remove( 'show-drawer' );
			//dispatch the event on the drawer dom element
			drawer.dispatchEvent( eventClose );
		} else {
			drawer.classList.add( 'show-drawer' );
			//dispatch the event on the drawer dom element
			drawer.dispatchEvent( eventOpen );
		}
	};

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-bu-block-drawer' );
		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var block = {};

				//get first returned drawer content element
				block.drawer = elements[i];
				//get all matched trigger btns
				block.button = elements[i].querySelectorAll( '.js-bu-block-drawer-open' );
				//get first returned overlay element
				block.close = elements[i].querySelector( '.js-bu-block-drawer-close' );

				//for each one found store as object in the array
				drawerBlocks.push( block );
			}
		}
	};

	var setupHandlers = function() {
		if ( drawerBlocks.length > 0 ) {
			drawerBlocks.forEach( function( thisDrawer, item ) {

				//some drawer blocks may have more than one trigger btn
				//so loop through all matched to setup events
				thisDrawer.button.forEach( function( button, index ) {
					//for each btn we find, add an event handler
					button.addEventListener( "click", function(e) {
						e.preventDefault();
						toggleDrawer( thisDrawer.drawer );
					});

				});

				thisDrawer.close.addEventListener( "click", function(e) {
					e.preventDefault();
					toggleDrawer( thisDrawer.drawer );
				});

			});
		}
	};

	var drawerInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
  		drawerInit();

	});

	return {
		getdrawerBlocks: function() {
			return drawerBlocks;
		},
		toggleDrawer: function( drawer ) {
			if( drawer ) {
				toggleDrawer( drawer );
			}
		}
	};
})();;bu_blocks.modal = (function() {
	var modalBlocks = [];
	var $body = document.getElementsByTagName('body')[0];
	var eventOpen = new CustomEvent('bu-blocks-modal-open');
	var eventClose = new CustomEvent('bu-blocks-modal-close');

	var lockScroll = function() {
		$body.classList.add('bu-blocks-modal-noscroll');
	};

	var unlockScroll = function() {
		$body.classList.remove('bu-blocks-modal-noscroll');
	}

	var toggleModal = function(overlay) {
		// Using an if statement to check the class
		if (overlay.classList.contains('show-overlay')) {
			overlay.classList.remove('show-overlay');
			//dispatch the event on the overlay dom element
			overlay.dispatchEvent( eventClose );
			unlockScroll();
		} else {
			overlay.classList.add('show-overlay');
			//dispatch the event on the overlay dom element
			overlay.dispatchEvent( eventOpen );
			lockScroll();
		}
	};

	var findElements = function() {
		//find all the blocks
		var elements = document.querySelectorAll( '.js-bu-block-modal' );
		//if found
		if (elements.length > 0) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var block = {};

				//get first returned overlay element
				block.overlay = elements[i].querySelector( '.js-bu-block-modal-overlay' );
				//get all matched trigger btns
				block.button = elements[i].querySelectorAll( '.js-bu-block-modal-trigger-overlay' );
				//get first returned overlay element
				block.close = elements[i].querySelector( '.js-bu-block-modal-overlay-close' );

				//for each one found store as object in the array
				modalBlocks.push( block );
			}
		}
	};

	var setupHandlers = function() {
		if (modalBlocks.length > 0) {
			modalBlocks.forEach( function( thisModal, item ) {

				//some modals may have more than one trigger btn
				//so loop through all matched to setup events
				thisModal.button.forEach( function( button, index ) {
					//for each btn we find, add an event handler
					button.addEventListener( "click", function(e) {
						e.preventDefault();
						toggleModal( thisModal.overlay );
					});

				});
				thisModal.close.addEventListener( "click", function(e) {
					e.preventDefault();
					toggleModal( thisModal.overlay );
				});
			});
		}
	};

	var modalInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {
		modalInit();

	});

	return {
		getmodalBlocks: function() {
			return modalBlocks;
		},
		toggleModal: function( overlay ) {
			if( overlay ) {
				toggleModal( overlay );
			}
		}
	};
})();;bu_blocks.photoessay = (function() {
	var scrollTop = 0;
	var photoEssayBlocks = []; //stores all of our found blocks
	var photoEssayGroups = [];
	var photoEssayOverlay = false;
	var photoEssayFigures = {};
	var overlayActiveGroup = false;
	var $html = document.getElementsByTagName( 'html' )[0]; //target html tag
	var $body = document.getElementsByTagName( 'body' )[0]; //target body tag


	/*
	* Find all photo essay blocks
	* and store in an array.
	*
	* For each found get all of the DOM
	* elements we'll need
	*
	*/
	var findElements = function() {
		//find all the blocks
		var findBlocks = document.querySelectorAll( '.js-block-editorial-photoessay' );
		var elements = [].slice.call( findBlocks );

		//if found
		if ( elements.length > 0 ) {
			//for each found block do stuff
			for ( var i = 0; i < elements.length; i++ ) {

				var group = Array();

				var block = {};
				block.element = elements[i];

				//get first returned social photo block element
				group.push( block );


				var siblings = getSiblings( elements[i], '.js-block-editorial-photoessay'  );

				if ( siblings.length > 0 ) {

					//add siblings to group.
					siblings.forEach( function( sibling, index ) {
						var sib = {};
						sib.element = sibling;
						group.push( sib );
					});

					//reduce elements array by removing the siblings
					elements.splice(i, siblings.length);

				}

				//for each one found store as object in the array
				photoEssayGroups.push( group );
			}





		}
	};


	/*
	* For Each Photo Essay Block Setup:
	*
	* Setup the Overlay Container DOM elements.
	*
	* Find each Figure inside each block inside each group and build
	* an array for each "group" with all of the figures in order so we
	* can later traverse.
	*
	* Then call setupHandlers() to setup
	* remaining event handlers for opening the overlay, etc.
	*
	*/
	var setupBlocks = function() {
		if ( photoEssayGroups.length > 0 ) {

			photoEssayOverlay = {};
			photoEssayOverlay.container = appendOverlay();
			photoEssayOverlay.closeBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-close' );
			photoEssayOverlay.prevBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-prev' );
			photoEssayOverlay.nextBtn = photoEssayOverlay.container.querySelector( '.js-block-editorial-photoessay-overlay-next' );
			photoEssayOverlay.photoContainer = photoEssayOverlay.container.querySelector( '.wp-block-editorial-photoessay-photocontainer' );


			// Foreach Group let's assign an id
			// and then traverse the blocks to find all of the
			// figure elements and push them into a global object.
			photoEssayGroups.forEach( function( group, index ) {

				// Create an id for each group.
				var groupID = "photoEssay_"+index;

				// Add an object with a key of the group id.
				photoEssayFigures[groupID] = Array();

				//group.figures = Array();
				// Loop through each Group and iterate on the blocks.
				group.forEach( function( block, item ) {

					// Find all of the Figure elements for the block as
					// each photoessay block can support multiple photos.
					block.figures = block.element.querySelectorAll( 'figure' );

					// For each Figure element push it into the global object
					// under the key for that group.
					block.figures.forEach( function( figure, item ) {
						photoEssayFigures[groupID].push( figure );
					});

				});

			});

			// Setup this block.
			setupHandlers();
		}
	};


	/*
	* Setup Handler for clicking on images/figure elements
	* and opening the overlay with the selected figure (image)
	* element.
	*/
	var openPhotoHandler = function( figure, group ) {
		// setup click handler
		figure.addEventListener( 'click', function(e) {
			e.preventDefault();

			//Set as Active Group
			overlayActiveGroup = photoEssayFigures[group];

			// Add the selected figure to the overlay
			overlayAddContent( figure );

			// Open the Photo Overlay.
			overlayToggle();
		});
	};

	/*
	* Setup remaining Handlers
	* for Progress Bar and Audio Complete Callbacks
	*
	* These use callbacks set in the global Audio API
	*/
	var setupHandlers = function() {

		for ( group in photoEssayFigures ) {

			photoEssayFigures[group].forEach( function( figure, item ) {
				openPhotoHandler( figure, group );
			});

		}

		photoEssayOverlay.closeBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			overlayToggle();
		});

		function nextSharedAction() {
			var next = nextPhoto();
			removeActiveFigure();
			overlayAddContent( overlayActiveGroup[next] );
		}

		photoEssayOverlay.nextBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			nextSharedAction();
		});

		function prevSharedAction() {
			var prev = prevPhoto();
			removeActiveFigure();
			overlayAddContent( overlayActiveGroup[prev] );
		}

		photoEssayOverlay.prevBtn.addEventListener( 'click', function(e) {
			e.preventDefault();
			prevSharedAction();
		});

		document.onkeydown = checkKey;

		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '39') {
				nextSharedAction();
			}
			else if (e.keyCode == '37') {
				prevSharedAction();
			}
		}

	};



	/*
	* Next Photo
	*
	* Find the next photo in the
	* currently active group if any exist.
	*
	* Return the index to that item in the array.
	*/
	var nextPhoto = function() {
		var next = false;
		var last = overlayActiveGroup.length -1;

		var current = overlayActiveGroup.findIndex( function( element ){
			return element.classList.contains( 'active' );
		});

		if ( current < last ) {
			next = current + 1;
		} else if ( current === last ) {
			next = 0;
		}

		return next;

	};


	/*
	* Previous Photo
	*
	* Find the previous photo in the
	* currently active group if any exist.
	*
	* Return the index to that item in the array.
	*/
	var prevPhoto = function() {
		var prev = false;
		var last = overlayActiveGroup.length -1;

		var current = overlayActiveGroup.findIndex( function( element ){
			return element.classList.contains( 'active' );
		});

		if ( current > 0 ) {
			prev = current - 1;
		} else if ( current === 0 ) {
			prev = last;
		}

		return prev;

	};


	/*
	* Open/Close Overlay
	*
	* Additionally sets up an event listener to
	* monitor scroll events when the overlay is open.
	*/
	var overlayToggle = function() {

		if( $html.classList.contains( 'show-photo-essay-overlay' ) ) {
			// Closing: Remove event listener.
			document.removeEventListener( 'scroll', scrollEvent );
		} else {
			// Opening: Add Event Listener.
			document.addEventListener( 'scroll', scrollEvent );

			// Set current ScrollTop position.
			scrollTop = $html.scrollTop;
		}

		//Toggle the show-overlay class.
		overlayClass();
	};


	/*
	* Event Handler for scroll event
	*
	* Handles closing the overlay if the user
	* intends to scroll "out" of it and continue reading.
	*
	* Serves as an alternative to the close button.
	*/
	var scrollEvent = function( e ) {
		if( $html.scrollTop - scrollTop > 250 ) {
			//console.log("close");
			// Reset scrollTop.
			scrollTop = 0;

			// Remove Event Listener until next overlay is open.
			document.removeEventListener( 'scroll', scrollEvent );

			// Close Overlay.
			overlayClass();
		}
	};


	/*
	* Toggle the "show" class for the overlay
	* element by toggling the class on the
	* HTML tag.
	*/
	var overlayClass = function() {
		if ( overlayActiveGroup.length > 1 ) {
			$html.classList.toggle( 'photo-essay-overlay-has-multiple' );
		}
		$html.classList.toggle( 'show-photo-essay-overlay' );
	};


	/*
	* Remove all "active" classes on any
	* figure element in the active group.
	*/
	var removeActiveFigure = function() {
		for (var i = 0; i < overlayActiveGroup.length; i++) {
			if (overlayActiveGroup[i].matches('.active')) {
				overlayActiveGroup[i].classList.remove('active');
			}
		}
	};


	/*
	* Add clone of image & caption figure
	* to the overlay component
	*
	* @param figure the figure to clone and add.
	*/
	var overlayAddContent = function( figure ) {

		figure.classList.add("active");

		// Clone with child elements.
		var newFigure = figure.cloneNode( true );

		// Clean anything that might exist.
		photoEssayOverlay.photoContainer.innerHTML = '';

		// Append to overlay container.
		photoEssayOverlay.photoContainer.appendChild( newFigure );

		//Wrap the img tag in a span for better styling.
		wrapElement( photoEssayOverlay.photoContainer.querySelector( 'img' ), document.createElement( 'span' ) );
	};


	/*
	* Add Overlay to the body
	*
	*/
	var appendOverlay = function() {
		var element = document.createElement( 'div' );

		var html = overlayTemplate();
		element.innerHTML = html;

		return $body.appendChild( element );
	};

	/*
	* Wrap an element in  some html:
	*
	* example: wrapElement(document.querySelector('a.wrap_me'), document.createElement('div'));
	*
	*/
	var wrapElement = function( el, wrapper ) {
		el.parentNode.insertBefore( wrapper, el );
		wrapper.appendChild( el );
	}


	/*
	* Generate the template for the
	* Overlay to display larger photos
	* in from each photoessay block.
	*/
	var overlayTemplate = function() {

		var html = [
			'<div class="wp-block-editorial-photoessay-overlay">',
				'<nav class="wp-block-editorial-photoessay-overlay-nav">',
					'<button class="wp-block-editorial-photoessay-overlay-prev js-block-editorial-photoessay-overlay-prev"><span>Previous</span></button>',
					'<button class="wp-block-editorial-photoessay-overlay-close js-block-editorial-photoessay-overlay-close"><span>Close</span></button>',
					'<button class="wp-block-editorial-photoessay-overlay-next js-block-editorial-photoessay-overlay-next"><span>Next</span></button>',
				'</nav>',
				'<div class="wp-block-editorial-photoessay-container">',
					'<div class="wp-block-editorial-photoessay-photocontainer">',
					'</div>',
				'</div>',
			'</div>',
		].join("\n");

		return html;
	};

	/*
	* Get Siblings of the passed element until
	* selector doesn't match.
	*
	* Returns Array of sibling elements.
	*/
	var getSiblings = function ( elem, selector ) {

		// Setup siblings array
		var siblings = [];

		// Get the next sibling element
		elem = elem.nextElementSibling;

		// As long as a sibling exists
		while (elem) {

			// If selector doesn't match, bail
			if ( ! elem.matches(selector) ) break;

			// Otherwise, push it to the siblings array
			siblings.push(elem);

			// Get the next sibling element
			elem = elem.nextElementSibling;

		}

		return siblings;

	};


	var init = function() {
		//find the elements
		findElements();

		//setup blocks
		setupBlocks();
	};

	//start on dom ready (ie8+)
	document.addEventListener( "DOMContentLoaded", function() {
		init();

	});

	return {
		getBlocks: function() {
			return photoEssayBlocks;
		},
		getActiveGroup: function() {
			return overlayActiveGroup;
		}
	};
})();;bu_blocks.slideshow = (function() {
	var slideshowBlocks = [];
	var $body = document.getElementsByTagName('body')[0];

	var findElements = function() {
		//find all the blocks
		var elements = document.getElementsByClassName('js-bu-blocks-slideshow');

		//if found
		if (elements.length > 0) {
			//for each found block do stuff
			for( i = 0; i < elements.length; i++ ) {

				var block = {};

				//get back btn
				block.backBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-back-btn')[0];
				//get forward btn
				block.forwardBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-forward-btn')[0];

				//get onmedia back btn
				block.backMediaBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-back-onmedia-btn')[0];
				//get onmedia forward btn
				block.forwardMediaBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-forward-onmedia-btn')[0];
				//get ontrack forward btn
				block.forwardTrackBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-forward-ontrack-btn')[0];

				//get caption btn
				block.captionBtn = elements[i].getElementsByClassName('js-bu-blocks-slideshow-caption-btn')[0];

				//get media track
				block.mediatrack = elements[i].getElementsByClassName('js-bu-blocks-slideshow-media-track')[0];

				//get media items
				block.mediatrackitems = elements[i].getElementsByClassName('js-bu-blocks-slideshow-media-track-item');

				//get caption track
				block.captiontrack = elements[i].getElementsByClassName('js-bu-blocks-slideshow-caption-track')[0];

				//get caption items
				block.captiontrackitems = elements[i].getElementsByClassName('js-bu-blocks-slideshow-caption-item');
				//get caption items
				block.captionContainer = elements[i].getElementsByClassName('js-bu-blocks-slideshow-caption-container')[0];

				//for each one found store as object in the array
				slideshowBlocks.push(block);
			} 

			// set active states on items and captions
			for ( i = 0; i < block.mediatrackitems.length; i++) {
				block.mediatrackitems[i].active = false;
				block.captiontrackitems[i].active = false;
			}
			// set first to active true
			block.mediatrackitems[0].active = true;
			block.captiontrackitems[0].active = true;
			for (var i = block.mediatrackitems.length - 1; i >= 0; i--) {
				// set active classes
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[0].classList.toggle("bu-blocks-slideshow-media-track-item-active");
					block.captiontrackitems[0].classList.toggle("bu-blocks-slideshow-media-track-item-active");
				}
			}
			block.captionContainer.collapsed = true;
			sizingCaption( block );
		}
	};


	var setupHandlers = function() {
		if (slideshowBlocks.length > 0) {
			for ( i = 0; i < slideshowBlocks.length; i++ ) {
				var block = slideshowBlocks[i];

				block.backBtn.addEventListener("click", function(e){
					e.preventDefault();
					prevItem( block );
					sizingCaption( block );
				});
				block.backMediaBtn.addEventListener("click", function(e){
					e.preventDefault();
					prevItem( block );
					sizingCaption( block );
				});
				block.forwardBtn.addEventListener("click", function(e){
					e.preventDefault();
					nextItem( block );
					sizingCaption( block );
				});
				block.forwardMediaBtn.addEventListener("click", function(e){
					e.preventDefault();
					nextItem( block );
					sizingCaption( block );
				});
				block.forwardTrackBtn.addEventListener("click", function(e){
					e.preventDefault();
					nextItem( block );
					sizingCaption( block );
				});
				block.captionBtn.addEventListener("click", function(e) {
					e.preventDefault();
					toggleCaption( block );
					sizingCaption( block );
				});
			}
		}
	};


	var setupMediaTrack = function() {
		for ( i = 0; i < slideshowBlocks.length; i++ ) {
			var block = slideshowBlocks[i];
			if ( block.mediatrack && block.mediatrackitems ) {
				//set currentItem variable
				block.currentItem = 0;

				//store number of items
				block.itemslength = block.mediatrackitems.length;


				//set default width
				block.mediatrack.style.width = 'calc(' + block.itemslength + ' * 100%)';
				//set start position to first image
				block.mediatrack.style.left = '0%';

				//for each image calculate the width
				for ( var i = 0; i < block.mediatrackitems.length; i++ ) {
					block.mediatrackitems[i].style.width = 'calc(1/' + block.itemslength + ' * 100% - 2px)';
				}
			}


			//setup the caption track starting widths and postion
			if( block.captiontrack && block.captiontrackitems ) {
				//set default width
				block.captiontrack.style.width = 'calc(' + block.itemslength + ' * 100%)';
				//set start position to first caption
				block.captiontrack.style.left = '0%';

				//for each caption calculate the width
				for ( var i = 0; i < block.captiontrackitems.length; i++ ) {
					block.captiontrackitems[i].style.width = 'calc(1/' + block.itemslength + ' * 100%)';
				}
			}
		}

	};


	var nextItem = function( block ) {
		if( block.currentItem === block.itemslength - 1 ) {
			//can't go next anymore
		} else {
			block.currentItem = block.currentItem + 1;
			block.mediatrack.style.left = block.currentItem * -100 + '%';
			block.captiontrack.style.left = block.currentItem * -100 + '%';
			//move over active states
			for (var i = block.mediatrackitems.length - 1; i >= 0; i--) {
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[i].active = false;
					block.mediatrackitems[i].classList.toggle("bu-blocks-slideshow-media-track-item-active");
					block.mediatrackitems[i + 1].active = true;
					block.mediatrackitems[i + 1].classList.toggle("bu-blocks-slideshow-media-track-item-active");

					block.captiontrackitems[i].active = false;
					block.captiontrackitems[i].classList.toggle("bu-blocks-slideshow-media-track-item-active");
					block.captiontrackitems[i + 1].active = true;
					block.captiontrackitems[i + 1].classList.toggle("bu-blocks-slideshow-media-track-item-active");
				}
			}
		}
	};

	var prevItem = function( block ) {
		if( block.currentItem === 0 ) {
			//do nothing can't go back more
		} else {
			block.currentItem = block.currentItem - 1;
			block.mediatrack.style.left = block.currentItem * -100 + '%';
			block.captiontrack.style.left = block.currentItem * -100 + '%';
			//move over active states
			for (var i = 0; i < block.mediatrackitems.length; i++) {
				if (block.mediatrackitems[i].active === true) {
					block.mediatrackitems[i].active = false;
					block.mediatrackitems[i].classList.toggle("bu-blocks-slideshow-media-track-item-active");
					block.mediatrackitems[i - 1].active = true;
					block.mediatrackitems[i - 1].classList.toggle("bu-blocks-slideshow-media-track-item-active");

					block.captiontrackitems[i].active = false;
					block.captiontrackitems[i].classList.toggle("bu-blocks-slideshow-media-track-item-active");
					block.captiontrackitems[i - 1].active = true;
					block.captiontrackitems[i - 1].classList.toggle("bu-blocks-slideshow-media-track-item-active");
				}
			}
		}
	};

	var toggleCaption = function( block ) {
		// Toggle the collapsed class
		block.captionContainer.classList.toggle("bu-blocks-slideshow-caption-container-collapsed");
		block.captionContainer.collapsed = !block.captionContainer.collapsed;
	};

	var sizingCaption = function( block ) {
		// look for active caption and grab height
		for (var i = 0; i < block.captiontrackitems.length; i++) {
			if (block.captionContainer.collapsed == false) {
				if (block.captiontrackitems[i].active === true) {
					block.captiontrack.style.maxHeight = block.captiontrackitems[i].offsetHeight + 'px';
				}
			}
			else {
				block.captiontrack.style.maxHeight = '1.6em';
				if (block.captiontrackitems[i].active === true) {
					//remove colapse class if text is 1 line
					if (block.captiontrackitems[i].offsetHeight < block.captiontrack.offsetHeight ) {
						block.captionContainer.classList.remove("bu-blocks-slideshow-caption-container-collapsed");
						block.captionBtn.style.display = 'none';
					}
					else {
						block.captionContainer.classList.add("bu-blocks-slideshow-caption-container-collapsed");
						block.captionBtn.style.display = 'block';
					}
				}
			}
		}
	};




	var slideshowInit = function() {
		//find the elements
		findElements();

		//setup handlers
		setupHandlers();

		setupMediaTrack();
	};

	//start on dom ready (ie8+)
	document.addEventListener("DOMContentLoaded", function() {
  		slideshowInit();

	});

	return {
		getslideshowBlocks: function() {
			return slideshowBlocks;
		}
	};
})();