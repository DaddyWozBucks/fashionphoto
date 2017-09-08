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
