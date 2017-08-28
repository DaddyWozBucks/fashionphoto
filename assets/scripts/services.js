angular.module('tktr.services', ['ja.qr']).factory('Associations', ['$http', '$mdToast'


		, function ($http, $mdToast) {
			return {
				sendEnquiry: function (email) {
					var req = {
						"method": "POST"
						, "url": "https://www.pbpapi.com/users/val_enq", // "url": "https://312c30f7.ngrok.io/users/val_enq",
						"data": {
							"email": email
						}
					}
					$http(req).then(function (response) {
						console.log(response)
						$mdToast.show($mdToast.simple().textContent("We'll be in touch!"));
					})
				}
			}
}]).factory('Promoters', ['$http', '$cacheFactory', '$firebaseArray'


		, function ($http, $cacheFactory, $firebaseArray) {
			var ref = firebase.database().ref("promoters").orderByChild("voucher");
			var promocodes = []
			var promoArr = $firebaseArray(ref)
			promoArr.$loaded(function (data) {
				promocodes = data;
			})
			return {
				checkPromoCode: function (code) {
					var lowerCode = angular.lowercase(code)
					console.log(lowerCode)
					var pass = true;
					angular.forEach(promocodes, function (data) {
						if (angular.lowercase(data.code) == lowerCode) {
							pass = false;
						}
					})
					return pass;
				}
				, checkCode: function (code) {
					var lowerCode = angular.lowercase(code)
					console.log(lowerCode)
					var pass = false;
					angular.forEach(promocodes, function (data) {
						if (angular.lowercase(data.code) == lowerCode) {
							pass = true;
						}
					})
					return pass;
				}
				, codes: function () {
					var promocodes = []
					var promoArr = $firebaseArray(ref)
					promoArr.$loaded(function (data) {
						promocodes = data;
						return promocodes;
					})
				}
			, }
}]).factory('User', ['$http', '$q', 'Auth', '$mdDialog', '$firebaseObject', '$rootScope', '$state', '$mdMedia', '$mdDialog', '$stateParams'


		, function ($http, $q, Auth, $mdDialog, $firebaseObject, $rootScope, $state, $mdMedia, $mdDialog, $stateParams) {
			// var authuser = authObj.$getAuth();
			var ref = firebase.database().ref();
			var auth = Auth.auth.$getAuth();
			if (auth) {
				var uid = auth.uid;
				var auth;
			}
			var twitter = new firebase.auth.TwitterAuthProvider();
			// var emailRef = ref.child("profiles/" + uid)
			// emailRef.on('child_added', function(snapshot) {
			//   if (snapshot.key == "email") {
			//      welcomeEmail(uid);
			//   }
			// });
			function loginWith(prov, method) {
				var deferred = $q.defer();
				switch (prov) {
				case "google":
					var provider = new firebase.auth.GoogleAuthProvider();
					provider.addScope('https://www.googleapis.com/auth/plus.login');
					provider.addScope('https://www.googleapis.com/auth/userinfo.email');
					break;
				case "facebook":
					var provider = new firebase.auth.FacebookAuthProvider();
					provider.addScope('email');
					provider.addScope('user_friends');
					break;
				case "twitter":
					var provider = new firebase.auth.TwitterAuthProvidernewDriver();
					break;
				}
				switch (method) {
					case 'pop':
						Auth.auth.$signInWithPopup(provider).then(function(userObj){
							console.log(userObj)
							if(userObj.user && userObj.user.email ){
								var profile = {
								
								uid: userObj.user.uid,
								email: userObj.user.email
								
								, voucher: $stateParams.partner
								, photo: "hold"
								}
							
							if (userObj.user.name) {
								profile.name = userObj.user.name
							}
							if (userObj.user.photoURL) {
								profile.photo = userObj.user.photoURL
							}
							console.log(profile)
								ref.child("profiles").child(userObj.user.uid).set(profile).then(function(data){
									console.log(data)
									$state.go("app.home.store");
								})
							
							
							}
						});
						break;
						case 'redir':
							firebase.auth().signInWithRedirect(provider);
							break;
					default:

				}

			}
			function mergeComplete(obj) {
				Auth.auth.$updatePassword(obj.password).then(function() {
				  console.log("Password changed successfully!");
				}).catch(function(error) {
				  console.error("Error: ", error);
				});
			}
			function mergeCompleteProvider(prov) {
				switch (prov) {
				case "google":
					var provider = new firebase.auth.GoogleAuthProvider();
					provider.addScope('https://www.googleapis.com/auth/plus.login');
					provider.addScope('https://www.googleapis.com/auth/userinfo.email');
					var credential = provider.credential(
    				googleUser.getAuthResponse().id_token);
					break;
				case "facebook":
					var provider = new firebase.auth.FacebookAuthProvider();
					provider.addScope('email');
					provider.addScope('user_friends');
					var credential = firebase.auth.FacebookAuthProvider.credential(
    					response.authResponse.accessToken);
					break;
				case "twitter":
					var provider = new firebase.auth.TwitterAuthProvidernewDriver();
					break;
				}

				firebase.auth().currentUser.link(credential).then(function(user) {
					  console.log("Account successfully upgraded", user);
				
				})

			}
			function ssiLanding(email){
				var splitArr = email.split("@");
				var temppword = "tk" + splitArr[0] + "tr";
				Auth.auth.$signInWithEmailAndPassword(email, temppword).then(function(user){
					$rootScope.uid = user.uid;
				});
			}
			function payMerge(){
				$firebaseObject(ref.child("profiles").child($rootScope.uid).child("email")).$loaded(function(data){
					var splitArr = data.$value.split("@");
				var temppword = "tk" + splitArr[0] + "tr";
		
				var credential = firebase.auth.EmailAuthProvider.credential(data.$value, temppword);
				firebase.auth().currentUser.link(credential).then(function(user) {
					$state.go("app.tickets", {id: user.uid})
					})
				})
				
			}
			function mergeNow(emailObj){
				var deferred = $q.defer();
				
					var splitArr = emailObj.email.split("@");
				var temppword = "tk" + splitArr[0] + "tr";
					var email = email;
				var credential = firebase.auth.EmailAuthProvider.credential(emailObj.email, temppword);
				firebase.auth().currentUser.link(credential).then(function(user) {
					console.log(user.uid, user)
					ref.child("profiles").child(user.uid).child("email").set(emailObj.email);
					if (emailObj.name) {
						ref.child("profiles").child(user.uid).child("name").set(emailObj.name);
					}
					deferred.resolve(user)
					})
			
				return deferred.promise;
			}
			function mergeFull(emailObj){
				var deferred = $q.defer();
			
				var credential = firebase.auth.EmailAuthProvider.credential(emailObj.email, emailObj.password);
				firebase.auth().currentUser.link(credential).then(function(user) {
					console.log(user)
					ref.child("profiles").child(user.uid).child("email").set(emailObj.email);
					ref.child("profiles").child(user.uid).child("name").set(emailObj.name);
					deferred.resolve(user)
					})
			
				return deferred.promise;
			}
			function walletLink(email){
				var deferred = $q.defer();
				var splitArr = email.split("@");
				var temppword = "tk" + splitArr[0] + "tr";
				Auth.auth.$signInWithEmailAndPassword(email, temppword).then(function(user){

					if (user) {
						$rootScope.uid = user.uid;
						deferred.resolve(user.uid);
					} else {
						deferred.reject(false)
					}
				});
				return deferred.promise

			}
			function initMerge(emailObj){
				var splitArr = emailObj.email.split("@");
				var temppword = "tk" + splitArr[0] + "tr";
		
				var credential = firebase.auth.EmailAuthProvider.credential(emailObj.email, temppword);
				firebase.auth().currentUser.link(credential).then(function(user) {
					  console.log("Anonymous account successfully upgraded", user);
					  var req = {
					"method": "POST",
						//"url": "https://312c30f7.ngrok.io/users/merge"
					 "url": "https://www.pbpapi.com/users/merge"
					, "data": {
						"uid": user.uid,
						"email": emailObj.email
					}
				}
				$http(req).then(function (response) {
					console.log(response)
				})
					}, function(error) {
					  console.log("Error upgrading anonymous account", error);
					});

			}
			function adminLoginWith(prov, method) {
				switch (prov) {
				case "google":
					var provider = new firebase.auth.GoogleAuthProvider();
					provider.addScope('https://www.googleapis.com/auth/plus.login');
					provider.addScope('https://www.googleapis.com/auth/userinfo.email');
					break;
				case "facebook":
					var provider = new firebase.auth.FacebookAuthProvider();
					provider.addScope('email');
					provider.addScope('user_friends');
					break;
				case "twitter":
					var provider = new firebase.auth.TwitterAuthProvidernewDriver();
					break;
				}
				switch (method) {
					case 'pop':
						firebase.auth().signInWithPopup(provider).then(function(user){
							
							
								ref.child("profiles").child(user.user.uid).child("staff").once('value', function(profile){
									$state.go("app.admin.dash", {vendor: profile.val()})
							
								})
						})
						break;
						case 'redir':
							firebase.auth().signInWithRedirect(provider);
							break;
					default:

				}

			}

			function uiInviteLogin() {
				var uiConfig = {
					'signInSuccessUrl': 'https://pacha.tktr.es/#/app/dashboard'
					, 'signInOptions': [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID
              , firebase.auth.FacebookAuthProvider.PROVIDER_ID
              , firebase.auth.TwitterAuthProvider.PROVIDER_ID
              , firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
					, 'callbacks': {
						'signInSuccess': function (currentUser, credential, redirectUrl) {
							// checkUser(currentUser)
							// checkCart(currentUser.uid)
							auth = currentUser;
							User.check(currentUser);
							User.attachCode(i_uid, currentUser.uid)
							Coop.addToCoop(currentUser.uid, cid)
							console.log(uid)
							$state.go("app.coop.room({id: cid})")
						}
					}, // Terms of service url.
					'tosUrl': 'https://pacha.tktr.es/#/app/terms'
				};
				// var app = firebase.initializeApp(config);
				var auth = firebase.auth();
				var ui = new firebaseui.auth.AuthUI(auth);
				// The start method will wait until the DOM is loaded.
				ui.start('#firebaseui-auth-container', uiConfig);
			}

			function welcomeEmail(uid) {
				console.log("!!!")
				var req = {
					"method": "POST"
					, "url": "https://www.pbpapi.com/users/welcome"
					, "data": {
						"uid": uid
					}
				}
				$http(req).then(function (response) {
					console.log(response)
				})
			}

			function getUser() {
				var deferred = $q.defer();
				var user = $firebaseObject(ref.child("profiles").child(auth.uid))
				user.$loaded().then(function (data) {
					deferred.resolve(data)
				}, function(err){
					deferred.reject(err)
				})
				return deferred.promise
			}

			function updateEmail(email) {
				var auth = Auth.auth.$getAuth();
				var uid = auth.uid;
				var user = $firebaseObject(ref.child("profiles").child(uid))
				user.$loaded().then(function (data) {
					user.email = email;
					user.$save(function (data) {
						console.log(data);
					})
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}

			function voucherCheck(uid) {
				var deferred = $q.defer();
				console.log(uid)
				var vRef = $firebaseObject(firebase.database().ref("profiles/" + uid + "/voucher"))
				vRef.$loaded(function (data) {
					console.log(data)
					if (!data.$value) {
						deferred.resolve(false)
					}
					else {
						deferred.resolve(true)
					}
				})
				return deferred.promise
			}

			function saveUser(user) {
				var userObj = $firebaseObject(ref.child("profiles").child(user.uid))
				userObj.$loaded().then(function (data) {
					userObj.$value = user;
					userObj.$save()
				}, function (err) {
					console.log(err)
				})
			}

			function attachCode(uid, n_uid) {
				var userObj = $firebaseObject(ref.child("profiles").child(uid))
				userObj.$loaded().then(function (data) {
					var n_userObj = $firebaseObject(ref.child("profiles").child(uid))
					n_userObj.$loaded().then(function (data) {
						n_userObj.voucher = userObj.voucher;
						n_userObj.$save(function (data) {
							console.log(data)
						}, function (err) {
							console.log(err)
						})
					}, function (err) {
						console.log(err)
					})
				}, function (err) {
					console.log(err)
				})
			}

			function anonUser(uid) {
				var deferred = $q.defer();
				var new_user = $firebaseObject(ref.child("profiles").child(uid))
				new_user.$loaded(function () {
					var guestURL = "https://firebasestorage.googleapis.com/v0/b/glaring-fire-7161.appspot.com/o/Guest_icon.svg?alt=media&token=cec3ff30-335e-4de8-9c84-190925177106";
					var changeBool = false
					if (!new_user.name) {
						new_user.name = "Guest";
						changeBool = true;
					}
					if (!new_user.photo) {
						new_user.photo = guestURL;
						changeBool = true;
					}
					if (changeBool) {
						new_user.$save(function (ref) {
							deferred.resolve(new_user)
						}, function (error) {
							console.log("Error:", error);
						});
					}
					else {
						deferred.resolve(new_user)
					}
				}, function (error) {
					console.error("Error:", error);
				});
				return deferred.promise
			}

			function checkUser(user) {
				var deffered = $q.defer();
				console.log(user)
				var new_user = $firebaseObject(ref.child("profiles").child(user.uid))
				new_user.$loaded(function () {
					var changeBool = false
					if (!new_user.name) {
						new_user.name = user.displayName;
						changeBool = true;
					}
					if (!new_user.email && user.email) {
						new_user.email = user.email;
						changeBool = true;
					}
					if (!new_user.emailVerified) {
						new_user.emailVerified = user.emailVerified;
						changeBool = true;
					}
					if (!new_user.photo) {
						new_user.photo = user.photoURL;
						changeBool = true;
					}
					if (changeBool) {
						new_user.$save(function (ref) {
							deffered.resolve(new_user)
						}, function (error) {
							console.log("Error:", error);
						});
					}
					else {
						deffered.resolve(new_user)
					}
				}, function (error) {
					console.error("Error:", error);
				});
				return deffered.promise
			}
			var userVoucher = "";

			function getUid() {
				var deffered = $q.defer();
				var auth = Auth.auth.$getAuth();
				if (auth) {
					console.log(auth)
					deffered.resolve(auth.uid);
				}
				return deffered.promise
			}

			function setUserVoucher(uid, vouch) {
				var ref = firebase.database().ref("profiles/" + uid + "/voucher")
				ref.set(vouch).then(function (data) {});
			}
			return {
				uiLogin: function () {
					return uiLogin()
				}, mergeComplete: function(obj) {
 					return mergeComplete(obj)
 					},mergeCompleteProvider: function(prov) {
 					return mergeCompleteProvider(prov)
 					},ssiLanding: function(email){
 					return ssiLanding(email)
 					},initMerge: function(emailObj){
 					return	initMerge(emailObj)
 				}
 				,payMerge: function(emailObj){
 					return	payMerge(emailObj)
 				}
 				,mergeNow: function(emailObj){
 					return	mergeNow(emailObj)
 				}
 				,mergeFull: function(emailObj){
 					return	mergeFull(emailObj)
 				}
				, providerLogin: function (provider, method) {
					return loginWith(provider, method)
				}
				, adminProviderLogin: function (provider, method) {
					return adminLoginWith(provider, method)
				}
				, getUser: function () {
					return getUser();
				}
				, walletLink: function(email){
					return walletLink(email);
				}
				, anonUser: function (uid) {
					return anonUser(uid);
				}
				, welcomeEmail: function (uid) {
					return welcomeEmail(uid)
				}
				, attachCode: function (uid, nuid) {
					return attachCode(uid, nuid)
				}
				, setVoucher: function (uid, voucher) {
					return setVoucher(uid, voucher)
				}
				, updateEmail: function (email) {
					return updateEmail(email)
				}
				, getUID: function () {
					return getUid();
				}
				, checkV: function (uid) {
					console.log(uid)
					return voucherCheck(uid)
				}
				, save: function (user) {
					return saveUser(user)
				}
				, setUserVoucher: function (uid, vouch) {
					return setUserVoucher(uid, vouch);
				}
				, getUserVoucher: function () {
					return userVoucher;
				}, // validateUser: function(){
				//   if (user.sin === true) {
				//     return true
				//   } else {
				//     var parentEl = angular.element(document.body);
				//   $mdDialog.show({
				//    parent: parentEl,
				//    templateUrl: "templates/sinModal.html",
				//        locals: {
				//      user: user
				//    },
				//    controller: "SinEntryCtrl"
				//  })
				//   }
				// },
				check: function (user) {
					return checkUser(user);
				}
			};
}]).factory('Cart', ['$http', '$interval', '$firebaseObject', 'Auth', '$firebaseArray', 'User', '$mdSidenav', '$rootScope', '$geolocation', '$mdToast', '$q'


		, function ($http, $interval, $firebaseObject, Auth, $firebaseArray, User, $mdSidenav, $rootScope, $geolocation, $mdToast, $q) {
			var ref = firebase.database().ref();
			var user_cart;
			var cart;
			var auth = Auth.authObj();
			// var auth = Auth.auth.$getAuth();
			var uid = $rootScope.uid;
			if (uid) {
				var itemRef = ref.child("carts/" + uid + "/items")
				itemRef.on('child_added', function (childSnapshot, prevChildKey) {
					updateTotal(uid)
				})
				itemRef.on('value', function (childSnapshot, prevChildKey) {
					updateTotal(uid)
				})
			}

			function updateTotal(uid) {
				//   var auth = Auth.auth.$getAuth();
				//   if (auth) {
				//     var uid = auth.uid;
				// }
				var uid = uid;
				var newtotal = 0.00;
				var itemObj = $firebaseArray(ref.child("carts/" + uid + "/items"))
				itemObj.$loaded(function (data) {
					if (itemObj.length) {
						angular.forEach(itemObj, function (item) {
							if (item.ticket > 1) {
								ref.child("carts/" + uid + "/tables").set(true)
							}
							newtotal += item.total;
						})
						console.log(newtotal)
					}
					else {
						newtotal = 0.00
					}
					var totalObj = $firebaseObject(ref.child("carts/" + uid + "/total"))
					totalObj.$loaded(function (data) {
						totalObj.$value = newtotal;
						console.log(newtotal)
						totalObj.$save().then(function (resp) {
							console.log(resp)
						})
					}, function (err) {
						console.log(err)
					})
				})
			}

			function removeItem(key) {
				var uid = Auth.uid();

				var ref = firebase.database().ref("carts/" + uid + "/items/" + key);
				var itemObj = $firebaseObject(ref);
				itemObj.$remove()

				updateTotal(uid)
			}

			function getItems() {
				var  deferred = $q.defer();
				var uid = auth.uid;
				var ref = firebase.database().ref();
				var itemArray = $firebaseArray(ref.child("carts/" + uid + "/items/"))
				itemArray.$loaded(function (data) {
					deferred.resolve(data);
				})
				return deferred.promise
			}

			function addTable(tid) {

			}

			function addNewItem(item) {
				var uid = $rootScope.uid;

				if (uid) {
					console.log(item)
					var loc = {};
					var vlocRef = firebase.database().ref("vendor_locations")
					var ulocRef = firebase.database().ref("geofire")
					var veoFire = new GeoFire(vlocRef)
					var geoFire = new GeoFire(ulocRef)
					var user_coords;
					geoFire.get(uid).then(function (loc) {
							if (!loc) {
								user_coords = [41.387162, 2.169966]
							}
							else {
								user_coords = loc;
							}
						})
						//  var auth = Auth.auth.$getAuth();
						// var uid = auth.uid;
					var ref = firebase.database().ref("carts/" + uid + "/items");
					var url = "carts/" + uid + "/items/" + item.pid
					console.log(url)
					var saveItem = $firebaseObject(ref.child(item.pid))
					saveItem.$loaded(function (data) {
						// $mdSidenav('right').open();
						if (data.quantity ) {
							if (item.duration && !item.quantity) {
								item.quantity = item.duration;
							}
							saveItem.quantity += item.quantity;

							saveItem.total = saveItem.price * saveItem.quantity
							saveItem.$save().then(function (data) {
								updateTotal(uid);
							}, function (error) {
								console.log("Error:", error);
							})
						}
						 
						 else {
						 	if (item.duration && !item.quantity) {
								item.quantity = item.duration;
							}
							angular.forEach(item, function (value, key) {

								if (value) {
									saveItem[key] = value;
								}

							})
							if (!user_coords) {
								user_coords = [41.387162, 2.169966]
							}

								if (item.date && item.time) {
									var date = moment(item.date).clone().format("YYYY-MM-DD");
								if (item.time.length > 6 ) {
										
									saveItem.time = moment(item.date).clone().format("lll");
								} else{
								var tArr = item.time.split("-");
									
								saveItem.time = moment(item.date).clone().hours(parseInt(tArr[0])).minutes(parseInt(tArr[1])).format("lll");
								}
							}
								
							saveItem.user_coords = user_coords;
							saveItem.total = item.price * item.quantity || item.duration;
							saveItem.$save().then(function (data) {
								console.log(data)
								updateTotal(uid)
							}, function (error) {
								console.log("Error:", error);
							})
						}
						$mdSidenav('right').open()
					})
				}
			}
			return {
				addItem: function (item) {
					// addNewItem(item, q)
					return addNewItem(item)
				}
				, newTicket: function (product, user) {
					return newTicket(product, user)
				}
				, removeItem: function (id) {
					return removeItem(id);
				}
				, empty: function () {
					var uid = $rootScope.uid;
					ref.child("carts/" + uid).child("total").set(0.00);
					ref.child("carts/" + uid).child("items").set(null);

				}
				, getItems: function () {
					return getItems()
				}
				, getCart: function () {
					return cart
				}
				, updateTotal: function () {
					return updateTotal();
				}
			}
}]).factory('Coop', ['User', '$firebaseArray', '$firebaseObject', '$state', '$http', '$q'


		, function (User, $firebaseArray, $firebaseObject, $state, $http, $q) {
			function getFriends(friends) {
				var friendArray = [];
				for (var i = friends.length - 1; i >= 0; i--) {
					friendArray.push(User.getUser(friends[i].key))
				}
				console.log(friendArray, friends)
				return friendArray
			}

			function getProduct(uid) {
				var newId = uid.slice(0, -1);
				var ref = firebase.database().ref("products");
				var p_obj = $firebaseObject(ref.child(newId))
				p_obj.$loaded(function (data) {
					console.log(data, uid)
					return data
				})
			}

			function getCoops() {
				var url = "live/events"
				var ref = firebase.database().ref(url);
				var coopArr = $firebaseArray(ref)
				coopArr.$loaded(function (data) {
					console.log(data)
					return data
				}, function (err) {
					console.log(err)
				})
			}

			function getUserCoops(uid) {
				var deferred = $q.defer()
				var userCoops = [];
				var ref = firebase.database().ref("profiles");
				var user = $firebaseObject(ref.child(uid))
				user.$loaded().then(function (data) {
					angular.forEach(user.coops, function (value, key) {
						console.log(key)
						userCoops.push(getCoop(key))
					})
					deffered.resolve(userCoops);
				})
				return deferred.promise
			}

			function addToCoop(uid, cid) {
				url = "live/events/" + cid + "/members"
				var ref = firebase.database().ref(url);
				var coop = $firebaseObject(ref.child(uid))
				coop.$loaded(function (data) {
					coop.$value = true;
					coop.$save()
				}, function (err) {
					console.log(err)
				})
			}

			function inviteToCoop(email, cid) {
				var uid = User.getUID();
				var req = {
					"method": "POST", 
					 "url" : "https://www.pbpapi.com/coop/invite",
					//"url": "https://312c30f7.ngrok.io/coop/invite"
					 "data": {
						"email": email
						, "cid": cid
						, "uid": uid
					}
				}
				$http(req).then(function (response) {
					console.log(response)
				})
			}

			function getCoop(cid) {
				var deferred = $q.defer()
				var ref = firebase.database().ref("live/events");
				var coop = $firebaseObject(ref.child(cid))
				coop.$loaded().then(function (data) {
					deferred.resolve(data);
				})
				return deferred.promise;
			}

			function preAuth(c_id, uid) {
				// var req = {
				//       "method" : "POST",
				//        // "url" : "https://www.pbpapi.com/coop/invite",
				//         "url" : "https://312c30f7.ngrok.io/coop/pay",
				//       "data": {
				//         "cid": cid,
				//         "uid": uid
				//       }
				//     }
				// $http(req).then(function(response){
				//   console.log(response)
				// })
			}

			function initiateGroupPay(c_id) {
				var evRef = firebase.database().ref("live/events/" + c_id)
				var newRef = firebase.database().ref("grouppay/" + c_id)
				var evObj = $firebaseObject(evRef)
				var expiry = moment().add(1, 'days').format()
				evObj.$loaded(function (data) {
					var split = data.total / data.split
					var taxsplit = split * 1.21
					var taxtotal = data.total * 1.21
					var members = data.members
					var vendor = angular.forEach(members, function (value, key) {
						newRef.child("payees").child(key).set({
							subtotal: split
							, total: taxsplit
							, preauthed: false
							, collected: false
						})
					})
					newRef.child("expiry").set(expiry)
					newRef.child("completed").set(false)
					newRef.child("product").set(evObj.product)
					evRef.child("executeOn").set(true)
				})
			}

			function newCoop(package) {
				var uid = User.getUID();
				var newEvent = {
					data: package
					, primary: uid
					, quantity: package.quantity
					, max: 10
					, total: package.price
					, split: 1
					, product: package.$id
					, name: package.name
					, description: package.description
					, execute_time: package.date
					, executeOn: false
				}
				var ref = firebase.database().ref();
				var p_arr = $firebaseArray(ref.child("live/events"))
				p_arr.$add(newEvent).then(function (data) {
					var memberref = $firebaseObject(ref.child("live/events/" + data.key + "/members").child(uid))
					memberref.$loaded(function (data) {
						memberref.$value = true;
						memberref.$save().then(function (data) {
							console.log(data)
						}, function (err) {
							console.log(err)
						})
					})
					var user_ref = $firebaseObject(ref.child("profiles/" + uid + "/coops").child(data.key))
					user_ref.$value = true;
					user_ref.$save().then(function (data) {
						console.log(data)
						$state.go("app.coop.room", {
							id: data.key
						})
					}, function (err) {
						console.log(err)
					})
				})
			}
			return {
				friends: function (friends) {
					return getFriends(friends)
				}
				, new: function (package) {
					return newCoop(package);
				}
				, getUserCoops: function (uid) {
					var userCoops = [];
					var ref = firebase.database().ref("profiles");
					var user = $firebaseObject(ref.child(uid))
					user.$loaded().then(function (data) {
						angular.forEach(user.coops, function (value, key) {
							console.log(key)
							userCoops.push(getCoop(key))
						})
						return userCoops
					})
				}
				, invite: function (email, cid) {
					return inviteToCoop(email, cid);
				}
				, getCoops: function () {
					return getCoops()
				}
				, initiatePay: function (cid) {
					return initiateGroupPay(cid)
				}
				, getProduct: function (uid) {
					var newId = uid.slice(0, -1);
					var ref = firebase.database().ref("products");
					var p_obj = $firebaseObject(ref.child(newId))
					p_obj.$loaded(function (data) {
						console.log(data, uid, newId)
						return data
					})
				}
			};
}]).factory("Auth", ["$firebaseAuth", "$rootScope"


		, function ($firebaseAuth, $rootScope) {
			var ref = firebase.database().ref();
			var uid = $rootScope.uid;
			var auth = {};
				if (!uid) {
				auth = $firebaseAuth().$getAuth();
				if (auth) {
					if (auth.email) {
						ref.child("profiles").child(auth.uid).child("email").set(auth.email)
					}
					uid = auth.uid;
					$rootScope.uid = uid;
				}
				}
			return {
				auth: $firebaseAuth(),
				authObj: function(){
					return auth;
				},
				uid: function(){
					console.log(auth)
					if (!uid) {
						auth = $firebaseAuth().$getAuth();
						if (auth) {
						console.log(auth)
						return auth.uid;
					}
					} else {
						console.log(auth)
						return uid;
					}

				}
			}
  }
]).factory('DateParser', function () {
		return {
			decode: function (strArray) {
				var dates = [];
				var ordDate = moment().day();

				if (strArray !== 0) {
					var dateOpt = strArray[0].$value.split("D")
					if (dateOpt[0] === "*") {
						for (var d = 0; d <= 7; d++) {
							for (var i = 0; i <= strArray.length - 1; i++) {
								var daily = ordDate + d
								var allDateOpt = strArray[i].$value.split("D")
								var allTimeObj = allDateOpt[1].split("H")
								var newDate = moment().day(daily).hour(parseInt(allTimeObj[0])).minute(parseInt(allTimeObj[1])).format("YYYY, MMM, D, h:mm A")
								dates.push(newDate)
							}
						}

						return dates
					}
					else {
						var dOpt = parseInt(dateOpt[0])
						for (var i = 0; i <= strArray.length - 1; i++) {
							var dateSplit = strArray[i].$value.split("D")
							var dOpt = parseInt(dateSplit[0])
							if (ordDate <= dOpt) {
								var timeObj = dateSplit[1].split("H")
								var newDate = moment().day(dOpt).hours(parseInt(timeObj[0])).minutes(parseInt(timeObj[1])).format("YYYY, MMM, D, h:mm A")
								dates.push(newDate)
									// console.log(newDate)
							}
							else {
								var timeObj = dateSplit[1].split("H")
								var newDate = moment().day(dOpt + 7).hours(parseInt(timeObj[0])).minutes(parseInt(timeObj[1])).format("YYYY, MMM, D, h:mm A")
								dates.push(newDate)
									// console.log(newDate)
							}
						}
						console.log(dates)
						return dates
					}
				}
				else if (strArray == 0) {
					return [moment().format("MMM, D")]
				}
			}
		};
	}).factory('Live', ['$firebaseArray', '$firebaseObject', 'Auth'


		, function ($firebaseArray, $firebaseObject, Auth) {
			var ref = firebase.database().ref("live");

			function addNewLive() {}

			function getLive() {
				var arr = $firebaseArray(ref);
				arr.$loaded(function (data) {
					// console.log(data)
					return data;
				})
			}
			return {
				getAll: function () {
					return getLive()
				}
				, add: function () {
					return addNewLive()
				}
			}
}]).factory('Clubs', ['$firebaseArray', '$firebaseObject', 'Auth', '$q'


		, function ($firebaseArray, $firebaseObject, Auth, $q) {
			function clubEvents(clubId) {
				var deferred = $q.defer();
				var events = [];
				var clubRef = firebase.database().ref("events");
				var clubArr = $firebaseArray(clubRef.child("defaults"))
				var eventArr = $firebaseArray(clubRef.child("guests").orderByChild("date"))
				var dateIndex = moment().day();
				guestArr.$loaded(function (guests) {
					var guests = guests;
					clubArr.$loaded(function (data) {
						var events = data;
						angular.forEach(guests, function (item) {
							angular.forEach(events, function (ev) {
								if (ev.date) {}
							})
						})
					})
				})
			}

			function guestEvents() {
				var ref = firebase.database().ref()
				var clubRef = ref.child("ticketing")
				angular.forEach(calendar, function (item) {
					console.log(item)
					var itemRef = $firebaseObject(clubRef.child(item))
					itemRef.$loaded(function (data) {
						console.log(item)
						if (!data.$value) {
							var index = moment(item).day();
							console.log(item, moment(item), index)
							var defRef = $firebaseObject(ref.child("events/guests"));
							defRef.$loaded(function (snapshot) {
								if (snapshot) {
									console.log(itemRef)
									angular.forEach(snapshot, function (value, key) {
										itemRef[key] = value
									})
									itemRef.$save()
								}
							})
						}
					})
				})
			}

			function tableEvent(event) {
				var club = club;
				var event = event;
				var ref = firebase.database().ref("clubs")
				var evRef = ref.child("events/schedule/" + event)
				var tRef = ref.child("ticketing/" + event)
				var clubdefaults;
				var defaultsRef = $firebaseObject(ref.child("defaults")).$loaded(function (defaultData) {
					clubdefaults = defaultData;
					console.log(clubdefaults)
					var evObj = $firebaseObject(evRef).$loaded(function (evData) {
						console.log(evData)
						var ticketing = {
							"event": event
							, "available": clubdefaults.capacity
							, "list": []
							, "price": evData.price
							, "tables": {}
						}
						$firebaseObject(ref.child("tables")).$loaded(function (data) {
							console.log(data)
							angular.forEach(data, function (value, key) {
								ticketing.tables[key] = value;
								ticketing.tables[key].available = true;
							})
							ref.child("ticketing/" + event).set(ticketing).then(function (data) {
								console.log(data)
							})
						})
					})
				})
			}

			function calendar() {
				var calendar = [];
				for (var i = 0; i < 20; i++) {
					var date = moment().add(i, 'days').format("YYYY-MM-DD");
					calendar.push(date)
				}
				var ref = firebase.database().ref()
				var clubRef = ref.child("events/schedule")
				angular.forEach(calendar, function (item) {
					var itemRef = $firebaseObject(clubRef.child(item))
					itemRef.$loaded(function (data) {
						if (!data.$value) {
							var index = moment(item).day();
							var defRef = $firebaseObject(ref.child("events/defaults/" + index));
							defRef.$loaded(function (snapshot) {
								if (snapshot) {
									angular.forEach(snapshot, function (value, key) {
										itemRef[key] = value
									})
									itemRef.$save()
									tableEvent(item)
								}
							})
						}
					})
				})
			}

			function newEvent(event) {
				var ref = firebase.database().ref("clubs");
				var clubdefaults;
				var event = event;
				var defaultsRef = ref.child("defaults").once('value', function (data) {
					clubdefaults = data;
					var evKey;
					if (event.default) {
						$firebaseArray(ref.child("events/defaults")).$add(event).then(function (data) {
							evKey = data.key;
						})
					}
					else {
						$firebaseArray(ref.child("events/guests")).$add(event).then(function (data) {
							console.log(data)
							evKey = data.key;
						})
					}
					if (evKey) {
						var ticketing = {
							"event": evKey
							, "available": clubdefaults.capacity
							, "list": []
							, "price": event.price
							, "tables": {}
						}
						$firebaseArray(ref.child("tables")).$loaded(function (data) {
							angular.forEach(data, function (item) {
								ticketing.tables[item.$id] = item;
								ticketing.tables[item.$id].available = true;
							})
						})
						$firebaseObject(ref.child("ticketing/" + evKey)).$save(ticketing).then(function (data) {
							console.log(data)
						})
					}
				})
			}
			return {
				events: function (clubId) {
					return clubEvents(clubId)
				}
				, newEvent: function (club, event) {
					return newEvent(club, event);
				}
				, calendar: function () {
					return calendar();
				}
			}
}]).factory('Stock', ['$firebaseArray', '$firebaseObject', '$q', '$filter'


		, function ($firebaseArray, $firebaseObject, $q, $filter) {
			var ref = firebase.database().ref();
			//   var geoRef = firebase.database().ref("geofire/products")
			// var geoFire = new GeoFire(geoRef);
			// var stockFire = new GeoFire(ref.child("geofire/stock"));
			// var nearest = {
			//    distance: 100
			//  };
			//  var stockList = [];
			//  var sortedList = [];
			//    var stockQuery = stockFire.query({
			//      center: [41.387162, 2.169966],
			//      radius: 50
			//    });
			//    var onReadyRegistration = stockQuery.on("ready", function() {
			//      sortedList = $filter('orderBy')(stockList)
			//    });
			//    var onKeyEnteredRegistration = stockQuery.on("key_entered", function(key, location, distance) {
			//      var item = {key: key, location: location, distance: distance}
			//    stockList.push(item)
			//    });
			// function checkStock (datetime, pid, blockLength){
			// }


			return {
				checkRooms: function(booking){
					var deferred = $q.defer();
				var results = [];

				var bstr = "bookings/" + moment(booking.start_date).format("YYYY-MM-DD");






				var booking = booking;
				var days = [];
				var currDate = moment(booking.start_date).clone().startOf('day');
				var lastDate = moment(booking.end_date).clone().startOf('day');
				while (currDate.add('days', 1).diff(lastDate) < 0) {
					console.log(currDate.toDate());
					days.push(currDate.clone().toDate());
				}
				console.log(days)
				$firebaseObject(ref.child("beds").orderByChild(bstr).equalTo(null)).$loaded(function (data) {
					console.log(data);
					angular.forEach(data, function (value, key) {
						var booked = false;
						var roomKey = key
						value.id = key;
						angular.forEach(days, function (day) {
							console.log(day, value)
							var dateKey = moment(day).clone().format("YYYY-MM-DD")
							if (value.bookings && value.bookings[dateKey] ) {
								booked = true;
							}
							// ref.child("bookings/" + $stateParams.partner + "/" + dateKey + "/" + key).once('value', function(snapshot){
							//  booked = true;
							// }) && value[dateKey]["uid"]
						})
						if (!booked) {
							var obj = value;
							obj.id = key;
							results.push(obj);
						}
					})
					deferred.resolve(results);

			}, function(err){
						deferred.reject(err);
					})
				return deferred.promise
				},
				checkStatic: function(build){
					console.log(build)
							var deferred = $q.defer();
								var bstr;
							 
							if (build.time == "00-00" ) {
								bstr =  moment(build.date).clone().format("YYYY-MM-DD");
							} else {
								bstr =  moment(build.date).clone().format("YYYY-MM-DD") + "/" + build.time 
							}
							

					
						
						if (!build.duration) {
						$firebaseObject(ref.child("static_stock").child(build.parent).child(bstr)).$loaded(function (data) {
								console.log(data)
								
										if (data.available && data.available >= build.quantity) {
											deferred.resolve(true);
										} else if (!data.available && data.capacity && data.capacity >= build.quantity){
												deferred.resolve(true);
										}	else {
											deferred.resolve(false);
										}

							})
					} else {
						var durObj = true;
						for (var i = build.duration - 1; i >= 0; i--) {

							var cstr =  moment(build.date).clone().add(i, 'hours').format("YYYY-MM-DD") + "/" + build.time;
							
							$firebaseObject(ref.child("static_stock").child(build.parent).child(cstr)).$loaded(function (data) {
						
										if (data.available && data.available > build.quantity) {
											durObj =true
										} else if (!data.available && data.capacity && data.capacity >= build.quantity){
												durObj = true
										}	else {
											durObj = false
										}

							})
						}
						
						if (durObj){
							deferred.resolve(true)
						} else {
							deferred.resolve(false)
						}

					}
							
					return deferred.promise
				},
	checkStock: function (build) {

		var deferred = $q.defer();
		var results = {};
		var repeats = build.duration * 2 - 1;
		var bstr = "bookings/" + moment(build.time).clone().subtract(1, 'hours').format("YYYY-MM-DD/HH-mm");
		var estr;
		var filter = {};

		var startTime = moment(build.time)
		var i = 0;
		for (var i = 0; i < repeats; i++) {
			var time = moment(build.time).add(30 * i, 'm');
			var checkstr = "bookings/" + moment(time).clone().subtract(1, 'hours').format("YYYY-MM-DD-HH-mm")
			filter[checkstr] = true;
			if (i == repeats - 1) {
				estr = checkstr;
			}
		}
		$firebaseArray(ref.child("stock").child(build.parent).orderByChild(bstr).equalTo(null)).$loaded(function (data) {
			var filterResults = {};
			var stockArr = data;
			var count = build.quantity-1;
			for (var t = 0; t < stockArr.length; t++) {
				if (count >= 0) {
					var clear = true;
					angular.forEach(filter, function (v, k) {
						if (stockArr[t][k]) {
							clear = false;
						}
					})

					if (clear && !results[count]) {

						results[count] = stockArr[t].$id;
						stockArr[t][bstr] = "pending";
						stockArr[t][estr] = "pending";
						count--
						console.log(stockArr[t])

					}
					else if (!clear && t == stockArr.length - 1) {
						results[count] == "No Stock Available!";
						count--
						deffered.reject("No Stock Available!");
					}
				}
				else {
					ref.child("stock").child(bstr).set("pending")
					ref.child("stock").child(estr).set("pending")
					deferred.resolve(results)
				}
			}
		})
		return deferred.promise
	}
}
}]).factory('Tracking', ['$firebaseArray', function ($firebaseArray) {
		function newSignin(voucher) {
			var vouch = voucher;
			var promoRef = firebase.database().ref("promoters");
			$firebaseArray(promoRef).$loaded(function (data) {
				angular.forEach(data, function (value) {
					if (value.code == vouch) {
						ref.child(value.$id).transaction(function (count) {
							if (count) {
								count.userCount += 1
							}
							else {
								count.userCount = 0
							}
						})
					}
				})
			})
		}
		return {
			newSignin: function (code) {
				newSignin(code);
			}
		};
}]).factory('MapTools', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$state', '$rootScope'


		, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, $state, $rootScope) {
			function initialize(lat, lng) {
				directionsDisplay = new google.maps.DirectionsRenderer();
				//var location = new google.maps.LatLng(43.6525, -79.3816667);
				var location = new google.maps.LatLng(lat, lng);
				var myOptions = {
					zoom: 7
					, mapTypeId: google.maps.MapTypeId.ROADMAP
					, center: location
				}
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				directionsDisplay.setMap(map);
			}

			function calcRoute(from, to) {
				var start = from;
				var end = to;
				var request = {
					origin: start
					, destination: end
					, travelMode: google.maps.DirectionsTravelMode.DRIVING
					, unitSystem: google.maps.DirectionsUnitSystem.METRIC
				};
				directionsService.route(request, function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(response);
						distance = response.routes[0].legs[0].distance.value;
						time_taken = response.routes[0].legs[0].duration.value;
						auto_fare = distance.value * 4
						vayaObj.fare = auto_fare;
						vayaObj.distance = distance;
						vayaObj.duration = duration;
					}
					else {}
				});
			}

			return {
				route: function (from, to) {
					return calcRoute(from, to)
				}
			}
 }])
	//.factory("GeoTools", ["$geolocation", "$firebaseArray", "$firebaseObject", "$rootScope", "$q",
	//function($geolocation, $firebaseArray, $firebaseObject, $rootScope, $q){
	//	function geolocate(uid){
	//	$geolocation.getCurrentPosition({
	//                  timeout: 60000
	//               }).then(function(position) {
	//                   geoFire.set(uid, [position.coords.latitude, position.coords.longitude]).then(function() {
	//                    console.log("Provided key has been added to GeoFire");
	//                    ref.child("profiles/" + uid + "/location").set([position.coords.latitude, position.coords.longitude])
	//                  })
	//
	//               });
	//	}
	//
	//
	.factory('LangTools', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$state', '$rootScope', '$q'


		, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, $state, $rootScope, $q) {
			var ref = firebase.database().ref();

			function tolqString() {
				return "https://68c26ab0ffd3f2a2:812b1218903c071c@api.tolq.com/v1/translations/requests/quote"
			}
			function updateLang(lang){
				var deferred = $q.defer();
				$firebaseObject(ref.child("translations").child("en")).$loaded(function (dataEN) {

						$firebaseObject(ref.child("translations").child("es")).$loaded(function (dataES) {
							var langObj = {};
							angular.forEach(dataEN, function (value, key) {
								if (!dataES[key]) {
									langObj[key] = {
										text: value
									};
								}


							})
							ref.child("dump").child(lang).set(langObj)
							var req = {
								"method": "POST",
								
								"url": "https://pbpapi.com/admins/translate" + lang
								
							}
							$http(req).then(function (response) {
								console.log(response)
							}, function (err) {
								console.log(err)
							})
					})
				})

			}
			function quoteNewLang(lang) {
				$firebaseObject(ref.child("translations").child("en").limitToFirst(600)).$loaded(function (data) {
					var english = {};
					angular.forEach(data, function (value, key) {

						english[key] = {
							text: value
						};

					})
					//ref.child("dump").child("en").set(english)
					var req = {
						"method": "POST",
						"headers": {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*"
						},
						"url": "https://99076d71ead6bb11:6f927b381ff50bdb@api.tolq.com/v1/translations/requests/quote"
						, "data": {
							"request": english
							, "source_language_code": "en"
							, "target_language_code": "tq"
							, "quality": "premium"
							, "style_guide_reference_id": 1
							,"options": {
								"context_url": "tktr.es",
								"name": "Initial translation",
								"description": "One language quote of entire site",
								"auto_client_review": false
							}
						}
					}
					$http(req).then(function (response) {
						console.log(response)
					}, function (err) {
						console.log(err)
					})
				})
			}
			return {
				quoteNewLang: function (lang) {
					return quoteNewLang(lang)
				},
				updateLang: function (lang) {
					return updateLang(lang)
				}
			}
}])
	.factory('Vaya', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$state', '$rootScope'


		, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, $state, $rootScope) {
			function search(sObj){


			}
			return{
				search: function(obj){
					return search(obj)
				}
			}

}]).factory('AdminTools', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$state', '$rootScope', '$stateParams'


		, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, $state, $rootScope, $stateParams) {
			var ref = firebase.database().ref();

			function saveTimes(objId) {
				$firebaseObject("times" + objId).$save(timeObj)
			}

			function newDriver(obj) {
				$firebaseAuth().$createUserWithEmailAndPassword(obj.newAdmin.email, obj.newAdmin.password).then(function (firebaseUser) {
					obj.newDriver.driver = true;

					obj.newDriver.voucher = obj.newDriver.staff;
					ref.child("drivers").child(firebaseUser.uid).set(obj.newDriver)
					ref.child("profiles").child(firebaseUser.uid).set(obj.newDriver)
					console.log("User " + firebaseUser.uid + " created successfully!");
					$state.go("app.admin_fleet_pickup")
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}
			function newDriverProvider(prov) {


				$firebaseAuth().$signInWithPopup(prov).then(function (firebaseUser) {
					console.log(firebaseUser)
					var obj2 = {driver: true, staff: $stateParams.vendor, voucher: $stateParams.vendor};
					$rootScope.uid = firebaseUser.user.uid;

					if (firebaseUser.user.name) {
						obj2.name = firebaseUser.user.displayName;

					}
					if (firebaseUser.user.email) {
						obj2.email = firebaseUser.user.email;

					}
					if (firebaseUser.user.emailVerified) {
						obj2.emailVerified = firebaseUser.user.emailVerified;

					}
					if (firebaseUser.user.photoURL) {
						obj2.photo = firebaseUser.user.photoURL;

					}
					console.log(obj2)
					ref.child("drivers").child(firebaseUser.user.uid).set(obj2)
					ref.child("profiles").child(firebaseUser.user.uid).set(obj2)
					console.log("User " + firebaseUser.user.uid + " created successfully!");
					$state.go("app.admin_fleet_pickup")
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}

			function vendorApply(appl) {
				var arr = $firebaseArray(ref.child("vendor_applications"));
				arr.$add(appl).then(function () {
					alert("Application Recieved!")
				})
			}

			function newVehicle(vehicle) {
				var vehicleFire = new GeoFire(ref.child("geofire/vehicles"));
				$firebaseArray(ref.child("stock")).$add(vehicle).then(function (data) {
					console.log(data)
					vehicleFire.set(data.$id, [41.380057, 2.171269])
				})
			};
			function updateRec(place, id){
			var recRef = new GeoFire(ref.child("geofire/recs"))
				console.log(place)
				var types = {};
				angular.forEach(place.types, function (item) {
					types[item] = true;
				})
				var newRec = {


					 name: place.name

					, website : place.website
					, rating: place.rating
					, filters: types
					, placeid: place.place_id
					, location: {
						lat: place.geometry.location.lat()
						, lng: place.geometry.location.lng(),
						mailmap: place.url
					}
				}

				var recObj = $firebaseObject(ref.child("info").child(id))
				recObj.$loaded(function(item){
					angular.forEach(newRec, function(v, k){
					if(v){
						recObj[k] = v;
					}
				})
				recObj.$save().then(function (data) {
					alert("Rec Added!")
					recRef.set(data.key, [place.geometry.location.lat(), place.geometry.location.lng()])
					console.log(data)

				}, function(err){
					console.log(err)
				})
				})

			}
			function googleRec(place, cat) {
				var recRef = new GeoFire(ref.child("geofire/recs"))
				console.log(place, cat)
				var types = {};
				angular.forEach(place.types, function (item) {
					types[item] = true;
				})
				var newRec = {
					tag: "recs"
					, cat: cat
					, name: place.name


					, filters: types
					, placeid: place.place_id
					, location: {
						lat: place.geometry.location.lat()
						, lng: place.geometry.location.lng()
					}
				}
				if(place.website){
						newRec.website = place.website
					}
				if(place.rating){
						newRec.rating = place.rating
					}

				if(place.opening_hours && place.opening_hours.weekday_text && place.opening_hours.weekday_text){
						newRec.opening_text = place.opening_hours.weekday_text
					}
				console.log(newRec)
				$firebaseArray(ref.child("info")).$add(newRec).then(function (data) {
					alert("Rec Added!")
					recRef.set(data.key, [place.geometry.location.lat(), place.geometry.location.lng()])
					console.log(data)
					ref.child("media").child(data.key).set({
						name: place.name
					})
				})
			}

			function pickupVehicle(id) {
				console.log($rootScope.uid, id)
				ref.child("vehicles").child(id).child("driver").set($rootScope.uid)
				ref.child("drivers").child($rootScope.uid).child("vehicle").set(id)
			}

			function newLodge(newLodgeObj) {
				console.log(newLodgeObj)
				var lodgeFire = new GeoFire(ref.child("geofire/lodges"))
				var pid = newLodgeObj.newLodge.subdomain;
				var infoObj = {
					pid: newLodgeObj.newLodge.subdomain
					, vendor: newLodgeObj.newLodge.vendor
					, lodge: true
				}
				var partner = {
					name: newLodgeObj.newLodge.name
					, welcome: newLodgeObj.newLodge.welcome
					, lodge: true
				, }
				var admin = {
					email: newLodgeObj.newAdmin.email
					, password: newLodgeObj.newAdmin.password
				, }
				var media = {
					pid: pid
					, name: newLodgeObj.newLodge.name
				}
				var vendor = {
					name: newLodgeObj.newLodge.name
					, sales_email: newLodgeObj.newLodge.sales_email
					, full_address: newLodgeObj.newLodge.full_address
				}
				ref.child("partners").child(pid).set(partner)
				ref.child("info").child(pid).set(infoObj);
				ref.child("vendors").child(pid).set(vendor);
				lodgeFire.set(pid, [newLodgeObj.newLodge.latitude, newLodgeObj.newLodge.longitude]).then(function () {
					console.log("success");
				});
				$firebaseArray(ref.child("translations").child(newLodgeObj.newLodge.lang)).$add(newLodgeObj.newLodge.name).then(function (detes) {
					ref.child("info").child(pid).child("name").set(detes.key);
					ref.child("partners").child(pid).child("name").set(detes.key);
				})
				$firebaseArray(ref.child("translations").child(newLodgeObj.newLodge.lang)).$add(newLodgeObj.newLodge.welcome).then(function (detes) {
					ref.child("info").child(pid).child("welcome").set(detes.key);
					ref.child("partners").child(pid).child("welcome").set(detes.key);
				})
				$firebaseObject(ref.child("media").child(pid)).$save(media).then(function (data) {
					console.log(data)
				})
				$firebaseAuth().$createUserWithEmailAndPassword(admin.email, admin.password).then(function (firebaseUser) {
					console.log("User " + firebaseUser.uid + " created successfully!");
					$state.go("app.admin_mng_rooms", {
						vendor: pid
					})
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}
			 function newSmallVendor (newSV) {
				 var vendorFire = new GeoFire(ref.child("geofire/vendors"))
				 var types = {};
				angular.forEach(newSV.newSmallVendor.placeObj.types, function (item) {
					types[item] = true;
				})
				var infoObj = {


					name: newSV.newSmallVendor.placeObj.name


					, filters: types,
					vendor: true
					, placeid: newSV.newSmallVendor.placeObj.place_id
					, location: {
						lat: newSV.newSmallVendor.placeObj.geometry.location.lat()
						, lng: newSV.newSmallVendor.placeObj.geometry.location.lng()
					}
				}
				if(newSV.newSmallVendor.placeObj.website){
						infoObj.website = newSV.newSmallVendor.placeObj.website
					}
				if(newSV.newSmallVendor.placeObj.rating){
						infoObj.rating = newSV.newSmallVendor.placeObj.rating
					}
				 if(newSV.newSmallVendor.placeObj.international_phone_number){
						infoObj.phone = newSV.newSmallVendor.placeObj.international_phone_number
					}

				if(newSV.newSmallVendor.placeObj.opening_hours && newSV.newSmallVendor.placeObj.opening_hours.weekday_text ){
						infoObj.opening_text = newSV.newSmallVendor.placeObj.opening_hours.weekday_text
					}
					console.log(newSV)
					var pid = newSV.newSmallVendor.subdomain;
					infoObj.pid = newSV.newSmallVendor.subdomain;


					var partner = {
						name: newSV.newSmallVendor.placeObj.name
						, welcome: newSV.newSmallVendor.welcome
					}
					var admin = {
						email: newSV.newAdmin.email
						, password: newSV.newAdmin.password
					 }
					var media = {
						pid: pid
						, name: newSV.newSmallVendor.placeObj.name
						, partner_logo: "hold"
					}

						var vendor = {
							name: newSV.newSmallVendor.name
							, sales_email: newSV.newSmallVendor.sales_email
							, paypal: newSV.newSmallVendor.paypal
						}
					var vendor_loc = {
						mailmap : newSV.newSmallVendor.placeObj.url,
						location: {
						lat : infoObj.location.lat,
						lng: infoObj.location.lng
						},
						full_address: newSV.newSmallVendor.placeObj.formatted_address,
						place_id : infoObj.placeid
					}


					ref.child("partners").child(pid).set(partner);
					ref.child("info").child(pid).set(infoObj);
				 	ref.child("vendors").child(pid).set(vendor);
				 ref.child("vendor_locations").child(pid).set(vendor_loc)
				 vendorFire.set(pid, [infoObj.location.lat, infoObj.location.lng])

					$firebaseArray(ref.child("translations").child(newSV.newSmallVendor.lang)).$add(newSV.newSmallVendor.welcome).then(function (detes) {
						ref.child("info").child(pid).child("welcome").set(detes.key);
						ref.child("partners").child(pid).child("welcome").set(detes.key);
					})
					ref.child("media").child(pid).set(media)
					$firebaseAuth().$createUserWithEmailAndPassword(admin.email, admin.password).then(function (firebaseUser) {
						console.log("User " + firebaseUser.uid + " created successfully!");
						ref.child("profiles").child("staff").set(pid);
						$state.go("app.admin_mng_products", {
							vendor: pid
						})
					}).catch(function (error) {
						console.error("Error: ", error);
					});
			 }
			 function newMenuItem(itemObj){
			 	var obj = {};
					obj.vendor = itemObj.vendor;
					obj.tag = itemObj.tag;
					if (itemObj.ticket) {
						obj.ticket = itemObj.ticket;
					}
					if (itemObj.price) {
						obj.price = itemObj.price;
					}
					if (itemObj.capacity) {
						obj.capacity = itemObj.capacity;
					}
					
					$firebaseArray(ref.child("menu_items")).$add(obj).then(function (data) {
						console.log(data)
						obj.pid = data.key
						ref.child("menu_items").child(data.key).child("pid").set(data.key);
						ref.child("media").child(data.key).set({
							name: itemObj.name
							, tag: itemObj.tag
							
						});
						// ref.child("dates").child(data.key).set(["*D10H00", "*D11H00", "*D12H00", "*D13H00", "*D16H00", "*D17H00", "*D18H00", "*D19H00", "*D20H00"])
						
							$firebaseArray(ref.child("translations").child(itemObj.lang)).$add(itemObj.name).then(function (name) {
								ref.child("menu_items").child(data.key).child("name").set(name.key)
							});
						
						$firebaseArray(ref.child("translations").child(itemObj.lang)).$add(itemObj.description).then(function (desc) {
							ref.child("menu_items").child(data.key).child("description").set(desc.key)
						})
				
					})
			 }
			function newPackage(comms, newProduct, newPackages) {
				console.log(newProduct, newPackages)
				var pKey = newProduct.$id;

				var pathObj = ref.child("packages").child(pKey);
				angular.forEach(newPackages, function (pack) {

					var obj = {};
					angular.forEach(pack, function(v,k){
						obj[k] = v;
					})
					obj.vendor = newProduct.vendor;

					obj.price = pack.price;
					if (obj.ticket) {
						obj.ticket = newProduct.ticket;
					}
					if (obj.full_address) {
						obj.full_address = newProduct.full_address;
					}

					obj.tax = comms / 100 * pack.price * 21 / 100
					
					$firebaseArray(pathObj).$add(obj).then(function (packRef) {
						console.log(packRef)
						$firebaseArray(ref.child("translations").child("en")).$add(pack.details).then(function (data) {
							pathObj.child(packRef.key).child("details").set(data.key)
						})
						$firebaseArray(ref.child("translations").child("en")).$add(pack.name).then(function (data) {
							pathObj.child(packRef.key).child("name").set(data.key)
						})
						$firebaseArray(ref.child("translations").child("en")).$add(pack.description).then(function (data) {
							pathObj.child(packRef.key).child("description").set(data.key)
						})
						var req = {
					"method": "POST",
					"url": "https://www.pbpapi.com/comms/set"
					// "url": "https://312c30f7.ngrok.io/comms/set"
					, "data": {
						"pid": pKey,
						"pacKey": packRef.key,
						"price": obj.price
						, "comms": comms
					}
				}
				$http(req).then(function (response) {}, function (err) {
					console.log(err)
				})
					}, function(err){
						console.log(err)
					})
				})
				console.log(comms, pKey)
				
			}
			return {
				newMenuItem: function (itemObj){
					return newMenuItem(itemObj)
				},
				newPacks: function (comms, obj, packs) {
					return newPackage(comms, obj, packs);
				}
				, newVehicle: function (obj) {
					return newVehicle(obj)
				}
				, newSmallVendor: function (obj) {
					return newSmallVendor(obj)
				}
				, vendorApply: function (appl) {
					return vendorApply(appl)
				}
				, googleRec: function (place, cat) {
					return googleRec(place, cat);
				}
				, updateRec: function(place, id){
					return updateRec(place, id);
				}
				, pickupVehicle: function (obj) {
					return pickupVehicle(obj)
				}
				, newDriver: function (obj) {
					return newDriver(obj)
				}
				, newDriverProvider: function (obj) {
					return newDriverProvider(obj)
				}
				, newLodge: function (obj) {
					return newLodge(obj)
				}
				, newSite: function (newSiteObj) {
					console.log(newSiteObj)
					var pid = newSiteObj.newSite.subdomain;
					var infoObj = {
						pid: newSiteObj.newSite.subdomain
						, vendor: newSiteObj.newSite.vendor
					}
					var partner = {
						name: newSiteObj.newSite.name
						, welcome: newSiteObj.newSite.welcome
					, }
					var admin = {
						email: newSiteObj.newAdmin.email
						, password: newSiteObj.newAdmin.password
					, }
					var media = {
						pid: pid
						, name: newSiteObj.newSite.name
					}
					if (newSiteObj.vendor) {
						var vendor = {
							name: newSiteObj.newSite.name
							, sales_email: newSiteObj.newVendor.sales_email
							, full_address: newSiteObj.newVendor.full_address
						}
					}
					ref.child("partners").child(pid).set(partner)
					ref.child("info").child(pid).set(infoObj);
					$firebaseArray(ref.child("translations").child(newSiteObj.newSite.lang)).$add(newSiteObj.newSite.name).then(function (detes) {
						ref.child("info").child(pid).child("name").set(detes.key);
						ref.child("partners").child(pid).child("name").set(detes.key);
					})
					$firebaseArray(ref.child("translations").child(newSiteObj.newSite.lang)).$add(newSiteObj.newSite.welcome).then(function (detes) {
						ref.child("info").child(pid).child("welcome").set(detes.key);
						ref.child("partners").child(pid).child("welcome").set(detes.key);
					})
					$firebaseObject(ref.child("media").child(pid)).$save(media).then(function (data) {
						console.log(data)
					})
					$firebaseAuth().$createUserWithEmailAndPassword(admin.email, admin.password).then(function (firebaseUser) {
						console.log("User " + firebaseUser.uid + " created successfully!");
						$state.go("app.admin_mng_products", {
							vendor: pid
						})
					}).catch(function (error) {
						console.error("Error: ", error);
					});
				}
				, newProduct: function (newProduct, newPackages) {
					var obj = {};
					obj.vendor = newProduct.vendor;
					obj.tag = newProduct.tag;
					if (newProduct.ticket) {
						obj.ticket = newProduct.ticket;
					}
					if (newProduct.price) {
						obj.price = newProduct.price;
					}
					if (newProduct.capacity) {
						obj.capacity = newProduct.capacity;
					}
					console.log(obj)
					$firebaseArray(ref.child("info")).$add(obj).then(function (data) {
						console.log(data)
						obj.pid = data.key
						obj.comms = newProduct.comms;
						ref.child("media").child(data.key).set({
							name: newProduct.name
							, tag: newProduct.tag
						})
						ref.child("dates").child(data.key).set(["*D10H00", "*D11H00", "*D12H00", "*D13H00", "*D16H00", "*D17H00", "*D18H00", "*D19H00", "*D20H00"])
						$firebaseArray(ref.child("translations").child(newProduct.lang)).$add(newProduct.details).then(function (detes) {
							ref.child("info").child(data.key).child("details").set(detes.key)
							$firebaseArray(ref.child("translations").child(newProduct.lang)).$add(newProduct.name).then(function (name) {
								ref.child("info").child(data.key).child("name").set(name.key)
							});
						});
						$firebaseArray(ref.child("translations").child(newProduct.lang)).$add(newProduct.description).then(function (desc) {
							ref.child("info").child(data.key).child("description").set(desc.key)
						})
					
					})
				}
				, newLodgeRoom: function (newRoom) {
					var obj = {};
					obj.vendor = newRoom.vendor;
					obj.tag = newRoom.tag;
					obj.ammenities = newRoom.ammenites;
					if (obj.ticket) {
						obj.ticket = newRoom.ticket;
					}
					if (obj.capacity) {
						obj.capacity = newRoom.capacity;
					}
					$firebaseArray(ref.child("rooms").child(obj.vendor)).$add(obj).then(function (data) {
						$firebaseArray(ref.child("translations").child("en")).$add(newRoom.details).then(function (detes) {
							ref.child("rooms").child(data.key).child("details").set(detes.key)
							$firebaseArray(ref.child("translations").child("en")).$add(newRoom.name).then(function (name) {
								ref.child("rooms").child(data.key).child("name").set(name.key)
								$firebaseArray(ref.child("translations").child("en")).$add(newRoom.description).then(function (desc) {
									ref.child("rooms").child(data.key).child("description").set(desc.key)
									ref.child("media").child(data.key).set({
										name: obj.name
										, tag: obj.tag
									})
								})
							})
						})
					})
				}, newRoomType: function(newRoomType){
					var obj = {};
					obj.vendor = newRoomType.vendor;
					obj.ensuite = newRoomType.ensuite;
					obj.bed_price = newRoomType.pp_price;
					obj.occupancy = newRoomType.occupancy;
					console.log(obj)
					 $firebaseArray(ref.child("accomm")).$add(obj).then(function(data){
						alert("New Room Type Added");
					ref.child("media").child(data.key).set({name: newRoomType.name});
					$firebaseArray(ref.child("translations").child("en")).$add(newRoomType.details).then(function (detes) {

							ref.child("accomm").child(data.key).child("details").set(detes.key);
					})
					$firebaseArray(ref.child("translations").child("en")).$add(newRoomType.name).then(function (name) {
							ref.child("accomm").child(data.key).child("name").set(name.key);
					})
					$firebaseArray(ref.child("translations").child("en")).$add(newRoomType.description).then(function (desc) {
							ref.child("accomm").child(data.key).child("description").set(desc.key)
						})
					})


				}
				, newRoom: function (newRoom, bedData) {
					var obj = {};
					obj.vendor = newRoom.vendor;
					obj.room_type = newRoom.room_type;
					obj.number = newRoom.number;

					obj.bed_price = newRoom.pp_price;
					obj.occupancy = newRoom.occupancy;
					console.log(obj)
					$firebaseArray(ref.child("rooms")).$add(obj).then(function(data){
						var i = 1;
					while(i <= newRoom.beds){
						var newBed = {
							room_id: data.key,
							price: newRoom.pp_price,
							vendor: newRoom.vendor,
							type: bedData[i]
						}
						console.log(newBed)
						$firebaseArray(ref.child("beds")).$add(newBed).then(function(bed){
							ref.child("rooms").child(data.key).child("beds").child(bed.key)
						})
						i += 1;
					}

					})

				}
				, newRec: function (newRec) {
					var rec = {};
					var newRec = newRec;
					var ref = firebase.database().ref();
					console.log(newRec, rec)
					rec.tag = "recs";
					rec.cat = newRec.cat;
					rec.openTime = moment(newRec.openTime).format("HH-mm");
					rec.closeTime = moment(newRec.closeTime).format("HH-mm");
					rec.location = newRec.location;
					console.log(rec)
					$firebaseArray(ref.child("info")).$add(rec).then(function (data) {
						ref.child("media").child(data.key).set({
							name: newRec.name
							, tag: rec.tag
							, cat: rec.cat
						})
						console.log(rec, data, data.key)
						$firebaseArray(ref.child("translations").child(newRec.lang)).$add(newRec.details).then(function (detes) {
							ref.child("info").child(data.key).child("details").set(detes.key);
						})
						$firebaseArray(ref.child("translations").child(newRec.lang)).$add(newRec.name).then(function (name) {
							ref.child("info").child(data.key).child("name").set(name.key);
							console.log(name.key)
						})
						$firebaseArray(ref.child("translations").child(newRec.lang)).$add(newRec.description).then(function (desc) {
							ref.child("info").child(data.key).child("description").set(desc.key);
							console.log(desc.key)
						})
						var newLoc = [rec.location.lat, rec.location.lng];
						console.log(newLoc)
						var geoFire = new GeoFire(ref.child("geofire/recs"))
						geoFire.set(data.key, newLoc)
					}, function (err) {
						console.log(err)
					})
				}
			};
}]).factory('PosTools', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', 'Ticketing', '$state'


		, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, Ticketing, $state) {
			var ref = firebase.database().ref();

			function dataURItoBlob(dataURI) {
				// convert base64/URLEncoded data component to raw binary data held in a string
				var byteString;
				if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
				else byteString = unescape(dataURI.split(',')[1]);
				// separate out the mime component
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
				// write the bytes of the string to a typed array
				var ia = new Uint8Array(byteString.length);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ia], {
					type: mimeString
				});
			}

			function ticketPurchase(objkey, obj, form) {
				var url = obj.pid + "/" + obj.date + "/" + obj.time
				var req = {
					"method": "POST", 
					"url": "https://www.pbpapi.com/ticketing/" + form + "_sale",
					//"url": "https://312c30f7.ngrok.io/ticketing/" + form + "_sale"
					 "data": {
						"obj": obj
						, "pos": objkey
						, "url": url
					}
				}
				$http(req).then(function (response) {
					console.log(response)
					var blob = dataURItoBlob(response.data.file)
					var storage = firebase.storage().ref("tickets/" + response.data.profile.uid + "/" + response.data.key + ".png")
					var uploadTask = storage.put(blob);
					// Register three observers:
					// 1. 'state_changed' observer, called any time the state changes
					// 2. Error observer, called on failure
					// 3. Completion observer, called on successful completion
					uploadTask.on('state_changed', function (snapshot) {
						// Observe state change events such as progress, pause, and resume
						// See below for more detail
					}, function (error) {
						// Handle unsuccessful uploads
					}, function () {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						var downloadURL = uploadTask.snapshot.downloadURL;
						if (response.data.profile.email) {
							var req2 = {
								"method": "POST", 
								"url": "https://www.pbpapi.com/ticketing/" + form + "_ticket",
								// "url": "https://312c30f7.ngrok.io/ticketing/" + form + "_ticket"
								 "data": {
									"tix": response.data.key
									, "email": response.data.profile.email
									, "url": url
								}
							}
							$http(req2)
						}
						ref.child("tix").child(response.data.key).child("url").set(downloadURL)
					});
				})
			}
			return {
				cashSale: function (pObj) {
					$firebaseArray(ref.child("pos/" + pObj.vendor + "/" + moment().format("YYYY-MM-DD") + "/sales")).$add(pObj).then(function (data) {
						// Ticketing.saveQR()
						ref.child("pos/" + pObj.vendor + "/" + moment().format("YYYY-MM-DD") + "/cash").transaction(function (total) {
							if (total) {
								total += pObj.total;
							}
							else {
								total = pObj.total;
							}
						})
						ticketPurchase(data.key, pObj, "cash");
					})
				}
				, cardSale: function (pObj) {
					$firebaseArray(ref.child("pos/" + pObj.vendor + "/" + moment().format("YYYY-MM-DD") + "/sales")).$add(pObj).then(function (data) {
						// Ticketing.saveQR()
						ref.child("pos/" + pObj.vendor + "/" + moment().format("YYYY-MM-DD") + "/card").transaction(function (total) {
							if (total) {
								total += pObj.total;
							}
							else {
								total = pObj.total;
							}
						})
						ticketPurchase(data.key, pObj, "card");
					})
				}
			}
}]).factory('Ticketing', ['$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$state', '$stateParams'
	, function ($http, $firebaseArray, $firebaseObject, $firebaseAuth, $state, $stateParams) {
	var ref = firebase.database().ref();
		function setNew(pid, date, cap) {
			var url = pid + "/" + moment(date).format("YYYY-MM-DD") + "/" + moment(date).format("HH-mm")
			var req = {
				"method": "POST", 
				"url": "https://www.pbpapi.com/ticketing/set_new",
				//"url": "https://312c30f7.ngrok.io/ticketing/set_new"
				 "data": {
					"url": url
					, "capacity": cap
				}
			}
			$http(req)
		}
		function freeMe(id, claimObj){
			ref.child("profiles").child(id).child("email").set(claimObj.email);
				if (claimObj.name) {
					ref.child("profiles").child(id).child("name").set(claimObj.name);
				}
			ref.child("freebies").child(claimObj.item.pid).child($stateParams.partner).child("available").transaction(function(count){
				if (count && count != "error" && count > 0){
					return count --
				} else {
					return "error"
				}
			}, function(){
				var req = {
				"method": "POST", 
				 "url": "https://www.pbpapi.com/ticketing/" + $stateParams.partner + "/freeMe/" + id + "/" + claimObj.item.pid + "/" + claimObj.item.package
				 // "url": "https://cc980990.ngrok.io/ticketing/" + $stateParams.partner + "/freeMe/" + id + "/" + claimObj.item.pid + "/" + claimObj.item.package
				, "data": {
					"uid": id
					, "free_id": claimObj.item.pid
					, "pack_id": claimObj.item.package
				}
			}
			$http(req).then(function(response){
				ref.child("profiles").child(id).child("prizeClaimed").set(true);

				console.log(response)
				
			})
			})

		}
		function dataURItoBlob(dataURI) {
				// convert base64/URLEncoded data component to raw binary data held in a string
				var byteString;
				if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
				else byteString = unescape(dataURI.split(',')[1]);
				// separate out the mime component
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
				// write the bytes of the string to a typed array
				var ia = new Uint8Array(byteString.length);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ia], {
					type: mimeString
				});
			}
		function ticketGen(uid, tixId) {
			var req = {
				"method": "POST", 
				"url": "https://www.pbpapi.com/ticketing/ticketMe"
				// "url": "https://312c30f7.ngrok.io/ticketing/ticketMe"
				, "data": {
					"txId": tixId
				, }
			}
			$http(req).then(function (response) {
				console.log(response)
				var blob = dataURItoBlob(response.data.file)
				var storage = firebase.storage().ref("tickets/" + uid + "/" + tixId + ".png")
				var uploadTask = storage.put(blob);
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
				}, function (error) {
					// Handle unsuccessful uploads
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					ref.child("tix").child(tixId).child("url").set(downloadURL)
				})
			});
		}

		function soldUpdate(obj, id, date) {
			var req = {
				"method": "POST", 
				"url": "https://www.pbpapi.com/ticketing/update_sold"

				// "url": "https://312c30f7.ngrok.io/ticketing/update_sold"
				, "data": {
					"obj": obj
					, "id": id
					, "date": date
				}
			}
			$http(req)
		}

		function saveQr(uid) {
			console.log("sending to " + uid)
			var storage = firebase.storage().ref("tickets/" + uid + "/qr.svg")
			var ref = firebase.database().ref()
			var req = {
				"method": "POST", 
				 "url": "https://www.pbpapi.com/ticketing/qrGen"
				//"url": "https://312c30f7.ngrok.io/ticketing/qrGen"
				, "data": {
					"uid": uid
				}
			}
			$http(req).then(function (response) {
				console.log(response)
				var uploadTask = storage.putString(response.data.file, 'base64').then(function (snapshot) {
					console.log('Uploaded a base64 string!');
				});
				// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', function (snapshot) {
					// Observe state change events such as progress, pause, and resume
					// See below for more detail
				}, function (error) {
					// Handle unsuccessful uploads
				}, function () {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					var downloadURL = uploadTask.snapshot.downloadURL;
					ref.child("tix").child(response.data.key).child("url").set(downloadURL)
				});
			})
		}
		return {
			saveQr: function (uid) {
				return saveQR(uid);
			}
			, ticketGen: function (uid, txId) {
				return ticketGen(uid, txId);
			}
			, setNew: function (pid, date, capacity) {
				return setNew(pid, date, capacity);
			}
			, updateTix: function (obj, id, date) {
				return soldUpdate(obj, id, date)
			}, freeMe: function(id, claimObj){
				return freeMe(id, claimObj)
			}
		};
}]).factory('Products', ['$firebaseArray', function ($firebaseArray) {
	var pArray = $firebaseArray(ref.child("info").orderByChild("product").equalTo(true))
		return function name() {};
}]).factory('Booking', ['$firebaseArray', function ($firebaseArray) {
		return function name() {};
}])
