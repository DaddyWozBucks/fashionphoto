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
