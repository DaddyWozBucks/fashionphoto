angular.module('tktr.controllers', ['tktr.services']).controller('AppCtrl', ['$scope', '$log', '$state', '$stateParams', '$rootScope', '$http', '$anchorScroll', '$location', '$mdMedia', '$mdDialog', '$timeout', "$geolocation", '$firebaseObject', '$firebaseArray', '$translate', 'User', '$mdToast', 'Auth', '$mdSidenav', '$mdDialog', '$sce'

		, function ($scope, $log, $state, $stateParams, $rootScope, $http, $anchorScroll, $location, $mdMedia, $mdDialog, $timeout, $geolocation, $firebaseObject, $firebaseArray, $translate, User, $mdToast, Auth, $mdSidenav, $mdDialog, $sce) {
			var ref = firebase.database().ref();
			$scope.location;
			$scope.partner = {};
			$scope.currLoc = {};
			$scope.gMapper = function(placeid){
				var str = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCaG3yAf9wZEB-fqLE3U0QmuzO4iNn5HUw&q=place_id:" + placeid + "&zoom=14";
				 
				 return $sce.trustAsResourceUrl(str)
			};
			$firebaseObject(ref.child("partners/" + $stateParams.partner)).$loaded(function (data) {
				$scope.partner.info = data;
			})
			$firebaseObject(ref.child("media/" + $stateParams.partner)).$loaded(function (data) {
				$scope.partnerMedia = data;
				console.log(data)
			})
			$firebaseObject(ref.child("vendor_locations/" + $stateParams.partner)).$loaded(function (data) {
				$scope.partner.location = data;
			});
			$firebaseObject(ref.child("sites/" + $stateParams.partner)).$loaded(function (data) {
				$scope.partner.classes = data;
				//     $scope.titleStyle = {
				//   'background-color': transparentize($scope.partner.classes.hex, 0.7)
				// }
			})
			$scope.gRoute = function(route){
				var keys = Object.keys(route.stops);
				var str1 = "&origin=place_id:" + route.origin + "&destination=place_id:" + route.destination + "&waypoints="
				angular.forEach(keys, function(key){
					str1 = str1 + "place_id:" + route.stops[key] + "|"
				})
				
				
			

				var str2 = str1.slice(0, -1);


				var str = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCaG3yAf9wZEB-fqLE3U0QmuzO4iNn5HUw&" + str2 + "&zoom=14";
				 
				 return $sce.trustAsResourceUrl(str)
			};

			$scope.uirefSideNav = function(side, state){
				$mdSidenav(side).close().then(function(){
					$state.go("app.category.list", {id: state});
				})
			}
			$scope.youtubeUrl = function(code){
				var str = 'https://www.youtube.com/embed/' + code + '?autoplay=0'
				return  $sce.trustAsResourceUrl(str)
			}
			$scope.trust = function(str){
					return  $sce.trustAsResourceUrl(str)
			}
			$scope.colGroup = function(arr){
				return arr.length;
			}
			$scope.closeSNav = function(side, fn){
				$mdSidenav(side)
					.close()
					.then(function(){
						fn;
					});
			}
			$scope.mediaQuery = function(breakPoint){
				return $mdMedia(breakPoint)
			}
			$scope.recfilters = [{icon: "assets/site/cat_clubs_btn.svg",text:"club"}, {icon: "assets/site/cat_bars_btn.svg",text:"bar"}, {icon: "assets/site/cat_restaurants_btn.svg",text:"restaurant"}, {icon: "assets/site/cat_shops_btn.svg",text:"shop"}, {icon: "assets/site/cat_sights_btn.svg",text:"sights"}]
			$scope.filters = [{icon: "assets/site/cat_vipclubbing_btn.svg",text:"parties"}, {icon: "assets/site/cat_watersports_btn.svg",text:"watersports"},{icon:  "assets/site/cat_tktr_btn.svg",text: "tktr"}, {icon: "assets/site/cat_guidedtours_btn.svg",text:"tours"}, {icon: "assets/site/cat_rentanything_btn.svg",text:"rentals"}, {icon: "assets/site/cat_activities_btn.svg",text:"activities"}];
			$scope.partnerlogo = function () {
				return "./assets/site/" + $stateParams.partner + "_logo_btn.svg";
			};
			$scope.partnercart = function () {
				return "./assets/site/" + $stateParams.partner + "_total_btn.svg";
			};
			
			$scope.cookies = function () {
				window.open("https://www.google.com/policies/technologies/cookies/")
			};
			
			$scope.partnersFilter = {
				partner: true
			}
			$scope.promoteFilter = {
				promote: true
			}


			$scope.termsAccepted = false;
			$scope.toggleLeftMenu = function () {
				if ($mdSidenav('left').isOpen()) {
					$mdSidenav('left').toggle();
				}
				else if (!$mdSidenav('left').isOpen() && !$mdSidenav('right').isOpen()) {
					$mdSidenav('left').toggle();
				}
				else if (!$mdSidenav('left').isOpen() && $mdSidenav('right').isOpen()) {
					$mdSidenav('right').toggle();
					$mdSidenav('left').toggle();
				}
			};
			$scope.toggleRightMenu = function () {
				if ($mdSidenav('right').isOpen()) {
					$mdSidenav('right').toggle();
				}
				else if (!$mdSidenav('right').isOpen() && !$mdSidenav('left').isOpen()) {
					$mdSidenav('right').toggle();
				}
				else if (!$mdSidenav('right').isOpen() && $mdSidenav('left').isOpen()) {
					$mdSidenav('left').toggle();
					$mdSidenav('right').toggle();
				}
			};
			$scope.openPics = function (images, key) {
				console.log(key)
				var imgObj = {
					images: images
					, key: key
				}
				var parentEl = angular.element(document.body);
				$mdDialog.show({
					parent: parentEl
					, templateUrl: "templates/picModal.html"
					, locals: {
						imgObj: imgObj
					}
					, controller: "ImgCtrl"
				})
			};
			
			$scope.showInfo = function (info) {
				var parentEl = angular.element(document.body);
				$mdDialog.show({
					parent: parentEl
					, templateUrl: "templates/infoModal.html"
					, locals: {
						info: info
					}
					, controller: "InfoModalCtrl"
				})
			};
			//  var storage = firebase.storage();
			$scope.user;
			$scope.auth = Auth.auth.$getAuth();
			$scope.currentNavItem = 'Home';
			$scope.toggleCart = function () {
				$mdSidenav('right').toggle();
			}
			$rootScope.previousState;
			$rootScope.currentState;
			$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
				$rootScope.previousState = from.name;
				$rootScope.currentState = to.name;
				$rootScope.previousParams = fromParams;
				$rootScope.currentParams = toParams;

				console.log('Previous state:' + $rootScope.previousState + "p" + fromParams)
				console.log('Current state:' + $rootScope.currentState + "p" + toParams)
			});
			if ($rootScope.previousState) {
				$scope.backBool = true;
			}
			$scope.siteInfo = {
				watersports: "adrenalintitle"
				, tables: "tablestitle"
				, outdoors: "outdoortitle"
				, tours: "tourstitle"
				, rentals: "rentaltitle"
				, contact: "contacttitle"
				, parties: "viptitle"
			}
			
			$scope.radioShow = false;
			$scope.radioBtn = function () {
				if ($scope.radioObj.paused) {
					$scope.radioObj.play()
				}
				else {
					$scope.radioObj.pause()
				}
			}
			$scope.openMap = function (mapurl) {
				window.open(mapurl)
			}
			console.log($mdMedia('gt-sm'))
			$scope.showNav = function () {
				$scope.navHide = !$scope.navHide;
			};
			$scope.gotoAnchor = function (x) {
				var newHash = x;
				if ($location.hash() !== newHash) {
					// set the $location.hash to `newHash` and
					// $anchorScroll will automatically scroll to it
					$location.hash(x);
				}
				else {
					// call $anchorScroll() explicitly,
					// since $location.hash hasn't changed
					$anchorScroll();
				}
			};
			$scope.langs = [
				{
					lang: "en"
					, sign: "EN"
				}
				, {
					lang: "es"
					, sign: "ES"
				}
  ];
			$scope.selectedLang = {
				lang: "en"
				, sign: "EN"
			};
			$scope.back = function () {
				if ($rootScope.fromParams) {
					$state.go($rootScope.previousState, $rootScope.fromParams)
				} else {
					$state.go("app.home.store")
				}
				
			}
			$scope.updateLang = function (lang) {
				console.log("using" + lang)
				ref.child("profiles").child($rootScope.uid).child("l18n").set(lang)
				$translate.use(lang);
			};
			$scope.appAuth = Auth.auth.$getAuth();
			if($scope.appAuth){
				$geolocation.getCurrentPosition({
								timeout: 60000
							}).then(function (position) {
								geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
									console.log("Provided key has been added to GeoFire");
									ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
								})
								$scope.currLoc.location = [position.coords.latitude, position.coords.longitude];
								$scope.user.location = {lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]};
							});
			}
			var geoFire = new GeoFire(ref.child("geofire/locs"));
			firebase.auth().onAuthStateChanged(function (user) {
				console.log(user)
					if (user) {
						if (user.isAnonymous) {
							var partner = $stateParams.partner;
							$scope.user = {
								name: "Guest"
								, uid: user.uid
								
								, voucher: partner
								, image: "https://firebasestorage.googleapis.com/v0/b/pachapitch.appspot.com/o/Icon_Guest%20Cherry.svg?alt=media&token=8f8f56d3-4eaf-4ccb-a540-f1bab3ec9777"
							}
							$rootScope.uid = user.uid;
							console.log($rootScope.uid)
							$firebaseObject(ref.child("profiles/" + user.uid)).$loaded(function(data){
								$scope.user = data;
								})
							$geolocation.getCurrentPosition({
								timeout: 60000
							}).then(function (position) {
								geoFire.set(user.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
									console.log("Provided key has been added to GeoFire");
									ref.child("profiles/" + user.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
								})
								$scope.currLoc.location = [position.coords.latitude, position.coords.longitude];
								$scope.user.location = {lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]};
							});
							$firebaseObject(ref.child("carts").child(user.uid)).$bindTo($scope, 'cart').then(function(data){
							console.log(data)
						})

						} else {
							$firebaseObject(ref.child("profiles").child(user.uid)).$loaded(function(data){
								$scope.user = data;
							})
							$firebaseObject(ref.child("carts").child(user.uid)).$bindTo($scope, 'cart').then(function(data){
							console.log(data)
						})
						}
						
					}
					else {
						$rootScope.uid = null;
						$state.go("app.landing")
					}
				})
				
					if ($scope.user && !$scope.user.location) {
					$geolocation.getCurrentPosition({
								timeout: 60000
							}).then(function (position) {
								geoFire.set($scope.user.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
									console.log("Provided key has been added to GeoFire");
									ref.child("profiles/" + $scope.user.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
								})
								$scope.currLoc.location = [position.coords.latitude, position.coords.longitude];
								$scope.user.location = [position.coords.latitude, position.coords.longitude];
							});
				// }
				}
}]).controller('MyTixWalletCtrl', ['$scope', '$firebaseArray', 'Auth', '$state', '$rootScope', 'User', '$stateParams'
, function ($scope, $firebaseArray, Auth, $state, $rootScope, User, $stateParams) {
	var ref = firebase.database().ref();

	$scope.loginObj = {};
			User.walletLink($stateParams.email)
}]).controller('PurchaseSuccessCtrl', ['$scope', '$firebaseArray', 'Auth', '$state', '$rootScope', 'User', '$stateParams'

		, function ($scope, $firebaseArray, Auth, $state, $rootScope, User, $stateParams) {
			var ref = firebase.database().ref();
			var auth = Auth.auth.$getAuth();

			if (auth) {
				$state.go("app.tickets", {uid: auth.uid})
			} else {
				$scope.showLogin = true;
			}
			

}]).controller('LoginCtrl', ['$scope', '$firebaseArray', 'Auth', '$state', '$rootScope', 'User', '$stateParams'

		, function ($scope, $firebaseArray, Auth, $state, $rootScope, User, $stateParams) {
			var ref = firebase.database().ref();
			$scope.signUpObj = {};
			$scope.signInObj = {};
			$scope.auth = Auth.auth.$getAuth();
			$scope.lStage = 0;
			$scope.stage1 = function(){
				$scope.lStage = 1;
			}
			if ($scope.auth) {
					ref.child("profiles").child($scope.auth.uid).on('value', function(data){
				$scope.profile = data.val();
			})
			}
		
			$scope.stagePlus = function(val){
				$scope.lStage += val;
			}
			$scope.joinProvider = function(prov){
				User.providerLogin(prov, 'pop')
			}
			$scope.roughIt = function(){
				
				ref.child("profiles").child($scope.auth.uid).child("email").set($scope.mergeObj.email)
				ref.child("profiles").child($scope.auth.uid).child("name").set($scope.mergeObj.name)
			}
			$scope.signInClassic = function(){
				Auth.auth.$signInWithEmailAndPassword($scope.signInObj.email, $scope.signInObj.password).then(function (firebaseUser) {
					console.log("Signed in as:", firebaseUser.uid);
					$state.go("app.home.store");
					$rootScope.uid = firebaseUser.uid;
					
					$scope.auth = firebaseUser;
				}).catch(function (error) {
					console.error("Authentication failed:", error);
				});
			};
			$scope.mergeFull = function(){
				User.mergeFull($scope.mergeObj).then(function(data){
					
				})
			}
			$scope.switchSignUp = function(){
				if ($scope.signInObj.email && !$scope.signInObj.password && $scope.signInObj.name) {
					User.mergeNow($scope.signInObj).then(function(data){
					
					})
				} else if ($scope.signInObj.email && $scope.signInObj.password && $scope.signInObj.name) {
					
					User.mergeFull($scope.signInObj).then(function(data){
						})
					
				} else if (!$scope.signInObj.email || !$scope.signInObj.name) {
					alert("At least an email & Name is required!")
				} 
			}
			$scope.mergeObj = {};
			$scope.mergeNow = function(){
				User.mergeNow($scope.mergeObj.email).then(function(data){
					
				})
			}
			$scope.logBool = false;
			$scope.logShowFn = function(code){
				return $scope.logBool == code;
			};
			$scope.showLog = function(code){
				$scope.logBool = code;
			};
			$scope.logFn = function(code){
				if ($scope.logBool == code) {
					return 3
				} else {
					return 1
				};
			}
			$scope.joinClassic = function(){
				Auth.auth.$createUserWithEmailAndPassword($scope.signUpObj.email, $scope.signUpObj.password).then(function (firebaseUser) {
					console.log("Signed in as:", firebaseUser.uid);
					$state.go("app.home.store");
					$rootScope.uid = firebaseUser.uid;
					var profile = {
								name: $scope.signUpObj.name
								, uid: firebaseUser.uid,
								email: $scope.signUpObj.email
								, location: [41.380057, 2.171269]
								, voucher: $stateParams.partner
								, image: "hold"
							}
							ref.child("profiles").child(firebaseUser.uid).set(profile);
							$state.go("app.home.store");
							$scope.auth = firebaseUser;
				}).catch(function (error) {
					console.error("Authentication failed:", error);
				});
			}
			$scope.loginObj = {};
			$scope.login = function () {
				// User.adminLogin($scope.loginObj);
				Auth.auth.$signInWithEmailAndPassword($scope.loginObj.email, $scope.loginObj.password).then(function (firebaseUser) {
					console.log("Signed in as:", firebaseUser.uid);
					$state.go("app.admin");
					$rootScope.uid = firebaseUser.uid;
					$scope.auth = firebaseUser;
				}).catch(function (error) {
					console.error("Authentication failed:", error);
				});
			}
			$scope.provLogin = function(prov, method){
				User.adminProviderLogin(prov, method);
			}
}])
.controller('SafeLoginCtrl', ['$scope', '$firebaseArray', 'Auth', '$state', '$rootScope', 'User'

		, function ($scope, $firebaseArray, Auth, $state, $rootScope, User) {
			$scope.loginObj = {};
			User.ssiLanding($stateParams.email);
			$scope.loginClassic = function () {
				User.mergeComplete($scope.loginObj)
			}
			$scope.mergeProvider = function(provider){
				User.mergeCompleteProvider(provider)
			}
			
}]).controller('InfoModalCtrl', ['$scope', '$mdDialog', 'info', '$state'






		, function ($scope, $mdDialog, info, $state) {
			$scope.info = info;
			$scope.closeModal = function () {
				$mdDialog.hide();
			}
}]).controller('VayaModalCtrl', ['$scope', '$mdDialog',  '$state', 'Cart'

		, function ($scope, $mdDialog, $state, Cart) {
			var ref = firebase.database().ref();
			$scope.dateObj = {};
				$scope.itemMedia = {};
				$scope.numbArray = [1,2,3,4,5,6,7,8,9];
			Cart.getItems().then(function(items){
				$scope.items = items;
				angular.forEach(items, function(item){
					if (item.$id == "-KV5Z5qiB-XrRytE8_V_") {
						$scope.vayaObj = item;
						angular.forEach(item.valid_dates, function(vDate, k){
							var vvDate = moment(vDate).format('YYYY-MM-DD')
							$scope.dateObj[vvDate] = true;

						})
						ref.child("media").child(item.$id).child("wide_branding").once('value',function(data){
							$scope.itemMedia[item.$id] = data;
						})
					}
					var itemDate = moment(item.time).format('YYYY-MM-DD');
					$scope.dateObj[itemDate] = false;
				})
				if (!$scope.vayaObj.name) {
					ref.child("packages/-KV56B97r9RCS6ddIjH1/-KV5Z5qiB-XrRytE8_V_").once('value', function(data){
						$scope.vayaObj = data;
					})
				}
			})
			$scope.newVayaQ = 1;
			$scope.addVayaDay = function(obj){
				var timeKey = moment(obj.time).format('YYYY-MM-DD');
				$scope.vayaObj.valid_dates[timeKey] = $scope.newVayaQ[obj.$id]
			}
			$scope.vayaObj = {};
			$scope.addVaya = function(){
				ref.child("carts").child("-KV5Z5qiB-XrRytE8_V_").set($scope.vayaObj)
			}
}])
.controller('ImgCtrl', ['$scope', '$mdDialog', 'imgObj', '$state', '$mdMedia'

		, function ($scope, $mdDialog, imgObj, $state, $mdMedia) {
			$scope.modalImages = imgObj.images;
			$scope.showIndex = 0;
			var count = 0;
			console.log(imgObj)
			angular.forEach(imgObj.images, function (item) {
					if (item.id == imgObj.key) {
						
						$scope.showIndex = count;
						console.log($scope.centerImg, item)
					}
					else {
						count++;
					}
				})
			 $scope.centerImg = function(){
			 	return $scope.modalImages[$scope.showIndex].url
			 };
			$scope.closeModal = function () {
				$mdDialog.hide();
			}
			// $scope.swipeRight = function () {
			// 	if ($scope.index < $scope.modalImages.length - 1) {
			// 		$scope.index += 1;
			// 		$scope.centerImg = $scope.modalImages[$scope.index];
			// 	}
			// 	else if ($scope.index == $scope.modalImages.length - 1) {
			// 		$scope.index = 0;
			// 		$scope.centerImg = $scope.modalImages[$scope.index];
			// 	}
			// }
			// $scope.swipeLeft = function () {
			// 	if ($scope.index > 0) {
			// 		$scope.index -= 1;
			// 		$scope.centerImg = $scope.modalImages[$scope.index];
			// 	}
			// 	else if ($scope.index == 0) {
			// 		$scope.index = $scope.modalImages.length - 1;
			// 		$scope.centerImg = $scope.modalImages[$scope.index];
			// 	}
			// }
			$scope.indexShift = function (val) {
				var newindex = $scope.showIndex + val;
				if (newindex > $scope.modalImages.length - 1) {
					$scope.showIndex = 0;
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.modalImages.length - 1
				} else {
					$scope.showIndex = newindex;
				};
			}
}])
.controller('VrModalCtrl', ['$scope', '$mdDialog', 'vrObj', '$state', '$timeout'

		, function ($scope, $mdDialog, vrObj, $state, $timeout) {
			$scope.modalSpheres = [];
			$scope.showIndex = 0;
			var count = -1;
			console.log(vrObj);
			$scope.loadVR = function (vr) {
				console.log(vr)
				var PSV = new PhotoSphereViewer({
					panorama: vr.url
					, container: 'mview'
					
					, time_anim: 3000
					, navbar: true
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, usexmpdata: true
					, gyroscope: true
					, auto_rotate: true
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
			angular.forEach(vrObj.spheres, function (item) {
				console.log(item)
				if (count < 0) {
					count = 0
				}
					if (item.id == vrObj.key) {
						
						$scope.showIndex = count;
						
					}
					else {
						count++;
					}
					$scope.modalSpheres.push(item);
					console.log($scope.modalSpheres)
				})
			
				// $scope.centerImg = $scope.modalSpheres[vrObj.key].url;
			$scope.closeModal = function () {
				$mdDialog.hide();
			}
			$scope.vrShift = function (val) {

				var newindex = $scope.showIndex + val;
				if (newindex > $scope.modalSpheres.length - 1) {
					$scope.showIndex = 0;
					$scope.loadVR($scope.modalSpheres[$scope.showIndex]);
					console.log($scope.modalSpheres, val, newindex, $scope.showIndex, $scope.modalSpheres[$scope.showIndex])
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.modalSpheres.length - 1
					$scope.loadVR($scope.modalSpheres[$scope.showIndex]);
					console.log($scope.modalSpheres, val, newindex, $scope.showIndex, $scope.modalSpheres[$scope.showIndex])
				} else {
					$scope.showIndex = newindex;
					$scope.loadVR($scope.modalSpheres[$scope.showIndex]);
					console.log($scope.modalSpheres, val, newindex, $scope.showIndex, $scope.modalSpheres[$scope.showIndex])
				};
				// console.log($scope.modalSpheres, val, newindex, $scope.showIndex, $scope.modalSpheres[$scope.showIndex])
			}
			$scope.sphereTarget = document.getElementById('mview');
			if ($scope.modalSpheres && $scope.sphereTarget && count >= 0) {
				$scope.loadVR($scope.modalSpheres[count]);
			}
			else {
				$timeout(function(){
					$scope.loadVR($scope.modalSpheres[count]);
				}, 1000);
			}
}]).controller('AdminStockCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', 'AdminTools'






		, function ($scope, $stateParams, $firebaseArray, $firebaseObject, AdminTools) {
			var mediaRef = firebase.database().ref("media");
			var ref = firebase.database().ref();
			var geoFire = new GeoFire(ref.child("geofire/vendors"));
			var vendorFire = new GeoFire(ref.child("geofire/vendors/" + $stateParams.vendor));
			$firebaseArray(ref.child("info").orderByChild("vendor").equalTo($stateParams.vendor)).$loaded(function (data) {
				$scope.stockTypes = data;
				console.log(data)
			})
			$firebaseArray(ref.child("vendor_locations").orderByChild("vendor").equalTo($stateParams.vendor)).$loaded(function (data) {
				$scope.stores = data;
				console.log(data)
				angular.forEach(data, function (value) {
					vendorFire.set(value.$id, value.location)
				})
			})
			$scope.stockType = {};
			$scope.storeLoc = {};
			$scope.stockRepeater = 1;
			$scope.generateStock = function () {
				var stockFire = new GeoFire(ref.child("geofire/stock").child($scope.stockType.$id));
				console.log($scope.storeLoc, $scope.stores, $scope.stockRepeater, $scope.stockType)
				var genArray = $firebaseArray(ref.child("stock").child($scope.stockType.$id))
				for (var i = $scope.stockRepeater; i >= 0; i--) {
					var stockPush = {
							vendor: $stateParams.vendor
							, product: $scope.stockType.$id
							, vendor_location: $scope.storeLoc.$id
							, stockNo: i
						}
						// console.log(newItem)
					var newLoc = [$scope.storeLoc.location.lat, $scope.storeLoc.location.lng]
					genArray.$add(stockPush).then(function (data) {
						stockFire.set(data.key, newLoc)
					}, function (err) {
						console.log(err)
					})
				}
			}
}]).controller('RoomEditCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', 'AdminTools'


		, function ($scope, $stateParams, $firebaseArray, $firebaseObject, AdminTools) {
			var mediaRef = firebase.database().ref("media");
			var ref = firebase.database().ref();
			var fArray = $firebaseArray(ref.child("rooms").orderByChild("vendor").equalTo($stateParams.vendor))
			fArray.$loaded(function (data) {
				$scope.rooms = data;
			});
			$scope.newRoom = {
				beds: 1
			};
			$scope.newRoomTypeSel = {};
			var typeArray = $firebaseArray(ref.child("accomm").orderByChild("vendor").equalTo($stateParams.vendor))
			typeArray.$loaded(function(accoms){
				$scope.accomTypes = accoms;
			})
			$scope.newRoomType = {};
			$scope.deleteRoom = function (id) {
				fArray.$remove(id)
			};
			$scope.rangeMe = function(no){
				var range = [];
				var i = 1;
				while(i <= no){
					range.push(i)
					i ++
				}
				return range
			}
			$scope.saveNewRoomType = function(){
				$scope.newRoomType.vendor = $stateParams.vendor;
				$scope.newRoomType.tag = "room";
				AdminTools.newRoomType($scope.newRoomType)
			}
			$scope.bedOpts = ["single", "double", "single_bunk", "double_bunk"]
			$scope.newBeds = {};
			$scope.saveNewRoom = function () {
				$scope.newRoom.vendor = $stateParams.vendor;
				$scope.newRoom.pp_price = $scope.newRoomTypeSel.bed_price;
				$scope.newRoom.room_type = $scope.newRoomTypeSel.$id;
				$scope.newRoom.occupancy = $scope.newRoomTypeSel.occupancy;
				$scope.newRoom.tag = "room";
	
				AdminTools.newRoom($scope.newRoom, $scope.newBeds);
			};
  }]).controller('MediaEditCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$sce'

		, function ($scope, $stateParams, $firebaseArray, $firebaseObject, $sce) {
			var mediaRef = firebase.database().ref("media");
			var ref = firebase.database().ref();
			$scope.editObj = {};
			$scope.editMedium = "branding";
			$scope.mediaObj = {};
			$scope.currentEdit = "";
			var storage = firebase.storage().ref();
			$firebaseObject(mediaRef).$loaded(function (data) {
				$scope.mediaObj = data;
			})
			$scope.preview = function(key, key2){
				if(!key2){
					$scope.currentEdit = $scope.editObj[key];
				console.log($scope.editObj[key])
				} else {
					$scope.currentEdit = $scope.editObj[key][key2].url;

				}
			};
			$scope.siteColours = {};
			$scope.setColour = function (type, rgba) {
				var numbers = rgba.slice(0, -2)
				if(type == "accent"){
					console.log(type)
					if (numbers) {
							var fade = numbers + ",0.3)"
							var fadeclass = "background-color: rgba(" + fade + ";"
							ref.child("sites").child($scope.editObj.pid).child("accfade").set(fadeclass)
					}
					ref.child("sites").child($scope.editObj.pid).child("rgbaaccentcode").set("rgba(" + rgba + ")")
					var accentcode = "background-color: rgba(" + numbers + ",0.1); -webkit-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);-moz-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);"
						ref.child("sites").child($scope.editObj.pid).child("accent").set(accentcode)
				} else if (type == "color"){
					console.log(type)

						ref.child("sites").child($scope.editObj.pid).child("hex").set("rgba(" + rgba + ")")
							var fade2 = numbers + ",0.20)"
							var fade2class = "background: linear-gradient(rgba(" + fade2 + ", rgba(" + fade2 + ");"
							var rgbacode = "background-color: rgba(" + numbers + ",0.75); -webkit-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);-moz-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);"
						ref.child("sites").child($scope.editObj.pid).child("bgf").set(fade2class)
						ref.child("sites").child($scope.editObj.pid).child("rgba").set(rgbacode)
						}

				var style = "background: rgba(" + rgba + "); -webkit-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);-moz-box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);box-shadow: inset 0px 0px 35px 5px rgba(0,0,0,0.35);";
				ref.child("sites").child($scope.editObj.pid).child(type).set(style)

			};
			$scope.upload = function (medium, key, file) {
				var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					mediaRef.child($scope.editObj.pid).child(medium).child(key).child("url").set(downloadURL);
					$scope.currentEdit = downloadURL;
				});
			}
			$scope.uploadBoxBranding = function (file) {
				if (file) {
					var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
						console.log(snapshot)
					}, function (error) {
						// Handle unsuccessful uploads
						console.log(error)
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						console.log(downloadURL)
						mediaRef.child($scope.editObj.pid).child("box_branding").set(downloadURL);
						ref.child("info").child($scope.editObj.pid).child("box_branding").set(downloadURL);
						$scope.currentEdit = downloadURL;

					});
				}
			}
			$scope.uploadEmailHeader = function (file) {
				if (file) {
					var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
						console.log(snapshot)
					}, function (error) {
						// Handle unsuccessful uploads
						console.log(error)
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						console.log(downloadURL)
						mediaRef.child($scope.editObj.pid).child("email_header").set(downloadURL);
						ref.child("info").child($scope.editObj.pid).child("email_header").set(downloadURL);
						$scope.currentEdit = downloadURL;

					});
				}
			}
			$scope.uploadWideBranding = function (file) {
				if (file) {
					var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
						console.log(snapshot)
					}, function (error) {
						// Handle unsuccessful uploads
						console.log(error)
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						console.log(downloadURL)
						mediaRef.child($scope.editObj.pid).child("wide_branding").set(downloadURL);
						ref.child("info").child($scope.editObj.pid).child("wide_branding").set(downloadURL);
						$scope.currentEdit = downloadURL;

					});
				}
			}
			$scope.uploadBranding = function (file) {
				if (file) {
					var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
						console.log(snapshot)
					}, function (error) {
						// Handle unsuccessful uploads
						console.log(error)
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						console.log(downloadURL)
						mediaRef.child($scope.editObj.pid).child("branding").set(downloadURL);
						ref.child("info").child($scope.editObj.pid).child("branding").set(downloadURL);
						$scope.currentEdit = downloadURL;

					});
				}
			}
			$scope.uploadPartnerLogo = function (file) {
				var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					mediaRef.child($scope.editObj.pid).child("partner_logo").set(downloadURL);
					ref.child("info").child($scope.editObj.pid).child("partner_logo").set(downloadURL);
					if ($cope.editObj.logo) {
						ref.child("partners").child($scope.editObj.pid).child("partner_logo").set(downloadURL);
					}
					$scope.currentEdit = downloadURL;
				});
			}
			$scope.uploadLogo = function (file) {
				var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					mediaRef.child($scope.editObj.pid).child("logo").set(downloadURL);
					ref.child("info").child($scope.editObj.pid).child("logo").set(downloadURL);
					if ($cope.editObj.logo) {
						ref.child("partners").child($scope.editObj.pid).child("logo").set(downloadURL);
					}
					$scope.currentEdit = downloadURL;
				});
			}
			$scope.changeOrder = function (key, order) {
				var arr = $scope.editObj
				mediaRef.child($scope.editObj.pid)
			}
			$scope.uploadNew = function (medium, file) {
				if (file) {
					var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
						console.log(snapshot)
					}, function (error) {
						// Handle unsuccessful uploads
						console.log(error)
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						var newMedia = {
							title: $scope.newMedia.title
							, url: downloadURL
						}
						$firebaseArray(mediaRef.child($scope.editObj.pid).child(medium)).$add(newMedia)
						$scope.currentEdit = downloadURL;
						$scope.newMedia = {};
					});
				}
				else {
					var newMedia = {
						title: $scope.newMedia.title
						, url: $scope.newMedia.url
					}
					$firebaseArray(mediaRef.child($scope.editObj.pid).child(medium)).$add(newMedia)
					$scope.newMedia = {};
					$scope.currentEdit = $sce.trustAsResourceUrl(newMedia.url)
				}
			}
			$scope.delete = function (medium, key) {
				$firebaseObject(mediaRef.child($scope.editObj.pid).child(medium).child(key)).$remove()
			}
			$scope.saveObj = function (medium, key) {
				$firebaseObject(mediaRef.child($scope.editObj.pid).child(medium)).$save($scope.editObj[medium][key])
				$scope.saveBool = false;
			}

			$scope.refresh = function (medium) {
				$firebaseObject(mediaRef.child($scope.editObj.pid).child(medium)).$loaded()
			}
			$scope.edit = function (key) {
				$scope.editObj = $scope.mediaObj[key];
				$scope.editObj.pid = key;
			}
			$scope.saveBool = false;
			$scope.newMedia = {};
			$scope.uploadStill = function (medium, key, file) {
				var uploadTask = storage.child("media").child($scope.editObj.pid).child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					$scope.editObj[medium][key].url = downloadURL;
					$scope.currentEdit = downloadURL;
				});
			}
}]).controller('VendorDashCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$stateParams'






		, function ($scope, $firebaseArray, $firebaseObject, $stateParams) {}]).controller('PacksCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$stateParams'






		, function ($scope, $firebaseArray, $firebaseObject, $stateParams) {
			var ref = firebase.database().ref();
			$scope.loadPack = function (item) {
				$firebaseArray(ref.child("media").child(item.$id).child("images")).$loaded(function (data) {
					$scope.packGal = data;
				})
				angular.forEach(item.tkts, function (value, key) {
					console.log(key, value)
					$firebaseObject(ref.child("info").child(key)).$loaded(function (data) {
						$scope.packData[key] = data;
					})
					$firebaseObject(ref.child("media").child(key)).$loaded(function (data) {
						$scope.packMedia[key] = data;
					})
				})
			}
			$scope.objGals = {};
			$firebaseArray(ref.child("tkts")).$loaded(function (data) {
				$scope.tkts = data;
				angular.forEach(data, function (item) {
					$firebaseArray(ref.child("media").child(item.$id).child("images")).$loaded(function (data) {
						$scope.objGals[item.$id] = data;
					})
				})
			})
			var dataArray = $firebaseArray(ref.child("info").orderByChild("tktrpack").equalTo(true))
			dataArray.$loaded(function (data) {
				$scope.packs = data;
				console.log(data)
				$scope.prepareGalleries();
				$scope.pack = dataArray.$getRecord($stateParams.id);
				$scope.loadPack($scope.pack);
			})
			$scope.packMedia = {};
			$scope.packData = {};
			$scope.gridId = "";
			$scope.gridSelector = function (id) {
				$scope.gridId = id;
			}
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					return 2;
				}
				else {
					return 1;
				}
			}
			$scope.galleries = {};
			$scope.prepareGalleries = function () {
				angular.forEach($scope.packs, function (item) {
					if (item.tktrpack) {
						$firebaseArray(ref.child("media").child(item.$id).child("images")).$loaded(function (data) {
							$scope.galleries[item.$id] = data;
						})
					}
				})
				$scope.startPackRotate();
			}
			$scope.imgInds = {
				pack1: 0
				, pack2: 0
				, pack3: 0
				, pack4: 0
			};
			$scope.startPackRotate = function () {
				$interval(function () {
					if ($scope.imgInds.pack1 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack1++;
					}
					else {
						$scope.imgInds.pack1 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3500)
				$interval(function () {
					if ($scope.imgInds.pack2 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[1]];
						$scope.imgInds.pack2++;
					}
					else {
						$scope.imgInds.pack2 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3200)
				$interval(function () {
					if ($scope.imgInds.pack3 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack3++;
					}
					else {
						$scope.imgInds.pack3 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 2700)
				$interval(function () {
					if ($scope.imgInds.pack4 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack4++;
					}
					else {
						$scope.imgInds.pack4 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3700)
			}
}]).controller('MenuInitCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$stateParams', '$sce', 'Cart'

		, function ($scope, $firebaseArray, $firebaseObject, $stateParams, $sce, Cart) {
			
			$scope.videos = [];
			
			$scope.mediaBool = 'video';
			var initBool = false;
			$scope.init = function(id){
				$scope.paramKey = id;
				initBool = true;
			}
			var ref = firebase.database().ref();
			$firebaseArray(ref.child("menu_items").orderByChild("vendor").equalTo($scope.paramKey)).$loaded(function (data) {
					$scope.menuItems = data;
					
				})
				
				$firebaseObject(ref.child("restaurants").child($scope.paramKey)).$loaded(function(data){
					$scope.restaurants = data;
					$scope.restaurant = data[0];
				})
		$scope.delObj = {
			vendor: $scope.paramKey
		};
		if ($stateParams.id && !initBool) {
				$scope.paramKey = $stateParams.id;
				
			} else if (!$stateParams.id && $stateParams.partner && !initBool) {
				$scope.paramKey = $stateParams.partner;
					
			} 
			$scope.addDelivery = function(){
				Cart.addDelivery($scope.delObj)
			}


}])
.controller('MediaCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$stateParams', '$sce'

		, function ($scope, $firebaseArray, $firebaseObject, $stateParams, $sce) {
			
			$scope.videos = [];
			
			$scope.paramKey;
			$scope.mediaBool = 'img';
			var initBool = false;
			$scope.init = function(id){
				$scope.paramKey = id;
				initBool = true;
			}
			$scope.mediaColFn = function(code){
				if ($scope.mediaBool && $scope.partner && $scope.partner.classes) {
					if ($scope.mediaBool == code) {
						return $scope.partner.classes.accent
					} else {
					
						return $scope.partner.classes.color
				
					}
				}
			}
			$scope.brander = function(index){
				console.log(index, index == 0)
				
				if (index == 0) {
					return "2:1"
				} else {
					return "4:3"
				}
			}
			$scope.setBool = function(code){
				$scope.mediaBool = code;

				var viewer = document.querySelectorAll('#viewer');
			
				if (code == "vr" && viewer[0]) {
					$scope.loadVR($scope.vrGal[0]);
				} else {
					$timeout(function(){
						$scope.loadVR($scope.vrGal[0]);
					}, 500);
				}
			}
			$scope.hideBranding = function(url){
				return !angular.equals($scope.media.wide_branding, url)
			}
			$scope.showMedia = function(code){
				return $scope.mediaBool == code;
			}
			$scope.colGroup = function(arr){
				if (arr.length > 3) {
					return arr.length;
				} else {
					return 4;
				}
			}
			if ($stateParams.id && !initBool) {
				$scope.paramKey = $stateParams.id;
				
			} else if (!$stateParams.id && $stateParams.partner && !initBool) {
				$scope.paramKey = $stateParams.partner;
					
			} 
			$scope.colGen = function (bool1, bool2, bool3) {
				if (bool1 || bool2 || bool3) {
					return 2;
				}
				else {
					return 1;
				}
			}
			var ref = firebase.database().ref();
			$scope.rhIndex = function(){
			
				if ($scope.showIndex == 0) {
						return "2:1"
				} else {
					return "4:3"
				}
			}



			$scope.gallery = [];
			$scope.vrGal = [];
			$scope.explView = true;
			$scope.vrURL = function (url) {
				
				return "./vrview/index.html?image=" + url
			}
			$scope.gvrs = []
			if ($scope.paramKey) {
				$firebaseObject(ref.child("media/" + $scope.paramKey)).$loaded(function (data) {
				$scope.media = data;
				
				// $scope.gallery.push(data.branding)

				var wbrand = {
					url: data.wide_branding
				};
				$scope.gallery.push(wbrand)
				angular.forEach(data.images, function (value, key) {
					value.id = key;
					$scope.gallery.push(value)

					$scope.centerImg = $scope.gallery[0];
				})
				angular.forEach(data.gvr, function (value, key) {
					var obj = value;
					obj.id = key;
					obj.url = $sce.trustAsResourceUrl(value.url)
					$scope.gvrs.push(obj)
				})
				console.log(data.video)
				angular.forEach(data.video, function (value, key) {
					
					var obj = value;
					obj.id = key;
					// obj.trustedUrl = $sce.trustAsResourceUrl(value.url)
					$scope.videos.push(obj)
					console.log($scope.videos)
				})
				
				angular.forEach(data.vr, function (value, key) {
					var obj = value;
					obj.id = key;
					
					$scope.vrGal.push(value)
					
				})
				// if ($scope.vrGal[0]) {
				// 	$scope.loadVR($scope.vrGal[0]);
				// }
			})
			}
$scope.sphereMode = false;
			$scope.sphereIndex = 0;

			$scope.loadVR = function (vr) {
				var PSV = new PhotoSphereViewer({
					panorama: vr.url
					, container: 'viewer'
					, loadingImg: $scope.partner.logo
					, time_anim: 3000
					, navbar: true
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, usexmpdata: true
					, gyroscope: true
					, auto_rotate: true
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

}]).controller('RecsCtrl', ['$scope', '$mdDialog', '$firebaseArray', '$firebaseObject'






		, function ($scope, $mdDialog, $firebaseArray, $firebaseObject) {
			var ref = firebase.database().ref();
			$scope.recs = [];
			$firebaseArray(ref.child("recommendations")).$loaded(function (data) {
				// angular.forEach(data, function(item){
				$scope.recs = data;
				// });
			})
}]).controller('RoomCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Booking', '$interval', '$stateParams', '$mdpDatePicker', '$mdMedia'

		, function ($scope, $firebaseObject, $firebaseArray, Booking, $interval, $stateParams, $mdpDatePicker, $mdMedia) {
			var ref = firebase.database().ref();

			$firebaseObject(ref.child("bkginfo").child($stateParams.partner)).$loaded(function (data) {
				$scope.accomInfo = data;
			})
			$firebaseArray(ref.child("beds").orderByChild("vendor").equalTo($stateParams.partner)).$loaded(function (data) {
				$scope.roomBeds = data;
				$scope.calendar = [];
				var today = moment();
				for (var i = 0; i < 30; i++) {
					$scope.calendar.push(moment().add(i, 'days').format('YYYY-MM-DD'))
					}
			})
			$firebaseObject(ref.child("accomm").child($stateParams.id)).$loaded(function (data) {
				$scope.roomInfo = data;
				$firebaseObject(ref.child("info").child(data.vendor)).$loaded(function (data2) {
					$scope.hostelInfo = data2;
				})
				$firebaseArray(ref.child("rooms").orderByChild("room_type").equalTo($stateParams.id)).$loaded(function (data3) {
					$scope.rooms = data3;

				})
			})

			$scope.bookingUrl = function(id){

				 var url = "app.room.book({id:" + id + ", date: " + moment($scope.booking.start_date).format("YYYY-MM-DD") + "end: " + moment($scope.booking.end_date).format("YYYY-MM-DD") + ", people: " + $scope.booking.quantity + "  })"
				 console.log(url)
				 return url
			}
			$scope.booking = {
				start_date: ""
				, end_date: ""
			};

			$scope.showDatePicker = function (ev) {
				$mdpDatePicker($scope.currentDate, {
					targetEvent: ev
				}).then(function (selectedDate) {});;
			}
			$scope.roomResults = [];
			$scope.roomFilter = {
				bookings: {}
			};
			$scope.calCodes = function(key){
				var aval = true
				angular.forEach($scope.roomBeds, function(item){

				if (item.bookings) {
					if (item.bookings[key]) {
						aval = false;
					}
				}

				})
				if (aval) {
					return	"-webkit-box-shadow: inset 0px -2px 54px -9px rgba(18,212,0,1);-moz-box-shadow: inset 0px -2px 54px -9px rgba(18,212,0,1);box-shadow: inset 0px -2px 54px -9px rgba(18,212,0,1);"
				}
				else
				{return "-webkit-box-shadow: inset 0px -2px 54px -9px rgba(212,42,0,1);-moz-box-shadow: inset 0px -2px 54px -9px rgba(212,42,0,1);box-shadow: inset 0px -2px 54px -9px rgba(212,42,0,1);"}
			}
			$scope.searchRooms = function(){
				var days = [];
				var currDate = moment($scope.booking.start_date).clone().startOf('day');
				var lastDate = moment($scope.booking.end_date).clone().startOf('day');
				while (currDate.add('days', 1).diff(lastDate) < 0) {
					console.log(currDate.toDate());
					$scope.roomFilter.bookings[currDate.format('YYYY-MM-DD')] = false;
					days.push(currDate.clone().toDate());

				}
				//angular.forEach()
			}
			$scope.indexShift = function (val) {
				var newindex = $scope.showIndex + val;
				console.log(val, $scope.showIndex, newindex, $scope.pGal[newindex], newindex > $scope.pGal.length - 1, newindex < 0)
				if (newindex > $scope.pGal.length - 1) {
					$scope.showIndex = 0;
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.pGal.length - 1
				}
				else {
					$scope.showIndex = newindex;
				};
			}
			$scope.showIndex = 0;
			$scope.gallery = [];
			$scope.gvrs = [];
			$scope.vrGal = [];
			$firebaseObject(ref.child("media/" + $stateParams.id)).$loaded(function (data) {
				$scope.media = data;
				// $scope.gallery.push(data.branding)
				var wbrand;
				if (data.wide_branding) {
					wbrand = {
						url: data.wide_branding
					}
				} else {
					wbrand = {
						url: "./assets/site/roomplaceholder.jpg"
					}
				}

				$scope.gallery.push(wbrand)
				angular.forEach(data.images, function (value, key) {
					value.id = key;
					$scope.gallery.push(value)
					$scope.centerImg = $scope.gallery[0];
				})
				angular.forEach(data.gvr, function (value, key) {
					obj = value;
					obj.id = key;
					obj.url = $sce.trustAsResourceUrl(value.url)
					$scope.gvrs.push(obj)
				})
				console.log($scope.gallery)
				angular.forEach(data.vr, function (value, key) {
					value.id = key;
					$scope.vrGal.push(value)
					console.log($scope.vrGal)
				})
				if ($scope.vrGal[0]) {
					$scope.loadVR($scope.vrGal[0]);
				}
			})

			$scope.defaultImg = "./assets/site/roomplaceholder.jpg"
			if ($stateParams.date) {
				$scope.booking = {
					start_date: $stateParams.date
					, end_date: $stateParams.end
					, people: $stateParams.people
				}
			}
			$scope.loadBeds = function (booking) {
				var booking = booking;
				var days = [];
				var currDate = moment(booking.start_date).clone().startOf('day');
				var lastDate = moment(booking.end_date).clone().startOf('day');
				while (currDate.add('days', 1).diff(lastDate) < 0) {
					console.log(currDate.toDate());
					days.push(currDate.clone().toDate());
				}
				console.log(days)
				$firebaseObject(ref.child("bookings/" + $stateParams.partner).startAt(currDate.format('YYYY-MM-DD')).endAt(lastDate.format('YYYY-MM-DD'))).$loaded(function (data) {
					$scope.bookings = data;
					angular.forEach($scope.rooms, function (value, key) {
						var booked = false;
						var roomKey = key
						value.id = key;
						angular.forEach(days, function (day) {
							var dateKey = moment(day).format("YYYY-MM-DD")
							if ($scope.bookings[dateKey] && $scope.bookings[dateKey][roomKey]) {
								booked = true;
							}
							// ref.child("bookings/" + $stateParams.partner + "/" + dateKey + "/" + key).once('value', function(snapshot){
							//  booked = true;
							// })
						})
						if (!booked) {
							$scope.results.push(value);
						}
					})
				})
			}
}]).controller('BookingCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Booking', '$interval', '$stateParams', '$mdpDatePicker', 'Stock', '$mdMedia'

		, function ($scope, $firebaseObject, $firebaseArray, Booking, $interval, $stateParams, $mdpDatePicker, Stock, $mdMedia) {
			var ref = firebase.database().ref();


			$scope.showDatePicker = function (ev) {
				$mdpDatePicker($scope.currentDate, {
					targetEvent: ev
				}).then(function (selectedDate) {});;
			}
			$scope.roomResults = [];
			$firebaseObject(ref.child("rooms").orderByChild("vendor").equalTo($stateParams.partner)).$loaded(function (data) {
					$scope.rooms = data;


				})
			$firebaseObject(ref.child("accomm").orderByChild("vendor").equalTo($stateParams.partner)).$loaded(function (data) {
					$scope.roomInfo = data;

				})
				// $scope.defaultImg = "./assets/site/roomplaceholder.jpg"

			$scope.loadBeds = function () {
				Stock.checkRooms($scope.booking).then(function(rooms){

					$scope.roomResults = rooms;



				})

			}
			$scope.roomImg = function(id){
				var room = $scope.rooms[id];
				if (room) {
						var room_type = $scope.roomInfo[room.room_type];
						if (room_type) {
							return room_type.wide_branding
						} else {
							return "./assets/site/roomplaceholder.jpg";
						}
				}



			}
			if ($stateParams.date && $stateParams.end && $stateParams.people) {
				$scope.booking = {
					start_date: $stateParams.date
					, end_date: $stateParams.end,
					quantity: $stateParams.people
				};
				$scope.loadbeds();
			} else {
				$scope.booking = {
					start_date: ""
					, end_date: ""
				};
			}
			$scope.gridId = "";
			$scope.gridSelector = function (key) {
				$scope.gridId = key;
				// if (true) {}
				// $scope.loadPack(item);
			}
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					console.log(id, 2)
					return 2;
				}
				else {
					console.log(id, 1)
					return 1;
				}
			}
			$scope.gridMobile = function (id) {
				if ($mdMedia('xs') || $mdMedia('sm')) {
					if (id == $scope.gridId) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			$scope.tktrRewards = [];



				$firebaseObject(ref.child("info/-KTnRahHfraR-jJZMtyS")).$loaded(function(data){
					console.log(data);
					$scope.tktrRewards.push(data);
				})
				$firebaseObject(ref.child("info/guelltapas")).$loaded(function(data){
					console.log(data);
					$scope.tktrRewards.push(data);
				})
				$firebaseObject(ref.child("info/ons")).$loaded(function(data){
					console.log(data);
					$scope.tktrRewards.push(data);
				})

			$scope.tellMeMore = function(){
				$scope.tktrInfo = !$scope.tktrInfo;
			}
			$scope.bookingLevels = [0, 1, 2, 3, 4];
}]).controller('HomeRecCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$timeout', '$stateParams', '$anchorScroll', '$sce', 'Associations', '$interval', 'uiGmapGoogleMapApi', '$geolocation'




		, function ($scope, $firebaseObject, $firebaseArray, $timeout, $stateParams, $anchorScroll, $sce, Associations, $interval, uiGmapGoogleMapApi, $geolocation) {
			var ref = firebase.database().ref();
			var map;
			var infowindow;
			$scope.location = {};
			$scope.placesData = {};

			function initMap() {
				console.log($scope.location)
				var pyrmont = {
					lat: $scope.location.lat
					, lng: $scope.location.lat
				};
				map = new google.maps.Map(document.getElementById('map'), {
					center: pyrmont
					, zoom: 15
				});
				infowindow = new google.maps.InfoWindow();
				var service = new google.maps.places.PlacesService(map);
				$firebaseArray(ref.child("info").orderByChild("tag").equalTo("recs")).$loaded(function (data) {
					$scope.recs = data;
					console.log(data)
					angular.forEach(data, function (item) {
						console.log(item.placeid, item.$id)
						if (item.placeid) {
							service.getDetails({
								placeId: item.placeid
							}, function (place, status) {
								if (status === google.maps.places.PlacesServiceStatus.OK) {
									$scope.placesData[item.$id] = place;
									console.log(place)
									if (!item.location) {
										ref.child("info").child(item.$id).child("location/lat").set(place.geometry.location.lat())
										ref.child("info").child(item.$id).child("location/lng").set(place.geometry.location.lng())
									}
								}
								else {
									console.log(status)
								}
							});
						}
						else {
							console.log("wrong" + item.$id)
						}
					})
				})
			}
			uiGmapGoogleMapApi.then(function () {
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {

					$scope.location.lat = position.coords.latitude;
					$scope.location.lng = position.coords.longitude;
					$scope.location.loc = [position.coords.latitude, position.coords.longitude];
					initMap();
				});
			})

			function callback(results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {
						createMarker(results[i]);
					}
				}
			}

			function createMarker(place) {
				var placeLoc = place.geometry.location;
				var marker = new google.maps.Marker({
					map: map
					, position: place.geometry.location
				});
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(place.name);
					infowindow.open(map, this);
				});
			}
		}]).controller('TktrHomeCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$timeout', '$stateParams', '$anchorScroll', '$sce', 'Associations', '$interval', 'uiGmapGoogleMapApi', '$geolocation', 'AdminTools', '$mdDialog'





		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $timeout, $stateParams, $anchorScroll, $sce, Associations, $interval, uiGmapGoogleMapApi, $geolocation, AdminTools, $mdDialog) {
			var ref = firebase.database().ref();
			$firebaseArray(ref.child("info").orderByChild("partner").equalTo("acc")).$loaded((function (data) {
				$scope.accArray = data;
				console.log(data)

			}))
			$firebaseObject(ref.child("sites")).$loaded(function(data){
				$scope.siteColours = data;
			})
			$firebaseArray(ref.child("info").orderByChild("partner").equalTo("act")).$loaded((function (data) {
				$scope.actArray = data;
				console.log(data)

			}))
			$firebaseArray(ref.child("media/tktr/vr")).$loaded(function (data) {})
			$scope.grabLoc = function () {
				$scope.vendorApp.location = {};
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.vendorApp.location.lat = $scope.currLoc.lat;
					$scope.vendorApp.location.lng = $scope.currLoc.lng;
					$scope.vendorApp.location.loc = $scope.currLoc.loc;
				});
			}
			$scope.actView = true;
			$scope.accView = true;
			$scope.vendorApp = {};

			$geolocation.getCurrentPosition({
					timeout: 60000
			}).then(function (position) {
					$scope.currLoc.lat = position.coords.latitude;
					$scope.currLoc.lng = position.coords.longitude;
					$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
					$scope.currLoc.gmap = {
						lat: position.coords.latitude
						, lng: position.coords.longitude
					};

			})
}])
.controller('ScreenCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$timeout', '$stateParams', 'Cart', '$sce', 'DateParser', '$interval', '$mdMedia', '$rootScope', '$mdpDatePicker', '$geolocation', '$state', 'Stock', '$mdDialog', '$anchorScroll', '$location'


		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $timeout, $stateParams, Cart, $sce, DateParser, $interval, $mdMedia, $rootScope, $mdpDatePicker, $geolocation, $state, Stock, $mdDialog, $anchorScroll, $location) {
			var ref = firebase.database().ref();
			$scope.partyArray = [];
			$scope.actArray = [];
			$scope.tourArray = [];
			$scope.rentalArray = [];
			$scope.wsArray = [];
			$scope.eventsArray = [];
			console.log("!!!");
			$scope.gridId;
			$scope.gridDist = {	};
			$scope.showSelect = false;
			$scope.showInfo = function(obj){

				$scope.select = {};
				$scope.select = obj;
				$scope.showSelect = true;
				$scope.gotoAnchor("item");
			}
			$scope.gotoAnchor = function (x) {
				var newHash = x;
				if ($location.hash() !== newHash) {
					// set the $location.hash to `newHash` and
					// $anchorScroll will automatically scroll to it
					$location.hash(x);
				}
				else {
					// call $anchorScroll() explicitly,
					// since $location.hash hasn't changed
					$anchorScroll();
				}
			};
			$scope.centerArr = [];
			$scope.switchArr = function(code){
				switch (code) {
					case 'parties':
					$scope.centerArr =	$scope.partyArray

						break;
						case 'watersports':
						$scope.centerArr =	$scope.wsArray

							break;
							case 'tours':
							$scope.centerArr =	$scope.tourArray

								break;
								case 'activities':
								$scope.centerArr =	$scope.actArray

									break;
									case 'rentals':
									$scope.centerArr =	$scope.rentalArray

										break;
										case 'events':
										$scope.centerArr =	$scope.eventsArray

											break;
					default:

				}

				};
			
			$firebaseArray(ref.child("info").orderByChild('product').equalTo(true)).$loaded(function (data) {
				$scope.displayArray = data;

				console.log(data)
				angular.forEach(data, function(item){
					console.log(item.tag)
					switch (item.tag) {
						case 'parties':
							$scope.partyArray.push(item)

							break;
							case 'watersports':
								$scope.wsArray.push(item)

								break;
								case 'tours':
									$scope.tourArray.push(item)

									break;
									case 'activities':
										$scope.actArray.push(item)

										break;
										case 'rentals':
											$scope.rentalArray.push(item)

											break;
											case 'events':
												$scope.eventsArray.push(item)

												break;
						default:

					}
				})
				$scope.centerArr = $scope.partyArray;
			})
			$scope.colGroup = function(arr){
				return arr.length
			}

}])	.controller('HomeCtrl', ['$scope', 'Auth', '$firebaseObject', '$firebaseArray', 'Ticketing', '$timeout', '$stateParams', 'Cart', '$sce', 'DateParser', '$interval', '$mdMedia', '$rootScope', '$mdpDatePicker', '$geolocation', '$state', 'Stock', '$mdDialog', 'User'


		, function ($scope, Auth, $firebaseObject, $firebaseArray, Ticketing, $timeout, $stateParams, Cart, $sce, DateParser, $interval, $mdMedia, $rootScope, $mdpDatePicker, $geolocation, $state, Stock, $mdDialog, User) {
			var ref = firebase.database().ref();
			var geoRef = firebase.database().ref("geofire/products")
			var geoFire = new GeoFire(geoRef);
			$scope.auth = Auth.auth.$getAuth();
			$scope.filtergrow = function(){
				return 1
			};
			$scope.ssiObj = {
				email: ""
			};
			$scope.gimmeBool = false;
			$scope.gimmeStyle = "color: whitesmoke;"
			$scope.gimmeHover = function(){
				$scope.gimmeBool = !$scope.gimmeBool;
				if ($scope.gimmeBool) {
					$scope.gimmeStyle = "color:" + $scope.partner.classes.rgbaaccentcode;
				} else{
					$scope.gimmeStyle = "color: whitesmoke;"
				}
			};
			$scope.safeURL = "";
			$scope.initSLog = function(){
				$scope.ssiBool = true;
				User.initMerge($scope.ssiObj);
				$scope.safeURL = "https://tktr.eu/#/app/tktr/login/" + $rootScope.uid + "/safesignin/"+ $scope.ssiObj.email
			};
			$scope.colGroup = function(arr){
				return arr.length
			}
			$scope.prettyDate = function(id){
				if ($scope.build[id].date && $scope.build[id].time) {
					var date = moment($scope.build[id].date).clone().format("YYYY-MM-DD");
					if ($scope.build[id].time.length > 6 ) {
						
						return moment($scope.build[id].date).clone().format("lll");
					} else{
					var tArr = $scope.build[id].time.split("-");
					
					return moment($scope.build[id].date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
					}
				}
			};
			$scope.ssiBool = false;
			$scope.quoteBool = {};
			$scope.quoteNow = function(id){

				$scope.quoteBool[id] = true;
				console.log(id, $scope.quoteBool[id] )
			}
			$scope.location = {};
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				$scope.location.lat = position.coords.latitude;
				$scope.location.lng = position.coords.longitude;
				$scope.location.loc = [position.coords.latitude, position.coords.longitude];
				ref.child("profiles/" + $scope.auth.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
			});
			$scope.search = {};
			$scope.search.tktr = true;
			$firebaseObject(ref.child("info").child($stateParams.partner)).$loaded(function (data) {
				$scope.partner.info = data;
				$scope.partner.bookingInfo = [];
				if (data.bookingInfo) {
					$firebaseObject(ref.child("bkginfo")).$loaded(function (data) {
						$scope.bookingInfo = data;
					})
					angular.forEach(data.bookingInfo, function(v, k){
						var obj = v;
						obj.id = k;

						$scope.partner.bookingInfo.push(obj);
					})
				}
			})
			$scope.claimNow = function(id){
				$scope.claimObj[id].item = $scope.freebieArray[id].freeb;
				
				if ($scope.user && !$scope.user.prizeClaimed && $scope.auth) {
					
					Ticketing.freeMe($scope.auth.uid, $scope.claimObj[id])
				} 
				// else if ($scope.user && !$scope.user.prizeClaimed && $scope.auth.isAnonymous){
				// 	User.mergeNow($scope.claimObj).then(function(user){
				// 		Ticketing.freeMe($scope.auth.uid, $scope.claimObj);
				// 	})
				// }
			}

			// $scope.loadTimes = function(date){
			// 	$scope.times = [];
			// 	 var day = moment(date).format('YYYY-MM-DD')
			// 	 var mnt = moment(date);
			// 	console.log($scope.buildStatStock, $scope.buildStatStock[day])
			// 	angular.forEach($scope.buildStatStock[day], function(value, key){
			// 		var timeObj = key.split('-');
			// 		console.log(value, key)
			// 		var time = timeObj[0] + ":" + timeObj[1]
			// 		$scope.times.push({
			// 			key: key,
			// 			mnt: mnt,
			// 			time: time
			// 		})
			//
			// 	})
			//
			// }
			$scope.rhIndex = function(){
				if ($scope.showIndex == 0) {
						return "2:1"
				} else {
					return "4:3"
				}
			}
			$scope.addVaya = function(){
				$mdDialog.show({

					templateUrl: "templates/vayaModal.html"
					// , locals: {
					// 	buildObj: imgObj
					// }
					, controller: "VayaModalCtrl"
				})
			}
			$scope.avalnow = function(id){
				var str1 = moment($scope.build[id].date).format('YYYY-MM-DD');
				var str2 = moment($scope.build[id].time).format('HH-mm');

				if ($scope.buildStatStock[id][str1] && $scope.buildStatStock[id][str1][str2] && $scope.buildStatStock[id][str1][str2].available) {
					return $scope.buildStatStock[id][str1][str2].available
				} else if ($scope.buildStatStock[id][str1] && !$scope.buildStatStock[id][str1][str2] && $scope.buildStatStock[id][str1].available) {
					return $scope.buildStatStock[id][str1].available
				}
			}
			$firebaseObject(ref.child("bkginfo")).$loaded(function (data) {
				$scope.bookingInfo = data;
			})
			$scope.distance = function (loc) {
				if($scope.location && $scope.location.loc){return GeoFire.distance(loc, $scope.location.loc)}
			}
			$scope.indexShift = function (val) {
				var newindex = $scope.showIndex + val;
				console.log(val, $scope.showIndex, newindex, $scope.pGal[newindex], newindex > $scope.pGal.length - 1, newindex < 0)
				if (newindex > $scope.pGal.length - 1) {
					$scope.showIndex = 0;
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.pGal.length - 1
				}
				else {
					$scope.showIndex = newindex;
				};
			}
			$scope.showIndex = 0;
			$scope.stockDistance = {};
			$scope.nearest = {
				distance: 100
			};
			$scope.checkStatic = function(id){

				console.log(id, $scope.build[id])
				Stock.checkStatic($scope.build[id]).then(function(resp){
					console.log(resp)
					if (resp) {
						$scope.build[id].greenlit = 1;} else {
							$scope.build[id].greenlit = 2;
						}
				})
			};
			$scope.numbArray = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19]
			$scope.addPack = function (id) {
				var newpack = $scope.packageData[id]
				newpack.quantity = $scope.packz[id];
				ref.child("carts").child($rootScope.uid).child("items").child(id).set(newpack)
			}
			$scope.acceptTerms = function () {
				$scope.termsAccepted = true;
			}
			$scope.colGen = function (bool1, bool2) {
				if (bool1 || bool2) {
					return 2;
				}
				else {
					return 1;
				}
			}
			$scope.packz = {};
			
			$scope.buildStatStock = {};
			$scope.build = {};
			$scope.buildPack = function (id) {
				$scope.buildPack = $scope.packageData[id][id];
				$scope.buildPack.quantity = $scope.build[id].quantity;
			}
			$scope.builder = function (parentKey, item) {
				console.log(item)
				$scope.times[parentKey] = [];
				$scope.build[parentKey] = {};
				var product = $scope.dispArrObj.$getRecord(parentKey);
				$scope.build[parentKey].location = product.location;
				angular.forEach(item.val, function (value, key) {
					$scope.build[parentKey][key] = value;
				})
		
				$scope.build[parentKey].date = null;
				$scope.build[parentKey].time = null;
				$scope.build[parentKey].pid = item.key;
				$scope.build[parentKey].parent = parentKey;
			
				$scope.build[parentKey].greenlit = 0;

				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											
											if (moment(cQ).isAfter()) {
											$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
											}
										}
										
									})
								} else {
									$scope.times[parentKey] = [{key: "00-00"}];
								}
								})
					})
				}
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
				

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){
								if(v2 ){
									var cQ = key1 + " " + k2;
									if (moment(cQ).isAfter()) {
											$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
											}
								}
								
							})
						} else {
							$scope.times[parentKey] = [{key: "00-00"}];
						}
						})
					})

				}
			};
			$scope.stops = [ "junta", "rraval"];
			
			$scope.clearBuild = function(id){
				$scope.build[id] = null;
			};
			$scope.tempDate = {};
			$scope.builderVaya = function (parentKey) {
				$scope.times[parentKey] = [];
				$scope.build[parentKey] = {};
				var product = $scope.dispArrObj.$getRecord(parentKey);
				$scope.build[parentKey].location = product.location;
				var pkey = Object.keys($scope.packageData[parentKey])[0];
				var item = $scope.packageData[parentKey][pkey];
				angular.forEach(item, function (value, key) {
					$scope.build[parentKey][key] = value;
				})
				
				$scope.build[parentKey].date = $scope.tempDate;
				$scope.build[parentKey].time = null;
				$scope.build[parentKey].pid = pkey;
				$scope.build[parentKey].parent = parentKey;
			
				$scope.build[parentKey].greenlit = 0;
				console.log($scope.build)
				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
					

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											if (moment(cQ).isAfter()) {
											$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
											}
										}
										
									})
								} else {
									$scope.times[parentKey] = [{key: "00-00"}];
								}
								})
					})
				}
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){
								if(v2 ){
									var cQ = key1 + " " + k2;
									$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm"), key: k2})
								}
								
							})
						} else {
							$scope.times[parentKey] = [{key: "00-00"}];
						}
						})
					})

				}
			}
			$scope.addToCart = function (key) {
				$scope.build[key].time = moment($scope.build[key].time).format("lll");
				Cart.addItem($scope.build[key]);
			};
			$scope.validDates = {};
			$scope.today = moment().format('YYYY-MM-DD');
			$scope.validate = function (date) {
				var key = moment(date).format('YYYY-MM-DD')
				
				return !$scope.validDates[key];
			}
			$scope.loadTimes = function(id){
				
				if ($scope.buildStatStock && $scope.buildStatStock[id]) {
				// var timeArray = [];
				 var date = $scope.build[id].date;
				  var day = moment(date).format('YYYY-MM-DD');
				//  var mnt = moment(date);
				// console.log($scope.buildStatStock, $scope.buildStatStock[day])
				// angular.forEach($scope.buildStatStock[day], function(value, key){
				// 	var timeObj = key.split('-');
				// 	console.log(value, key)
				// 	var time = timeObj[0] + ":" + timeObj[1]
				// 	 timeArray.push({
				// 		key: key,
				// 		mnt: mnt,
				// 		time: time
				// 	})
			
				// })
				// return timeArray;
				console.log($scope.buildStatStock[id][day])
				return Object.keys($scope.buildStatStock[id][day])
			 }
				
			}
			$scope.checkStock = function(key){

				Stock.checkStock($scope.build[key]).then(function(data){
					if(data){
						$scope.build[key].stock = data;
						$scope.build[key].greenlit = 1;
						console.log($scope.build[key].stock);
					}
				}).catch(function(err){
					$scope.build[key].time = null;
					$scope.build[key].quantity = null;
					$scope.build[key].greenlit = 2;
					alert(err);
				})
			}
			$firebaseObject(ref.child("packages")).$loaded(function (data) {
				$scope.packageData = data;
			})
			$scope.times = {};
			// $scope.checkDay = function (id, time) {
			// 	// console.log(moment(time).isSame($scope.build.date, 'day'))
			// 	console.log(time, id)
			// 	if ($scope.build[id]) {return moment(time).isSame($scope.build[id].date, 'day')}
			// 	else {
			// 		return false;
			// 	}
			// }
			$scope.prettyTime = function (time) {
				var timeObj = time.split('-');
				var newTime = timeObj[0] + ":" + timeObj[1]
				return newTime
			}
			$scope.gridId = "";
			$scope.gridSelector = function (item) {
				$scope.gridId = item.$id;
				// if (true) {}
				// $scope.loadPack(item);
			}
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					console.log(id, 2)
					return 2;
				}
				else {
					console.log(id, 1)
					return 1;
				}
			}
			$scope.gridMobile = function (id) {
				if ($mdMedia('xs') || $mdMedia('sm')) {
					if (id == $scope.gridId) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			$firebaseObject(ref.child("partners").child($stateParams.partner)).$loaded(function (data) {
				$scope.partner.details = data;
			})
			if ($scope.partnerMedia) {
				$scope.topImg = $scope.partnerMedia.images
			}
			$scope.optShow = function (tag) {
				if ($mdMedia('gt-sm') || $scope.search.tag == tag) {
					return true
				}
				else if (tag == 'acts' && !$scope.search.cat) {
					return true
				}
			}
			$scope.mediaSwitch = function (code) {
				switch (code) {
				case 'images':
					$scope.noVrBool = true;
					break;
				case 'video':
					$scope.noVrBool = true;
					break;
				case 'sphere':
					$scope.noVrBool = false;
					break;
				}
			}
			$scope.displayMenu = false;
			$scope.openMenu = function () {
				$scope.displayMenu = true;
			}
			$scope.selTop = function (choice) {
				$scope.topSel = choice;
			}
			$scope.topSel = 'products';
			$scope.showProd = function (k) {
				$scope.centerProd = k;
			}
			$scope.showProduct = function (k) {
				$scope.centerProduct = k;
			}
			$scope.selPack = function (pack) {
				$scope.packSel = pack;
			}
			$scope.packSel = {};
			$scope.galleries = {};
			$scope.prepareGalleries = function () {
				angular.forEach($scope.displayArray, function (item) {
					if (item.tktrpack) {
						$firebaseArray(ref.child("media").child(item.$id).child("images")).$loaded(function (data) {
							$scope.galleries[item.$id] = data;
						})
					}
				})
				$scope.startPackRotate();
			}
			$scope.conflictRes = function (itemKey) {
				if ($scope.partner.details && $scope.partner.details.conflicts) {
					var result = true;
					angular.forEach($scope.partner.details.conflicts, function (value, key) {
						if (itemKey == key) {
							result = false;
							console.log("yay resolved")
						}
					})
					console.log("noproblems = " + result)
					return result;
				}
				else {
					return true;
				}
			}
			$scope.packFilter = {
				tktrpack: true
			};
			$scope.vendorFilter = {};
			if ($stateParams.partner != 'partybypaul') {
			$scope.vendorFilter.vendor = $stateParams.partner;
		} else {
			$scope.vendorFilter.tktr = true;
		}
			
			// $scope.search.cat = "bar";
			$scope.valEnq = "";
			$scope.sendEnq = function () {
				Associations.sendEnquiry($scope.valEnq)
			}
			$scope.partnerFilter = {
				partner: true
			}
			$scope.loading = false;
			$scope.switchFilter = function (filter) {
					if (filter == "recs") {
						$scope.search.tag = "recs";
						$scope.search.cat = "bar";
						$scope.gotoAnchor("selection")
						console.log($scope.search)
					}
					else {
						$scope.search = {};
						$scope.search.tag = "parties";
						$scope.gotoAnchor("selection")
						console.log($scope.search)
					}
				}
				// $scope.fillMe = function(code){
				// if($scope.partner.classes){
				//     if ($scope.search.tag == code) {
				//       console.log("filled" + code + "successfully", $scope.partner.classes.hex)
				//       return $scope.partner.classes.hex
				//     } else if ($scope.search.tag == 'recs' && $scope.search.cat == code) {
				//       console.log("filled" + code + "successfully")
				//       return $scope.partner.classes.hex
				//     } else {
				//       console.log("filled" + code + "nope")
				//       return "#B5B5B5"
				//     }
				//  }
				// }
			$scope.switchTag = function (tag) {
				$scope.search = {};
				$scope.search.tag = tag;
				$scope.displayMenu = true;
				angular.forEach($scope.displayArray, function (item) {
						if (item.tag == tag) {
							$scope.centerProd = item;
						}
					})
					// $scope.gotoAnchor("results");
			}
			$scope.switchCat = function (tag) {
				$scope.search = {
					tag: 'recs'
				};
				$scope.search.cat = tag;
				$scope.displayMenu = true;
				angular.forEach($scope.displayArray, function (item) {
						if (item.tag == tag) {
							$scope.centerProd = item;
						}
					})
					// $scope.gotoAnchor("results");
			}
			
			$scope.vrGal = [];
			$scope.dispArrObj = $firebaseArray(ref.child("info"));
			$scope.dispArrObj.$loaded(function (data) {
				$scope.displayArray = data;
				$scope.centerProd = data[18];
				$scope.prepareGalleries();
			});
			$scope.claimObj = [{}];
			$scope.freebieQ = {};
			$scope.freebieArray = [];
			$scope.freebieBool = false;
			var fArray;
			
				
				fArray = $firebaseArray(ref.child("freebies").orderByChild($stateParams.partner + "/available").startAt(1))
				fArray.$loaded(function(data){
					console.log(data)
					if(data){
						
						
						console.log(data);
					angular.forEach(data, function(item){
						var obj = $scope.dispArrObj.$getRecord(item.pid);
						obj.freeb = item;
						$scope.freebieArray.push(obj);
					})
					}
					
				})
			$scope.qFree = function(){
				$scope.freebieBool = true;
			}
			$scope.closeFreebie = function(){
				$scope.freebieBool = false;
			}
			$scope.pGal = [];
			$firebaseObject(ref.child("media/" + $stateParams.partner)).$loaded(function (data) {
				$scope.partnerMedia = data;
				$scope.pGal.push({
					url: data.wide_branding
					, i: 0
				})
				var i = 1;
				angular.forEach(data.images, function (v, k) {
					var img = v;
					img.id = k;
					img.ind = i;

					$scope.pGal.push(img)
					i++
				});

				if (data.vr){
			$scope.noVrBool = false;
					angular.forEach(data.vr, function (v, k) {
					var vrO = v;
					vrO.id = k;
					vrO.ind = i;

					$scope.vrGal.push(vrO)
					i++
				});
					$scope.loadVR($scope.vrGal[0]);
				}

//
			})
			
			$scope.vrIndex = 0;
			$scope.shiftVr = function(val){
		
				var arrLength = $scope.vrGal.length -1
				console.log($scope.vrGal[0].url, val)
				if (val === 'x') {
					var rIndex =  Math.random() * (arrLength - 0) + 0;
					console.log($scope.vrGal[rIndex].url, rIndex)
					$scope.loadVR($scope.vrGal[rIndex]);
						$scope.vrIndex = rIndex;
					
						
				} else {

						var newindex = $scope.vrIndex + val;
					
					if (newindex > $scope.vrGal.length - 1) {
						$scope.vrIndex = 0;
						$scope.loadVR($scope.vrGal[$scope.vrIndex]);
					}
					else if (newindex < 0) {
						$scope.vrIndex = $scope.vrGal.length - 1
						$scope.loadVR($scope.vrGal[$scope.vrIndex]);
					}
					else {
						$scope.vrIndex = newindex;
						$scope.loadVR($scope.vrGal[$scope.vrIndex]);
					};
				
				}
			}

			$scope.loadVR = function (vr) {
				var PSV = new PhotoSphereViewer({
					panorama: vr.url
					, container: 'home'
					, loadingImg: $scope.partnerMedia.partner_logo
					, time_anim: 3000
					, navbar: true
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, gyroscope: true
					, usexmpdata: true
					, auto_rotate: true
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

			$scope.imgInds = {
				pack1: 0
				, pack2: 0
				, pack3: 0
				, pack4: 0
			};
			$scope.startPackRotate = function () {
				$interval(function () {
					if ($scope.imgInds.pack1 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack1++;
					}
					else {
						$scope.imgInds.pack1 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3500)
				$interval(function () {
					if ($scope.imgInds.pack2 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[1]];
						$scope.imgInds.pack2++;
					}
					else {
						$scope.imgInds.pack2 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3200)
				$interval(function () {
					if ($scope.imgInds.pack3 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack3++;
					}
					else {
						$scope.imgInds.pack3 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 2700)
				$interval(function () {
					if ($scope.imgInds.pack4 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack4++;
					}
					else {
						$scope.imgInds.pack4 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3700)
			}
			$scope.imgIndex = 0;

			$scope.noVrBool = true;

			var PSV;
			$scope.centerVR = "";
			$scope.moreInfo = false;
			$scope.showMore = function () {
				this.showMore = !this.showMore;
			}
			$scope.recFilter = {
				tag: "recs"
				, cat: "sights"
			};
			$scope.recfilters = [{icon: "assets/site/cat_clubs_btn.svg",text:"club"}, {icon: "assets/site/cat_bars_btn.svg",text:"bar"}, {icon: "assets/site/cat_restaurants_btn.svg",text:"restaurant"}, {icon: "assets/site/cat_shops_btn.svg",text:"shop"}, {icon: "assets/site/cat_sights_btn.svg",text:"sights"}]
			$scope.filters = [{icon: "assets/site/cat_vipclubbing_btn.svg",text:"parties"}, {icon: "assets/site/cat_watersports_btn.svg",text:"watersports"},{icon: "https://firebasestorage.googleapis.com/v0/b/tktr-fa4cf.appspot.com/o/media%2Ftktr%2FTKTR.es_150x150.png?alt=media&token=01a4c9c2-6746-4bb3-973c-27f7fc544f86",text:"tktr"}, {icon: "assets/site/cat_guidedtours_btn.svg",text:"tours"}, {icon: "assets/site/cat_rentanything_btn.svg",text:"rentals"}, {icon: "assets/site/cat_activities_btn.svg",text:"activities"}];
			$scope.pillFn = function (filter, attr) {
				if ($scope.partner.classes) {
					if ($scope.search[attr] == filter) {
						return $scope.partner.classes.color
					}
					else {
						return $scope.partner.classes.accent
					}
				}
			}
			$scope.display = {
				parties: true
				, outdoor: false
				, watersports: false
				, tours: false
				, rentals: false
			};
			$scope.vrHider = function (){
				if ($scope.noVrBool) {
					return "height: 0px;"
				} else {
					return "height: max-content;"
				}
			}
			$scope.searchFilter = function(attr, text){
				
				if (text == 'tktr') {
					$scope.search = {
						tktr: true
						}
				} else {
					switch(attr){
					case 'tag':
						$scope.search = {
						tag: text
						}
						break;
					case 'cat':
						$scope.recFilter = {
						tag: "recs",
						cat: text
						}
						break;
				}
				}
			}
			$scope.checkTag = function (tag) {
				//  var result = false;
				//  console.log(tag)
				// angular.forEach($scope.display, function(tags, keys){
				//  if (tags == tag) {
				//    result = true;
				//  }
				return $scope.display[tag]
					// })
					// console.log(result)
					// return result
			}
			$scope.recs = [];
			$firebaseArray(ref.child("recommendations")).$loaded(function (data) {
				// angular.forEach(data, function(item){
				$scope.recs = data;
				// });
			})
			$scope.trustSrc = function (src) {
				return $sce.trustAsResourceUrl(src);
			}
			$scope.bigMedia = {
				images: []
				, vr: []
			};
		}]).controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.contactForm = {};
		$scope.contactUs = function () {
			$http({
				"method": "POST"
				, "url": "https://www.pbpapi.com/contact", // "url": "https://e9feb6d3.ngrok.io/contact",
				"data": {
					"email": $scope.contactForm.email
					, "subject": $scope.contactForm.subject
					, "body": $scope.contactForm.body
				, }
			}).then(function (response) {
				$mdDialog.hide();
			})
		};
}]).controller('CategoryCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$interval', '$stateParams', 'Cart', 'DateParser', '$mdMedia', 'Stock'



		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $interval, $stateParams, Cart, DateParser, $mdMedia, Stock) {
			var ref = firebase.database().ref();
			var geoRef = firebase.database().ref("geofire/products")
			var geoFire = new GeoFire(geoRef);
			$scope.search;
			// angular.forEach($scope.displayArray, function(item){
			//   if (item.tag == $stateParams.id) {
			//     $scope.catArray.push(item);
			//   }
			// })
			$scope.packageData = {};
			
			$scope.siteInfo = {
				watersports: "adrenalintitle"
				, tables: "tablestitle"
				, outdoor: "outdoortitle"
				, tours: "tourstitle"
				, rentals: "rentaltitle"
				, contact: "contacttitle"
				, parties: "viptitle"
				, bar: "bar"
				, club: "club"
				, restaurant: "restaurant"
				, shop: "Shops"
				,activities : "activities"
			}
			$scope.catTitle = $scope.siteInfo[$stateParams.id];
			function loadPacks(array){
				angular.forEach(array, function(item){
					ref.child("packages").child(item.$id).once('value', function(snap){
						$scope.packageData[item.$id] =	snap.val();					
					})
				})
			}
			$scope.dispArrObj;
			if ($stateParams.id === "parties" || $stateParams.id === "outdoor" || $stateParams.id === "tours" || $stateParams.id === "rentals" || $stateParams.id === "watersports" || $stateParams.id === "activities") {
				$scope.dispArrObj = $firebaseArray(ref.child("info").orderByChild('tag').equalTo($stateParams.id))
				$scope.dispArrObj.$loaded(function (data) {
				$scope.displayArray = data;
				loadPacks(data);
				console.log(data)
			}, function (err) {
				console.log(err)
			});
			}
			else if($stateParams.id == 'tktr'){
				$scope.dispArrObj = $firebaseArray(ref.child("info").orderByChild('tktr').equalTo(true))
				$scope.dispArrObj.$loaded(function (data) {
				$scope.displayArray = data;
				console.log(data)
				loadPacks(data);
				$scope.prepareGalleries();
				}, function (err) {
					console.log(err)
				});
			}
			else {
				$scope.dispArrObj = $firebaseArray(ref.child("info").orderByChild('cat').equalTo($stateParams.id))
				$scope.dispArrObj.$loaded(function (data) {
				$scope.displayArray = data;
				console.log(data)
				loadPacks(data);
				}, function (err) {
					console.log(err)
				});
			}
			$scope.distance = function (loc) {
				return GeoFire.distance(loc, $scope.user.location)
			}
			$scope.checkStatic = function(id){
				console.log(id, $scope.build[id])
				Stock.checkStatic($scope.build[id]).then(function(resp){
					console.log(resp)
					if (resp) {
						$scope.build[id].greenlit = 1;} else {
							$scope.build[id].greenlit = 2;
						}
					
				})
			};
		
$scope.numbArray = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19]
	$scope.build = {};
			$scope.buildPack = function (id) {
				$scope.buildPack = $scope.packageData[id][id];
				$scope.buildPack.quantity = $scope.build[id].quantity;
			}
			$scope.builder = function (parentKey, item) {
				console.log(item)
				$scope.times[parentKey] = [];
				$scope.build[parentKey] = {};
				var product = $scope.dispArrObj.$getRecord(parentKey);
				$scope.build[parentKey].location = product.location;
				angular.forEach(item.val, function (value, key) {
					$scope.build[parentKey][key] = value;
				})
		
				$scope.build[parentKey].date = null;
				$scope.build[parentKey].time = null;
				$scope.build[parentKey].pid = item.key;
				$scope.build[parentKey].parent = parentKey;
			
				$scope.build[parentKey].greenlit = 0;
				console.log($scope.build)
				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).format("HH:mm"), key: k2})
										}
										
									})
								} else {
								
									$scope.times[parentKey] = [{key: "00-00"}];
								}
								})
					})
				}
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){
								if(v2 ){
									var cQ = key1 + " " + k2;
									$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm")})
								}
								
							})
						} else {
							
							$scope.times[parentKey].push({mnt: moment(k), time: moment(k).format("YYYY-MM-DD")})
						}
						})
					})

				}
			}
			$scope.prettyDate = function(id){
				if ($scope.build[id].date) {
					var date = moment($scope.build[id].date).clone().format("YYYY-MM-DD");
					if ($scope.build[id].time.length > 6 ) {
						
						return moment($scope.build[id].date).clone().format("lll");
					} else {
					var tArr = $scope.build[id].time.split("-");
					
					return moment($scope.build[id].date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
					}
				}
			};
			$scope.stops = [ "junta", "rraval"];

			$scope.clearBuild = function(id){
				$scope.build[id] = null;
			};
			$scope.tempDate = {};
			$scope.builderVaya = function (parentKey) {
				$scope.times[parentKey] = [];
				$scope.build[parentKey] = {};
				var product = $scope.dispArrObj.$getRecord(parentKey);
				$scope.build[parentKey].location = product.location;
				var pkey = Object.keys($scope.packageData[parentKey])[0];
				var item = $scope.packageData[parentKey][pkey];
				angular.forEach(item, function (value, key) {
					$scope.build[parentKey][key] = value;
				})
				$scope.build[parentKey].date = $scope.tempDate;
				$scope.build[parentKey].time = null;
				$scope.build[parentKey].pid = pkey;
				$scope.build[parentKey].parent = parentKey;
			
				$scope.build[parentKey].greenlit = 0;
				console.log($scope.build)
				// if (item.stops) {
				// 	$scope.stops = [];
				// 	angular.forEach(item.stops, function(value, key){
				// 		var obj = value;
				// 		obj.key = key;
				// 		$scope.stops.push(obj);
				// 	})
				// }
				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).format("HH:mm"), key: k2})
										}
										
									})
								} else {
									$scope.noTimeBool[e.$id] = true;
									$scope.times[parentKey] = [{key: "00-00"}];
								}
								})
					})
				}
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + parentKey).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							$scope.times[parentKey] = [];
							var key1 = k;
							if (!v.capacity || v.capacity == undefined) {
							angular.forEach(v, function(v2, k2){
								if(v2 ){
									var cQ = key1 + " " + k2;
									$scope.times[parentKey].push({mnt: moment(cQ), time: moment(cQ).add(-1, 'hours').format("HH:mm")})
								}
								
							})
						} else {
							$scope.noTimeBool[e.$id] = true;
							$scope.times[parentKey].push({mnt: moment(k), time: moment(k).format("YYYY-MM-DD")})
						}
						})
					})

				}
			}
			$scope.checkStock = function(key){
				Stock.checkStock($scope.build[key]).then(function(data){
					if(data){
						$scope.build[key].stock = data;
						$scope.build[key].greenlit = true;
						console.log($scope.build[key].stock);
					}
				}).catch(function(err){
					$scope.build[key].time = null;
					$scope.build[key].quantity = null;
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
			$scope.checkDay = function (key, time) {
				return moment(time).isSame($scope.build[key].date, 'day')
			}
			$scope.addToCart = function (key) {
				Cart.addItem($scope.build[key]);
			};


			$scope.prettyTime = function (time) {
				var timeObj = time.split('-');
				var newTime = timeObj[0] + ":" + timeObj[1]
				return newTime
			}
			$scope.gridId = "";
			$scope.gridSelector = function (item) {
				$scope.gridId = item.$id;
				// if (true) {}
				// $scope.loadPack(item);
			}
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					console.log(id, 2)
					return 2;
				}
				else {
					console.log(id, 1)
					return 1;
				}
			}
			$scope.gridMobile = function (id) {
				if ($mdMedia('xs') || $mdMedia('sm')) {
					if (id == $scope.gridId) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			$scope.galleries = {};
			$scope.prepareGalleries = function () {
				angular.forEach($scope.displayArray, function (item) {
					if (item.tktrpack) {
						$firebaseArray(ref.child("media").child(item.$id).child("images")).$loaded(function (data) {
							$scope.galleries[item.$id] = data;
						})
					}
				})
				$scope.startPackRotate();
			}
			$scope.imgInds = {
				pack1: 0
				, pack2: 0
				, pack3: 0
				, pack4: 0
			};
			$scope.startPackRotate = function () {
				$interval(function () {
					if ($scope.imgInds.pack1 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack1++;
					}
					else {
						$scope.imgInds.pack1 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3500)
				$interval(function () {
					if ($scope.imgInds.pack2 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[1]];
						$scope.imgInds.pack2++;
					}
					else {
						$scope.imgInds.pack2 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3200)
				$interval(function () {
					if ($scope.imgInds.pack3 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack3++;
					}
					else {
						$scope.imgInds.pack3 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 2700)
				$interval(function () {
					if ($scope.imgInds.pack4 < 3) {
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
						$scope.imgInds.pack4++;
					}
					else {
						$scope.imgInds.pack4 = 0;
						// $scope.centerImg = $scope.partner.images[$scope.imgInds[0]];
					}
				}, 3700)
			}
}]).controller('EventsCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', '$interval'






		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, $interval) {
			var ref = firebase.database().ref();
			$scope.lineup;
			$scope.headliners;
			$firebaseArray(ref.child("events/schedule")).$loaded(function (data) {
				$scope.lineup = data;
				console.log(data)
			}, function (err) {
				console.log(err)
			})
			$firebaseArray(ref.child("events/guests")).$loaded(function (data) {
				$scope.headliners = data;
				console.log(data)
				$interval(function () {
					var img = $scope.headliners.shift();
					$scope.headliners.push(img)
				}, 6000)
			}, function (err) {
				console.log(err)
			})
}]).controller('TermsCtrl', ['$scope', function ($scope) {}])
.controller('ArrivalCtrl', ['$scope', '$state', 'Auth', '$rootScope', '$interval', '$timeout', '$stateParams', '$mdMedia'

		, function ($scope, $state, Auth, $rootScope, $interval, $timeout, $stateParams, $mdMedia) {
			var firebaseRef = firebase.database().ref('geofire');
			var ref = firebase.database().ref();
			// Create a new GeoFire instance at the random Firebase location
			// $scope.loading = 0;
			// $scope.authBool = false;
			// $scope.adminBool = false;
			// $scope.anonCont = function() {
				
			
			$scope.auth ={}
			$scope.auth.uid = Auth.uid();
			console.log($scope.auth);
			if ($scope.auth.uid) {
				ref.child("profile").child($scope.auth.uid).once('value', function(data){
					if ($stateParams.partner != 'portal') {
						$state.go("app.home.store");
					} else if ($stateParams.partner == 'portal' && data.staff) {
						$state.go("app.admin.dash", {vendor: data.staff});
					} else if (!data){
						ref.child("profiles").child($scope.auth.uid).set({
								name: "Guest"
								, uid: $scope.auth.uid
								, voucher: $stateParams.partner
								})
						$state.go("app.home.store");
					}
				})
		
			} else {
				// $timeout(function(){
					if ($stateParams.partner != 'portal') {
						
					Auth.auth.$signInAnonymously().then(function (firebaseUser) {
					$scope.auth = firebaseUser;
					$scope.authBool = true;
					$rootScope.uid = firebaseUser.uid;
					ref.child("profiles").child(firebaseUser.uid).set({
								name: "Guest"
								, uid: firebaseUser.uid
								, voucher: $stateParams.partner
								})
					$state.go("app.home.store");
				}).catch(function (error) {
					console.error("Authentication failed:", error);
					
				});
				}
				
			}
			$scope.logShow = function(code){
				return $scope.logBool == code;
			};
			$scope.anonCont = function(){
				Auth.auth.$signInAnonymously().then(function (firebaseUser) {
					$scope.auth = firebaseUser;
					$scope.authBool = true;
					$rootScope.uid = firebaseUser.uid;
					ref.child("profiles").child(firebaseUser.uid).set({
								name: "Guest"
								, uid: firebaseUser.uid
								, voucher: $stateParams.partner
								})
					$state.go("app.home.store");
				}).catch(function (error) {
					console.error("Authentication failed:", error);
					
				});
			}
			
			$scope.tabletWelcome = function(){
				if ($mdMedia('gt-sm')) {
					return 40
				} else if ($mdMedia('portrait')) {
					return 100
				}
			}
}])

	// .controller('SideCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth',
	//  function($scope, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth){
	//  var auth = Auth.auth.$getAuth();
	//   var ref = firebase.database().ref();
	//  }
	//  $firebaseArray(ref.child("events/schedule")).$loaded(function(data){
	//   $scope.lineup = data;
	//  })
	//  $scope.events
	// }])
	.controller('TicketSideCtrl', ['$scope', '$state', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$rootScope', '$http', '$state', '$mdToast', 'User'

		, function ($scope, $state, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $rootScope, $http, $state, $mdToast, User) {
			var ref = firebase.database().ref();
			$scope.addTable = false;
			$scope.tableaddons;
			$scope.auth = Auth.auth.$getAuth();
			if (!$rootScope.uid || $rootScope.uid == "undefined") {
				
				if ($scope.auth) {
					console.log($scope.auth)
					$rootScope.uid = $scope.auth.uid;
					$scope.uid = $scope.auth.uid;
				}
				else {
					$state.go("app.landing");
				}
			}
			else {
				$scope.uid = $rootScope.uid;
			}
			//     $firebaseObject(ref.child("profiles/" + $scope.uid)).$bindTo($scope, 'profile')
			//     var cartObj = $firebaseObject(ref.child("carts/" + uid ))
			//     cartObj.$bindTo($scope, 'cart').then(function(){
			//       if ($scope.cart.items) {
			//         $scope.showPaypal = true;
			//   }
			// })
			console.log($scope.auth)

			$scope.closeThis = function(){
				$scope.showPayPal = false;
			}
			$scope.signOut = function(){
				$scope.closeSNav('right', Auth.auth.$signOut())
				// Auth.auth.$signOut().then(function(){
				// 	;
				// })
			}
			$scope.tixHref = function(){
				$scope.closeSNav('right', $state.go("app.tickets", {uid: $scope.uid}))
				// Auth.auth.$signOut().then(function(){
				// 	;
				// })
			}
			$scope.deltaQ = function(id, val){
				console.log($scope.cart.items[id].quantity + val == 0)
				if ($scope.cart.items[id].quantity + val == 0) {
					Cart.removeItem(id);
				}
					else {
						$scope.cart.items[id].quantity += val
					}
				
			}
			$scope.showPayPal = false;
			var cartObj;
			function loader(uid) {
				console.log("loading")
				$firebaseObject(ref.child("profiles/" + $scope.uid)).$bindTo($scope, 'profile')
				cartObj = $firebaseObject(ref.child("carts/" + $scope.uid))
				cartObj.$bindTo($scope, 'cart').then(function () {
					if ($scope.cart.items) {

					}
					cartObj.$watch(function () {
						var new_total = 0.00;
						var tax_total = 0.00;
						if ($scope.cart.items) {
							angular.forEach($scope.cart.items, function (value, key) {
								new_total += value.price * value.quantity;
								tax_total += value.tax * value.quantity
							})
						}
						$scope.cart.total = new_total;
						$scope.cart.tax = tax_total;
					})
				})
			}
			if ($scope.uid) {
				loader()
			}
			else {
				$scope.auth = Auth.auth.$getAuth();
				if (!$scope.auth) {
					$state.go("app.landing")
				}
				else {
					loader($scope.uid)
				}
				$scope.cart = {
					total: 0.00
					, items: []
				}
			}
			$scope.mergeObj = {};
			$scope.mergeNow = function(){
				User.mergeNow($scope.mergeObj.email).then(function(data){
					console.log(data)
						$scope.payNow()
						$scope.authNow = false;
				
					
				})
				
			}
			$scope.authNow = false;
			$scope.payNow = function () {
				console.log($scope.auth.isAnonymous)
				$scope.showPayPal = true;
				
					
					paypal.checkout.setup('KWPCEZL8SC7XS', {
					environment: 'live'
					, container: 'paypalbtn'
					, click: function () {
						paypal.checkout.initXO();
						var req = {
							"method": "POST"
							,
							"url" : "https://www.pbpapi.com/tktr/" + $stateParams.partner + "/pay",
							// "url" : "https://312c30f7.ngrok.io/tktr/" + $stateParams.partner + "/pay",
							"data": {
								"uid": $scope.uid
							}
						}
						$http(req).then(function (response) {
							$scope.tempToken = response.data.token;
							console.log(response)
							paypal.checkout.startFlow(response.data.token);
						}, function (err) {
							console.log(err)
							paypal.checkout.closeFlow();
						})
					}
				});
				
			}
			$scope.payForce = function () {
				paypal.checkout.startFlow($scope.tempToken);
			}
			$scope.removeItem = function (key) {
					Cart.removeItem(key);
				}
				// $firebaseArray(ref.child("events/schedule")).$loaded(function(data){
				//  $scope.lineup = data;
				// })
			$scope.hideCart = "true";
			$scope.emptyCart = function () {
				Cart.empty();
			}
}]).controller('AdminCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', '$mdMedia', 'Auth'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, $mdMedia, Auth) {
			var ref = firebase.database().ref();
			$scope.admin = {};
			var uid = $rootScope.uid;
			
			if (!uid) {
				var auth = Auth.auth.$getAuth();
				if (auth) {
					$rootScope.uid == auth.uid;
				} else {
					$state.go("app.landing");
				}
			}
			$scope.signOut = function(){
				// $scope.closeSNav('right', )
				// // Auth.auth.$signOut().then(function(){
				// // 	;
				// // })
				$mdSidenav('right')
					
					.close()
					.then(function(){
						Auth.auth.$signOut()
					});
			}
			$firebaseObject(ref.child("profiles/" + uid)).$loaded(function (data) {
				$scope.admin.profile = data;
				// $scope.$watch("admin.profile", function(n, o){
				// 		console.log(n,o)
				// 	if (!n) {
				// 		$firebaseObject(ref.child("profiles/" + uid)).$loaded(function (data) {
				// 			$scope.admin.profile = data;
				//
				// 		})
				// 			}
				// 		});


				console.log(data)
			})
			$firebaseObject(ref.child("admins/" + uid)).$loaded(function (data) {
				if (!data || data == null) {
					$state.go("app.home.store")
				}
				else {
					$scope.admin.rank = data.$value;
					// $scope.$watch("admin.rank", function(n, o){
					// 	console.log(n,o)
					// 	if (!n) {
					// 		$firebaseObject(ref.child("admins/" + uid)).$loaded(function (data) {
					// 			$scope.admin.rank = data.$value;
					//
					// 		})
					// 			}
					// 		});
				}
				console.log(data)
				console.log($scope.admin)
			})
}])
.controller('AdminDashCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', '$mdMedia', 'Auth', '$stateParams'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, $mdMedia, Auth, $stateParams) {
			var ref = firebase.database().ref();
			$scope.commTotal = 0.00;
			$scope.commMonth = 0.00;
		$firebaseObject(ref.child("comms/partners").child($stateParams.vendor)).$loaded(function(data){
			$scope.commArray = data.storage;
			console.log(data);
			if (!data.total) {
				angular.forEach(data.storage, function(comm, k){
					$scope.commTotal += comm.val;
					console.log($scope.commTotal)
				
					if (moment(comm.created).isSame(moment(), 'month')) {
						$scope.commMonth += comm.val;
						console.log($scope.commMonth)
					}
				})
			}
			
			
		})
		if ($stateParams.vendor == 'tktr' && $scope.admin.rank == 100) {
			$firebaseObject(ref.child("comms/board")).$loaded(function(data){
				angular
			})
		}
		$scope.commArray = [];
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
}])
.controller('AdminStopsCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', '$mdMedia', 'Auth', '$stateParams'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, $mdMedia, Auth, $stateParams) {
			var ref = firebase.database().ref();
			$scope.commTotal = 0.00;
			$scope.commMonth = 0.00;
		$firebaseObject(ref.child("info").orderByChild("route")).$loaded(function(data){
			$scope.products = data;
			console.log(data);		
		})

		$scope.grabLoc = function () {
				$scope.newRec.location = {};
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.newRec.location.lat = $scope.currLoc.lat;
					$scope.newRec.location.lng = $scope.currLoc.lng;
					$scope.newRec.location.loc = $scope.currLoc.loc;
				});
			}
			$scope.input = "";

			function initMap(center) {
				var map = new google.maps.Map(document.getElementById('map'), {
					center: center
					, zoom: 13
				});
				var input = document.getElementById('pac-input');
				console.log(input)
				var autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', map);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
				autocomplete.addListener('place_changed', function () {
					infowindow.close();
					var place = autocomplete.getPlace();
					$scope.autoPlace = place;
					console.log($scope.autoPlace)
					if (!place.geometry) {
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					}
					else {
						map.setCenter(place.geometry.location);
						map.setZoom(17);
					}
					// Set the position of the marker using the place ID and location.
					marker.setPlace({
						placeId: place.place_id
						, location: place.geometry.location
					});
					marker.addListener('click', function () {
						AdminTools.googleRec($scope.autoPlace, $scope.newRec.cat);
					})
					marker.setVisible(true);
					infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address);
					infowindow.open(map, marker);
				});
			}
			uiGmapGoogleMapApi.then(function () {
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.currLoc.lat = position.coords.latitude;
					$scope.currLoc.lng = position.coords.longitude;
					$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
					$scope.currLoc.gmap = {
						lat: position.coords.latitude
						, lng: position.coords.longitude
					};
					initMap($scope.currLoc.gmap)
				});
			})
}])
.controller('AdminSideCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', '$mdMedia', 'Auth'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, $mdMedia, Auth) {
			var ref = firebase.database().ref();
				$scope.admin = {};

				var uid = Auth.uid();
				console.log(uid);
				if (uid) {
					$rootScope.uid = uid;

					console.log(uid);
					load();
				}
				$scope.signOut = function(){
				$scope.closeSNav('right', Auth.auth.$signOut())
				

				// $mdSidenav('right')
					
				// 	.close()
				// 	.then(function(){
				// 		Auth.auth.$signOut()
				// 	});
			}
			function load(){
				$firebaseObject(ref.child("profiles/" + uid)).$loaded(function (data) {
					$scope.admin.profile = data;
					// $scope.$watch("admin.profile", function(n, o){
					// 		console.log(n,o)
					// 	if (!n) {
					// 		$firebaseObject(ref.child("profiles/" + uid)).$loaded(function (data) {
					// 			$scope.admin.profile = data;
					//
					// 		})
					// 			}
					// 		});


					console.log(data)
				})
				$firebaseObject(ref.child("admins/" + uid)).$loaded(function (data) {
					if (!data || data == null) {
						$state.go("app.home")
					}
					else {
						$scope.admin.rank = data.$value;
						// $scope.$watch("admin.rank", function(n, o){
						// 	console.log(n,o)
						// 	if (!n) {
						// 		$firebaseObject(ref.child("admins/" + uid)).$loaded(function (data) {
						// 			$scope.admin.rank = data.$value;
						//
						// 		})
						// 			}
						// 		});
					}
					console.log(data)
					console.log($scope.admin)
				})
			}

}]).controller('AdminStaffCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'Auth', '$state'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, Auth, $state) {
			var ref = firebase.database().ref();
			$scope.admin = {};
			var uid = $rootScope.uid;
			$firebaseObject(ref.child("profiles/" + uid)).$loaded(function (data) {
				$scope.admin.profile = data;
				console.log(data)
			})
			$firebaseObject(ref.child("admins/" + uid)).$loaded(function (data) {
				$scope.admin.rank = data;
				console.log(data)
			})
			$firebaseArray(ref.child("partners")).$loaded(function (data) {
				$scope.vendors = data;
			})
			$scope.ranks = [
				{
					level: "trainee"
					, rank: 10
				}
				, {
					level: "ticket"
					, rank: 20
				}
				, {
					level: "manager"
					, rank: 30
				}
    ]
			$scope.signUpObj = {};
			$scope.createStaff = function () {
				console.log("!")
				if ($scope.signUpObj.password === $scope.signUpObj.password_confirmation) {
					Auth.$createUserWithEmailAndPassword($scope.signUpObj.email, $scope.signUpObj.password).then(function (firebaseUser) {
						// $state.go("app.staff_dashboard")
						$rootscope
						ref.child("profiles").child(firebaseUser.uid).set({
							name: $scope.signUpObj.name
							, rank: $scope.signUpObj.rank
							, uid: firebaseUser.uid
							, staff: $scope.signUpObj.vendor
						});
						console.log("User " + firebaseUser.uid + " created successfully!");
					}).catch(function (error) {
						console.error("Error: ", error);
					});
				}
				else {
					$mdToast.show($mdToast.simple().textContent('Passwords Dont Match'));
				}
			}
}]).controller('AdminTranslateCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', 'LangTools'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, LangTools) {
			var ref = firebase.database().ref();
			$scope.quoteNewLanguage = function (lang) {
				LangTools.quoteNewLang(lang)
			};
			$scope.updateLanguage = function (lang) {
				LangTools.updateLang(lang)
			};
	 }]).controller('AdminLodgesCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools) {
			var ref = firebase.database().ref();

			$scope.newPackages = [];
			$scope.newPack = {};
			$scope.newLodge = {
				vendor: true
			};
			$firebaseObject(ref.child("bkginfo")).$loaded(function (data) {
				$scope.ammenities = data;
			})
			$scope.newLodgeAdmin = {};
			$scope.newVendor = {};
			$scope.langs = ["en", "es"];
			$scope.addNewLodge = function () {
				var newObj = {
					newLodge: $scope.newLodge
					, newAdmin: $scope.newLodgeAdmin
				}
				AdminTools.newLodge(newObj)
			}
			$scope.uniqBool = function (subdomain) {
				if (subdomain) {
					$firebaseObject(ref.child("info").child(subdomain)).$loaded(function (data) {
						if (data) {
							return false;
						}
						else {
							return true;
						}
					})
				}
			}
}]).controller('AdminVendorCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', 'uiGmapIsReady', '$geolocation'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, uiGmapIsReady, $geolocation) {
			var ref = firebase.database().ref();
			$scope.newPackages = [];
			$scope.newPack = {};
			$scope.newSite = {
				vendor: true
			};
			$scope.newSiteBool = false;
			$scope.newSiteAdmin = {};
			$scope.newVendor = {};
			$scope.langs = ["en", "es"];
			$scope.addNewSite = function () {
				var newObj = {
					newSite: $scope.newSite
					, newAdmin: $scope.newSiteAdmin
				}
				AdminTools.newSite(newObj)
			}
			$scope.uniqBool = function (subdomain) {
				if (subdomain) {
					$firebaseObject(ref.child("info").child(subdomain)).$loaded(function (data) {
						if (data) {
							return false;
						}
						else {
							return true;
						}
					})
				}
			}
			$scope.newVendorView = function(code){
				switch(code){
					case 'small':
						initMap($scope.currLoc.gmap);
						$scope.newSiteBool = !$scope.newSiteBool;
						break;
					case 'site':
						$scope.newSiteBool = !$scope.newSiteBool;
						break;
				}

			}
			$scope.newSmallVendor = {};
			$scope.newSmallVendorAdmin = {};
			$scope.newVendor = {};
			$scope.addNewSmallVendor = function () {
				var newObj = {
					newSmallVendor: $scope.newSmallVendor
					, newAdmin: $scope.newSmallVendorAdmin
				}
				AdminTools.newSmallVendor(newObj)
			};
			$scope.input = "";

			function initMap(center) {
				console.log(center)
				var map = new google.maps.Map(document.getElementById('map'), {
					center: center
					, zoom: 13
				});
				var input = document.getElementById('pac-input');
				console.log(input)
				var autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', map);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
				autocomplete.addListener('place_changed', function () {
					infowindow.close();
					var place = autocomplete.getPlace();
					$scope.autoPlace = place;
					console.log($scope.autoPlace)
					if (!place.geometry) {
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					}
					else {
						map.setCenter(place.geometry.location);
						map.setZoom(17);
					}
					// Set the position of the marker using the place ID and location.Great value and friendly service for locals and tourists alike!
					marker.setPlace({
						placeId: place.place_id
						, location: place.geometry.location
					});
					marker.addListener('click', function () {
						$scope.newSmallVendor.placeObj = $scope.autoPlace;
						$scope.newSmallVendor.name = $scope.autoPlace.name;
						console.log($scope.newSmallVendor.placeObj)


					})
					marker.setVisible(true);
					infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address);
					infowindow.open(map, marker);
				});
			}

				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.currLoc.lat = position.coords.latitude;
					$scope.currLoc.lng = position.coords.longitude;
					$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
					$scope.currLoc.gmap = {
						lat: position.coords.latitude
						, lng: position.coords.longitude
					};
					initMap($scope.currLoc.gmap);

				});

}]).controller('FleetPickupCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation) {
			var ref = firebase.database().ref();
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var vayaFire = new GeoFire(ref.child("geofire/vayas"));
			$firebaseArray(ref.child("vehicles").orderByChild("driver").equalTo(null)).$loaded(function (data) {
				$scope.vehicles = data;
			})
			$scope.carSel = {};
			$scope.location = {};
			$scope.selectCar = function () {
				AdminTools.pickupVehicle($scope.carSel.$id);
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.location.lat = position.coords.latitude;
					$scope.location.lng = position.coords.longitude;
					$scope.location.loc = [position.coords.latitude, position.coords.longitude];
					driverFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude])
				});
				$firebaseArray(ref.child("vayas").orderByChild("hail").equalTo(-1)).$loaded(function (data) {
					$scope.hails = data;
				})
			}
 }]).controller('MapCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation', 'uiGmapIsReady', 'Auth'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation, uiGmapIsReady, Auth) {
			var ref = firebase.database().ref();
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var geoFire = new GeoFire(ref.child("geofire/locs"));
			var productFire = new GeoFire(ref.child("geofire/products"));
			var vayaFire = new GeoFire(ref.child("geofire/vayas"));
			$firebaseObject(ref.child("vehicles")).$loaded(function (data) {
				$scope.vehicles = data;
			})
			var auth = Auth.auth.$getAuth();
			var directionsDisplay = new google.maps.DirectionsRenderer();
			var directionsService = new google.maps.DirectionsService();
			var geocoder = new google.maps.Geocoder();
			$scope.products = [];
			// directions object -- with defaults
			$scope.directions = {
				origin: "Placa Catalunya, Barcelona"
				, destination: "Enter Destination"
				, showList: false
				, distance: 0
				, fare: 0
			};
			$scope.search = {
				tag: "tours"
			}
			$scope.setHere = function () {
				$scope.directions.origin = "41.387662,2.170166";
			};
			$scope.hailNow = function () {
				if ($scope.hailLoc) {
					var hailObj = $scope.directions;
					hailObj.status = -1;
					$firebaseArray(ref.child("vayas")).$add(hailObj).then(function (data) {
						alert("Waiting for Driver to accept!")
						vayaFire.set(data.key, $scope.hailLoc)
					})
				}
			};
			// get directions using google maps api
			$scope.getDirections = function () {
				var request = {
					origin: $scope.directions.origin
					, destination: $scope.directions.destination
					, travelMode: google.maps.DirectionsTravelMode.DRIVING
				};
				directionsService.route(request, function (response, status) {
					if (status === google.maps.DirectionsStatus.OK) {
						var distance = 0;
						directionsDisplay.setDirections(response);
						directionsDisplay.setMap($scope.instanceMap);
						angular.forEach(response.routes[0].legs, function (leg) {
							distance += leg.distance.value
						})
						$scope.directions.distance = distance;
					}
					else {
						alert('Google route unsuccesfull!');
						console.log(status)
					}
				});
			};
			//	 $firebaseArray(ref.child("profiles/" + $rootScope.uid + "/location")).$loaded(function(data){
			//		 $scope.hailLoc = data;
			//	 })
			$scope.hailLoc;
			$scope.viewRight = function ($markerModel, ev, obj) {
				console.log($markerModel, obj)
				$scope.rightObj = obj;
			}
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				console.log($rootScope.uid, [position.coords.latitude, position.coords.longitude])
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + auth.uid + "/location").set([position.coords.latitude, position.coords.longitude])
					$scope.hailLoc = [position.coords.latitude, position.coords.longitude];
					var productQuery = productFire.query({
						center: $scope.hailLoc
						, radius: 25
					})
					$scope.map = {
						control: {}
						, center: {
							latitude: $scope.hailLoc[0]
							, longitude: $scope.hailLoc[1]
						}
						, zoom: 15
					};
					productQuery.on('key_entered', function (key, location, distance) {
						var info = $scope.dispArrObj.$getRecord(key)
						info.location = {
							latitude: location[0]
							, longitude: location[1]
						};
						info.distance = distance;
						info.pid = key;
						info.clickEv = function ($markerModel) {
							$scope.rightObj = $markerModel;
						}
						$scope.products.push(info)
						console.log($scope.packageData)
					})
				})
			});
			$scope.vayaQuery = {};
			$scope.vayaQ = function () {
				calcRoute($scope.hailLoc, $scope.vayaQuery.destination);
				console.log($scope.hailLoc, $scope.vayaQuery.destination);
			}
			$scope.vayaObj = {};
			//	 $scope.hailLoc = $scope.user.location
			$scope.map = {
				control: {}
				, show: true
				, center: {
					latitude: 41.387662
					, longitude: 2.170166
				}
				, zoom: 12
			};
			$scope.options = {
				scrollwheel: false
			};
			$scope.hailmap = {
				center: {
					latitude: 51.219053
					, longitude: 4.404418
				}
				, zoom: 14
			};
			$scope.kmlOpts;
			$scope.map.control = {};
			uiGmapIsReady.promise(1).then(function (instances) {
				console.log('uiGmapIsReady done');
				console.log($scope.displayArray)
				$scope.instanceMap = instances[0].map;
				$scope.kmlOpts = {
					url: '/assets/tktrrecs.kml'
				};
				//
			});
	}]).controller('VayaSelectCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation', 'uiGmapIsReady'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation, uiGmapIsReady) {
			var ref = firebase.database().ref();
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var geoFire = new GeoFire(ref.child("geofire/locs"));
			var vayaFire = new GeoFire(ref.child("geofire/vayas"));
			$scope.hailLoc;
			$scope.vayas = [];
			$scope.vayaClass = function (status) {
				switch (status) {
				case -1:
					return "hailing"
					break;
				case 0:
					return "waiting"
					break;
				case 1:
					return "enroute"
					break;
				}
			};
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
					$scope.hailLoc = [position.coords.latitude, position.coords.longitude];
					var vayaQuery = vayaFire.query({
						center: $scope.hailLoc
						, radius: 15
					})
					$scope.map = {
						control: {}
						, center: {
							latitude: $scope.hailLoc[0]
							, longitude: $scope.hailLoc[1]
						}
						, zoom: 12
					};
					vayaQuery.on('key_entered', function (key, location, distance) {
						$firebaseObject(ref.child("vayas").child(key)).$loaded(function (data) {
							console.log(data)
							var v = data;
							v.fare_distance = distance;
							v.fare_location = location;
							$scope.vayas.push(v)
							console.log($scope.vayas)
						})
					})
				})
			});
}]).controller('FunkyCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation', 'uiGmapIsReady', '$mdpTimePicker', '$stateParams'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation, uiGmapIsReady, $mdpTimePicker, $stateParams) {
			var ref = firebase.database().ref();
			var map;
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var geoFire = new GeoFire(ref.child("geofire/locs"));
			var vayaFire = new GeoFire(ref.child("geofire/rickshaws"));
			$scope.drivers = [];
			$firebaseObject(ref.child("vehicles")).$loaded(function (data) {
				$scope.vehicles = data;
			})
			var directionsDisplay = new google.maps.DirectionsRenderer();
			var directionsService = new google.maps.DirectionsService();
			var geocoder = new google.maps.Geocoder();
			// directions object -- with defaults
			$scope.directions = {
				origin: "Placa Catalunya, Barcelona"
				, destination: "Enter Destination"
				, showList: false
				, distance: 0
				, fare: 0
			};
			$scope.setHere = function () {
				if($scope.currLoc.gmap){
					$scope.directions.origin = $scope.currLoc.gmap;
				}

			};
			$scope.hailNow = function () {
					if ($scope.hailLoc) {
						var hailObj = $scope.directions;
						hailObj.status = -1;
						$firebaseArray(ref.child("vayas")).$add(hailObj).then(function (data) {
							alert("Waiting for Driver to accept!")
							vayaFire.set(data.key, $scope.hailLoc)
						})
					}
				}
				// get directions using google maps api
			$scope.getDirections = function () {
					var request = {
						origin: $scope.directions.origin
						, destination: $scope.directions.destination
						, travelMode: google.maps.DirectionsTravelMode.BICYCLING
					};
					directionsService.route(request, function (response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
							var distance = 0;
							directionsDisplay.setDirections(response);
							directionsDisplay.setMap($scope.instanceMap);
							angular.forEach(response.routes[0].legs, function (leg) {
								distance += leg.distance.value
							})
							$scope.directions.distance = distance;
						}
						else {
							alert('Google route unsuccesfull!');
							console.log(status)
						}
					});
				}
				//	 $firebaseArray(ref.child("profiles/" + $rootScope.uid + "/location")).$loaded(function(data){
				//		 $scope.hailLoc = data;
				//	 })
			$scope.hailLoc;
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
					$scope.hailLoc = [position.coords.latitude, position.coords.longitude];
					var driverQuery = driverFire.query({
						center: $scope.hailLoc
						, radius: 15
					})
					$scope.map = {
						control: {}
						, center: {
							latitude: $scope.hailLoc[0]
							, longitude: $scope.hailLoc[1]
						}
						, zoom: 12
					};
					driverQuery.on('key_entered', function (key, location, distance) {
						$firebaseObject(ref.child("drivers").child(key)).$loaded(function (data) {
							$scope.drivers.push(data)
							console.log($scope.drivers)
						})
					})
				})
			});
			$scope.vayaQuery = {};
			$scope.vayaQ = function () {
				calcRoute($scope.hailLoc, $scope.vayaQuery.destination);
				console.log($scope.hailLoc, $scope.vayaQuery.destination);
			}
			$scope.vayaObj = {};
			//	 $scope.hailLoc = $scope.user.location
			$scope.map = {
				control: {}
				, center: {
					latitude: 41.387662
					, longitude: 2.170166
				}
				, zoom: 12
			};
			$scope.options = {
				scrollwheel: false
			};
			$scope.hailmap = {
				center: {
					latitude: 51.219053
					, longitude: 4.404418
				}
				, zoom: 14
			};
			$scope.viewVal = 2;
			$scope.viewChange = function (val) {
				$scope.viewVal = val;
			}
			$scope.map.control = {};
			uiGmapIsReady.promise(1).then(function (instances) {
				console.log('uiGmapIsReady done');
				$scope.instanceMap = instances[0].map;
				map = instances[0].map;
				var input = document.getElementById('destinput');
				var input2 = document.getElementById('originput');
				console.log(input)
				var autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', map);
				//				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				var autocomplete2 = new google.maps.places.Autocomplete(input2);
				autocomplete2.bindTo('bounds', map);
				//				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				autocomplete2.addListener('place_changed', function () {
					infowindow.close();
					var place2 = autocomplete2.getPlace();
					$scope.directions.origin = place2.formatted_address;
					console.log(place2)
				})
				autocomplete.addListener('place_changed', function () {
					infowindow.close();
					var place = autocomplete.getPlace();
					$scope.autoPlace = place;
					console.log($scope.autoPlace)
					if (!place.geometry) {
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					}
					else {
						map.setCenter(place.geometry.location);
						map.setZoom(17);
					}
					// Set the position of the marker using the place ID and location.
					$scope.directions.destination = place.formatted_address;
					infowindow.open(map, marker);
				})
			});
 }]).controller('VayaCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation', 'uiGmapIsReady', '$mdpTimePicker', '$mdMedia', 'Vaya', 'DateParser'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation, uiGmapIsReady, $mdpTimePicker, $mdMedia, Vaya, DateParser) {
			var ref = firebase.database().ref();
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var geoFire = new GeoFire(ref.child("geofire/locs"));
			var vayaFire = new GeoFire(ref.child("geofire/vayas"));
			$scope.drivers = [];
			$scope.vehicleMedia = {};
			var fArray = $firebaseArray(ref.child("info").orderByChild("vendor").equalTo("vaya"))
			fArray.$loaded(function (data) {
				$scope.vehicles = data;
				console.log($scope.vehicles)
				angular.forEach(data, function(v,k){
					$firebaseObject(ref.child("media").child(k)).$loaded(function(data){
						$scope.vehicleMedia[k] = data;
					})
				})
			});
			$scope.checkDay = function (time) {
				if($scope.vayaQuery.date){
					return moment(time).isSame($scope.vayaQuery.date, 'day')
				}
			};
			$scope.rangeArray = [1,2,3,4,5,6,7,8,9,10];
			$firebaseArray(ref.child("dates").child("vaya")).$loaded(function(data){
				$scope.hoursArray = DateParser.decode(data);
			})


			$scope.gridId = "";
			console.log($scope.rangeArray, $scope.hoursArray)
			$scope.gridSelector = function (item) {
				$scope.gridId = item.$id;
				// if (true) {}
				// $scope.loadPack(item);
			}
			$scope.valiTime = function(time){
					return moment(time).isSame(moment(time).minutes(0)) || moment(time).isSame(moment(time).minutes(0))
			};
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					console.log(id, 2)
					return 2;
				}
				else {
					console.log(id, 1)
					return 1;
				}
			}
			$scope.gridMobile = function (id) {
				if ($mdMedia('xs') || $mdMedia('sm')) {
					if (id == $scope.gridId) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			var directionsDisplay = new google.maps.DirectionsRenderer();
			var directionsService = new google.maps.DirectionsService();
			var geocoder = new google.maps.Geocoder();
			// directions object -- with defaults
			$scope.directions = {
				origin: "Placa Catalunya, Barcelona"
				, destination: "Enter Destination"
				, showList: false
				, distance: 0
				, fare: 0
			};
			$scope.hours = [1,2,3,4,5,6];
			$scope.setHere = function () {
				$scope.directions.origin = $scope.currLoc.lat + "," + $scope.currLoc.lng;
			};
			$scope.hailNow = function () {
					if ($scope.hailLoc) {
						var hailObj = $scope.directions;
						hailObj.status = -1;
						$firebaseArray(ref.child("vayas")).$add(hailObj).then(function (data) {
							alert("Waiting for Driver to accept!")
							vayaFire.set(data.key, $scope.hailLoc)
						})
					}
				}

				// get directions using google maps api
			$scope.getDirections = function () {
					var request = {
						origin: $scope.directions.origin
						, destination: $scope.directions.destination
						, travelMode: google.maps.DirectionsTravelMode.DRIVING
					};
					directionsService.route(request, function (response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
							var distance = 0;
							directionsDisplay.setDirections(response);
							directionsDisplay.setMap($scope.instanceMap);
							angular.forEach(response.routes[0].legs, function (leg) {
								distance += leg.distance.value
							})
							$scope.directions.distance = distance;
						}
						else {
							alert('Google route unsuccesfull!');
							console.log(status)
						}
					});
				}
				//	 $firebaseArray(ref.child("profiles/" + $rootScope.uid + "/location")).$loaded(function(data){
				//		 $scope.hailLoc = data;
				//	 })
			$scope.hailLoc;
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
					$scope.currLoc.lat = position.coords.latitude;
					$scope.currLoc.lng = position.coords.longitude;
					$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
					$scope.currLoc.gmap = {
						lat: position.coords.latitude
						, lng: position.coords.longitude
					};
					var driverQuery = driverFire.query({
						center: $scope.currLoc.loc
						, radius: 15
					})
					$scope.map = {
						control: {}
						, center: {
							latitude: $scope.currLoc.lat
							, longitude: $scope.currLoc.lng
						}
						, zoom: 12
					};
					driverQuery.on('key_entered', function (key, location, distance) {
						$firebaseObject(ref.child("drivers").child(key)).$loaded(function (data) {
							$scope.drivers.push(data)
							console.log($scope.drivers)
						})
					})
				})
			});
			$scope.prodInfo = {};
			$scope.resultsFilter = {
				trips: {}
			};
			$scope.vayaQuery = {};
			$scope.vayaQ = function () {
				$scope.results = [];
				var bstr = "trips/" + moment($scope.vayaQuery.date).format("YYYY-MM-DD") + "-" + moment($scope.vayaQuery.time).format("HH-mm");
				$firebaseArray(ref.child("vehicles").orderByChild( bstr).equalTo(null)).$loaded(function(data){

					console.log(data)
					angular.forEach(data, function(item){
						var durBool = true;
						var repeats = $scope.vayaQuery.duration * 2 - 1
						console.log(durBool, repeats);
						var i = 0
						while( i < repeats) {
							$scope.resultsFilter.trips[checkstr] = null;

							var time = moment($scope.vayaQuery.time).add(30 * i, 'm');
							var checkstr = moment($scope.vayaQuery.date).format("YYYY-MM-DD") + "-" + time.format("HH-mm")

							if (item.trips && item.trips[checkstr]){
								durBool = false;
							}
							if(parseInt(item.capacity) < $scope.vayaQuery.seats){
								durBool = false;
							}
							i ++
						}

						console.log(durBool);
						if (durBool){

							$scope.results.push(item)
							$scope.prodInfo[item.$id] = fArray.$getRecord(item.pid)
						}
						console.log($scope.prodInfo, $scope.results)
					})
				})

			}
				function initPickupSearch (){
					var input1 = document.getElementById('originput');
					var input2 = document.getElementById('originput');
	
					var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
					var autocomplete1 = new google.maps.places.Autocomplete(input1);
				autocomplete1.bindTo('bounds', map);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input1);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
						autocomplete1.addListener('place_changed', function () {
					infowindow.close();
					var place1 = autocomplete1.getPlace();
					$scope.vayaObj.origin = place1.formatted_address;
					console.log(place1)
				})
						
	var autocomplete2 = new google.maps.places.Autocomplete(input2);
				autocomplete2.bindTo('bounds', map);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
						autocomplete2.addListener('place_changed', function () {
					infowindow.close();
					var place2 = autocomplete2.getPlace();
					$scope.vayaObj.destination = place2.formatted_address;
					console.log(place2)
				})
						google.maps.event.trigger(map, 'resize');
				}
		$scope.selectCar = function(id){
			$scope.vayaObj.vehicle = id;
			$scope.mapShow = true;
			initPickupSearch()
		}
		$scope.vayaObj = {};
			//	 $scope.hailLoc = $scope.user.location
			$scope.map = {
				control: {}
				, center: {
					latitude: 41.387662
					, longitude: 2.170166
				}
				, zoom: 12
			};

			$scope.options = {
				scrollwheel: false
			};
			$scope.hailmap = {
				center: {
					latitude: 51.219053
					, longitude: 4.404418
				}
				, zoom: 14
			};
			$scope.mapShow = false;
			$scope.map.control = {};
			uiGmapIsReady.promise(1).then(function (instances) {
				console.log('uiGmapIsReady done');
				$scope.instanceMap = instances[0].map;

				map = instances[0].map;




			});
 }])
 .controller('DriverTrackerCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$geolocation'

		 		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $geolocation) {

				var ref = firebase.database().ref();
				var dArray;
				var vArray = $firebaseArray(ref.child("vayas"));
				if ($stateParams.vendor == 'tktr') {
					dArray = $firebaseArray(ref.child("drivers"));
				} else {
					dArray = $firebaseArray(ref.child("drivers").orderByChild("staff").equalTo($stateParams.vendor));
				}
				var driverFire = new GeoFire(ref.child("geofire/drivers"))
				$geolocation.getCurrentPosition({timeout: 60000
			}).then(function (position) {
				driverFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire " + [position.coords.latitude, position.coords.longitude]);
					ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})

				})
				$scope.drivers = {};
				$scope.centerLocObj = {lat: position.coords.latitude, lng: position.coords.longitude};
				$scope.centerLoc = [position.coords.latitude, position.coords.longitude];
				var driverQuery = driverFire.query({
					center: $scope.centerLoc
					, radius: 10
				})
				var map = L.map('mapid').setView($scope.centerLoc, 13);
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);
				var markers = {};
				var onEnterQ = driverQuery.on("key_entered", function (key, location, distance) {
					console.log(key + " entered query at " + location + " (" + distance + " km from center)");

						var driver = dArray.$getRecord(key);
						if(driver){
							driver.currLoc = location;

							driver.distance = distance;

							marker = L.marker(location).addTo(map)
					    .bindPopup(driver.name + "@" + driver.currLoc)
					    .openPopup();
							driver.marker = marker;
						$scope.drivers[key] = driver;
						}
					})

					var onMoveQ = driverQuery.on("key_moved", function (key, location, distance) {
						console.log(key + " entered query at " + location + " (" + distance + " km from center)");
						$scope.drivers[key].marker.setLatLng(location);
			});
				});
					$scope.vayas = {};
			$scope.loadVayas = function(){
				var vayaQuery = driverFire.query({
					center: $scope.centerLoc
					, radius: 10
				})
					var vayaFire = new GeoFire(ref.child("geofire/vayas"))
				var onEnterVQ = vayaQuery.on("key_entered", function (key, location, distance) {
					console.log(key + " entered query at " + location + " (" + distance + " km from center)");

						var vaya = vArray.$getRecord(key);
						if(vaya){
							vaya.currLoc = location;

							vaya.distance = distance;

							marker = L.marker(location).addTo(map)
							.bindPopup(vaya.name + "@" + vaya.currLoc)
							.openPopup();
							vaya.marker = marker;
							$scope.vayas[key] = driver;
						}
					})

					var onMoveVQ = vayaQuery.on("key_moved", function (key, location, distance) {
						console.log(key + " entered query at " + location + " (" + distance + " km from center)");
						if ($scope.vayas[key]) {
							$scope.vayas[key].marker.setLatLng(location);
						}
			});
			}




 }]).controller('DriveTimeCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$geolocation', '$interval'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $geolocation, $interval) {
			var ref = firebase.database().ref();
			var geoFire = new GeoFire(ref.child("geofire/drivers"))
			$interval(function () {
				$geolocation.getCurrentPosition({timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					// ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
				})
						})
			}, 200);


 }]).controller('AdminDriverCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$geolocation'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $geolocation) {
			var ref = firebase.database().ref();
			$scope.newPackages = [];
			$scope.newDriver = {
				available: true,
				voucher: $stateParams.vendor
			};
			var geoFire = new GeoFire(ref.child("geofire/drivers"));
			var dArr = $firebaseArray(ref.child("drivers").orderByChild("staff").equalTo($stateParams.vendor))
			dArr.$loaded(function(data){
				$scope.drivers = data;
			})
			$scope.loadDriverInfo = function(id){
				$scope.driverInfo = dArr.$getRecord(id);

			}
			$scope.newBool = 'newdriver';
			$scope.newDriverAdmin = {};
			$scope.newVendor = {};
			$scope.langs = ["en", "es"];
			$scope.addNewDriver = function () {
				var newObj = {
					newDriver: $scope.newDriver
					, newAdmin: $scope.newDriverAdmin
				}
				AdminTools.newDriver(newObj)
			}
			$scope.signUpDriver = function(prov){
				AdminTools.newDriverProvider(prov)
			}
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + $rootScope.uid + "/location").set({lat: position.coords.latitude, lng: position.coords.longitude, location:[position.coords.latitude, position.coords.longitude]})
				})
				$scope.user.location = [position.coords.latitude, position.coords.longitude];
			});
}]).controller('AdminFleetCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams) {
			var ref = firebase.database().ref();
			$scope.newVehicle = {
				vendor: $stateParams.vendor,
				vehicle: true
			};
			$scope.addNewVehicle = function () {
				AdminTools.newVehicle($scope.newVehicle)
			}
}]).controller('AdminRecCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$geolocation', 'uiGmapGoogleMapApi', '$document'






		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $geolocation, uiGmapGoogleMapApi, $document) {
			$scope.newBool = true;
			$scope.newRec = {};
			$scope.langs = ["en", "es"];
			$scope.cats = ["club", "shop", "restaurant", "bar", "test", "sights"];
			$scope.addNewRec = function () {
				AdminTools.newRec($scope.newRec);
			};
			$scope.gAdd = true;
			$scope.googleAdd = function () {
				$scope.gAdd = !$scope.gAdd;
			}
			$scope.grabLoc = function () {
				$scope.newRec.location = {};
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.newRec.location.lat = $scope.currLoc.lat;
					$scope.newRec.location.lng = $scope.currLoc.lng;
					$scope.newRec.location.loc = $scope.currLoc.loc;
				});
			}
			$scope.input = "";

			function initMap(center) {
				var map = new google.maps.Map(document.getElementById('map'), {
					center: center
					, zoom: 13
				});
				var input = document.getElementById('pac-input');
				console.log(input)
				var autocomplete = new google.maps.places.Autocomplete(input);
				autocomplete.bindTo('bounds', map);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
				autocomplete.addListener('place_changed', function () {
					infowindow.close();
					var place = autocomplete.getPlace();
					$scope.autoPlace = place;
					console.log($scope.autoPlace)
					if (!place.geometry) {
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					}
					else {
						map.setCenter(place.geometry.location);
						map.setZoom(17);
					}
					// Set the position of the marker using the place ID and location.
					marker.setPlace({
						placeId: place.place_id
						, location: place.geometry.location
					});
					marker.addListener('click', function () {
						AdminTools.googleRec($scope.autoPlace, $scope.newRec.cat);
					})
					marker.setVisible(true);
					infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address);
					infowindow.open(map, marker);
				});
			}
			uiGmapGoogleMapApi.then(function () {
				$geolocation.getCurrentPosition({
					timeout: 60000
				}).then(function (position) {
					$scope.currLoc.lat = position.coords.latitude;
					$scope.currLoc.lng = position.coords.longitude;
					$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
					$scope.currLoc.gmap = {
						lat: position.coords.latitude
						, lng: position.coords.longitude
					};
					initMap($scope.currLoc.gmap)
				});
			})
}]).controller('AdminMenusCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$mdMedia', 'DateParser'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $mdMedia, DateParser) {
			var ref = firebase.database().ref();
			var storage = firebase.storage().ref()
			var mArray;
			var m_iArray;
			$scope.menuItems = [];
			$scope.centerMenuItem
			//if ($stateParams.vendor == 'tktr') {
				$firebaseArray(ref.child("menu_items")).$loaded(function (data) {
					$scope.menuItems = data;
					console.log($scope.menuItems)
					$scope.centerMenuItem = $scope.menuItems[0];
				})
				$firebaseArray(ref.child("menu_items")).$loaded(function (data) {
					$scope.menu = data;
				})
				$firebaseArray(ref.child("restaurants")).$loaded(function(data){
					$scope.restaurants = data;
					$scope.restaurant = data[0];
				})

			// }
			// else {
			// 	$firebaseObject(ref.child("restaurants").child($stateParams.partner)).$loaded(function(data){
			// 		$scope.restaurant = data;
			// 	})
			// 	$firebaseArray(ref.child("menu_items").orderByChild('vendor').equalTo($stateParams.vendor)).$loaded(function (data) {
			// 		$scope.menuItems = data;
			// 		console.log($scope.menuItems)
			// 		$scope.centerMenuItem = $scope.menuItems[0];
			// 	})
			// 	$firebaseArray(ref.child("menu").orderByChild('vendor').equalTo($stateParams.vendor)).$loaded(function (data) {
			// 		$scope.menu = data;
			// 	})

			// };
			$scope.newMenuItem = {
				vendor: $stateParams.vendor,
				tags: []
			};

			$scope.productTags = ["burgers", "pizza", "noodles", "sushi", "italian", "pasta", "turkish", "vegetarian", "carnivore"]
			$scope.newMenu = {
				vendor: $stateParams.vendor
			}
			$scope.setRestaurantCats = function(){
				$firebaseObject(ref.child("restaurants").child($stateParams.vendor).child("categories")).$bindTo($scope, "catObj").then(function(data){

				})
			}
			$scope.saveMenuItem = function(){

				AdminTools.newMenuItem($scope.newMenuItem);
				$scope.newMenuItem = {
				vendor: $stateParams.vendor
				};
				$scope.showNewBtn = false;
			}
			$scope.showNewBtn = false;
			$scope.upload = function (file) {
				var uploadTask = storage.child("media").child($stateParams.vendor).child("menu").child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					// mediaRef.child($stateParams.vendor).child("menu").child(key).child("url").set(downloadURL);
					$scope.newMenuItem.photo = downloadURL;
					$scope.showNewBtn = true;
				});
			}
			$scope.uploadEdit = function (file) {
				var uploadTask = storage.child("media").child($stateParams.vendor).child("menu").child(file.name).put(file);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
					console.log(snapshot)
				}, function (error) {
					// Handle unsuccessful uploads
					console.log(error)
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					ref.child("menu_items").child($stateParams.vendor).child("photo").set(downloadURL);
					$scope.editMenuItem.photo = downloadURL;
				});
			}
			$scope.loadEdit = function (id) {
				console.log(id)
					var edit = $firebaseObject(ref.child("menu_items").child(id))
					edit.$bindTo($scope, "editMenuItem").then(function (data) {
						console.log(data)

					})
					$scope.newBool = 'editMenuItem';
			}
			$scope.editMenuItemData = {};
			$scope.saveEdit = function (attr) {
				if (attr == 'tag' || attr == 'price') {
					console.log(attr)
					$scope.editMenuItem[attr] = $scope.editMenuItemData[attr];
				}
				else {
					console.log(attr)
					$firebaseArray(ref.child("translations").child($scope.editLang)).$add($scope.editMenuItemData[attr]).then(function (translation) {
						$scope.editMenuItem[attr] = translation.key;
					})
				}
			};
		
			$scope.langs = ["en", "es"];
			$scope.newBool = "";
			$scope.boolSwitch = function(code){
				$scope.newBool = code;
			}

}]).controller('AdminFreebiesCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$mdMedia', 'DateParser'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $mdMedia, DateParser) {
			var ref = firebase.database().ref();
			var pArray;
			var fArray;
			// $scope.pFilter = {
			// 	partner: true,
			// 	bookingInfo : true
			// };
			$scope.tktrFilter = {
				tktr: true
			}
			$scope.newFreebie = {};
			$firebaseObject(ref.child("packages")).$loaded(function(data){
						$scope.packOpts = data;
			})
			$scope.editFreebie = {};
			if ($stateParams.vendor == 'tktr') {
				pArray = $firebaseObject(ref.child("info"))
				pArray.$loaded(function (data) {
					$scope.infoObj = data;
				})
				fArray = $firebaseArray(ref.child("freebies"))
				fArray.$loaded(function (data) {
					$scope.freebies = data;
				})
			}
			else {
				fArray = $firebaseArray(ref.child("freebies").orderByChild('dist').equalTo($stateParams.vendor))
				fArray.$loaded(function (data) {
					$scope.freebies = data;
				})
			};

			$scope.langs = ["en", "es"];
			$scope.newBool = "newFreebie";
			
			$scope.loadEdit = function (id) {

					var edit = $firebaseObject(ref.child("freebies").child(id))
					edit.$bindTo($scope, "editFreebie").then(function (data) {
						console.log(data)

					})
					
					$scope.newBool = 'editFreebie';
			}
			
			$scope.deletePromo = function(id){
		
				fArray.child(id).$remove();


			}
			$scope.saveNewFreebie = function(){
				fArray.$add($scope.newFreebie)
			}
}]).controller('AdminProductsCtrl', ['$scope', '$http', '$rootScope', '$firebaseArray', '$firebaseObject', 'AdminTools', '$stateParams', '$mdMedia', 'DateParser'

		, function ($scope, $http, $rootScope, $firebaseArray, $firebaseObject, AdminTools, $stateParams, $mdMedia, DateParser) {
			var ref = firebase.database().ref();
			var pArray;
			if ($stateParams.vendor == 'tktr') {
				pArray = $firebaseArray(ref.child("info").orderByChild('vendor').equalTo('tktr'))
				pArray.$loaded(function (data) {
					$scope.products = data;
				})
			} else {
				pArray = $firebaseArray(ref.child("info").orderByChild('vendor').equalTo($stateParams.vendor))
				pArray.$loaded(function (data) {
					$scope.products = data;
				})
			};
			$scope.itemHourlyVals = [{},{},{},{},{},{},{}
			];
			$scope.langs = ["en", "es"];
			$scope.newBool = "newproduct";
			$scope.newProduct = {
				vendor: $stateParams.vendor
				, ticket: false,
				comms: 15
			};
			$scope.loadEdit = function (id) {

					var edit = $firebaseObject(ref.child("info").child(id))
					edit.$bindTo($scope, "editProduct").then(function (data) {
						console.log(data)

					})
					$scope.newBool = 'editproduct';
			}
			$scope.newStockObj = {};
			$scope.addNewStock = function(){
				for (var i = 0; i < $scope.newStockObj.multiplier; i++) {
					var obj = {
						stockNo: $scope.itemStock.length + 1,
						vendor: $stateParams.vendor,
						product: $scope.packageEditID,
						vendor_location: $scope.newStockObj.vendor_location
					};
						$firebaseArray(ref.child("stock").child($scope.packageEditID))
						.$add(obj)
				}
			}
			$scope.itemStockCal = [];
			var date = moment();
			for (var i = 0; i < 7; i++) {

				$scope.itemStockCal.push(i)
			}
			console.log($scope.itemStockCal[0]);
			$scope.stockProd;
			$scope.printVal = function(){
				console.log()
			}
			$scope.valIndex
			$scope.setFixedStockDaily = function (){
				angular.forEach($scope.itemStockVals, function(v, k){
					for (var i = 0; i < 30; i++) {
						var date = moment().add(i, 'days').format('YYYY-MM-DD');
						ref.child("static_stock").child($scope.stockProd.$id).child(date).child("capacity").set(v)
					}
				})
			}
			$scope.newDailyVal = {};
			$scope.addTime = function(){
				var newOrd = moment($scope.newDailyVal.time).day();
				var newKey = moment($scope.newDailyVal.time).format('HH-mm');
				$scope.itemHourlyVals[newOrd][newKey] = {
					key: newKey,
					mnt: moment($scope.newDailyVal.time),
					val: $scope.newDailyVal.aval}
			}
			$scope.flatValue = 0;
			$scope.setAll = function(){
				angular.forEach($scope.itemHourlyVals, function(obj){
					angular.forEach(obj, function(v, k){
						v.val = $scope.flatValue
					})
						})
			}
			$scope.setFixedStockHourlyWeek = function (){


				angular.forEach($scope.dayIndexes, function(ord){
					var ord = ord;
				angular.forEach($scope.itemHourlyVals, function(obj){
					angular.forEach(obj, function(v, k){
						for (var i = 0; i < 6; i++) {
							var date = moment(v.mnt).day(ord).add(i * 7, 'days').format('YYYY-MM-DD/HH-mm');
							ref.child("static_stock").child($scope.stockProd.$id).child(date).child("capacity").set(v.val);
							ref.child("static_stock").child($scope.stockProd.$id).child(date).child("available").set(v.val)
							// s
							
						}
					})
						})
							})

			}
			$scope.setFixedStockHourly = function (){
				console.log($scope.itemHourlyVals);


				angular.forEach($scope.itemHourlyVals, function(obj){
					angular.forEach(obj, function(v, k){
						for (var i = 0; i < 6; i++) {
							var date = moment(v.mnt).day($scope.listOrd).add(i * 7, 'days').format('YYYY-MM-DD/HH-mm');
								ref.child("static_stock").child($scope.stockProd.$id).child(date).child("capacity").set(v.val);
								ref.child("static_stock").child($scope.stockProd.$id).child(date).child("available").set(v.val)
							// 			.transaction(function(count){
							// 	if (count) {
							// 		if (count.list) {
							// 			var listKeys = Object.keys(count.list).length;
							// 			count.capacity = v.val;
							// 			count.available = v.val - listKeys;
							// 		} else {
							// 			count.capacity = v.val;
							// 			count.available = v.val;
							// 		}
							// 	}
							// });
							// ref.child("static_stock").child($scope.stockProd.$id).child(date).child("capacity").set(v.val);
							// ref.child("static_stock").child($scope.stockProd.$id).child(date).child("available").set(v.val);
						}
					})
						})

			}
			var dateArray;
			$scope.dayIndex = 0;
			$scope.deleteTime = function(day, time){
				var str = moment(day).format('e') + "D" + moment(time).format("HH") + "H" + moment(time).format("mm")
console.log(str)
				angular.forEach($scope.purchaseDates, function(dateCode){
					if (dateCode == str) {
						var delDate = dateArray$getRecord(dateCode.$id)
						delDate.$remove()
					}
				})
				
				dateArray.child(id).$remove();


			}

			$scope.dayIndexes = [0,1,2,3,4,5,6]
			$scope.stockDates = [];
			$scope.listOrd = 0;
			$scope.setDayFilter = function(ord){
				$scope.listOrd = ord;
				$scope.hourList = $scope.itemHourlyVals[ord];
				console.log($scope.hourList)
			}
			$scope.hourList = $scope.itemHourlyVals[$scope.listOrd];
			$scope.itemStockVals = {};
			$scope.loadStock = function(id){
				var start = moment().format('YYYY-MM-DD');
				var end = moment().add(7, 'days').format('YYYY-MM-DD');
					$scope.packageEditID = id;
					$scope.stockProd = pArray.$getRecord(id);
					$scope.product = $scope.stockProd;
					bookObj = $firebaseObject(ref.child("static_stock").child(id).startAt(start).endAt(end))
					bookObj.$loaded(function(data){
						$scope.stockBookings = data;
					})
					dateArray = $firebaseArray(ref.child("dates").child(id))
					dateArray.$loaded(function(data){
							$scope.pureDates = data;
							$scope.stockDates = DateParser.decode(data);


						console.log(data);
						if ($scope.stockDates) {

							angular.forEach($scope.stockDates, function(item){
								var check1 = moment(item).format('YYYY-MM-DD')
								var check2 = moment(item).format('HH-mm');
								var checkVal = 0;

								var ord = moment(item).day();
								$scope.itemHourlyVals;
								if ($scope.stockBookings && $scope.stockBookings[check1] && !$scope.stockBookings[check1][check2]&& $scope.stockBookings[check1].capacity) {
								checkVal = $scope.stockBookings[check1].capacity;
								var checkDone = {
									key: moment(item).format('HH-mm'),
									mnt: moment(item),
									val: checkVal};
								//  console.log(checkVal, check1, check2)
								 $scope.itemStockVals[checkDone.key] = checkDone;
								 $scope.itemHourlyVals[ord][checkDone.key] = checkDone;
								 console.log($scope.itemHourlyVals[ord][checkDone.key], ord)
								} else if ($scope.stockBookings && $scope.stockBookings[check1] && $scope.stockBookings[check1][check2] && $scope.stockBookings[check1][check2].capacity) {
									checkVal = $scope.stockBookings[check1][check2].capacity;
									var checkDone = {
										key: moment(item).format('HH-mm'),
										mnt: moment(item),
										val: checkVal};
								// console.log(checkVal, check1, check2)
								$scope.itemHourlyVals[ord][checkDone.key] = checkDone;
								console.log($scope.itemHourlyVals[ord][checkDone.key], ord)
							} else {
									checkVal = 0;
									var checkDone = {
										key: moment(item).format('HH-mm'),
										mnt: moment(item),
										val: checkVal};
									$scope.itemHourlyVals[ord][checkDone.key] = checkDone;
									console.log($scope.itemHourlyVals[ord][checkDone.key], ord)
							}


							})
							console.log($scope.itemHourlyVals);
							console.log($scope.itemStockVals);
						}

					})
					if ($scope.stockProd.tktr) {
						$firebaseArray(ref.child("stock").child(id)).$loaded(function(data){
							$scope.itemStock = data;
						})
						$firebaseArray(ref.child("vendor_locations").orderByChild("vendor").equalTo($stateParams.vendor)).$loaded(function(data){
							$scope.vendorLocs= data;
						})
					} else {

					}

				$scope.newBool = 'stock';
			}
			$scope.newPackageForm = function(id){
				$scope.newBool = 'newpacks';
				$scope.packageEditID = id;
				$scope.newPack = {
				vendor: $stateParams.vendor,
				parent: $scope.packageEditID
					};
				$scope.product = pArray.$getRecord(id);
			}
			$scope.hasBookings = function(item){
				if (item.bookings) {
					return true;
				} else {
					return false;
				}
			}
				$scope.packageEditID;
			$scope.loadPackageEdit = function (id) {
					$scope.packageEditID = id;
					$scope.product = pArray.$getRecord(id);
					$firebaseArray(ref.child("packages").child(id)).$loaded(function(data){
						$scope.editPackageArray = data;
					})


					$scope.newBool = 'editpacks';

			}
			$scope.boolSwitch = function(code){
				$scope.newBool = code;
			}
			$scope.deleteProduct = function(id){
				var inforef = $firebaseObject(ref.child("info").child(id));
				var mediaref = $firebaseObject(ref.child("media").child(id));
				var packsref = $firebaseObject(ref.child("packages").child(id));
				inforef.$remove();
				mediaref.$remove();
				packsref.$remove();
				$scope.newBool = "newproduct";
			}
			$scope.gridId = "";
			$scope.gridSelector = function (item) {
				$scope.gridId = item.$id;
				// if (true) {}
				// $scope.loadPack(item);
			}
			$scope.gridWatcher = function (id) {
				if (id == $scope.gridId) {
					console.log(id, 2)
					return 2;
				}
				else {
					console.log(id, 1)
					return 1;
				}
			}
			$scope.gridMobile = function (id) {
				if ($mdMedia('xs') || $mdMedia('sm')) {
					if (id == $scope.gridId) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			}
			$scope.productTags = ["parties", "watersports", "tours", "rentals", "outdoor", "events", "activities", "sights"];
			$scope.newPackages = [];
			$scope.newPack = {
				vendor: $stateParams.vendor,
				parent: $scope.packageEditID
			};
			$scope.times = {
				"mon": {}
				, "tue": {}
				, "wed": {}
				, "thu": {}
				, "fri": {}
				, "sat": {}
				, "sun": {}
			}
			$scope.editLang = "en";
			$scope.product = {};
			$scope.addPackage = function () {
				$scope.newPackages.push($scope.newPack)
				console.log($scope.newPackages)
				$scope.newPack = {vendor: $stateParams.vendor,
				parent: $scope.packageEditID};
			};
			$scope.editProduct = {};
			$scope.editProductData = {};
			$scope.saveEdit = function (attr) {
				if (attr == 'tag' || attr == 'price') {
					console.log(attr)
					$scope.editProduct[attr] = $scope.editProductData[attr];
				}
				else {
					console.log(attr)
					$firebaseArray(ref.child("translations").child($scope.editLang)).$add($scope.editProductData[attr]).then(function (translation) {
						$scope.editProduct[attr] = translation.key;
					})
				}
			};
			$scope.tempDate;

			$scope.savePackageEdit = function (id, attr) {
				if (attr == 'price' || attr == 'price') {
					console.log(attr)
					ref.child("packages").child($scope.packageEditID).child(id).child(attr).set($scope.editProductData[id][attr]);

				}
				else {
					console.log(attr)
					$firebaseArray(ref.child("translations").child($scope.editLang)).$add($scope.editProductData[id][attr]).then(function (translation) {
						ref.child("packages").child($scope.packageEditID).child(id).child(attr).set(translation.key);
					})
				}
			};
			$scope.editProductData = {};
			$scope.comms = 10;
			$scope.vendor = $stateParams.vendor;
			$scope.saveProduct = function () {
				console.log($scope.newProduct, $scope.newPackages)
				AdminTools.newProduct($scope.newProduct, $scope.newPackages);
			}
			$scope.savePackages = function () {
				console.log($scope.product)
				AdminTools.newPacks($scope.comms, $scope.product, $scope.newPackages);
			}
			$scope.saveTimes = function () {
				AdminTools.saveTimes()
			}
			$scope.productId = "";

			//- Hire by the hour of by the day - Toubabikes has you covered with great bikes and even better prices! Insurance offered at €3/bike. €50 deposit and photo ID required
}]).controller('PayPalCtrl', ['$scope', '$http', '$rootScope'






		, function ($scope, $http, $rootScope) {
			$scope.uid = $rootScope.uid;
			paypal.checkout.setup('KWPCEZL8SC7XS', {
				environment: 'live'
				, container: 'paypalbtn'
				, click: function () {
					paypal.checkout.initXO();
					var req = {
						"method": "POST"
						, "url": "https://www.pbpapi.com/purchases/tktr_pay", // "url" : "https://23b7a697.ngrok.io/purchases/tktr_pay",
						"data": {
							"uid": $scope.uid
						}
					}
					$http(req).then(function (response) {
						paypal.checkout.startFlow(response.data.token);
					}, function (err) {
						console.log(err)
						paypal.checkout.closeFlow();
					})
				}
			});
}]).controller('UpgradeCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdpDatePicker', '$mdSidenav', '$mdpTimePicker', 'DateParser'

		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav, $mdpDatePicker, $mdpTimePicker, DateParser) {
			var ref = firebase.database().ref();
			$scope.upSellTicket = {};
			$scope.init = function(ticket){
				$scope.upSellTicket = ticket;
			}
			if ($scope.upSellTicket.vendor) {
				var upgradeArr = $firebaseArray(ref.child("info").orderByChild("vendor").equalTo($scope.upSellTicket.vendor))
			upgradeArr.$loaded(function(data){
				$scope.upOptions = data;
			})
			}
			
}]).controller('MyTixCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdpDatePicker', '$mdSidenav', '$mdpTimePicker', 'DateParser'

		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav, $mdpDatePicker, $mdpTimePicker, DateParser) {
			var ref = firebase.database().ref();
			$scope.paramKey;
			$scope.init = function(id){
				$scope.paramKey = id;
			}
			if ($stateParams.uid) {
				$scope.paramKey = $stateParams.uid;
			}
			console.log($scope.paramKey);
			if ($scope.paramKey) {
				console.log($scope.paramKey);
				var tArray = $firebaseArray(ref.child("tix").orderByChild('uid').equalTo($scope.paramKey));
				$scope.ticketData = {};
				$scope.auth = Auth.auth.$getAuth();
				$firebaseObject(ref.child("packages")).$loaded(function (data) {
					$scope.packages = data;
				})
				$scope.mapUrls = {};
				tArray.$loaded(function (data) {
					$scope.myTix = data;
					
					
					angular.forEach(data, function (item) {
						if (item.url == 'NULL' || !item.url) {
							Ticketing.ticketGen($scope.paramKey, item.$id)
						}
						 if (item.parent == 'pack' && item.item) {
							$firebaseObject(ref.child("info").child(item.item)).$loaded(function (data) {
								$scope.ticketData[item.$id] = data;
								
							})
						}
						else if (item.parent != 'pack') {}
						$firebaseObject(ref.child("info").child(item.parent)).$loaded(function (data) {
							$scope.ticketData[item.$id] = data;
							console.log($scope.ticketData);					
							$firebaseObject(ref.child("vendor_locations").child(data.vendor)).$loaded(function (map) {
								$scope.mapUrls[item.$id] = map.mailmap;
							})
						})
					if (data[0]) {
						console.log(data[0]);
						$scope.loadTicket(data[0]);
						$scope.nextTix(1);
					}
					})
					
				})
				$firebaseArray(ref.child("profiles").child($scope.paramKey)).$loaded(function (data) {
				$scope.tixProfile = data;
				})
			}
			$scope.loadPackTix = function(id){

			}
			$scope.loadTicket = function(ticket){
				console.log(ticket)
				$scope.viewTicketData = {};
				$scope.viewTicket = {};
				$scope.viewTicketData = $scope.ticketData[ticket.$id];
				$scope.viewTicket = ticket;
			}
			
			$scope.showIndex = 0;
			$scope.nextTix = function(val){
					var newindex = $scope.showIndex + val;
				if (newindex > $scope.myTix.length - 1) {
					$scope.showIndex = 0;
					$scope.loadTicket($scope.myTix[$scope.showIndex])
				}
				else if (newindex < 0) {
					$scope.showIndex = $scope.myTix.length - 1
				} else {
					$scope.showIndex = newindex;
					$scope.loadTicket($scope.myTix[$scope.showIndex]);
				};
			}
}]).controller('EventCtrl', ['$scope', '$geolocation', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdpDatePicker', '$mdSidenav', '$mdpTimePicker', 'DateParser', '$rootScope', 'AdminTools', '$sce', '$mdMedia', 'Stock'

		, function ($scope, $geolocation, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav, $mdpDatePicker, $mdpTimePicker, DateParser, $rootScope, AdminTools, $sce, $mdMedia, Stock) {
			$scope.vendorFilter = {};
			$scope.ymlFilter = {};
			
			var ref = firebase.database().ref();
			$scope.paramKey;
			$scope.init = function(id){
				$scope.paramKey = id;
			}
			
			if ($stateParams.id) {
				$scope.paramKey = $stateParams.id;
			}
			$scope.uid = Auth.uid();
			$scope.info = {};
			// $scope.gotoAnchor('view');
			var geoRef = firebase.database().ref("geofire/locs")
			var geoFire = new GeoFire(geoRef);

		if (!$scope.user) {
			
			$firebaseObject(ref.child("profiles").child($scope.uid)).$loaded( function(data){
				$scope.user = data;
				if (!$scope.user.location) {
					$scope.user.location = {}
				}
				$geolocation.getCurrentPosition({
						timeout: 60000
					}).then(function (position) {
						$scope.user.location.lat = position.coords.latitude;
						$scope.user.location.lng = position.coords.longitude;
						$scope.user.location.location = [position.coords.latitude, position.coords.longitude];
						$scope.userLoc = [position.coords.latitude, position.coords.longitude];
						

					});
			})
			
			}
		if ($scope.paramKey) {
				$firebaseObject(ref.child("info/" + $scope.paramKey)).$loaded(function (data) {
				$scope.info = data
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
				var list = $firebaseArray(ref.child("info").orderByChild(catortag).equalTo(tagFilter))
			list.$loaded(function (dataArr) {
				$scope.displayArray = dataArr;
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
					//initRecData()
				}
				else if ($scope.info && $scope.paramKey){
					console.log("using" + $scope.paramKey)
					$firebaseArray(ref.child("dates/" + $scope.paramKey)).$loaded(function (data) {
						$scope.times = DateParser.decode(data);
					})
					$firebaseArray(ref.child("packages/" + $scope.paramKey)).$loaded(function (data) {
						$scope.packages = data;
						console.log(data);
						// if ($scope.packages.length < 2) {
						// 	$scope.builder($scope.packages[0])
						// }
					})
					}
					$scope.search = {
						tag: $scope.info.tag
					};
				})
			}
			
				
				// geoFire.get($scope.uid).then(function(location){
				// 	if (location) {
				// 		$scope.user.location.location = location;
				// 	}
				// })
			
			$scope.prettyDate = function(){
				if ($scope.build.date) {
					var date = moment($scope.build.date).clone().format("YYYY-MM-DD");
					if ($scope.build.time.length > 6 ) {
						$scope.build.time = moment($scope.build.date).clone().format("lll");
						return moment($scope.build.date).clone().format("lll");
					} else{
					var tArr = $scope.build.time.split("-");
					$scope.build.time = moment($scope.build.date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
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
						console.log(place)
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
				console.log("./vrview/index.html?image=" + url)
				return "./vrview/index.html?image=" + url
			}
			$firebaseObject(ref.child("profiles/" + $rootScope.uid)).$loaded(function (data) {
				$scope.user = data
			})
			$scope.gvrs = []
			$firebaseObject(ref.child("media/" + $scope.paramKey)).$loaded(function (data) {
				$scope.media = data;
				// $scope.gallery.push(data.branding)
				var wbrand = {
					url: data.wide_branding
				}
				$scope.gallery.push(wbrand)
				angular.forEach(data.images, function (value, key) {
					value.id = key;
					$scope.gallery.push(value)
					$scope.centerImg = $scope.gallery[0];
				})
				angular.forEach(data.gvr, function (value, key) {
					obj = value;
					obj.id = key;
					obj.url = $sce.trustAsResourceUrl(value.url)
					$scope.gvrs.push(obj)
				})
				console.log($scope.gallery)
				angular.forEach(data.vr, function (value, key) {
					value.id = key;
					$scope.vrGal.push(value)
					console.log($scope.vrGal)
				})
				if ($scope.vrGal[0]) {
					$scope.loadVR($scope.vrGal[0]);
				}
			})
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
					, time_anim: 3000
					, navbar: true
					, max_fov: 80
					, min_fov: 50
					, allow_scroll_to_zoom: false
					, usexmpdata: true
					, gyroscope: true
					, auto_rotate: true
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
				console.log($scope.build)
				Stock.checkStatic($scope.build).then(function(resp){
					console.log(resp)
					$scope.build.greenlit = resp;
				})
			};
$scope.numbArray = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19]
	$scope.build = {};
			$scope.buildPack = function (id) {
				$scope.buildPack = $scope.packageData[id][id];
				$scope.buildPack.quantity = $scope.build.quantity;
			}
			$scope.builder = function (itemObj) {
				console.log(itemObj)
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
				
				$scope.build.greenlit = 0;

				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + item.parent)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + $stateParams.id).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
				

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
							
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
					
								angular.forEach(v, function(v2, k2){
										if(v2){
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
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + $stateParams.id).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

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
				console.log($scope.build)
				// if (item.stops) {
				// 	$scope.stops = [];
				// 	angular.forEach(item.stops, function(value, key){
				// 		var obj = value;
				// 		obj.key = key;
				// 		$scope.stops.push(obj);
				// 	})
				// }
				if (!item.tktrpack && !item.ticket) {
					// $firebaseArray(ref.child("dates/" + parentKey)).$loaded(function (data) {
					// 	$scope.times = DateParser.decode(data);
					// })
					$firebaseObject(ref.child("static_stock/" + item.parent).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

						angular.forEach(data, function(v, k){
							$scope.valiDates = {};
							$scope.validDates[k] = true;
						
							var key1 = k;
						
							if (!v.capacity || v.capacity == undefined) {
								angular.forEach(v, function(v2, k2){
										if(v2){
											var cQ = key1 + " " + k2;
											if (moment(cQ).isAfter()) {
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
				 if (item.ticket) {
					var date = moment().format('YYYY-MM-DD');
					$firebaseObject(ref.child("static_stock/" + item.parent).startAt(date).limitToFirst(15)).$loaded(function (data) {
						$scope.buildStatStock = data;
						console.log(data)

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
			$scope.checkStock = function(){
				Stock.checkStock($scope.build).then(function(data){
					if(data){
						$scope.build.stock = data;
						$scope.build.greenlit = true;
						console.log($scope.build.stock);
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
			$scope.currentDate = moment();
			$scope.showDatePicker = function (ev) {
				$mdpDatePicker($scope.currentDate, {
					targetEvent: ev
				}).then(function (selectedDate) {
					$scope.build.date = moment(selectedDate).format('YYYY-MM-DD');
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
					console.log($scope.build)
				});;
			}
			$scope.imgIndex = 0;
			$scope.addToCart = function () {

				console.log($scope.build)
				Cart.addItem($scope.build);
			}
}])
	.controller('TablesCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'Ticketing', '$stateParams', '$animate', 'Auth', 'Cart', '$mdSidenav'

		, function ($scope, $firebaseObject, $firebaseArray, Ticketing, $stateParams, $animate, Auth, Cart, $mdSidenav) {
			var ref = firebase.database().ref();
			var authObj = Auth.auth.$getAuth();
			var uid;
			$scope.paramKey;
			$scope.initBool = false;
			$scope.init = function(table){
				$scope.table = table;
				
				$scope.initBool = true;
			}
			console.log(Auth.auth.$getAuth())
			$scope.auth = authObj;
			$scope.bTable = true;
			$scope.event;
			$scope.tables;
			$scope.ticketing;
			console.log($stateParams)

			if ($scope.table) {
				$firebaseArray(ref.child("tables").child($scope.table.vendor)).$loaded(function (data) {
				$scope.tables = data;
					console.log(data)
				}, function (err) {
					console.log(err)
				})
				$firebaseObject(ref.child("packages").child($scope.paramKey)).$loaded(function (data) {
					$scope.packages = data;
				}, function (err) {
					console.log(err)
				})
				$firebaseArray(ref.child("tableaddons").child($scope.table.vendor)).$loaded(function (data) {
					$scope.tableaddons = data;
				}, function (err) {
					console.log(err)
				})

			}
			// $firebaseObject(ref.child("ticketing/" + $stateParams.id)).$loaded(function (data) {
			// 	$scope.ticketing = data;
			// 	console.log(data)
			// }, function (err) {
			// 	console.log(err)
			// })
			$scope.addTicket = function () {
				var ticket = $scope.packages.pachasingle;
				ticket.title = $scope.event.title;
				ticket.artist = $scope.event.artist;
				ticket.date = $stateParams.id;
				ticket.quantity = 1;
				ticket.pid = "pachasingle"
				Cart.addItem(ticket);
			}
			$scope.buildTable = function (tid) {
				$scope.bTable = $scope.packages[tid];
				$scope.bTable.event_title = $scope.event.title;
				$scope.bTable.date = $stateParams.id;
				$scope.bTable.quantity = 1;
				$scope.bTable.pid = tid;
			}
			$scope.addons = {};
			$scope.newAddon;
			$scope.addOn = function (item) {
				item.quantity = 1;
				$scope.addons[item.$id] = item;
			}
			$scope.removeExtra = function (id) {
				$scope.addons[id] = null;
			}
			$scope.addTable = function (tid) {
				Cart.addItem(table);
				angular.forEach($scope.addons, function (value, key) {
					if (value.quantity != 0 || false) {
						Cart.addItem(value);
					}
				})
			}
			$scope.removeItem = function (key) {
				Cart.removeItem(key);
			}
}]).controller('TicketingCtrl', ['$scope', 'Cart', '$firebaseArray', '$firebaseObject', '$location', '$anchorScroll', '$stateParams'






		, function ($scope, Cart, $firebaseArray, $firebaseObject, $location, $anchorScroll, $stateParams) {
			var clubref = firebase.database().ref("ticketing");
			var clubObj = $firebaseArray(clubref.child("defaults"));
			clubObj.$loaded(function (data) {
				$scope.clubs = data;
			})
			$scope.clubs = [];
			$scope.evList;
			$scope.clubHeaderView = false;
			// $scope.loadEvents = function(key){
			//  var evObj =  $firebaseObject(clubref.child("events/" + key + "/schedule"))
			//  evObj.$loaded(function(data){
			//    console.log(data)
			//    $scope.evList = data;
			//  })
			// }
			$scope.ticketSale;
			$scope.chEvent = function (key, item) {
				$scope.selEvent = item;
				$scope.selEvent.eid = key;
				var key = key;
				angular.forEach($scope.ticketList, function (value, key2) {
					if (key2 == key) {
						$scope.seTicketing = value;
					}
				})
			}
			$scope.selOpt = function (code) {
				$scope.entOpt = code;
				switch (code) {
				case "t":
					var addObj = $firebaseObject(clubref.child("tableaddons/" + $scope.clubSelect.cid))
					addObj.$loaded(function (data) {
						console.log(data)
						$scope.tableaddons = data;
					})
					var addObj = $firebaseObject(clubref.child("tables/" + $scope.clubSelect.cid))
					addObj.$loaded(function (data) {
						console.log(data)
						$scope.tables = data;
					})
					break;
				case "s":
					$scope.ticketSale = $scope.packageList[$scope.clubSelect.single];
					if ($scope.selEvent.date) {
						$scope.ticketSale.date = moment($scope.selEvent.date);
					}
					$scope.ticketSale.name = $scope.selEvent.title;
					if (!$scope.selEvent.default) {
						$scope.ticketSale.price = $scope.selEvent.price;
					}
					$scope.ticketSale.quantity = 1;
					$scope.ticketSale.pid = $scope.clubSelect.defaults.single;
					$scope.ticketSale.eid = $scope.selEvent.eid;
					break;
				case "x":
					$scope.entOpt = false
					break;
				}
			}
			$scope.qCheck = function (key) {
				if ($scope.buildTable) {
					angular.forEach($scope.buildTable.addons, function (value, key2) {
						if (key2 == key) {
							console.log(value)
							return value.quantity
						}
						else {
							return 0
						}
					})
				}
			}
			$scope.addOn = function (key) {
				if (!$scope.buildTable.addons[key]) {
					$scope.buildTable.addons[key] = $scope.tableaddons[key];
					$scope.buildTable.addons[key].quantity = 1;
				}
				else {
					$scope.buildTable.addons[key].quantity += 1;
					$scope.buildTable.total += value.price;
				}
			}
			$scope.reOn = function (key) {
				if ($scope.buildTable.addons[key].quantity > 1) {
					$scope.buildTable.addons[key].quantity -= 1;
					$scope.buildTable.total -= $scope.buildTable.addons[key].price;
				}
				else {
					$scope.buildTable.total -= $scope.buildTable.addons[key].price;
					$scope.buildTable.addons[key] = false;
				}
			}
			$scope.entOpt = "";
			$scope.tableExtras = [];
			$scope.selTable = function (key, item) {
				var key = key;
				$scope.buildTable = $scope.seTicketing.tables[key];
				$scope.buildTable.addons = {};
				$scope.buildTable.total = $scope.seTicketing.tables[key].price;
				$scope.buildTable.pid = key;
				$scope.tableInfo = $scope.tables[key];
			}
			$scope.buyTicket = function () {
				Cart.addItem($scope.ticketSale)
			}
			$scope.clubViewItem = function (item) {
				var key = item.$id;
				$scope.infoView = false;
				$scope.buildView = false;
				$scope.clubSelect = item;
				// $scope.loadEvents(key);
				$scope.clubSelect.cid = key;
				$scope.gotoAnchor('clubs');
				$scope.closeAll();
				$scope.clubView = true;
				$scope.imgIndex = 0;
				$scope.gallery = $scope.clubSelect.images;
				$scope.centerImg = $scope.clubSelect.images[$scope.imgIndex];
				var evObj = $firebaseObject(clubref.child("events/" + key + "/schedule"))
				evObj.$loaded(function (data) {
					console.log(data)
					$scope.evList = data;
				})
				var packObj = $firebaseObject(clubref.child("packages/" + key))
				packObj.$loaded(function (data) {
					console.log(data)
					$scope.packageList = data;
				})
				var ticketObj = $firebaseObject(clubref.child("ticketing/" + key))
				ticketObj.$loaded(function (data) {
					console.log(data)
					$scope.ticketList = data;
				})
			}
			$scope.buyTable = function () {
				var table = $scope.packageList[$scope.buildTable.pid];
				table.pid = $scope.buildTable.pid;
				table.quantity = 1;
				Cart.addItem(table)
				angular.forEach($scope.buildTable.addons, function (value2, key3) {
					var addon = $scope.packageList[key3];
					addon.quantity = $scope.buildTable.addons[key3].quantity;
					addon.name = $scope.buildTable.addons[key3].name;
					addon.pid = key3;
					Cart.addItem(addon);
				})
			}
			$scope.openView = function (view) {
				switch (view) {
				case "e":
					$scope.eHeaderView = !$scope.eHeaderView;
					$scope.oHeaderView = false;
					$scope.tHeaderView = false;
					$scope.rHeaderView = false;
					$scope.wHeaderView = false;
					$scope.recHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "o":
					$scope.oHeaderView = !$scope.oHeaderView;
					$scope.eHeaderView = false;
					$scope.tHeaderView = false;
					$scope.rHeaderView = false;
					$scope.wHeaderView = false;
					$scope.recHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "t":
					$scope.tHeaderView = !$scope.tHeaderView;
					$scope.eHeaderView = false;
					$scope.oHeaderView = false;
					$scope.rHeaderView = false;
					$scope.wHeaderView = false;
					$scope.recHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "r":
					$scope.rHeaderView = !$scope.rHeaderView;
					$scope.eHeaderView = false;
					$scope.oHeaderView = false;
					$scope.tHeaderView = false;
					$scope.wHeaderView = false;
					$scope.recHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "w":
					$scope.wHeaderView = !$scope.wHeaderView;
					$scope.eHeaderView = false;
					$scope.oHeaderView = false;
					$scope.tHeaderView = false;
					$scope.rHeaderView = false;
					$scope.recHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "rec":
					$scope.recHeaderView = !$scope.recHeaderView;
					$scope.eHeaderView = false;
					$scope.oHeaderView = false;
					$scope.tHeaderView = false;
					$scope.rHeaderView = false;
					$scope.wHeaderView = false;
					$scope.clubHeaderView = false;
					break;
				case "club":
					$scope.clubHeaderView = !$scope.clubHeaderView;
					$scope.eHeaderView = false;
					$scope.oHeaderView = false;
					$scope.tHeaderView = false;
					$scope.rHeaderView = false;
					$scope.wHeaderView = false;
					$scope.recHeaderView = false;
					break;
				}
			}
			$scope.closeThis = function (code) {
				$scope.clubView = false;
			}
			$scope.closeAll = function () {
				$scope.eView = false;
				$scope.rView = false;
				$scope.oView = false;
				$scope.fView = false;
				$scope.wView = false;
				$scope.recView = false;
				$scope.clubView = false;
				$scope.tView = false;
				$scope.buildView = false;
				$scope.catProduct = {};
				$scope.builtPackage = {};
				$scope.buildId = "";
				$scope.imgIndex = 0;
				$scope.centerImg = "";
				$scope.gallery = [];
			}
			$scope.buildId = "";
			$scope.adPrice
			$scope.selectPack = function (key, value) {
				$scope.buildId = key;
				$scope.selPack = value;
				console.log(selPack)
			}
			$scope.imgView = false;
			$scope.dates = [];
			$scope.buildTotal = function () {
				$scope.subTotal = $scope.builtPackage.price * $scope.builtPackage.quantity
			}
			$scope.build = function (pid, product) {
				$scope.dates = DateParser.decode(product.content.available_dates);
				$scope.catBuilder = product.data.packages[pid];
				$scope.builtPackage = product.data.packages[pid];
				$scope.builtPackage.pid = pid;
				if ($scope.dates) {
					console.log($scope.dates)
					$scope.builtPackage.date = $scope.dates[0];
				}
				$scope.builtPackage.quantity = 1;
				$scope.buildTotal();
				$scope.buildView = true;
				$scope.catProduct = product;
			}
			$scope.closeGal = function () {
				$scope.imgView = false;
				$scope.buildView = false;
			}
			$scope.gallery = [];
			$scope.viewGal = function () {
				$scope.imgView = true;
			}
			$scope.swipeRight = function () {
				if ($scope.imgIndex < $scope.gallery.length - 1) {
					$scope.imgIndex += 1;
					$scope.centerImg = $scope.gallery[$scope.imgIndex];
				}
				else if ($scope.imgIndex == $scope.gallery.length - 1) {
					$scope.imgIndex = 0;
					$scope.centerImg = $scope.gallery[$scope.imgIndex];
				}
			}
			$scope.swipeLeft = function () {
				if ($scope.imgIndex > 0) {
					$scope.imgIndex -= 1;
					$scope.centerImg = $scope.gallery[$scope.imgIndex];
				}
				else if ($scope.imgIndex == 0) {
					$scope.imgIndex = $scope.gallery.length - 1;
					$scope.centerImg = $scope.gallery[$scope.imgIndex];
				}
			}
			$scope.buildBack = function () {
				$scope.buildView = false;
				$scope.catProduct = {};
			};
			$scope.printPack = function () {
				console.log($scope.builtPackage.date)
			}
			$scope.subTotalFn = function () {
				if ($scope.builtPackage) {
					return $scope.builtPackage.price * $scope.builtPackage.quantity;
				}
			};
			$scope.addToCart = function () {
				Cart.addItem($scope.builtPackage);
				$scope.buildBack();
				$scope.eView = false;
			};
}]).controller('CartCtrl', ['$scope', '$http', 'Cart', 'Auth', 'User', '$window', '$mdDialog', '$firebaseArray', '$geolocation', '$state', '$mdToast', 'Promoters', '$firebaseObject', '$rootScope'






		, function ($scope, $http, Cart, Auth, User, $window, $mdDialog, $firebaseArray, $geolocation, $state, $mdToast, Promoters, $firebaseObject, $rootScope) {
			// $scope.items = Cart.getItems();
			var ref = firebase.database().ref();
			// $scope.authID = store.get("uid");
			$scope.uid = $rootScope.uid;
			if ($scope.uid) {
				var userObj = $firebaseObject(ref.child("profiles/" + $scope.uid));
				userObj.$loaded().then(function (data) {
					$scope.user = data;
					console.log($scope.uid);
					if (!$scope.user.voucher) {
						$scope.dataForm = true;
					}
					var url = "carts/" + $scope.uid
					var totalUrl = "carts/" + $scope.uid + "/total"
					var cartObj = $firebaseObject(ref.child(url))
					cartObj.$bindTo($scope, "cart").then(function (data) {
						if ($scope.cart.total != 0) {
							paypal.checkout.setup('KWPCEZL8SC7XS', {
								environment: 'live'
								, container: 'myContainer'
								, click: function () {
									paypal.checkout.initXO();
									var req = {
										"method": "POST"
										, "url": "https://www.pbpapi.com/purchases/", // "url" : "https://23b7a697.ngrok.io/purchases/",
										"data": {
											"uid": $scope.uid
										}
									}
									$http(req).then(function (response) {
										console.log(response.data)
										if (response.data.token == "free") {
											$state.go("app.purchase_success")
										}
										else {
											paypal.checkout.startFlow(response.data.token);
										}
									}, function (err) {
										console.log(err)
										paypal.checkout.closeFlow();
									})
								}
							});
						}
					}, function (err) {
						console.log(err)
					});
					var totalObj = $firebaseObject(ref.child(totalUrl))
					totalObj.$bindTo($scope, "total").then(function (data) {
						console.log($scope.total)
					}, function (err) {
						console.log(err)
					});
				})
			}
			$scope.updateData = function () {
				var ref = firebase.database().ref("profiles");
				var userObj = $firebaseObject(ref.child($scope.uid));
				userObj.$loaded().then(function (data) {
					if (!data.voucher && $scope.missingData.voucher) {
						userObj.voucher = $scope.missingData.voucher;
					}
					if (!data.email && $scope.missingData.email) {
						userObj.email = $scope.missingData.email;
					}
					// User.updateEmail($scope.missingData.email);
					userObj.$save().then(function (data) {
						$mdToast.show($mdToast.simple().textContent('BOOYAKASHA'));
						$scope.dataForm = false;
					}, function (err) {
						$mdToast.show($mdToast.simple().textContent('FAIL'));
						console.log(err)
					})
				})
			}
			$scope.missingData = {};
			$scope.emptyCart = function () {
				Cart.empty();
			}
			$scope.removeItem = function (key) {
				Cart.removeItem(key);
				console.log(key)
			}
			$scope.deliveryCharge = {
				mcd: 0
				, bk: 0
				, kfc: 0
				, other: 0
				, total: 0
			}
			$scope.logCart = function () {
				console.log(Cart.getCart())
			}
			$scope.promocode = {};
			$scope.dataUrl = "";
			console.log(Cart.getItems())
			$scope.purchase;
			$scope.ppReturn;
			$scope.promocode = {};
			$scope.showPP = false;
			console.log($scope.dataUrl)
			$scope.checkout = false;
			$scope.animationsEnabled = true;
}]).controller('DoorCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$stateParams'






		, function ($scope, $firebaseObject, $firebaseArray, $stateParams) {
			var ref = firebase.database().ref();
			var clubRef = firebase.database().ref("clubs");
			$scope.showEdit = false;
			// $scope.editTable = function(){
			//   this.showEdit = true;
			// }
			// $scope.saveEdit = function(){
			//   this.showEdit = false;
			// }
			$scope.list = [];
			var tablesObj = $firebaseObject(clubRef.child("tables"))
			tablesObj.$bindTo($scope, "tables")
			var eventsObj = $firebaseObject(clubRef.child("events/schedule/" + $stateParams.id))
			eventsObj.$loaded(function (data) {
				$scope.event = data;
			})
			var tablesObj = $firebaseObject(clubRef.child("tables"))
			tablesObj.$loaded(function (data) {
				$scope.ticketing = data;
			})
			$scope.thisEvent = function (item) {
				$scope.list = [];
				$scope.scanTix = {};
				$scope.tixTables = {};
				console.log(item)
				$scope.eventInfo = item;
				var listArr = $firebaseArray(clubRef.child("ticketing/" + $stateParams.id + "/list"))
				listArr.$loaded(function (data) {
					angular.forEach(data, function (tix) {
						$firebaseObject(ref.child("profiles/" + tix.$id)).$loaded(function (data) {
							var person = data;
							person.q = tix.q;
							person.checkedIn = tix.checkedIn;
							console.log(person)
								// $scope.listObj[data.$id] = person
							$scope.list.push(person)
							console.log($scope.list)
						})
					})
					console.log($scope.list)
				})
				var tableArr = $firebaseArray(clubRef.child("ticketing/" + $stateParams.id + "/tables"))
				tableArr.$loaded(function (data) {
					$scope.tixTables = data;
				})
			}
			$scope.checkIn = function (uid) {
				clubRef.child("ticketing/" + $stateParams.club + "/" + item.$id + "/list/" + uid + "/checkedIn").set(true)
			}
			$scope.scanTix = {};
			$scope.onSuccess = function (uid) {
				// $firebaseObject(clubRef.child("ticketing/" + $stateParams.club + "/" + $scope.eventInfo.$id + "/list/" + uid)).$loaded(function(data){
				//    if (data) {
				//      console.log(data)
				//      $firebaseObject(ref.child("profiles/" + uid)).$loaded(function(profile){
				//        console.log(profile)
				//        $scope.scanTix.ticket = { name: profile.name, q: data.$value };
				//      })
				//    }
				//  })
				angular.forEach($scope.list, function (person) {
					console.log(person, uid, person.$id == uid)
					if (person.$id == uid) {
						$scope.scanTix.ticket = person;
						console.log($scope.scanTix)
					}
				})
				angular.forEach($scope.tixTables, function (table) {
					console.log(table.primary, uid, table.primary == uid)
					if (table.primary == uid) {
						$scope.scanTix.table = table;
						console.log($scope.scanTix)
					}
				})
			}
			$scope.onError = function (error) {
				console.log(error);
			};
			$scope.onVideoError = function (error) {
				console.log(error);
			};
			$scope.scanner = false;
			$scope.scanQR = function () {
				$scope.scanner = !$scope.scanner;
			}
}]).controller('QRScanner', ['$scope', '$firebaseObject', '$stateParams'
		, function ($scope, $firebaseObject, $stateParams) {
			var ref = firebase.database().ref();
			// var clubRef = firebase.database().ref("clubs");
			$scope.scanTix = {};
			$scope.ticketState = "";
			// $scope.onSuccess = function (data) {
			// 	$scope.ticketState = "pending";
			// 	$firebaseObject(ref.child("tix/" + data)).$loaded(function (ticket) {
			// 		if (ticket) {
			// 			$scope.scanTix.ticket = ticket;
			// 			$firebaseObject(ref.child("profiles/" + ticket.uid)).$loaded(function (profile) {
			// 				$scope.scanTix.profile = profile;	
			// 			})
			// 			$firebaseObject(ref.child("info/" + ticket.parent)).$loaded(function (item) {
			// 				$scope.scanTix.item = item;
			// 			})
			// 			$firebaseObject(ref.child("packages/" + ticket.parent + "/" + ticket.item)).$loaded(function (package) {
			// 				$scope.scanTix.package = package;
			// 			})
			// 			var dateKey;
			// 			var timeKey = moment(ticket.time).clone().format("HH-mm")
			// 			if (timeKey == "00-00") {
			// 				dateKey = moment(ticket.time).clone().format("YYYY-MM-DD");
			// 			} else {
			// 				dateKey = moment(ticket.time).clone().format("YYYY-MM-DD/HH-mm");
			// 			}
			// 			ref.child("static_stock").child(ticket.parent).child(dateKey).child("list").child(data).once('value', function(snap){
			// 				$scope.ticketState = "confirmed";
			// 			})
			// 		}
			// 	})
			// }
			// $scope.onError = function (error) {
			// 	console.log(error);
			// };
			// $scope.onVideoError = function (error) {
			// 	console.log(error);
			// };
			$scope.scanNow = function(){
					$scope.scanTix = {};
				$scope.scanner = !$scope.scanner;
				 //the scanner succesfully scan a QR code
			        var jbScanner = new JsQRScanner(onQRCodeScanned);
			        //reduce the size of analyzed image to increase performance on mobile devices
			        jbScanner.setSnapImageMaxSize(300);
			        var scannerParentElement = document.getElementById("scanner");
			        if(scannerParentElement)
			        {
			            //append the jbScanner to an existing DOM element
			            jbScanner.appendTo(scannerParentElement);
			        }       
			}
			$scope.scanner = false;
			$scope.scanQR = function () {
				$scope.scanner = !$scope.scanner;
			};
			 function onQRCodeScanned(scannedText)
			    {

			       
			        if(scannedText)
			        {
			        	$scope.ticketState = "pending";
						$firebaseObject(ref.child("tix/" + scannedText)).$loaded(function (ticket) {
							if (ticket) {
								$scope.scanTix.ticket = ticket;
								$firebaseObject(ref.child("profiles/" + ticket.uid)).$loaded(function (profile) {
									$scope.scanTix.profile = profile;	
								})
								$firebaseObject(ref.child("info/" + ticket.parent)).$loaded(function (item) {
									$scope.scanTix.item = item;
								})
								$firebaseObject(ref.child("packages/" + ticket.parent + "/" + ticket.item)).$loaded(function (package) {
									$scope.scanTix.package = package;
								})
								var dateKey;
								var timeKey = moment(ticket.time).clone().format("HH-mm")
								if (timeKey == "00-00") {
									dateKey = moment(ticket.time).clone().format("YYYY-MM-DD");
								} else {
									dateKey = moment(ticket.time).clone().format("YYYY-MM-DD/HH-mm");
								}
								ref.child("static_stock").child(ticket.parent).child(dateKey).child("list").child(ticket.$id).once('value', function(snap){
									$scope.ticketState = "confirmed";
								})
							}
						})
			         
			        }
			    }

			    //this function will be called when JsQRScanner is ready to use
			    function JsQRScannerReady()
			    {
			        //create a new scanner passing to it a callback function that will be invoked when
			        //the scanner succesfully scan a QR code
			        var jbScanner = new JsQRScanner(onQRCodeScanned);
			        //reduce the size of analyzed image to increase performance on mobile devices
			        jbScanner.setSnapImageMaxSize(300);
			        var scannerParentElement = document.getElementById("scanner");
			        if(scannerParentElement)
			        {
			            //append the jbScanner to an existing DOM element
			            jbScanner.appendTo(scannerParentElement);
			        }        
			    }
}]).controller('MapsCtrl', ['$scope', '$firebaseArray', '$geolocation', 'uiGmapIsReady', '$stateParams', '$firebaseObject', '$translate', '$mdMedia', '$translate'


		, function ($scope, $firebaseArray, $geolocation, uiGmapIsReady, $stateParams, $firebaseObject, $translate, $mdMedia, $translate) {
			var ref = firebase.database().ref()
			var center;
			var windowName;
			$scope.paramKey;
			$scope.initBool = false;
			$scope.init = function(id){
				$scope.paramKey = id;
				console.log("using" + id)
				loadData(id)
				$scope.initBool = true;
			}
			if ($stateParams.id) {
				$scope.paramKey = $stateParams.id;
				if (!$scope.initBool) {
					loadData($stateParams.id)}
			}
		
				console.log($scope.paramKey)

			function loadData(id){
				$firebaseObject(ref.child("info").child($scope.paramKey)).$loaded(function (data) {
					console.log(data)
				if (!data.location) {
						$firebaseObject(ref.child("accomm").child($scope.paramKey)).$loaded(function (data) {
							$scope.info = data;

							$firebaseObject(ref.child("info").child(data.vendor).child("location")).$loaded(function (data2) {
								$scope.hostelInfo = data2;
								$scope.info.location = data2;
								center = {
									lat: data2.lat
									, lng: data2.lng
								}
								$translate($scope.info.name).then(function(name){
										if (!name){
											windowName = $scope.info.name
										initMap()
										} else {

											windowName = name
											initMap()
										}

									})

							})
						})

				} else {
					$scope.info = data;
					center = {
						lat: data.location.lat
						, lng: data.location.lng
					};
					if (!data.location.mailmap) {
						ref.child("vendor_locations").child(data.vendor).child("mailmap").once('value', function(snap){
							if (snap.val()){
								$scope.info.location.mailmap = snap.val();
							} 
						})
					}

					$translate($scope.info.name).then(function(name){
										if (!name){
											windowName = $scope.info.name
										initMap()
										} else {

											windowName = name
											initMap()
										}

				})


			}

			})
		
			}

			function initMap() {
				console.log(center)
				if( $mdMedia('gt-sm')){

						var map = new google.maps.Map(document.getElementById('evmap'), {
							center: center
							, zoom: 15,
							draggable: false
						});
				} else {
					var map = new google.maps.Map(document.getElementById('evmobmap'), {
							center: center
							, zoom: 15,
							draggable: false
						});
				}



				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
				// Set the position of the marker using the place ID and location.
				var plObj = {
					 location: {
						lat: $scope.info.location.lat
						, lng: $scope.info.location.lng
					}
				}
				if($scope.info.placeid) {
						plObj.placeId =  $scope.info.placeid;
					}
				marker.setPlace(plObj);

				marker.addListener('click', function () {
					$scope.openMap()
				})
				infowindow.addListener('click', function () {
					$scope.openMap()
				})
				marker.setVisible(true);
				infowindow.setContent('<div><strong>' +  windowName + '</strong></div>');
				infowindow.open(map, marker);
			}
			$scope.openMap = function (){
				window.open($scope.info.location.mailmap);
			};
			function initUserMap() {
				center = {lat: $scope.currLoc.lat, lng: $scope.currLoc.lng}
				var map = new google.maps.Map(document.getElementById('evmap'), {
					center: center
					, zoom: 13
				});
				var infowindow = new google.maps.InfoWindow();
				var marker = new google.maps.Marker({
					map: map
				});
				marker.addListener('click', function () {
					infowindow.open(map, marker);
				});
				// Set the position of the marker using the place ID and location.
				marker.setPlace({
					placeId: $scope.info.placeid
					, location: {
						lat: $scope.info.location.lat
						, lng: $scope.info.location.lng
					}
				});
				marker.addListener('click', function () {})
				marker.setVisible(true);
				infowindow.setContent('<div><strong>' + $scope.info.name + '</strong><br>' + 'Place ID: ' + $scope.info.place_id + '<br>' + $scope.info.formatted_address);
				infowindow.open(map, marker);
			}
			uiGmapIsReady.promise(1).then(function () {
					$geolocation.getCurrentPosition({
						timeout: 60000
					}).then(function (position) {
						$scope.currLoc.lat = position.coords.latitude;
						$scope.currLoc.lng = position.coords.longitude;
						$scope.currLoc.loc = [position.coords.latitude, position.coords.longitude];
						$scope.currLoc.gmap = {
							lat: position.coords.latitude
							, lng: position.coords.longitude
						};
						if(center && center.lat){
							initMap()
						}

					});
				})

				
}]).controller('StaffDashCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth', 'Clubs'

		, function ($scope, $firebaseObject, $firebaseArray, $stateParams, Auth, Clubs) {
			var ref = firebase.database().ref();
			$scope.today = {};
			$firebaseObject(ref.child("events/schedule" + $stateParams.id)).$loaded(function (data) {
				$scope.event = data;
			})
			$firebaseObject(ref.child("accounts/events/" + $stateParams.id)).$loaded(function (data) {
				$scope.today.door = data;
			})
			$firebaseObject(ref.child("ticketing/" + $stateParams.id)).$loaded(function (data) {
				$scope.today.available = data.available;
				$scope.today.tables = data.tables
			})
			$firebaseObject(ref.child("defaults")).$loaded(function (data) {
				$scope.clubInfo = data;
				if ($scope.today.available && !$scope.today.door) {
					$scope.today.door = ($scope.clubInfo.capacity - $scope.today.available) * $scope.event.price
				}
			})
			$firebaseObject(ref.child("accounts/staff/" + $stateParams.id)).$loaded(function (data) {
				$scope.today.personal = data;
			})
			$scope.calendar = function () {
				Clubs.calendar();
			};
}]).controller('StaffManagementCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth'






		, function ($scope, $firebaseObject, $firebaseArray, $stateParams, Auth) {
			var ref = firebase.database().ref();
			$scope.showFOrm = false;
			$firebaseArray(ref.child("staff")).$loaded(function (data) {
				console.log(data)
				$scope.staff = data;
			})
			$firebaseObject(ref.child("accounts/staff")).$loaded(function (data) {
				$scope.staffPay = data;
			})
			$scope.newStaff = function () {
				$scope.showForm = true;
			}
			$scope.newStaffObj = {
				working: false
			}
			$scope.positions = [
    "bar"
    , "security"
    , "hostess"
  ]
			$scope.signUpObj = {};
			$scope.addStaff = function () {
				// $scope.signUpObj.email = $scope.newStaffObj.email
				//  if($scope.signUpObj.password === $scope.signUpObj.password_confirmation) {
				//   Auth.$createUserWithEmailAndPassword($scope.signUpObj.email, $scope.signUpObj.password)
				//       .then(function(firebaseUser) {
				$firebaseArray(ref.child("staff")).$add($scope.newStaffObj).then(function (ref) {
						console.log(ref)
						$scope.newStaff()
						ref.child("accounts/staff/" + ref.key).set(0.00).then(function (ref) {
								console.log(ref)
									// Auth.$signOut()
							})
							// Auth.$signOut()
					})
					//     console.log("User " + firebaseUser.uid + " created successfully!");
					//   }).catch(function(error) {
					//     console.error("Error: ", error);
					//   });
					// } else {
					// $mdToast.show($mdToast.simple().textContent('Passwords Dont Match'));
					// }
			}
}]).controller('StaffShiftCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth'






		, function ($scope, $firebaseObject, $firebaseArray, $stateParams, Auth) {
			$firebaseObject(ref.child("roster/" + $stateParams.id)).$loaded(function (data) {
				$scope.roster = data;
			})
}]).controller('AdminTicketsCtrl', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth', 'PosTools', 'DateParser', '$mdDialog', 'Ticketing'






		, function ($scope, $rootScope, $firebaseObject, $firebaseArray, $stateParams, Auth, PosTools, DateParser, $mdDialog, Ticketing) {
			var ref = firebase.database().ref()
			$scope.validDates = {};
			$firebaseArray(ref.child("info").orderByChild("vendor").equalTo($stateParams.vendor)).$loaded(function (data) {
				$scope.vendorProducts = data;
				$scope.product = data[0];
			})
			$scope.ticketsSold = {};
			$scope.editDate = moment().format('YYYY-MM-DD');
			$scope.updateTix = function () {
				Ticketing.updateTix($scope.ticketsSold, $scope.product.$id, $scope.editDate)
			}
}]).controller('PosCtrl', ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth', 'PosTools', 'DateParser', '$mdDialog', 'Ticketing'






		, function ($scope, $rootScope, $firebaseObject, $firebaseArray, $stateParams, Auth, PosTools, DateParser, $mdDialog, Ticketing) {
			var ref = firebase.database().ref()
			$scope.validDates = {};
			console.log()
			$firebaseObject(ref.child("profiles").child($rootScope.uid)).$loaded(function (data) {
				$scope.staff = data;
			})
			$firebaseArray(ref.child("info").orderByChild("vendor").equalTo($stateParams.vendor)).$loaded(function (data) {
				$scope.vProducts = data;
			})
			$scope.selProd = function (prod) {
				$scope.prod = prod;
				$firebaseArray(ref.child("dates/" + prod.$id)).$loaded(function (data) {
					$scope.times = DateParser.decode(data);
					if ($scope.times) {
						$scope.purchase.date = $scope.times[0];
						$scope.purchase.time = $scope.times[0];
					}
				})
				$firebaseArray(ref.child("packages").child(prod.$id)).$loaded(function (data) {
					$scope.packages = data;
					$scope.loadTickets();
					angular.forEach(data, function (value) {
						$scope.purchase.items[value.$id] = value;
					})
				})
			}
			$scope.quantityChange = function (direction, id) {
				if ($scope.purchase.items[id].quantity) {
					if (direction == 'down') {
						$scope.purchase.items[id].quantity -= 1
					}
					else if (direction == 'up') {
						$scope.purchase.items[id].quantity += 1
					}
					console.log(direction, id, $scope.purchase.items[id])
				}
				else if (direction == 'up' && !$scope.purchase.items[id].quantity) {
					$scope.purchase.items[id].quantity = 1
				}
			}
			$scope.ticketObj = {};
			$scope.loadTickets = function () {
				$firebaseObject(ref.child("ticketing").child($scope.prod.$id).child(moment($scope.purchase.date).format('YYYY-MM-DD')).child(moment($scope.purchase.time).format('HH-mm'))).$loaded(function (data) {
					$scope.ticketObj = data;
					console.log($scope.ticketObj)
					if (!$scope.ticketObj.available) {
						console.log("!!")
						Ticketing.setNew($scope.prod.$id, $scope.purchase.time)
					}
				})
			}
			$scope.today = moment().format('YYYY-MM-DD');
			$scope.validate = function (date) {
				// var key = moment(date).format('YYYY-MM-DD')
				//     if ( $scope.validDates[key] == null && moment(date).isAfter(moment())) {
				//       return true
				//     } else {
				//       return false
				//     }
				var result = true;
				angular.forEach($scope.times, function (timeObj) {
					if (moment(timeObj).isSame(date, 'day')) {
						result = false;
					}
				})
				return result;
			}
			$scope.$watch('purchase', function () {
				$scope.totalPurchase();
			})
			$scope.purchase = {
				items: {}
				, total: 0
			};
			$scope.total = 0.00;
			$scope.posTax = 0.00;
			$scope.totalPurchase = function () {
				$scope.purchase.total = 0.00;
				$scope.purchase.tax = 0.00;
				$scope.purchase.quantity = 0;
				angular.forEach($scope.purchase.items, function (value, key) {
					console.log(value, key)
					if (value.quantity) {
						$scope.purchase.total += value.price * value.quantity
						$scope.purchase.tax += value.tax * value.quantity
						$scope.purchase.quantity += value.quantity
					}
				})
			}
			$scope.addToTotal = function (item) {
				$scope.purchase.total += item.price * item.quantity
			}
			$scope.cashSale = function () {
				angular.forEach($scope.purchase.items, function (value, key) {
					console.log(value, key)
					if (!value.quantity) {
						$scope.purchase.items[key] = null;
					}
				})
				$scope.purchase.rep = $rootScope.uid;
				$scope.purchase.date = moment($scope.purchase.time).format("YYYY-MM-DD");
				$scope.purchase.time = moment($scope.purchase.time).format("HH-mm");
				$scope.purchase.vendor = $stateParams.vendor;
				$scope.purchase.pid = $scope.prod.$id;
				$scope.changeBool = true;
			}
			$scope.times = [];
			$scope.checkDay = function (time) {
				return moment(time).isSame($scope.purchase.date, 'day')
			}
			$scope.cashOpts = [{
				value: 5
				, q: 0
			}, {
				value: 10
				, q: 0
			}, {
				value: 20
				, q: 0
			}, {
				value: 50
				, q: 0
			}, {
				value: 100
				, q: 0
			}];
			console.log($scope.purchase)
			$scope.close = function () {
				$mdDialog.hide();
			}
			$scope.up = function (o) {
				o.q += 1
			}
			$scope.down = function (o) {
				o.q += 1
			}
			$scope.closeandPay = function () {
				PosTools.cashSale($scope.purchase);
				$scope.changeBool = false;
				$scope.prod = null;
			}
			$scope.change = function () {
				var total = 0;
				if ($scope.other) {
					return $scope.purchase.total - $scope.other;
				}
				else {
					angular.forEach($scope.cashOpts, function (item) {
						total += item.value * item.q
					})
					return $scope.purchase.total - total;
				}
			}
}]).controller("DriverMapCtrl", ['$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$stateParams', 'Auth', '$geolocation', 'uiGmapGoogleMapApi', '$mdDialog', 'Ticketing'






		, function ($scope, $rootScope, $firebaseObject, $firebaseArray, $stateParams, Auth, $geolocation, uiGmapGoogleMapApi, $mdDialog, Ticketing) {
			$geolocation.getCurrentPosition({
				timeout: 60000
			}).then(function (position) {
				geoFire.set($rootScope.uid, [position.coords.latitude, position.coords.longitude]).then(function () {
					console.log("Provided key has been added to GeoFire");
					ref.child("profiles/" + user.uid + "/location").set([position.coords.latitude, position.coords.longitude])
				})
				$scope.location = [position.coords.latitude, position.coords.longitude];
			});
			$scope.drivers = [];
			var ref = firebase.database().ref();
			var driverFire = new GeoFire(ref.child("geofire/drivers"));
			var driverQuery = driverFire.query({
				center: $scope.location
				, radius: 10
			})
			var onEnterQ = driverQuery.on("key_entered", function (key, location, distance) {
				console.log(key + " entered query at " + location + " (" + distance + " km from center)");
				var driver = {};
				$firebaseObject(ref.child("drivers").child(key)).$loaded(function (data) {
					angular.forEach(data, function (v, k) {
						driver[k] = v;
					})
					driver.location = location;
					driver.distance = distance;
					$scope.drivers.push(driver);
				})
			});
			uiGmapGoogleMapApi.then(function (maps) {
				$scope.map = {
					center: {
						latitude: 45
						, longitude: -73
					}
					, zoom: 8
				};
			});
}])
