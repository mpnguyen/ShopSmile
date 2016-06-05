var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $firebaseObject) {
	var ref = firebase.database().ref();
	$scope.data = "";
	var syncObject = $firebaseObject(ref);
	syncObject.$bindTo($scope, "data");

	$scope.page = 0;
	$scope.loadPage = function (key) {
		$scope.pages = 0;
		$scope.listItems = $scope.data['products'][key];
		console.log($scope.listItems);
	};
   
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    
    $scope.loginFacebook = function(){
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        }).catch(function(error) {
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
    $scope.loginGoogle = function(){
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        }).catch(function(error) {
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
});