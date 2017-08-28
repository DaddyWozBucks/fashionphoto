angular.module('sportium',
  ['sportium.controllers',
   'sportium.services',
   'sportium.directives',
   'sportium.filters',
   'ui.router',
   'ngAnimate',
   'ngSanitize',
   'firebase',
   'ngMaterial',
   'angular-storage',
    'pascalprecht.translate',
    'ngIdle',
    'jsonFormatter'
  ])

  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the city page
      if (error === "AUTH_REQUIRED") {
        $state.go("app.landing");
      }
    });

  }])
  .config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('YYYY-MM-DD');
    };
  }])

  // .run(['Idle', function(Idle) {
  //   // start watching when the app runs. also starts the Keepalive service by default.
  //   Idle.watch();
  // }])

  .config(['$translateProvider', function($translateProvider) {

  	$translateProvider.useStaticFilesLoader({
  			 prefix: '../translations/'

  		, suffix: '.json'
  	}).preferredLanguage('en').useMissingTranslationHandlerLog().useSanitizeValueStrategy(null);

  }])
  // .run(['$rootScope', '$translate', function($rootScope, $translate) {
  // 	$rootScope.$on('$translatePartialLoaderStructureChanged', function() {
  // 		$translate.refresh();
  // 	});
  // }])
  // .config(['$translateProvider', '$translatePartialLoaderProvider', function($translateProvider, $translatePartialLoaderProvider) {
  // 	 $translatePartialLoaderProvider.addPart('app');
  // 	$translateProvider.useLoader('$translatePartialLoader', {
  // 		urlTemplate: 'https://tktr-fa4cf.firebaseio.com/translations/{part}/{lang}.json'
  // 	});
  // 	$translateProvider.preferredLanguage('en');
  // }])

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
        .state('app.home', {
          url: '/home'  ,
          views: {
            "main": {
              templateUrl: "templates/home.html",
              controller: "HomeCtrl"
            }

          }
        })
        .state('app.data_entry', {
          url: '/entry',
          views: {
            "main": {
              templateUrl: "templates/entry.html",
              controller: "EntryCtrl"
            }

          }
        })
        .state('app.landing', {
          url: '/landing',
          views: {
            "main": {
              templateUrl: "templates/landing.html",
              controller: "LandingCtrl"
            }

          }
        })





      $urlRouterProvider.otherwise(function() {
        return '/app/home'

      });
    }
  ])
  .config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
  }])

angular.module('sportium.controllers', ['sportium.services', 'sportium.filters'])
.controller('AppCtrl', ['$scope', '$log', '$state', '$stateParams', '$rootScope', '$http', '$anchorScroll', '$mdSidenav',  '$mdMedia', '$translate'

		, function ($scope, $log, $state, $stateParams, $rootScope, $http, $anchorScroll, $mdSidenav, $mdMedia, $translate) {
			$scope.popSideNav = function() {
		    $mdSidenav('menu').toggle();
		  };

			$scope.mQ = function(bp){
				return $mdMedia(bp);
			};

			$scope.sideNavLink = function(str, params){
				$mdSidenav('menu').close().then(function(){
					$state.go(str, params)
				})

			};

			$scope.setLang = function(code){
				$scope.lang = code;
				$translate.use(code);
			};
			$scope.setLang("en")
			$scope.refreshState = function(){
				var state = $state.current.name.replace("app.", "")

				$scope.currentState = state.replace("_", " ");
			}
			$scope.showNavSteps = true;
			$scope.hideNavSteps = function(){
				$scope.showNavSteps = !$scope.showNavSteps;
			};
}])
.controller('LandingCtrl', ['$scope', '$sce', '$interval'
, function($scope, $sce, $interval){
	$scope.ytUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/bJD067WdqKU?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=bJD067WdqKU");
	$scope.refreshState();
	$scope.gIndex = 0;
	$scope.gifs = ["https://www.bloodsweatandtears.eu/apa/sportium/sportium1.gif", "https://www.bloodsweatandtears.eu/apa/sportium/sportium2.gif", "https://www.bloodsweatandtears.eu/apa/sportium/sportium3.gif"]
	$interval(function () {
		if ($scope.gIndex < 2) {
			$scope.gIndex += 1;
		} else {
			$scope.gIndex = 0;
		}
	}, 3300);
	$scope.hideNavSteps();
}])
.controller('HomeCtrl', ['$scope', '$http', '$interval'
, function($scope, $http, $interval){
	$scope.refreshState();

}])
.controller('EntryCtrl', ['$scope', '$http', '$stateParams', 'Results'
, function($scope, $http, $stateParams, Results){
$scope.refreshState();
		$scope.newEntry = {
			sport: "auto"
		};
		$scope.sports = ["tennis", "football", "nfl", "auto"];
		$scope.entries = [];
		$scope.saveEntry = function(){
			Results.parse($scope.newEntry.sport, $scope.newEntry.text).then(function(data){

				$scope.entries.push(data);
			})

		}
}])

angular.module('sportium.directives',[])
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

angular.module('sportium.filters', [])
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


angular.module('sportium.services', [])
.factory('Results', ['$http', '$q', function($http, $q){
  function parseFootball(str){
    var deferred = $q.defer();
    var teams = str.split('-');
    var team1A = teams[0].split(" ");
    var team2A = teams[1].split(" ");
    var score1 = team1A[team1A.length -1]
    var score2 = team2A[0];
    var team1 = "";
    var team2 = "";
    angular.forEach(team1A, function(str){
      if (str != team1A[team1A.length -1]) {
        team1 += " ";
        team1 += str;
      }
    })
    angular.forEach(team2A, function(str){
      if (str != team2A[0]) {
        team2 += " ";
        team2 += str;
      }
    })
  deferred.resolve({
    "teamAName": team1,
    "teamBName": team2,
    "teamAScore": score1,
    "teamBScore": score2,
    "sport": "football"
  })
    return deferred.promise;
  }
  function parseTennis(str){
    var deferred = $q.defer();
    var players = str.split('-');
    var bserve = false;
    var setReg = /\(([^)]+)\)/;
    if (players[1].indexOf("*") >= 0) {

      bserve = true;
    } else{

      bserve = false;
    }
    var player1A = players[0].split(" ");
    var player2A = players[1].split(" ");
    var score1 = player1A[player1A.length -1]
    var score2 = player2A[0];
    var player1 = players[0].split('(')[0].slice(0,players[0].split('(')[0].length -1).replace(/\*/, "");
    var player2 =  players[1].split(')')[1].slice(1,players[1].split(')')[1].length).replace(/\*/, "");;
    var games1 = player1A[player1A.length -2];
    var games2 = player2A[1];

    var sets1 = setReg.exec(players[0])[1];
    var sets2 = setReg.exec(players[1])[1];



    var resp = {
      "sport": "tennis",
        "teamAName": player1,
        "teamBName": player2,
        "teamAScore": score1,
        "teamBScore": score2,
        "teamAGames": games1,
        "teamBGames": games2,
        "teamBServing": bserve,
        "scoreboard": { "elements": [ { "title": "Sets", "teamAScore": sets1, "teamBScore": sets2 } ] }
    }

  deferred.resolve(resp)
    return deferred.promise;
  }
  function parseNfl(str){
    var deferred = $q.defer();
    var players = str.split('-');
    var quarter = "";
    var pl2 = "";
    var setReg = /\(([^)]+)\)/;
    if (players[1].indexOf("1st") >= 0) {
      quarter = players[1].slice(players[1].indexOf("1st"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("1st") - 1)
    } else if (players[1].indexOf("2nd") >= 0) {
      quarter = players[1].slice(players[1].indexOf("2nd"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("2nd") - 1)
    } else if (players[1].indexOf("3rd") >= 0) {
      quarter = players[1].slice(players[1].indexOf("3rd"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("3rd") - 1)
    }
    else if (players[1].indexOf("4th") >= 0) {
      quarter = players[1].slice(players[1].indexOf("4th"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("4th") - 1)
    }

    var player1A = players[0].split(" ");
    var player2A = pl2.split(" ");
    var score1 = player1A.splice(player1A.length -1,1)[0]
    var score2 = player2A.splice(0,1)[0];
    var player1 = player1A.join(" ");
    var player2 =  player2A.join(" ");




    var resp = {
      "sport": "nfl",
      "teamAName": player1,
      "teamBName": player2,
      "teamAScore": score1,
      "teamBScore": score2,
      "currentPeriod": quarter
    }

  deferred.resolve(resp)
    return deferred.promise;
  }
  function determineSport(str){
    if (str.indexOf("Quarter") > -1) {
      return parseNfl(str);
    } else if (str.indexOf("*") > -1) {
      return parseTennis(str)
    } else  {
        return parseFootball(str);
    }
  }

  function parse(sport, str){
    switch (sport) {
      case 'football':
          return parseFootball(str);
      case 'nfl':
          return parseNfl(str);
      case 'tennis':
          return parseTennis(str)
      case 'auto':
          return determineSport(str)
      default:
          return " "
  }
  }
	return {
    parse: function(sport, str){
      return parse(sport, str)
    }
	}
}])
