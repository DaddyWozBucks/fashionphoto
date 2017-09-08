angular.module('fashion',
  ['fashion.controllers',
   'fashion.services',
   'fashion.directives',
   'fashion.filters',
   'ui.router',
   'ngAnimate',
   'ngSanitize',
   'angular-storage'
  ])

  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the city page
      if (error === "AUTH_REQUIRED") {
        $state.go("app.search");
      }
    });

  }])



  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self'
      // Allow loading from our assets domain.  Notice the difference between * and **.

    ]);
  }])

  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.stateIsLoading = true;
    $rootScope.$on('$stateChangeStart', function() {
      $rootScope.stateIsLoading = true;
    });


  }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
      // $locationProvider.html5Mode(true, true);
      // $locationProvider.hashPrefix('');
      $stateProvider


        .state('app', {
          url: '/app',
          abstract: true,
          views: {
            "header": {
              templateUrl: "templates/app.html"

                ,
              controller: "AppCtrl"
            },

          }
        })

        .state('app.results', {
          url: '/search/:tags/:userId/results',
          views: {
            "main": {
              templateUrl: "templates/results.html",
              controller: "ResultsCtrl"
            }

          }
        })
        .state('app.search', {
          url: '/search',
          views: {
            "main": {
              templateUrl: "templates/search.html",
              controller: "SearchCtrl"
            }

          }
        })





      $urlRouterProvider.otherwise(function() {
        return '/app/search'

      });
    }
  ])

angular.module('fashion.controllers', ['fashion.services', 'fashion.filters'])
.controller('AppCtrl', ['$scope', '$log', '$state', '$stateParams', '$rootScope', '$http', '$anchorScroll'

		, function ($scope, $log, $state, $stateParams, $rootScope, $http, $anchorScroll) {

			$scope.refreshState = function(){
				var state = $state.current.name.replace("app.", "")

				$scope.currentState = state.replace("_", " ");
			}
			$scope.showNavSteps = true;
			$scope.hideNavSteps = function(){
				$scope.showNavSteps = !$scope.showNavSteps;
			};
}])
.controller('SearchCtrl', ['$scope', '$sce', '$state', 'Flickr'
, function($scope, $sce, $state, Flickr){
	var self  = this;
	this.searchTags = [];
	this.userId = '';
	this.searches = [];
	this.searchForm;
	this.search = function(valid){

		if (valid) {

			Flickr.searchTags(this.searchTags, this.userId).then(function(data){
				self.searches.push(data);
				this.searchTags = "";
				this.userId = "";
			})
		}
	}
}])

.controller('ResultsCtrl', ['$scope', '$http', '$stateParams', 'Flickr'
, function($scope, $http, $stateParams, Flickr){
	var self = this;
	this.per_page = 20;
	this.page = 1;
	function loadResults() {
		Flickr.retrieveSearch($stateParams.tags, $stateParams.userId, this.page, this.per_page).then(function(data){
			console.log(data);
			self.results = data.photo;
			self.page = data.page;
		})
	}
	loadResults();
	this.setPage = function(pNo) {
		self.page = pNo;
		loadResults();
	}
}])

angular.module('fashion.directives',[])
.directive('tagEnter', function () {
  return function(scope, element, attrs) {

     element.bind("keydown keypress", function(event) {
         var keyCode = event.which || event.keyCode;

         // If enter key is pressed
         if (keyCode === 13) {
             scope.$apply(function() {
                     // Evaluate the expression
                 scope.$eval(attrs.dlEnterKey);
             });

             event.preventDefault();
         }
     });
   }
})
.directive('threeKeys', function () {
    return function (scope, element, attrs) {
        var numKeysPress=0;
        element.bind("keydown keypress", function (event) {   
                 numKeysPress++;
                     if(numKeysPress>=3){
                        scope.$apply(function (){
                            scope.$eval(attrs.myOnKeyDownCall);
                        });
                        event.preventDefault();
                      }
                });
    };
})
.directive('myAutocomplete', function() {
    return {
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '=',
            address1: "=",
            city: "=",
            state: "=",
            country: "=",
            zip: '=',
        },
        template: '<input class="form-control" type="text" data-tap-disabled>',
        link: function(scope, element, attrs, model) {
            var options = {
                // types: [],
                // componentRestrictions: {}
            };    

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                scope.$apply(function() {
                    var place = autocomplete.getPlace();
                    var components = place.address_components;  // from Google API place object   

                    scope.address1 = components[0].short_name + " " + components[1].short_name;
                    scope.city = components[3].short_name;
                    scope.state = components[5].short_name;
                    scope.country = components[6].long_name;
                    scope.zip = components[7].short_name;

                    model.$setViewValue(element.val());   
                });
            });
        }
    }
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
})

.directive('disabletap', ['$timeout', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('type-selector').blur();
        });
       // container2 = document.getElementsByClassName('originput');
       //  // disable ionic data tab
       //  angular.element(container2).attr('data-tap-disabled', 'true');
       //  // leave input field if google-address-entry is selected
       //  angular.element(container2).on("click", function(){
       //      document.getElementById('type-selector').blur();
       //  });

      },500);

    }
  };
}])
.directive('onLongPress', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attrs) {
            $elm.bind('touchstart', function(evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                $timeout(function() {
                    if ($scope.longPress) {
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function() {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);
            });

            $elm.bind('touchend', function(evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;
                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {
                    $scope.$apply(function() {
                        $scope.$eval($attrs.onTouchEnd)
                    });
                }
            });
        }
    };
}])
.directive('myDirective', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'         },
      
        templateUrl: 'mytemplate.html',
        controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) { } //DOM manipulation
    }
})
.directive('ngDrag', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      // element.css({
      //  position: 'relative',
      //  border: '1px solid red',
      //  backgroundColor: 'lightgrey',
      //  cursor: 'pointer'
      // });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}]);

angular.module('fashion.filters', [])
.filter('OWMIcon', function() {
    return function(input) {
      return "http://openweathermap.org/img/w/"+ input +".png"
    }
})
.filter('kelvinFormat', function() {
    return function(input, key) {
      var temp;
      if (key == "C") {
        temp = Math.floor(input - 273.15);
        return temp + " " + key
      }else if (key == "F"){
        temp = Math.floor(input * 9/5 - 459.67);
        return temp + " " + key
      }

    }
})
.filter('unix', function() {
    return function(input, format) {
      return (!!input) ? moment.unix(input).clone().format(format) : '';
    }
})
.filter('dFormat', function() {
    return function(input, format) {
      return (!!input) ? moment(input).clone().format(format) : '';
    }
})
.filter('capitalise', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.filter('kelvin', function() {
    return function(input, key) {
      var temp;
      if (key == "C") {
        temp = Math.floor(input - 273.15);
        return temp
      }else if (key == "F"){
        temp = Math.floor(input * 9/5 - 459.67);
        return temp
      }

    }
})
// Filters for converting raw values from OWM API
.filter('kph', function() {
    return function(input) {
    var speed = Math.floor(input * 3600/ 1000);
    return speed + " kph";
    }
})

jQuery.expr.filters.offscreen = function(el) {
  var rect = el.getBoundingClientRect();
  return (
           (rect.x + rect.width) < 0 
             || (rect.y + rect.height) < 0
             || (rect.x > window.innerWidth || rect.y > window.innerHeight)
         );
};
(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    var $w=$(window);
    $.fn.visible = function(partial,hidden,direction,container){

        if (this.length < 1)
            return;
	
	// Set direction default to 'both'.
	direction = direction || 'both';
	    
        var $t          = this.length > 1 ? this.eq(0) : this,
						isContained = typeof container !== 'undefined' && container !== null,
						$c				  = isContained ? $(container) : $w,
						wPosition        = isContained ? $c.position() : 0,
            t           = $t.get(0),
            vpWidth     = $c.outerWidth(),
            vpHeight    = $c.outerHeight(),
            clientSize  = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function'){

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = isContained ?
												rec.top - wPosition.top >= 0 && rec.top < vpHeight + wPosition.top :
												rec.top >= 0 && rec.top < vpHeight,
                bViz = isContained ?
												rec.bottom - wPosition.top > 0 && rec.bottom <= vpHeight + wPosition.top :
												rec.bottom > 0 && rec.bottom <= vpHeight,
                lViz = isContained ?
												rec.left - wPosition.left >= 0 && rec.left < vpWidth + wPosition.left :
												rec.left >= 0 && rec.left <  vpWidth,
                rViz = isContained ?
												rec.right - wPosition.left > 0  && rec.right < vpWidth + wPosition.left  :
												rec.right > 0 && rec.right <= vpWidth,
                vVisible   = partial ? tViz || bViz : tViz && bViz,
                hVisible   = partial ? lViz || rViz : lViz && rViz,
		vVisible = (rec.top < 0 && rec.bottom > vpHeight) ? true : vVisible,
                hVisible = (rec.left < 0 && rec.right > vpWidth) ? true : hVisible;

            if(direction === 'both')
                return clientSize && vVisible && hVisible;
            else if(direction === 'vertical')
                return clientSize && vVisible;
            else if(direction === 'horizontal')
                return clientSize && hVisible;
        } else {

            var viewTop 				= isContained ? 0 : wPosition,
                viewBottom      = viewTop + vpHeight,
                viewLeft        = $c.scrollLeft(),
                viewRight       = viewLeft + vpWidth,
                position          = $t.position(),
                _top            = position.top,
                _bottom         = _top + $t.height(),
                _left           = position.left,
                _right          = _left + $t.width(),
                compareTop      = partial === true ? _bottom : _top,
                compareBottom   = partial === true ? _top : _bottom,
                compareLeft     = partial === true ? _right : _left,
                compareRight    = partial === true ? _left : _right;

            if(direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if(direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if(direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };

})(jQuery);

angular.module('fashion.services', [])
.factory('Flickr', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory){
	var searches = $cacheFactory('searches');

  var deferred = $q.defer();
	function searchTags (tags, userId) {
    let sObj = {tags: tags, sort: 'interestingness-desc', extras: 'date_upload, date_taken, owner_name, views, url_q', per_page: 1};
    if (userId) {
			sObj.user_id = userId;
		}
    var req = {
      method: 'POST',
      data: {
				search: sObj
			},
      url: 'http://localhost:5002/fashiontest-7aba2/us-central1/searchTags'
    };
		$http(req).then(function(response){
			var key = moment().format('x');
			searches.put(key, response.data.photos.photo);
			let resp = {key: key, data: response.data.photos.photo[0], search: {tags: tags, userId: userId || ""}}
			debugger
			deferred.resolve(resp);
		})
		return deferred.promise;
	};

	function retrieveSearch (tags, userId, page, pp) {
		var deferred = $q.defer();
		let sObj = {tags: tags, sort: 'interestingness-desc', extras: 'date_upload, date_taken, owner_name, views, url_q', per_page: pp, page: page};
		if (userId) {
			sObj.user_id = userId;
		}
    var req = {
      method: 'POST',
      data: {
				search: sObj
			},
      url: 'http://localhost:5002/fashiontest-7aba2/us-central1/searchTags'
    };
		$http(req).then(function(response){


			deferred.resolve(response.data.photos);
		})
		return deferred.promise;
	};
	return {
    searchTags: function(tags, userId){
      return searchTags(tags, userId);
    },
		retrieveSearch: function(tags, userId, page, pp) {
			return retrieveSearch(tags, userId, page, pp);
		}
	}
}])
