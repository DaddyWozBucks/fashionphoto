angular.module('tktr', ['tktr.controllers'
      , 'tktr.services'
      , 'tktr.directives'
      , 'tktr.filters'
      , 'ui.router'
      , 'ngAnimate'
      , 'ngSanitize'
      , 'firebase'
      , 'ngMaterial'
      , 'angular-storage'
      , 'ngGeolocation'
	 , 'uiGmapgoogle-maps'

      , 'ja.qr'
      , 'ngFileUpload'
  
      , '720kb.socialshare'
     
      , 'pascalprecht.translate'
            , 'qrScanner'
            , "mdPickers",
						'jkAngularRatingStars'
     
	,
	'chart.js'

  ]).run(function ($state, $rootScope) {
	// $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
	//   if (toState.changeColor) {
	//     $rootScope.changeColor = true;
	//     $rootScope.art_nav = true;
	//   } else {
	//     $rootScope.changeColor = false;
	//     $rootScope.art_nav = false;
	//   }
	// });
}).run(["$rootScope", "$state", function ($rootScope, $state) {
	$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
		// We can catch the error thrown when the $requireSignIn promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			$state.go("app.landing");
		}
	});
	
}]).run(['$anchorScroll', function ($anchorScroll) {
	// $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]).config(function () {
	var config = {
		// apiKey: "AIzaSyBuD3H897xaN-khFT8iG08yz00jmh5aTTQ",
  //   authDomain: "tktr-za.firebaseapp.com",
  //   databaseURL: "https://tktr-za.firebaseio.com",
  //   storageBucket: "tktr-za.appspot.com",
  //   messagingSenderId: "951271058800"
		apiKey: "AIzaSyCocsnJIAT1IDv0Q0-nmxpLfAtTAMvvxWQ"
		, authDomain: "tktr-fa4cf.firebaseapp.com"
		, databaseURL: "https://tktr-fa4cf.firebaseio.com"
		, storageBucket: "tktr-fa4cf.appspot.com"
	, };
	firebase.initializeApp(config);
}).config(['$translateProvider', function ($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix: 'https://tktr-fa4cf.firebaseio.com/translations/'
		, suffix: '.json'
	}).preferredLanguage('en').useMissingTranslationHandlerLog().useSanitizeValueStrategy('escape');
}]).config(function ($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self'
    , // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://tktr-fa4cf.firebaseio.com/**',
		'https://google.com/maps/embed/**'
    , "**tktr-fa4cf.appspot.com"
     , "**glaring-fire-7161.appspot.com"
    , 'https://*.tktr.eu/**',
		'https://api.tolq.com/v1/translations/requests/quote'
  ]);
}).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	// $locationProvider.html5Mode(true, false);
	$stateProvider
		.state('lodge', {
			url: '/lodge/:partner'
			, abstract: true
			, views: {
				"header": {
					templateUrl: function (params) {
						// return "templates/" + params.partner + ".html"; }, controller: "AppCtrl" }
						return "templates/app.html";
					}
					, controller: "AppCtrl"
				}
			}
		}).state('app', {
			url: '/app/:partner'
			, abstract: true
			, views: {
				"header": {
					templateUrl: function (params) {
						// return "templates/" + params.partner + ".html"; }, controller: "AppCtrl" }
						return "templates/app.html";
					}
					, controller: "AppCtrl"
				}
			}
		}).state('app.home', {
			url: '/home'
			, views: {
				"main": {
					templateUrl: "templates/home.html"


					, controller: "HomeCtrl"
				}
				, "side": {
					templateUrl:"templates/ticket.side.html"
					
					, controller: "TicketSideCtrl"
						
				},
				"sideview": {
					templateUrl: "templates/socialview.html"
					, controller: "HomeCtrl"
				}
			}
		}).state('app.home.store', {
			url: '/store'
			, views: {
				"homeview": {
					templateUrl: "templates/home.store.html"
					// , controller: "HomeCtrl"
				},
				"sideview": {
					templateUrl: "templates/socialview.html"
					// , controller: "HomeCtrl"
				},  
				"side": { 
					templateUrl: "templates/ticket.side.html",
				 controller: "TicketSideCtrl" }
			}
		}).state('app.home.partner', {
			url: '/'
			, views: {
				"homeview": {
					templateUrl:  function ($stateParams) {
						if ($stateParams.partner === "tktr" || $stateParams.partner === "vaya" || $stateParams.partner === "portal") {
							return "templates/" + $stateParams.partner + ".home.html"
						}
						else {
							return "templates/home.partner.html"
						}
					}
					, controllerProvider: function ($stateParams) {
						if ($stateParams.partner == 'tktr') {
							return "TktrHomeCtrl"
						}
						else if ($stateParams.partner == 'vaya') {
							return "VayaCtrl"
						}
						else {
							return "HomeCtrl"
						}
					}
				},
				"sideview": {
					templateUrl:  function ($stateParams) {
						if ($stateParams.partner === "tktr" ) {
							return "templates/socialview.html"
						}
						else if ($stateParams.partner == 'vaya') {
							return "templates/vayaside.html"
						}
						else {
							return "templates/socialview.html"
						}
					}
					, controllerProvider: function ($stateParams) {
						if ($stateParams.partner == 'tktr') {
							return "HomeCtrl"
						}
						else if ($stateParams.partner == 'vaya') {
							return "VayaCtrl"
						}
						else {
							return "HomeCtrl"
						}
					}

				},
				"funky@homeview": {
					templateUrl: "templates/mapping.html"
					, controller: "MapCtrl"
				}
			}
		})
		.state('app.home.recs', {
			url: '/recommends'
			, views: {
				"homeview": {
					templateUrl: "templates/home.recs.html"
					, controller: "HomeRecCtrl"
				},
				"sideview": {
					templateUrl: "templates/socialview.html"
					, controller: "HomeCtrl"
				}
			}
		}).state('app.tktr', {
			url: '/tktr'
			, views: {
				"main": {
					templateUrl: "templates/tktr.home.html"
					, controller: "TktrHomeCtrl"
				}
				, // "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.vaya', {
			url: '/vaya/donde'
			, views: {
				"main": {
					templateUrl: "templates/vaya.home.html"
					, controller: "VayaCtrl"
				}
				,  "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.home.partner.map', {
			url: '/map'
			, views: {
				"funky": {
					templateUrl: "templates/mapping.html"
					, controller: "MapCtrl"
				}
			}
		}).state('app.vayahail', {
			url: '/vaya/donde'
			, views: {
				"main": {
					templateUrl: "templates/vayahail.html"
					, controller: "VayaCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		}).state('app.pos_success', {
			url: '/tools/:vendor/pos_success'
			, views: {
				"main": {
					templateUrl: "templates/print_tix.html"
					, controller: "PosSuccessCtrl"
				}
				, // "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.admin.mng_recs', {
			url: '/mng_recs'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_recs.html"
					, controller: "AdminRecCtrl"
				}
				
			}
		})
		.state('app.admin.mng_freebies', {
			url: '/:vendor/mng_freebies'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_promos.html"
					, controller: "AdminFreebiesCtrl"
				}
				
			}
		})
		.state('app.admin.dash', {
			url: '/:vendor/dash'
			, views: {
				"adminview": {
					templateUrl: "templates/admin.dash.html"
					, controller: "AdminDashCtrl"
				}
				
			}
		}).state('app.admin.mng_vendor', {
			url: '/mng_vendor'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_vendor.html"
					, controller: "AdminVendorCtrl"
				}
				
			}
		})
		.state('app.admin.mng_lodges', {
			url: '/mng_lodges'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_lodges.html"
					, controller: "AdminLodgesCtrl"
				}
				
			}
	}).state('app.admin.mng_products', {
			url: '/:vendor/mng_products'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_products.html"
					, controller: "AdminProductsCtrl"
				}
				
			}
		})
	.state('app.admin.mng_menus', {
			url: '/:vendor/mng_menus'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_menus.html"
					, controller: "AdminMenusCtrl"
				}
				
			}
		}).state('app.admin.mng_packages', {
			url: '/:vendor/mng_packages'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_packages.html"
					, controller: "AdminProductsCtrl"
				}
				
			}
		}).state('app.admin.mng_rooms', {
			url: '/:vendor/mng_rooms'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_rooms.html"
					, controller: "RoomEditCtrl"
				}
				
			}
		}).state('app.admin.mng_events', {
			url: '/:vendor/mng_events'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_events.html"
					, controller: "AdminTicketsCtrl"
				}
				
			}
		}).state('app.admin.mng_stock', {
			url: '/:vendor/mng_stock'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_stock.html"
					, controller: "AdminStockCtrl"
				}
				
			}
		}).state('app.admin.mng_drivers', {
			url: '/:vendor/mng_drivers'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_drivers.html"
					, controller: "AdminDriverCtrl"
				}
				
			}
		}).state('app.track_drivers', {
			url: '/:vendor/track_drivers'
			, views: {
				"adminview": {
					templateUrl: "templates/drivertracking.html"
					, controller: "DriverTrackerCtrl"
				}
				
			}
		}).state('app.admin.mng_fleet', {
			url: '/vaya/mng_fleet'
			, views: {
				"adminview": {
					templateUrl: "templates/mng_fleet.html"
					, controller: "AdminFleetCtrl"
				}
				
			}
		}).state('app.admin.fleet_pickup', {
			url: '/vaya/fleet_pickup'
			, views: {
				"adminview": {
					templateUrl: "templates/pickupvehicle.html"
					, controller: "FleetPickupCtrl"
				}
				
			}
		}).state('app.landing', {
			url: '/landing'
			, views: {
				"main": {
						templateUrl: function ($stateParams) {
						if ($stateParams.partner == 'portal') {
							return "templates/portal.landing.html"
						}
						else {
							return "templates/landing.html"
						}
					},
					 controller: "ArrivalCtrl"
						
					
				}
				// "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.terms', {
			url: '/terms'
			, views: {
				"main": {
					templateUrl: "templates/terms.html"
					, controller: "TermsCtrl"
				}
				, // "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.privacy', {
			url: '/privacy'
			, views: {
				"main": {
					templateUrl: "templates/privacy.html"
					, controller: "TermsCtrl"
				}
				, // "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		})
    .state('app.contact', {
			url: '/contact'
			, views: {
				"main": {
					templateUrl: "templates/about.html"
					, controller: "ContactCtrl"
				}
				, // "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
			}
		}).state('app.category', {
			url: '/category/:id'
			, views: {
				"main": {
					templateUrl: "templates/category.html"
					, controller: "CategoryCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		})
		.state('app.category.list', {
			url: '/list'
			, views: {
				"catview": {
					templateUrl: "templates/category.main.html"
					
				},
				"sideview": {
					templateUrl: "templates/socialview.html"
								},  
				"side": { 
					templateUrl: "templates/ticket.side.html",
				 controller: "TicketSideCtrl" }
			}
		})

		 .state('app.driverApp',{
		   url: '/driver/live',
		   views: {
		     "main": { templateUrl: "templates/driver.live.html", controller: "VayaDriverCtrl"},
		     "side": { templateUrl: "templates/driver.side.live.html", controller: "VayaDriverCtrl" }
		   }
		 })
		// .state('app.staff_roster',{
		//   url: '/staff/roster/:id',
		//   views: {
		//     "main": { templateUrl: "templates/staff.shiftlist.html", controller: "StaffLoginCtrl"},
		//     "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
		//   }
		// })
		// .state('app.staff_dashboard',{
		//   url: '/staff/dashboard',
		//   views: {
		//     "main": { templateUrl: "templates/staff.dashboard.html", controller: "StaffDashCtrl"},
		//     "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
		//   }
		// })
		// .state('app.staff_manage',{
		//   url: '/staff/manage',
		//   views: {
		//     "main": { templateUrl: "templates/staff.mngmt.html", controller: "StaffManagementCtrl"},
		//     "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
		//   }
		// })
		//  .state('app.events',{
		//   url: '/:category',
		//   views: {
		//     "main": { templateUrl: "templates/events.html", controller: "EventsCtrl"},
		//     "side": { templateUrl: "templates/ticket.side.html", controller: "TicketSideCtrl" }
		//   }
		// })
		.state('app.door', {
			url: '/door/:id'
			, views: {
				"main": {
					templateUrl: "templates/door.html"
					, controller: "DoorCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		}).state('app.pos', {
			url: '/tools/:vendor/pos'
			, views: {
				"main": {
					templateUrl: "templates/pos.html"
					, controller: "PosCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		}).state('app.ticketing', {
			url: '/ticketing/:id'
			, views: {
				"main": {
					templateUrl: "templates/ticketing.html"
					, controller: "TicketingCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		}).state('app.success', {
			url: '/purchases/:id/success'
			, views: {
				"main": {
					templateUrl: "templates/ticketing.success.html"
					, controller: "PurchaseSuccessCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		})
    	.state('app.screen', {
			url: '/screen/:size/dash'
			, views: {
				"main": {
					templateUrl: function($stateParams){
            return "templates/" + $stateParams.partner + ".html"
          }
					, controller: "ScreenCtrl"
				}, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
			}).state('app.event', {
			url: '/browse/:id'
			, views: {
				"main": {
					templateUrl: "templates/event.html"
					, controller: "EventCtrl"
				}, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
			})
		.state('app.event.info', {
			url: '/'
			, views: {

				"prodview": {
					templateUrl: "templates/sideproduct.html"
					, controller: "EventCtrl"
				},
				"eventview": {
					templateUrl: "templates/eventinfo.html"
					, controller: "EventCtrl"
				}
			}
			}).state('app.rec', {
			url: 'home/recommended/:id'
			, views: {
				"main": {
					templateUrl: "templates/rec.html"
					, controller: "RecCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				},
				"sideview": {
					templateUrl: "templates/sideProduct.html"
					, controller: "EventCtrl"
				}
			}
		}).state('app.room', {
			url: '/rooms/:id'
			, views: {
				"main": {
					templateUrl: "templates/event.html"
					, controller: "RoomCtrl"
				}, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
			})
		.state('app.room.info', {
			url: '/info'
			, views: {

				"prodview": {
					templateUrl: "templates/sideroom.html"
					, controller: "RoomCtrl"
				},
				"eventview": {
					templateUrl: "templates/roominfo.html"
					, controller: "RoomCtrl"
				}
			}
    }).state('app.room.book', {
  			url: '/book/:date/:end/:people'
  			, views: {
  				"main": {
  					templateUrl: "templates/room.html"
  					, controller: "RoomCtrl"
  				}
  				, "side": {
  					templateUrl: "templates/sideroom.html"
  					, controller: "RoomCtrl"
  				}
  			}
  		}).state('app.packs', {
			url: '/packs/:id'
			, views: {
				"main": {
					templateUrl: "templates/packs.html"
					, controller: "PacksCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		}).state('app.translate', {
			url: '/translate'
			, views: {
				"adminview": {
					templateUrl: "templates/translate.html"
					, controller: "AdminTranslateCtrl"
				}
				, "side": {
					templateUrl: "templates/admin.side.html"
					, controller: "AdminSideCtrl"
				}
			}
		}).state('app.tickets', {
			url: '/tickets/:uid'
			, views: {
				"main": {
					templateUrl: "templates/tickets.html"
					, controller: "MyTixCtrl"
				}
				, "side": {
					templateUrl: "templates/ticket.side.html"
					, controller: "TicketSideCtrl"
				}
			}
		})
		.state('app.walletLink', {
			url: '/tickets/:id/walletLink/:email'
			, views: {
				"main": {
					templateUrl: "templates/tickets.html"
					, controller: "MyTixWalletCtrl"
				}
				
			}
		}).state('app.admin', {
			url: '/admin'
			, //   resolve: {
			//   admin: function($stateParams, ProjectService) {
			//     return ProjectService.get($stateParams.id);
			//   }
			// },
			views: {
				"main": {
					templateUrl: "templates/admin.html"
					, controller: "AdminCtrl"
				}
				, "side": {
					templateUrl: "templates/admin.side.html"
					, controller: "AdminSideCtrl"
				}
			}
		}).state('app.admin.media', {
			url: '/media'
			, views: {
				"adminview": {
					templateUrl: "templates/media.edit.html"
					, controller: "MediaEditCtrl"
				}
				
			}
		}).state('app.admin.staff', {
			url: '/staff'
			, views: {
				"adminview": {
					templateUrl: "templates/admin.staff.html"
					, controller: "AdminStaffCtrl"
				}
				
			}
		})
		.state('app.admin.scanner', {
			url: '/scanner'
			, views: {
				"adminview": {
					templateUrl: "templates/admin.scanner.html"
					, controller: "QRScanner"
				}
				
			}
		}).state('app.admin.login', {
			url: '/login'
			, views: {
				"adminview": {
					templateUrl: "templates/admin.html"
					, controller: "AdminCtrl"
				}
				, // "main": { templateUrl: "templates/admin.login.html", controller: "AdminCtrl"},
				"side": {
					templateUrl: "templates/admin.side.html"
					, controller: "AdminSideCtrl"
				}
			}
		})
		.state('app.safe_login', {
			url: '/login/:mergeId/safesignin/:email'
			, views: {
				"main": {
					templateUrl: "templates/safe_login.html"
					, controller: "SafeLoginCtrl"
				}
				
			}
		})
	$urlRouterProvider.otherwise(function ($injector, $location) {
		var partner;
		// = $stateParams.partner;
		console.log($location.path())
		var loc = $location.path()
		var locArr = loc.split("/")
		var partner = locArr[2];
		console.log(partner, loc, locArr)
		if (!partner) {
			return '/app/tktr/home/landing'
		}
		else {
			return "/app/" + partner + "/landing"
		}
	});
}).config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
}).config(function (uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: "AIzaSyCaG3yAf9wZEB-fqLE3U0QmuzO4iNn5HUw"
		, v: '3.20', //defaults to latest 3.X anyhow
		libraries: 'weather,geometry,visualization,places'
	});
});
// .config(function (SpotifyProvider) {
// 	SpotifyProvider.setClientId('5e10adf81564490590d285b7fc100fa8');


// });;
