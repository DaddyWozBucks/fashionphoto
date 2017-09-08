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
	this.search = function(valid){
		debugger;
		if (valid) {
			Flickr.searchTags(this.searchTags, this.userId).then(function(data){
				self.searches.push(data);
			})
		}
	}
}])

.controller('ResultsCtrl', ['$scope', '$http', '$stateParams', 'Flickr'
, function($scope, $http, $stateParams, Flickr){
	Flickr.retrieveSearch($stateParams.key).then(function(data){
		this.results = data;
	})
}])
