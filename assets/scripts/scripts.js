

angular.module('neocles', ['neocles.controllers'
      , 'neocles.services'
      , 'neocles.directives'
      , 'neocles.filters'


      , 'ui.router'
      , 'ngAnimate'
      , 'ngSanitize'
      , 'firebase'
      , 'ngMaterial'
      , 'angular-storage'
      , 'ngGeolocation'

	 ,'mdColorPicker'
      , 'ja.qr'
      , 'ngFileUpload'
      , '720kb.socialshare'
      , 'pascalprecht.translate'
       , 'qrScanner',
		'rzModule',
       'nvd3',
      'ngIdle',
	'jkAngularRatingStars',
	'chart.js',
	'ng.deviceDetector'
  ])

.run(['$rootScope', '$state', function ($rootScope, $state) {
	$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
		// We can catch the error thrown when the $requireSignIn promise is rejected
		// and redirect the user back to the city page
		if (error === "AUTH_REQUIRED") {
			$state.go("app.landing");
		}
	});

}])
.config(['$mdDateLocaleProvider',function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
}])

.run(['Idle', function(Idle){
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
}])
// .run(['$anchorScroll', function ($anchorScroll) {
// 	// $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
// }])

.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self'
     // Allow loading from our assets domain.  Notice the difference between * and **.

  ]);
}])

.run(['$rootScope', '$state',function($rootScope, $state){
	$rootScope.stateIsLoading = true;
  $rootScope.$on('$stateChangeStart',function(){
      $rootScope.stateIsLoading = true;
 	});


}])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider) {
	 // $locationProvider.html5Mode(true, true);
	 // $locationProvider.hashPrefix('');
	$stateProvider


		.state('app', {
			url: '/app'
			, abstract: true
			, views: {
				"header": {
					templateUrl: "templates/app2.html"

					, controller: "AppCtrl"
				},

			}
		})
		.state('app.home', {
			url: '/home'

			, views: {
				"main": {
					templateUrl: "templates/home.html"

					, controller: "HomeCtrl"
				},

			}
		})
    .state('app.city', {
			url: '/city'

			, views: {
				"main": {
					templateUrl: "templates/city.html"

					, controller: "CityCtrl"
				},

			}
		})




	$urlRouterProvider.otherwise(function(){
			return '/app/login'

	});
}])
.config(['$mdThemingProvider', function ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
}])

// .config(function (SpotifyProvider) {
// 	SpotifyProvider.setClientId('5e10adf81564490590d285b7fc100fa8');


// });;

angular.module('neocles.controllers', ['neocles.services', 'neocles.filters'])
.controller('AppCtrl', ['$scope',  '$log', '$state', '$stateParams', '$rootScope', '$http', '$anchorScroll'

		, function ($scope,  $log, $state, $stateParams, $rootScope, $http, $anchorScroll) {
	
}])
.controller('LoginCtrl', ['$scope', '$http', 'LoginService', function($scope, $http, LoginService){
	$scope.loginForm = {
		username: {
			type: "text",
			value: "",
			label: "Username"
		},
		password: {
			type: "password",
			value: "",
			label: "Password"
		}
	}
	$scope.login = function(){
		if ($scope.loginForm.username.value != "" && $scope.loginForm.password.value != "" && $scope.loginForm.password.value.length > 6) {
			LoginService.login($scope.loginForm.username.value, $scope.loginForm.password.value).then(function(bool){
				if (bool) {
					$state.go("app.products")
				}
			})
		}
	}
}])
.controller('ProductCtrl', ['$scope', '$http', 'ProductService', function($scope, $http, ProductService){
	$scope.startIndex = 0;
	$scope.pageTotal = 10
	ProductService.textSearch("", $scope.startIndex, $scope.pageTotal).then(function(){

	})
	$scope.getProductResults = function(text){
		return ProductService.textSearch("", $scope.startIndex, $scope.pageTotal).then(function(){
			$scope.searchResults = data
		})
	};
	$scope.nextPage = function(){
		$scope.startIndex += $scope.pageTotal;
		$scope.getProductResults($scope.searchText)
	};
	$scope.imgTransform = function(input, x, y){
		  if (x && y) {
	         return input + "&width=" + x + "&height=" + y
	       } else {
	        return  input
	       };
	};
}])

angular.module('neocles.directives',[])
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

angular.module('neocles.filters', [])

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


angular.module('neocles.services', [])
.factory('LoginService', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q){
	var tokenCache = $cacheFactory('token');
	function login(username, pword){
		var deferred = $q.defer();
		var req = {
			"url":"https://epicuroapitest.azurewebsites.net/token?grant_type=password&username=" + username + "&password=" + pword,
			"method": "POST"
		};
		$http(req).then(function(response){
			if (response && response.data) {
				debugger
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
			
		})
		return deferred.promise;
	};
	function getToken(){
		var deferred = $q.defer();
		var token = tokenCache.get('token');
		if (token) {
			deferred.resolve(token);
		} else {
			deferred.reject(false);
		}
		return deferred.promise;
	}
	return {
		login: function(username, pword){
			return login(username, pword)
		},
		getToken : function(){
			return getToken();
		}
	};
}])
.factory('ProductService', ['$http', '$cacheFactory', '$q', 'LoginService', function($http, $cacheFactory, $q, LoginService){
	var productCache = $cacheFactory('products');
	
		var token = "";
	
		function textSearch(text, start, num){
			var deferred = $q.defer();
			LoginService.getToken().then(function(token){
				var token = token;
	
				var req = {
					"url": "https://epicuroapitest.azurewebsites.net/api/products/" + token + "?q=" + text + "&start=" + start + "&num=" + num + "&type=now",
					"method": "POST"
				};
				$http(req).then(function(response){
					if (response && response.data) {
						
						deferred.resolve(response.data);
					} else {
						deferred.resolve(false);
					}
					
				})
			})
			return deferred.promise;
		}

	return {
		textSearch: function(text, start, num){
			return textSearch(text, start, num)
		},
		getToken : function(){
			return getToken();
		}
	};
}])
if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}
angular.module('neocles.vrctrl', ['neocles.services'])
.controller('VrAppCtrl', ['$scope', 'MediaService', '$log', '$state', '$stateParams', '$rootScope', '$http', '$anchorScroll', '$location', '$mdMedia', '$mdDialog', '$timeout', '$geolocation', '$firebaseObject', '$firebaseArray', '$translate', 'User', '$mdToast', 'Auth', '$mdSidenav', '$mdDialog', '$sce', '$interval', 'deviceDetector', 'subdomain', 'InfoService'

		, function ($scope, MediaService, $log, $state, $stateParams, $rootScope, $http, $anchorScroll, $location, $mdMedia, $mdDialog, $timeout, $geolocation, $firebaseObject, $firebaseArray, $translate, User, $mdToast, Auth, $mdSidenav, $mdDialog, $sce, $interval, deviceDetector, subdomain, InfoService) {
			var ref = firebase.database().ref();

			InfoService.filterProds().then(function(data){
				$scope.products = data;
				$scope.loadWorld();
			})
			// $scope.recfilters = [{icon: "assets/site/cat_clubs_btn.svg",text:"club"}, {icon: "assets/site/cat_bars_btn.svg",text:"bar"}, {icon: "assets/site/cat_restaurants_btn.svg",text:"restaurant"}, {icon: "assets/site/cat_shops_btn.svg",text:"shop"}]
			$scope.filters = [{icon: "assets/site/cat_guidedtours_btn.svg",text:"tours"}, {icon: "assets/site/cat_rentanything_btn.svg",text:"rentals"}, {icon: "assets/site/cat_activities_btn.svg",text:"activities"}, {icon: "assets/site/cat_sights_btn.svg",text:"sights"}];
			$firebaseArray(ref.child("media").orderByChild("vr")).$loaded(function(data){
				$scope.spheres = data;
			})
			$scope.showProd = function(id){

			};
			function latlng(sin){

				switch(sin){
					case 0:
						return {lat: -40, lng: 0}
					break;
					case 1:
						return {lat: 40, lng: 120}
					break;
					case 2:
						return {lat: -40, lng: 240}
					break;
					case 3:
						return {lat: 40, lng: 0}
					break;
				}
			}

			$scope.loadWorld = function () {
				var sphere_markers = [];
				var lng = 0;
				angular.forEach($scope.filters, function(filt){
					sphere_markers.push({
										      id: filt.text,
										      longitude: lng,
										      latitude: -0.13770,
										      image: filt.icon,
										      width: 150,
										      height: 150,
										      anchor: 'center center',
										      // tooltip: 'A image marker. <b>Click me!</b>',
										      // content: document.getElementById('lorem-content').innerHTML
										    })
					lng += 70;
				})
				// if (!vr) {
				// 	// vr = "assets/site/sights.jpg"
				// 	vr = 
				// }

				$scope.vrbgViewer = new PhotoSphereViewer({
					panorama: "assets/vr/activities_sphere.jpg"
					, container: 'vrbg'
					
					,anim_speed: '0.5rpm'
					, navbar: false
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, gyroscope: true
					, usexmpdata: true
					, auto_rotate: false
					// ,sphere_segments: 16
					// ,loading_img: "https://assets.tktr.es/assets/tktreu_p_logo.png"
					
					,loading_img: "https://assets.tktr.es/assets/tktreu_p_logo.png"
					, transition: {
						duration: 1500
						, loader: true
						, blur: true
					},
					markers: sphere_markers
					// onready: $scope.loaded()
					, navbar_style: {
						backgroundColor: 'rgba(58, 67, 77, 0.7)'
					}
				});
				$scope.vrbgViewer.on('select-marker', function(marker) {
					  $state.go("vrapp.cat", {tag: marker.id})
					});
			
			}
}])
.controller('VrCatCtrl', ['$scope', '$geolocation', '$http', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdpDatePicker', '$mdSidenav', '$mdpTimePicker', '$timeout', '$rootScope', 'AdminTools', '$sce', '$mdMedia', 'Stock', '$translate', 'DateParser', 'ProductsService', 'InfoService', 'PackageService', 'User'

	, function ($scope, $geolocation, $http, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav, $mdpDatePicker, $mdpTimePicker, $timeout, $rootScope, AdminTools, $sce, $mdMedia, Stock, $translate, DateParser, ProductsService, InfoService, PackageService, User) {

			$scope.loadCat = function(cat) {
				$scope.vrbgViewer.clearMarkers();
		
					var vrurl =  "assets/site/" + cat + ".jpg"
					
				
				var cat_markers = [];
				InfoService.getCat(cat).then(function(data){
					$scope.category = data;
					// var lat = 10;
					// var lng = 0;
					// var revs = 0;
					// var viewlng = 0;
					// if (lng > 90) {
					// 	viewlng = lng % 90
					// } else {
					// 	viewlng = lng
					// }
					var xax = 0
					console.log(data)
					angular.forEach(data, function(item){
					
						if (item.wide_branding) {
							var markerObj = $scope.vrbgViewer.addMarker({
							  id: item.$id,
							  image: item.wide_branding,
							  width: 300,
							  height: 150,
							  // latitude: 0.13770,
							  // longitude: lng ,
							  x: xax,
							  y: 1000,
							  content: "<p>" + item.tag + "</p>"
							}, false);
							// lng += 2 / data.length
							xax += 2048/data.length
						} else {
							console.log(item)
						}
						
						// switch(lng){
						// 	case 0:
						// 		lat * -1;
						// 		lng += 120;
						// 	break;
						// 	case 120:
						// 		lat * -1;
						// 		lng += 120;
						// 	break;
						// 	case 240:
						// 		lat * -1;
						// 		lng = 0;
						// 		revs += 1
						// 	break;
						// 	case 360:
						// 		lat * -1;
						// 		lng += 120;
						// 	break;
						// }
						
						// lng += 120;
						
						
					})
				})
				$scope.vrbgViewer.setPanorama(
				  vrurl,
				  {
				    longitude: Math.PI,
				    latitude: 0
				  },
				  true
				);
				$scope.vrbgViewer.render();
				$scope.vrbgViewer.on('select-marker', function(marker) {
					 $state.go('vrapp.info', {id: marker.id})
				});
			};
			$scope.loadCat($stateParams.tag);
}])
.controller('VrProdCtrl', ['$scope', '$geolocation', '$http', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdpDatePicker', '$mdSidenav', '$mdpTimePicker', '$timeout', '$rootScope', 'AdminTools', '$sce', '$mdMedia', 'Stock', '$translate', 'DateParser', 'ProductsService', 'InfoService', 'PackageService', 'User'

	, function ($scope, $geolocation, $http, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav, $mdpDatePicker, $mdpTimePicker, $timeout, $rootScope, AdminTools, $sce, $mdMedia, Stock, $translate, DateParser, ProductsService, InfoService, PackageService, User) {
			$scope.vendorFilter = {};
			$scope.ymlFilter = {};
			if (!$scope.prodView) {
				$scope.prodView = true;
			}
			// $scope.evBool = true;
			var ref = firebase.database().ref();
			$scope.paramKey;
			$scope.init = function(id){
				$scope.paramKey = id;
			}
			
			
			if ($stateParams.id) {
				$scope.paramKey = $stateParams.id;
			}

	
			$scope.ivView = 'info';
			$scope.iHudUp = function(code){
				
				$scope.ivView = code;
			}
			$scope.ivMediaBool = true;
			$scope.launchMedia = function(code){

			}
			User.anonAdsArrival().then(function(data){
				
				$scope.user = data.profile;
				$scope.auth = data.auth;
			})
			
			$scope.info = {};
			// $scope.gotoAnchor('view');
			var geoRef = firebase.database().ref("geofire/locs")
			var geoFire = new GeoFire(geoRef);
			$scope.buyNow = false;
			$scope.showBuy = function(){
				$scope.buyNow = !$scope.buyNow;
			}
		// if (!$scope.user && $scope.uid) {
			
		// 	$firebaseObject(ref.child("profiles").child($scope.uid)).$loaded( function(data){
		// 		$scope.user = data;
		// 		if (!$scope.user.location) {
		// 			$scope.user.location = {}
		// 		}
		// 		$geolocation.getCurrentPosition({
		// 				timeout: 60000
		// 			}).then(function (position) {
		// 				$scope.user.location.lat = position.coords.latitude;
		// 				$scope.user.location.lng = position.coords.longitude;
		// 				$scope.user.location.location = [position.coords.latitude, position.coords.longitude];
		// 				$scope.userLoc = [position.coords.latitude, position.coords.longitude];
						

		// 			});
		// 	})
			
		// 	}
			$scope.productFadeImg = {


				}
		$scope.affOpts = [];
		if ($scope.paramKey) {
			$scope.affOpts = [];
				// $firebaseObject(ref.child("info/" + $scope.paramKey)).$loaded(function (data) {
				InfoService.getInfo($scope.paramKey).then(function (data) {
				$scope.info = data;
				
				if (data.aff_tix) {
					
					angular.forEach(data.aff_tix, function(obj, prov){

						if (prov == "viator") {
							angular.forEach(obj, function(bool, key){
								
								ref.child("affiliates").child(prov).child("products").child(key).once('value', function(snap){
									var vobj = snap.val();
									vobj.provider = prov;
									$scope.affOpts.push(vobj);
									
								})
							})
						} else {
							angular.forEach(obj, function(link, key){
							
							ref.child("affiliates").child(prov).child(key).once('value', function(snap){
								
								if (snap) {

								var vobj = snap.val();
								vobj.provider = prov;
								$scope.affOpts.push(vobj);
								
								}
							
							})
						})
						}
						
						
					})
				}
				$translate(data.name).then(function(name){
					
					
						$scope.infoName = name;
						// console.log($scope.infoName.length)
				
					
				}, function(err){

					$scope.infoName = data.name;
					// console.log($scope.infoName.length)
				})
				var tagFilter;
				var catortag;
				if (data.tag == 'recs' && data.cat) {
					catortag = "cat";
					tagFilter = data.cat;
					$scope.ymlFilter = { tag: "recs", cat: tagFilter};
				} else {
						catortag = "tag";
					tagFilter = data.tag
					$scope.ymlFilter = { tag: tagFilter};
				}
				$scope.productFadeImg = "background: url('" + $scope.info.wide_branding + "'); background-size: 100% 100%; background-repeat: no-repeat; opacity: 0.5; background-size: cover; background-position: left;"
				// var list = $firebaseArray(ref.child("info").orderByChild(catortag).equalTo(tagFilter))
			// list.$loaded(function (dataArr) {
			ProductsService.getCategory(tagFilter).then(function (dataArr) {
				$scope.displayArray = dataArr;
				$timeout(function(){
					window.prerenderReady = true;
				}, 3000);
			})
			$scope.ymlFilter.tag = $scope.info.tag;
			if ($scope.info.tag == 'recs'){
				$scope.ymlFilter = { tag: "recs", cat: $scope.info.cat}
			}
			$scope.vendorFilter.vendor = $scope.info.vendor;
				$scope.search = {};
				if ($scope.info && $scope.info.tag == 'recs') {
					$scope.search.cat = $scope.info.cat;
					$scope.search.tag = 'recs';
					// $timeout(function(){
					// 		$scope.loaded();
					// }, 200);
					//initRecData()
				}
				else if ($scope.info && $scope.paramKey){
					// console.log("using" + $scope.paramKey)
					
					// $firebaseArray(ref.child("packages/" + $scope.paramKey)).$loaded(function (data) {
					PackageService.getPackages($scope.paramKey).then(function (data) {
				
						$scope.packages = data;
						// console.log(data);
						// if ($scope.packages.length < 2) {
						// 	$scope.builder($scope.packages[0])
						// }
					})
					}
					$scope.search = {
						tag: $scope.info.tag
					};
					// $timeout(function(){
					// 	$scope.loaded();	
					// }, 200);
				})
			}

			$scope.timeCheck = function(day){
				
				if(day){
					var dayKey = moment(day).format("YYYY-MM-DD");
					$scope.build.date = dayKey;
					$scope.times = Object.keys($scope.buildStatStock[dayKey]);
				}
				else if ($scope.builderDate && $scope.buildStatStock) {
					var dayKey = moment($scope.builderDate).format("YYYY-MM-DD");
					$scope.build.date = dayKey;
					$scope.times = Object.keys($scope.buildStatStock[dayKey]);
				} else {
					 $scope.times = [];
				}
			}
			$scope.setTime = function(time, check){
				// $scope.checkStatic();
				
				$scope.build.time = time;
				if (check) {
					$scope.checkStatic();
				}
				
				
			}
			$scope.timeEnqCheck = function(){

				if ($scope.enquireObj.date) {
					var dayKey = moment($scope.enquireObj.date).format("YYYY-MM-DD")
					$scope.times = Object.keys($scope.buildStatStock[dayKey]);
				} else {
					return $scope.times = [];
				}
			}
				
				// geoFire.get($scope.uid).then(function(location){
				// 	if (location) {
				// 		$scope.user.location.location = location;
				// 	}
				// })
			$scope.selTime = function(key){
				if ($scope.buildStatStock && $scope.build.date) {
					var dKey = moment($scope.build.date).format("YYYY-MM-DD");
					if ($scope.buildStatStock[dKey][key].available > 0) {
						$scope.build.time = key;
					} else {
						$mdToast.show($mdToast.simple().textContent('Unavailable!'));
					}
				} else {
					$mdToast.show($mdToast.simple().textContent('Unavailable!'));
				}
				$scope.build.time = key;
			}
			$scope.filterTimes = function(date){
				var results = [];
				angular.forEach($scope.times, function(data){
					if (moment(data.mnt).isSame(moment(date), 'day')) {
						results.push(data);
					}
				})
				
				$scope.times = results;
			}
			$scope.buildTimes = function(){
				if ($scope.build.date && $scope.buildStatStock) {
					var dKey = moment($scope.build.date).format("YYYY-MM-DD");
					return $scope.buildStatStock[dKey]
				} else {
					return {}
				}
			}
			$scope.prettyDate = function(){
				if ($scope.build.date) {
					var date = moment($scope.build.date).clone().format("YYYY-MM-DD");
					if ($scope.build.time.length > 6 ) {
						
						return moment($scope.build.date).clone().format("lll");
					} else{
					var tArr = $scope.build.time.split("-");
					
					return moment($scope.build.date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
					}
				}
			};
			
			$scope.gallery = []
			$scope.distance = function () {

				if ($scope.info && $scope.info.location && $scope.userLoc){

					return GeoFire.distance([$scope.info.location.lat, $scope.info.location.lng], $scope.userLoc)
				}
			}
			$scope.builderDate = new Date();
			// $scope.$watch('builderDate', function(nv, ov){
			// 	if (nv != ov) {
			// 		$scope.timeCheck($scope.builderDate);
					
			// 	}
			// })
			$scope.todayDate = new Date();
			$scope.minDate = new Date(
		      $scope.todayDate.getFullYear(),
		      $scope.todayDate.getMonth(),
		      $scope.todayDate.getDate());

			$scope.maxDate = new Date(
			      $scope.todayDate.getFullYear(),
			      $scope.todayDate.getMonth() + 8,
			      $scope.todayDate.getDate());

			$scope.todayFormat = moment().clone().subtract(1,'days').format("YYYY-DD-MM");
			function initRecData() {
				var pyrmont = {
					lat: $scope.info.location.lat
					, lng: $scope.info.location.lat
				};
				map = new google.maps.Map(document.getElementById('nomap'), {
					center: pyrmont
					, zoom: 15
				});
				var service = new google.maps.places.PlacesService(map);
				service.getDetails({
					placeId: $scope.info.placeid
				}, function (place, status) {

					if (status === google.maps.places.PlacesServiceStatus.OK) {
						$scope.placeData = place;
						// var photo = place.photos[0].getUrl()
						// console.log(place)
						AdminTools.updateRec(place, $scope.paramKey);
					}
				})
			}

			$scope.vrGrow = function (key) {
				if (key == $scope.vrId) {
					return 4
				}
				else {
					return 1
				}
			}

			$scope.vrId = "";
			$scope.explNow = function(){
				$scope.explView = !$scope.explView;
			}
			$scope.growVR = function (k) {
				$scope.vrId = k;
			}
			$scope.vrGal = [];
			$scope.explView = true;
			$scope.vrURL = function (url) {
				// console.log("./vrview/index.html?image=" + url)
				return "./vrview/index.html?image=" + url
			}
			$firebaseObject(ref.child("profiles/" + $scope.appAuth.uid)).$loaded(function (data) {
				$scope.user = data
			})
			$scope.gvrs = []
			$scope.enqDate = function(){
				if ($scope.enquireObj.date && $scope.enquireObj.time) {
					var date = moment($scope.enquireObj.date).clone().format("YYYY-MM-DD");
					if ($scope.enquireObj.time.length > 6 ) {
						
						return moment($scope.enquireObj.date).clone().format("lll");
					} else{
					var tArr = $scope.enquireObj.time.split("-");
					
					return moment($scope.enquireObj.date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
					}
				}
			};

			$scope.enquireObj = {};
			
			$scope.enquireBuild = function () {

					$scope.enquireObj.location = $scope.info.location;
				
				var item = $scope.packages[0];
				var pkey = $scope.packages[0].$id;
				$scope.times = [];
				$scope.enquireObj = {};
				var product = $scope.info;
				
				angular.forEach(product, function (value, key) {
					$scope.enquireObj[key] = value;
				})
				if ($scope.user) {
					if ($scope.user.name != " ") {
						$scope.enquireObj.username = $scope.user.name;
					}
					if ($scope.user.email) {
						$scope.enquireObj.email = $scope.user.email;
					}
					
				}
				$scope.enquireObj.date = null;
				

				$scope.enquireObj.time = null;
				$scope.enquireObj.pid =  $scope.info.$id;
				$scope.enquireObj.parent = product.$id;
				
				
				
				
				
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					var date = moment().format("YYYY-MM-DD")
						
						$firebaseObject(ref.child("static_stock/" + $scope.info.$id).orderByKey().startAt(date).limitToFirst(20)).$loaded(function (data) {
						$scope.enqSS = data;
						
						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							// if (moment(k).isAfter()) {

							// }
							$scope.validDates[k] = true;
							$scope.times = [];
							var key1 = k;
							
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										
										if(v2){
											var cQ = key1 + " " + k2;


											if (moment(cQ).isAfter()) { 
												// console.log(cQ)
												$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
											}
										}
										
									})
								} else {
									$scope.times = [{key: "00-00"}];
								}
								})
					})
				
				
			};
			$scope.enquireVBuild = function (parentKey) {
				
				$scope.enquireObj.location = product.location;
				
				var item = $scope.packages[0];
				var pkey = $scope.packages[0].$id;
				$scope.times = [];
				$scope.enquireObj = {};
				var product = $scope.info;
				
				angular.forEach(product, function (value, key) {
					$scope.enquireObj[key] = value;
				})
				if ($scope.user) {
					if ($scope.user.name != " ") {
						$scope.enquireObj.username = $scope.user.name;
					}
					if ($scope.user.email) {
						$scope.enquireObj.email = $scope.user.email;
					}
					
				}
				$scope.enquireObj.date = null;
				

				$scope.enquireObj.time = null;
				$scope.enquireObj.pid =  $scope.info.$id;
				$scope.enquireObj.parent = product.$id;
				
				
				
				
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					var date = moment().format("YYYY-MM-DD")
						
						$firebaseObject(ref.child("static_stock/" + parentKey).orderByKey().startAt(date).limitToFirst(20)).$loaded(function (data) {
						$scope.enqSS = data;
						
						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							// if (moment(k).isAfter()) {

							// }
							$scope.validDates[k] = true;
							$scope.times = [];
							var key1 = k;
							
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										
										if(v2){
											var cQ = key1 + " " + k2;


											if (moment(cQ).isAfter()) { 
												// console.log(cQ)
												$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
											}
										}
										
									})
								} else {
									$scope.times = [{key: "00-00"}];
								}
								})
					})
				
				
			};
			$scope.enqNow = function(id){
					$scope.enquireObj.sending = true;
					if ($scope.enquireObj.date && $scope.enquireObj.time) {
					var date = moment($scope.enquireObj.date).clone().format("YYYY-MM-DD");
					if ($scope.enquireObj.time.length > 6 ) {
						
						$scope.enquireObj.date = ($scope.enquireObj.date).clone().format("lll");
					} else{
					var tArr = $scope.enquireObj.time.split("-");
					
						$scope.enquireObj.date = moment($scope.enquireObj.date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
					}
				}
			
					$firebaseArray(ref.child("enqs")).$add($scope.enquireObj).then(function(data){
						// console.log(data)
						var req = {
								"method": "POST"
								,
								"url" : "https://www.pbpapi.com/tktr/" + $scope.enquireObj.vendor + "/enquire",
								// "url" : "https://176a0405.ngrok.io/tktr/" + $scope.enquireObj.vendor + "/enquire",
								"data": {
									"uid": $scope.appAuth.uid,
									"enquiry": $scope.enquireObj
								},
								 "dataType": 'json',
								 "headers": {
							        "Content-Type": "application/json"
							    }
							}
							$http(req).then(function (response) {
								$scope.enquireObj.sent = true;
								$scope.enquireObj = {};
								$timeout(function(){
									$scope.enquireObj.sending = false;
								}, 5000);
							}, function (err) {
								
							})
							ref.child("profiles").child($scope.appAuth.uid).child("name").set($scope.enquireObj[id]["username"])
						ref.child("profiles").child($scope.appAuth.uid).child("email").set($scope.enquireObj[id]["email"])
					
					})
		
		}
				
			$scope.vendorNumber = function(id){
				ref.child("info").child(id).child("phone").on('value', function(snap){
					return snap.val()
				})
			}
			// $firebaseObject(ref.child("media/" + $scope.paramKey)).$loaded(function (data) {
			// 	$scope.media = data;
			// 	// $scope.gallery.push(data.branding)
			// 	var wbrand = {
			// 		url: data.wide_branding
			// 	}
			// 	$scope.gallery.push(wbrand)
			// 	angular.forEach(data.images, function (value, key) {
			// 		value.id = key;
			// 		$scope.gallery.push(value)
			// 		$scope.centerImg = $scope.gallery[0];
			// 	})
			// 	angular.forEach(data.gvr, function (value, key) {
			// 		obj = value;
			// 		obj.id = key;
			// 		obj.url = $sce.trustAsResourceUrl(value.url)
			// 		$scope.gvrs.push(obj)
			// 	})
				// console.log($scope.gallery)
			// 	angular.forEach(data.vr, function (value, key) {
			// 		value.id = key;
			// 		$scope.vrGal.push(value)
					// console.log($scope.vrGal)
			// 	})
			// 	if ($scope.vrGal[0]) {
			// 		$scope.loadVR($scope.vrGal[0]);
			// 	}
			// })
			$scope.avalnow = function(){
				var str1 = moment($scope.build.date).format('YYYY-MM-DD');
				var str2 = moment($scope.build.time).format('HH-mm');

				if ($scope.buildStatStock[str1] && $scope.buildStatStock[str1][str2] && $scope.buildStatStock[str1][str2].available) {
					return $scope.buildStatStock[str1][str2].available
				} else if ($scope.buildStatStock[str1] && !$scope.buildStatStock[str1][str2] && $scope.buildStatStock[str1].available) {
					return $scope.buildStatStock[str1].available
				}
			}
			$scope.myState = function (id) {
				return paramKey == id;
			}
			$scope.sphereMode = false;
			$scope.sphereIndex = 0;

			$scope.loadVR = function (vr) {
				var PSV = new PhotoSphereViewer({
					panorama: vr.url
					, container: 'viewer'
					, loadingImg: $scope.partner.logo
					, time_anim: false
					, navbar: true
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, usexmpdata: false
					, gyroscope: true
					, auto_rotate: false
					, transition: {
						duration: 1500
						, loader: true
						, blur: false
					}
					, navbar_style: {
						backgroundColor: 'rgba(58, 67, 77, 0.7)'
					}
				});
			}
			$scope.loadImg = function (img) {
				$scope.centerImg = img;
			}
			$firebaseObject(ref.child("ticketing/" + $scope.paramKey)).$loaded(function (data) {
				$scope.ticketing = data;
			})
			$scope.expand = false;
			$scope.checkStatic = function(){
				

				Stock.checkStatic($scope.build).then(function(resp){
					// console.log(resp)
					if (resp) {
						$scope.build.greenlit = 1;} else {
							$scope.build.greenlit = 2;
						}
				})
			};
			$scope.numbArray = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19]
			$scope.build = {};
			$scope.buildPack = function (id) {
				$scope.buildPack = $scope.packageData[id][id];
				$scope.buildPack.quantity = $scope.build.quantity;
			}
			$scope.surgeBool = function(){
				var bool = false;
				if ($scope.build && $scope.build.date && $scope.build.weekend_charge) {
					var ord =  moment($scope.build.date).day();
				
					angular.forEach($scope.build.weekend_charge.days, function(value, key){
					
					if (value == ord) {
						bool = true;
					}
				})
				}
				
				return bool
			}
			$scope.tObj = {};
			var date = moment().format('YYYY-MM-DD');
		
			$scope.packBuy = function(pack){
				$scope.ivView = "buy";
				$scope.builder(pack);
			}
			$scope.packVBuy = function(){
				$scope.ivView = "buy";
				$scope.builderVaya();
			}
			$scope.dOpts = [];
			$scope.builder = function (itemObj) {
				// console.log(itemObj)
				var item;
				if (!itemObj.name && itemObj.val) {
					item = itemObj.val;
				} else {
					item = itemObj
				}
				console.log(item)
				$scope.times = [];
				$scope.build = {};
				angular.forEach(item, function (value, key) {
					$scope.build[key] = value;
				})
				
				$scope.build.date = null;
				$scope.build.time = null;
				$scope.build.pid = item.$id;
				$scope.build.parent = $stateParams.id;
				if ($scope.build.weekend_charge) {
					$scope.build.quantity = 1;
				}
				
				$scope.buildStatStock = {};
				$scope.build.greenlit = 0;
				$scope.tObj = {};
				var date = moment().format('YYYY-MM-DD');
				if (!$scope.build.tktrpack && !$scope.build.ticket) {
					// $firebaseArray(ref.child("dates/" + item.parent)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + $stateParams.id).orderByKey().startAt(date)).$loaded(function (data) {
						$scope.buildStatStock = data;
						
						

						angular.forEach(data, function(v, k){
							$scope.tObj = {
								k: []
							};
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.dOpts.push(moment(k).format("ll"))
					
							
							// var key1 = k;
						
							// if (!v.capacity || v.capacity == undefined) {
					
							// 	angular.forEach(v, function(v2, k2){
							// 			if(v2){
							// 				var cQ = key1 + " " + k2;
							// 				if (moment(cQ).isAfter()) {
							// 				$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
							// 				$scope.tObj[k].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
							// 			}
							// 			}
										
							// 		})

							// 	} else {
							// 		$scope.noTimeBool = true;
							// 		$scope.times = [{key: "00-00"}];
							// 	}
								})
					})
				}
				 if ($scope.build.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + $stateParams.id).orderByKey().startAt(date)).$loaded(function (data) {
						$scope.buildStatStock = data;
						// console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){

								if(v2 ){
									var cQ = key1 + " " + k2;
										if (moment(cQ).isAfter()) {
											$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
										}
									
								}
								
							})
						} else {
							$scope.noTimeBool = true;
							$scope.times = [{key: "00-00"}];
						}
						})
					})

				}
			}
			
			$scope.clearBuild = function(){
				$scope.build = null;
			};
			$scope.tempDate = {};
			$scope.stops = [ "junta", "rraval"];
			$scope.builderVaya = function () {
				$scope.times = [];
				$scope.build = {};
	
				var item = $scope.packages[0];
				var pkey = $scope.packages[0].$id;
				angular.forEach(item, function (value, key) {
					$scope.build[key] = value;
				})
				$scope.build.date = $scope.tempDate.date;
				$scope.build.time = null;
				$scope.build.pid = pkey;
				$scope.build.parent = item.parent;
				
				$scope.build.greenlit = 0;
				// console.log($scope.build)
				// if (item.stops) {
				// 	$scope.stops = [];
				// 	angular.forEach(item.stops, function(value, key){
				// 		var obj = value;
				// 		obj.key = key;
				// 		$scope.stops.push(obj);
				// 	})
				// }
				var date = moment().format("YYYY-MM-DD");
				if (!$scope.build.tktrpack && !$scope.build.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })

					$firebaseObject(ref.child("static_stock/" + item.parent).orderByKey().startAt(date)).$loaded(function (data) {
						$scope.buildStatStock = data;
						// console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
						
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											if (moment(cQ).isAfter() && moment(cQ).isSame(moment($scope.build.date), 'day')) {
											$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
										}
										}
										
									})
								} else {
									$scope.times = [{key: "00-00"}];
								}
								})
					})
				}
				 if ($scope.build.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + item.parent).orderByKey().startAt(date)).$loaded(function (data) {
						$scope.buildStatStock = data;
						// console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
						
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){
								if(v2 ){
									var cQ = key1 + " " + k2;
									if (moment(cQ).isAfter() && moment(cQ).isSame(moment($scope.build.date))) {
											$scope.times.push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
										}
								}
								
							})
						} else {
							$scope.noTimeBool = true;
							$scope.times = [{key: "00-00"}];
						}
						})
					})

				}
			}
			$scope.checkStock = function(){
				Stock.checkStock($scope.build).then(function(data){
					if(data){
						$scope.build.stock = data;
						$scope.build.greenlit = true;
						// console.log($scope.build.stock);
					}
				}).catch(function(err){
					$scope.build.time = null;
					$scope.build.quantity = null;
					alert(err);
				})
			}
			$scope.validDates = {};
			$scope.today = moment().format('YYYY-MM-DD');
			$scope.validate = function (date) {
				var key = moment(date).format('YYYY-MM-DD')
				
				return !$scope.validDates[key];
			}
			$scope.times = [];
			$scope.checkDay = function (time) {
				return moment(time).isSame($scope.build.date, 'day')
			}
			$scope.indexShift = function (val) {
				var newindex = $scope.showIndex + val;
				if (newindex > $scope.gallery.length - 1) {
					$scope.showIndex = 0;
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.gallery.length - 1
				} else {
					$scope.showIndex = newindex;
				};
			}
			$scope.showIndex = 0;
			$scope.prettyTime = function (time) {
					var timeObj = time.split('-');
					var newTime = timeObj[0] + ":" + timeObj[1]
					return newTime
				}


			$scope.mediaFilter = {};
			$scope.currentDate = Date();
			$scope.selectDay = function (ev) {
				$mdpDatePicker($scope.currentDate, {
					targetEvent: ev
				}).then(function (selectedDate) {
					$scope.build.date = moment(selectedDate).format('YYYY-MM-DD');
					// $scope.times = $scope.ticketing[$scope.build.date]
				});;
			}
			$scope.selectBVaya = function (ev) {
				$mdpDatePicker($scope.currentDate, {
					targetEvent: ev
				}).then(function (selectedDate) {
					$scope.tempDate.date = moment(selectedDate).format('YYYY-MM-DD');
					$scope.builderVaya()
					// $scope.times = $scope.ticketing[$scope.build.date]
				});;
			}
			$scope.showTimePicker = function (ev) {
				$mdpTimePicker($scope.currentTime, {
					targetEvent: ev
				}).then(function (selectedDate) {
					var key = moment(selectedDate).format('HH-mm');
					if ($scope.ticketing[$scope.build.date][key]) {
						$scope.build.time = key;
					}
					else {
						$scope.showTimePicker(ev);
					}
					// console.log($scope.build)
				});;
			}
			$scope.imgIndex = 0;
			$scope.addToCart = function () {

				// console.log($scope.build)
				Cart.addItem($scope.build);
				$scope.clearBuild();
			}
}])