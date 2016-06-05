var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $rootScope, $firebaseObject) {
	var ref = firebase.database().ref();
	$scope.data = "";
	var syncObject = $firebaseObject(ref);
	syncObject.$bindTo($scope, "data");

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
			var user = result.user;
			// ...
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
			console.log(result.user);
			// ...
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
});