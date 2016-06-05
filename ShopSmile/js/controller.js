var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $rootScope, $firebaseObject) {
	var ref = firebase.database().ref();
	$scope.data = "";
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
			$scope.userName = user.displayName;
			$scope.isLogin = true;
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
			$scope.userName = result.user.displayName;
			if (result.user.photoURL == null) {

			} else {
				$scope.isAvatar = true;
				$scope.userAvatar = result.user.photoURL;
			}
			$scope.isLogin = true;
			$('#mySignIn').modal('hide');
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
			$scope.userName = result.user.displayName;
			if (result.user.photoURL == null) {

			} else {
				$scope.isAvatar = true;
				$scope.userAvatar = result.user.photoURL;
			}

			$scope.isLogin = true;
			$('#mySignIn').modal('hide');
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
		firebase.auth().createUserWithEmailAndPassword($scope.userEmail, $scope.userPassword).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

		});
	};

	$scope.loginAccount = function () {
		firebase.auth().signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
		});
	};

	$scope.logout = function () {
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
			$scope.userName = "";
			$scope.isLogin = false;
		}, function (error) {
			// An error happened.
		});
	};

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



	//////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


});