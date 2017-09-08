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
