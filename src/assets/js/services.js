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
      url: 'https://us-central1-backbaseweather-713d6.cloudfunctions.net/searchTags'
    };
		$http(req).then(function(response){
			var key = moment().format('x');

			let resp = {key: key, data: response.data.photos.photo[0], search: {tags: tags, userId: userId || ""}}

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
      url: 'https://us-central1-backbaseweather-713d6.cloudfunctions.net/searchTags'
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
