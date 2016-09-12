(function () {
	'use strict';

	var module = angular.module('smoothScroll', []);

	// Smooth scrolls the window to the provided element.
	var smoothScroll = function (element) {
		
		var parent = element.parentNode;
		var child = element;
		var _parentScrollTop  = parent.scrollTop;
		var pixelsToScroll = child.offsetTop;
		var scrollLimit = parent.scrollHeight - parent.clientHeight;
		
		function clear(){
            clearInterval(myVar);
        }
		
		var easingPattern = function (type, time) {
			if(time > pixelsToScroll){
				time = pixelsToScroll-1;
			}
			if ( type == 'easeInQuad' ) return pixelsToScroll/time; // accelerating from zero velocity
			if ( type == 'easeOutQuad' ) return pixelsToScroll / (time - 2); // decelerating to zero velocity
			if ( type == 'easeInOutQuad' ) return time < 0.5 ? pixelsToScroll/time : pixelsToScroll / (time - 2); // acceleration until halfway, then deceleration
			if ( type == 'easeInCubic' ) return pixelsToScroll/(time-1); // accelerating from zero velocity
			if ( type == 'easeOutCubic' ) return pixelsToScroll / (time - 4); // decelerating to zero velocity
			if ( type == 'easeInOutCubic' ) return time < 0.5 ? pixelsToScroll/time : pixelsToScroll / (time - 8); // acceleration until halfway, then deceleration
			if ( type == 'easeInQuart' ) return pixelsToScroll/(time-2); // accelerating from zero velocity
			if ( type == 'easeOutQuart' ) return pixelsToScroll / (time - 6); // decelerating to zero velocity
			if ( type == 'easeInOutQuart' ) return time < 0.5 ? pixelsToScroll/time : pixelsToScroll / (time - 14); // acceleration until halfway, then deceleration
			if ( type == 'easeInQuint' ) return pixelsToScroll/(time-3); // accelerating from zero velocity
			if ( type == 'easeOutQuint' ) return pixelsToScroll / (time - 8);; // decelerating to zero velocity
			if ( type == 'easeInOutQuint' ) return time < 0.5 ? pixelsToScroll/time : pixelsToScroll / (time - 20); // acceleration until halfway, then deceleration
			return time; 
		};
		
		function move(){
			if(_parentScrollTop > pixelsToScroll){
				var incrementPixels = parent.scrollTop -= easingPattern('easeInQuad',300);
				if(incrementPixels <= pixelsToScroll || incrementPixels >= scrollLimit){
					clear();
				}
			}
			else if(_parentScrollTop < pixelsToScroll){
				var incrementPixels = parent.scrollTop += easingPattern('easeInQuad',300);
				if(incrementPixels >= pixelsToScroll || incrementPixels >= scrollLimit){
					clear();
				}
			}
		}
		
		var myVar= setInterval(function(){ move() }, 4);
	};

	// Expose the library via a provider to allow default options to be overridden
	//
	module.provider('smoothScroll', function() {

		function noop() {}
		var defaultOptions = {
			duration: 800,
			offset: 0,
			easing: 'easeInOutQuart',
			callbackBefore: noop,
			callbackAfter: noop
		};

		return {
			$get: function() {
				return function(element, options) {
					smoothScroll(element, angular.extend({}, defaultOptions, options));
				}
			},
			setDefaultOptions: function(options) {
				angular.extend(defaultOptions, options);
			}
		}
	});


	// Scrolls the window to this element, optionally validating an expression
	//
	module.directive('smoothScroll', ['smoothScroll', function(smoothScroll, smoothScrollProvider) {
		return {
			restrict: 'A',
			scope: {
				callbackBefore: '&',
				callbackAfter: '&',
			},
			link: function($scope, $elem, $attrs) {
				$attrs.$observe('scrollIf', function(value) {
					if ( typeof $attrs.scrollIf === 'undefined' || $attrs.scrollIf === 'true' ) {
						setTimeout( function() {
							smoothScroll($elem[0]);
						}, 500);
					}
				})
			}
		};
	}]);


	// Scrolls to a specified element ID when this element is clicked
	//
	module.directive('scrollTo', ['smoothScroll', function(smoothScroll) {
		return {
			restrict: 'A',
			scope: {
				callbackBefore: '&',
				callbackAfter: '&',
			},
			link: function($scope, $elem, $attrs) {
				var targetElement;

				$elem.on('click', function(e) {
					e.preventDefault();

					targetElement = document.getElementById($attrs.scrollTo);
					if ( !targetElement ) return;

					var callbackBefore = function(element) {
						if ( $attrs.callbackBefore ) {
							var exprHandler = $scope.callbackBefore({element: element});
							if (typeof exprHandler === 'function') {
								exprHandler(element);
							}
						}
					};

					var callbackAfter = function(element) {
						if ( $attrs.callbackAfter ) {
							var exprHandler = $scope.callbackAfter({element: element});
							if (typeof exprHandler === 'function') {
								exprHandler(element);
							}
						}
					};

					var options = {
						callbackBefore: callbackBefore,
						callbackAfter: callbackAfter
					};

					if (typeof $attrs.duration != 'undefined')
						options.duration = $attrs.duration;

					if (typeof $attrs.offset != 'undefined')
						options.offset = $attrs.offset;

					if (typeof $attrs.easing != 'undefined')
						options.easing = $attrs.easing;

					smoothScroll(targetElement, options);

					return false;
				});
			}
		};
	}]);

}());
