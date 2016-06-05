var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $firebaseObject) {
	var ref = firebase.database().ref();
	$scope.data = "";
	var syncObject = $firebaseObject(ref);
	syncObject.$bindTo($scope, "data");

	$scope.listItems = "";

	$scope.loadPage = function (key) {

	};

});