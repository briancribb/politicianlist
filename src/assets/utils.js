/*
============================================================
============================================================

These will be pure utility functions.

============================================================
============================================================
*/

const utils = {
	init : function() {
		this.polyfills.transEnd();
		this.polyfills.documentHidden();
		this.polyfills.RAF();
	},
	polyfills: {
		transEnd : function(){
			// This function gets the browser's name for "transitionend" and saves it to a prop which 
			// may then be used by other functions to detect the end of a CSS3 transition.
			var t;
			var el = document.createElement('fakeelement');
			var transitions = {
				'transition':'transitionend',
				'OTransition':'oTransitionEnd',
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			}

			for(t in transitions){
				if( el.style[t] !== undefined ){
					utils.trans_end = transitions[t];
				}
			}

			/*
			EXAMPLE LISTENER FUNCTION
			=========================
			This was originally meant for a navigation menu that would be visible only on larger sizes.
			For smaller sizes it would slide in from the side when a button was clicked. I didn't want it 
			to slide when the browser window was resized by the user, so the transition class was added 
			on the click and then removed when the transition was done. The result is that it would just 
			appear or disappear as needed on a window resize, but slide in when called by that button at 
			smaller sizes.

			First a click that changes that adds a transition class and changes the position of our element.
			Then this listener removes that class.

			element.addEventListener(utils.trans_end, function(evt) {
				console.log('Transition complete!');
				evt.target.removeClass('trans-right');
			});
			*/
		},
		documentHidden : function(){
			/*
			Setting strings to match vendor visibility names. This will normalize the following strings 
			as module properties: 

			utils.hidden
			utils.visibilityChange
			utils.visibilityState

			We can ask for utils.hidden and we'll get whatever the browser uses for that. Not as necessary 
			these days, but it will help just in case you ask for "hidden" and the browser is actually 
			using "webkitHidden".
			*/

			if (typeof document.hidden !== "undefined") {
				utils.hidden = "hidden", utils.visibilityChange = "visibilitychange", utils.visibilityState = "visibilityState";
			} else if (typeof document.mozHidden !== "undefined") {
				utils.hidden = "mozHidden", utils.visibilityChange = "mozvisibilitychange", utils.visibilityState = "mozVisibilityState";
			} else if (typeof document.msHidden !== "undefined") {
				utils.hidden = "msHidden", utils.visibilityChange = "msvisibilitychange", utils.visibilityState = "msVisibilityState";
			} else if (typeof document.webkitHidden !== "undefined") {
				utils.hidden = "webkitHidden", utils.visibilityChange = "webkitvisibilitychange", utils.visibilityState = "webkitVisibilityState";
			}

			// Boolean so the module knows whether the tab is hidden.
			utils.document_hidden = document[utils.hidden];

			/*
			EXAMPLE LISTENER FUNCTION
			=========================
			document.addEventListener(utils.visibilityChange, function() {
				// If the document's hidden state is different from our value then there's been a change.
				if(utils.document_hidden !== document[utils.hidden]) {
					if(document[utils.hidden]) {
						// The tab is now hidden. Maybe stop some stuff or pause it.
					} else {
						// The tab is now visible. The browser window might be a different size now, 
						// so take that into account.
					}
					// Set the module's value to match the browser's current value.
					utils.document_hidden = document[utils.hidden];
				}
			});
			*/
		},
		RAF : function(){
			/*
			Generic polifills that update the window object or something similar
			*/

			// Polyfill for HTML5 canvas.
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       || 
						window.webkitRequestAnimationFrame || 
						window.mozRequestAnimationFrame    || 
						window.oRequestAnimationFrame      || 
						window.msRequestAnimationFrame     || 
						function( callback ){
						window.setTimeout(callback, 1000 / 60);
						};
			})();
		}
	},
	throttle : (delay, fn)=>{
		let lastCall = 0;
		return function (...args) {
			const now = (new Date).getTime();
			if (now - lastCall < delay) {
				return;
			}
			lastCall = now;
			return fn(...args);
		}
		/*
		EXAMPLE OF USE:
		let myHandler = (event) => { console.log('event', event); }
		let tHandler = util.throttled(1000, myHandler);
		document.body.addEventListener("mousemove", tHandler);
		*/
	},
	debounce : (delay, fn)=>{
		let timerId;
		return function (...args) {
			if (timerId) {
				clearTimeout(timerId);
			}
			timerId = setTimeout(() => {
				fn(...args);
				timerId = null;
			}, delay);
		}
		/*
		EXAMPLE OF USE:
		let myHandler = (event) => { console.log('event', event); }
		let tHandler = util.debounced(1000, myHandler);
		document.body.addEventListener("mousemove", tHandler);
		*/
	}
}
// https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
export default utils;