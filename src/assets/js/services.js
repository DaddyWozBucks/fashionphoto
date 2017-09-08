angular.module('fashion.services', [])
.factory('Flickr', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory){
	var searches = $cacheFactory('searches');

  var deferred = $q.defer();
	function searchTags (tags, userId) {
    let sObj = {tags: tags, sort: 'interestingness-desc', extras: 'date_upload, date_taken, owner_name, views, url_q'};
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
			var key = moment.unix();
			searches.put(key, response.data);
			let resp = {key: key, data: response.data.photos.photo[0]}
			deferred.resolve(resp);
		})
		return deferred.promise;
	};

	function retrieveSearch (key) {
		var deferred = $q.defer();
		var search = searches.get(key);
		if (search) {
			deferred.resolve(search);
		} else {
			deferred.resolve([]);
		};
		return deferred.promise;
	};
	return {
    searchTags: function(tags, userId){
      return searchTags(tags, userId);
    },
		retrieveSearch: function(key) {
			return retrieveSearch(key);
		}
	}
}])
