var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $rootScope, $firebaseObject) {
	var ref = firebase.database().ref();

	var syncObject = $firebaseObject(ref);
	syncObject.$bindTo($scope, "data");

	$scope.isLogin = false;
	$scope.isAvatar = false;
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			if (user.photoURL == null) {

			} else {
				$scope.isAvatar = true;
				$scope.userAvatar = user.photoURL;
			}

			if (user.displayName == null) {
				$scope.userName = user.email;
			} else {
				$scope.userName = user.displayName;
			}

			$scope.isLogin = true;
			$scope.$apply();
		} else {

		}
	});

	$scope.loadPage = function (key, pageNumber = 0) {
		$scope.itemListName = key;
		listItems = $scope.data['products'][key];
		$rootScope.outItems = listItems.slice(parseInt(pageNumber) * 6, parseInt(pageNumber) * 6 + 6);
		$rootScope.maxPages = listItems.length / 6;
	};


	var provider = new firebase.auth.FacebookAuthProvider();
	provider.addScope('public_profile');

	$scope.loginFacebook = function () {
		firebase.auth().signInWithPopup(provider).then(function (result) {
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			$scope.messageError = "Đăng nhập thành công";
			$scope.userName = result.user.displayName;
			if (result.user.photoURL == null) {

			} else {
				$scope.isAvatar = true;
				$scope.userAvatar = result.user.photoURL;
			}
			$scope.isLogin = true;
			$('#mySignIn').modal('hide');

			var user = firebase.auth().currentUser;
			if ($scope.data['users'][user.uid] != undefined) {
				$scope.userCoin = $scope.data['users'][user.uid]['coin'];
				$scope.$apply();
				return;
			} else {
				var postData = {
					coin: 100
				};

				var newPostKey = user.uid;
				var updates = {};
				updates['/users/' + newPostKey] = postData;
				ref.update(updates);
			}

			$scope.$apply();
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	};

	provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/plus.login');
	$scope.loginGoogle = function () {
		firebase.auth().signInWithPopup(provider).then(function (result) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			$scope.messageError = "Đăng nhập thành công";
			$scope.userName = result.user.displayName;
			if (result.user.photoURL == null) {

			} else {
				$scope.isAvatar = true;
				$scope.userAvatar = result.user.photoURL;
			}

			$scope.isLogin = true;
			$('#mySignIn').modal('hide');

			var user = firebase.auth().currentUser;
			if ($scope.data['users'][user.uid] != undefined) {
				$scope.userCoin = $scope.data['users'][user.uid]['coin'];
				$scope.$apply();
				return;
			} else {
				var postData = {
					coin: 100
				};

				var newPostKey = user.uid;
				var updates = {};
				updates['/users/' + newPostKey] = postData;
				ref.update(updates);
			}

			$scope.$apply();
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	};

	$scope.createAccount = function () {
		firebase.auth().createUserWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function () {
			// The signed-in user info.
			$scope.messageError = "Tạo tài khoản thành công";
			$('#mySignIn').modal('hide');

			var user = firebase.auth().currentUser;
			if ($scope.data['users'][user.uid] != undefined) {
				$scope.userCoin = $scope.data['users'][user.uid]['coin'];
				$scope.$apply();
				return;
			} else {
				var postData = {
					coin: 100
				};

				var newPostKey = user.uid;
				var updates = {};
				updates['/users/' + newPostKey] = postData;
				ref.update(updates);
			}
			$scope.$apply();

		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/email-already-in-use') {
				$scope.messageError = "Email tài khoản đã tồn tại";
			} else if (errorCode == 'auth/invalid-email') {
				$scope.messageError = "Email không hợp lệ";
			} else if (errorCode == 'auth/operation-not-allowed') {
				$scope.messageError = "Tài khoản không thể dùng được";
			} else if (errorCode == 'auth/weak-password') {
				$scope.messageError = "Mật khẩu không đủ mạnh để đăng kí";
			}
			$scope.$apply();
		});
	};

	$scope.userPassword = "";
	$scope.loginAccount = function () {
		firebase.auth().signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function () {
			// The signed-in user info.
			$scope.messageError = "Đăng nhập thành công";
			$scope.userName = $scope.userEmail;
			$scope.isLogin = true;
			$('#mySignIn').modal('hide');

			var user = firebase.auth().currentUser;
			if ($scope.data['users'][user.uid] != undefined) {
				$scope.userCoin = $scope.data['users'][user.uid]['coin'];
				$scope.$apply();
				return;
			} else {
				var postData = {
					coin: 100
				};

				var newPostKey = user.uid;
				var updates = {};
				updates['/users/' + newPostKey] = postData;
				ref.update(updates);
			}

			$scope.$apply();
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/user-disabled') {
				$scope.messageError = "Tài khoản đã bị khóa";
			} else if (errorCode == 'auth/invalid-email') {
				$scope.messageError = "Email không hợp lệ";
			} else if (errorCode == 'auth/user-not-found') {
				$scope.messageError = "Tài khoản không tồn tại";
			} else if (errorCode == 'auth/wrong-password') {
				$scope.messageError = "Mật khẩu không đúng";
			} else if (errorCode == 'auth/argument-error') {
				$scope.messageError = "Nhập đầy đủ tài khoản và mật khẩu";
			}
			$scope.$apply();
		});
	};


	$scope.logout = function () {
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
			$scope.userName = "";
			$scope.isLogin = false;
			$scope.$apply();
		}, function (error) {
			// An error happened.
		});
	};
	////////////////////////////////////////////////////////////////////////////////////////////
	$scope.getNumber = function (num) {
		intNum = parseInt(num);
		if (isNaN(intNum)) {
			intNum = 0;
		}
		if (intNum < num) {
			intNum = intNum + 1;
		}
		return new Array(intNum);
	};

	$scope.loadDetail = function (index) {
		$rootScope.product = $rootScope.outItems[index];
		console.log($scope.product);
	};



	//////////////////////////////////////////////////////////////////////////////////////////////

	// root in Storage
	var storageRef = firebase.storage().ref();
	var urlUploadImage = null;
	var file = null;

	$scope.imageUpload = function (element) {
		console.log($scope.type);
		var reader = new FileReader();
		reader.onload = function (event) {
				$scope.images = event.target.result
				$scope.$apply();
			}
			// when the file is read it triggers the onload event above.
		reader.readAsDataURL(element.files[0]);
		file = element.files[0];
	};

	$scope.PostNewProduct = function () {
		var user = firebase.auth().currentUser;
		if (user) {
			// upload image to server
			var uploadTask = storageRef.child($scope.type + '/' + file.name).put(file);
			uploadTask.on('state_changed', null, function (error) {
				console.error('Upload failed:', error);
			}, function () {
				// tao data
				var postData = {
					avatar: uploadTask.snapshot.metadata.downloadURLs[0]
					, detail: $scope.detail
					, price: $scope.price
					, salesman: {
						address: $scope.address
						, name: $scope.name
						, phone: $scope.phone
						, uid: firebase.auth().currentUser.uid
					}
					, status: $scope.status
					, title: $scope.title
					, priority: "0"
				};

				var newPostKey = $scope.data['products'][$scope.type].length
				var updates = {};
				updates['/products/' + $scope.type + '/' + newPostKey] = postData;
				ref.update(updates);

				$rootScope.product = postData;
			});
		} else {
			window.location.href = "index.html";
		}
	};

	$scope.Post = function () {
		var user = firebase.auth().currentUser;
		if (user) {} else {
			window.location.href = "index.html";
		}
	};

	////////////////////////////////////////
	$scope.setCoin = function () {
		var user = firebase.auth().currentUser;
		if ($scope.data['users'][user.uid] != undefined) {
			$scope.userCoin = $scope.data['users'][user.uid]['coin'];
		}
	}

	$scope.resetLogin = function () {
		$scope.userEmail = "";
		$scope.userPassword = "";
		$scope.messageError = "";
	}

	$scope.maxTitle = 40;
	$scope.maxDetail = 80;

	function initialize() {

		var mapProp = {
			center: new google.maps.LatLng(10.745439, 106.692296)
			, zoom: 17
			, mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(10.745439, 106.692296)
			, animation: google.maps.Animation.BOUNCE
		});

		marker.setMap(map);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	function filterByPriority(data) {
		return data.priority == 1;
	}

	function shuffle(array) {
		var currentIndex = array.length
			, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	$scope.$watch('data', function () {
		if ($scope.data != undefined) {
			$scope.vehiclesHotProducts = shuffle($scope.data['products']['vehicles'].filter(filterByPriority)).slice(0, 6);
			$scope.booksHotProducts = shuffle($scope.data['products']['books'].filter(filterByPriority)).slice(0, 6);
			$scope.housesHotProducts = shuffle($scope.data['products']['houses'].filter(filterByPriority)).slice(0, 6);
			$scope.fashionsHotProducts = shuffle($scope.data['products']['fashions'].filter(filterByPriority)).slice(0, 6);
			$scope.electrical_equipmentsHotProducts = shuffle($scope.data['products']['electrical_equipments'].filter(filterByPriority)).slice(0, 6);
			$scope.mobilesHotProducts = shuffle($scope.data['products']['mobiles'].filter(filterByPriority)).slice(0, 6);
			$scope.jobsHotProducts = shuffle($scope.data['products']['jobs'].filter(filterByPriority)).slice(0, 6);
			$scope.housewaresHotProducts = shuffle($scope.data['products']['housewares'].filter(filterByPriority)).slice(0, 6);
			$scope.sportsHotProducts = shuffle($scope.data['products']['sports'].filter(filterByPriority)).slice(0, 6);
			$scope.office_equipmentsHotProducts = shuffle($scope.data['products']['office_equipments'].filter(filterByPriority)).slice(0, 6);
			$scope.healthHotProducts = shuffle($scope.data['products']['health'].filter(filterByPriority)).slice(0, 6);
			$scope.servicesHotProducts = shuffle($scope.data['products']['services'].filter(filterByPriority)).slice(0, 6);
			$scope.othersHotProducts = shuffle($scope.data['products']['others'].filter(filterByPriority)).slice(0, 6);
		}
	}, true);

	$scope.$on('loadSlider', function (ngRepeatFinishedEvent) {
		$(document).ready(function () {
			slider = $('.sliderProduct').bxSlider({
				slideWidth: 280
				, minSlides: 1
				, maxSlides: 4
				, moveSlides: 1
				, slideMargin: 10
				, controls: false
				, auto: true
				, pager: false
			});
			console.log(slider.getSlideCount());
		});
	});

});