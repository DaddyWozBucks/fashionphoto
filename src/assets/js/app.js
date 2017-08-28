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
