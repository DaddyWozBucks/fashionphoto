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
