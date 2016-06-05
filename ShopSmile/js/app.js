'use strict';

var config = {
	apiKey: "AIzaSyD55oGRMOEDLbNF2YkXb5fdeLvz9-qEI1c"
	, authDomain: "project-8852431456818982833.firebaseapp.com"
	, databaseURL: "https://project-8852431456818982833.firebaseio.com"
	, storageBucket: "project-8852431456818982833.appspot.com"
};
firebase.initializeApp(config);

// Declare app level module which depends on views, and components
var app = angular.module('ShopSmile', [
  'ngRoute'
	, 'myApp.version'
	, 'ShopSmileController'
	, 'ShopSmileDirective'
	, 'firebase'
]);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'partials/list-products.html'
			, controller: 'ShopSmileCtrl'
		})
		.when('/detail', {
			templateUrl: 'partials/product-detail.html'
			, controller: 'ShopSmileCtrl'
		})
		.when('/post', {
			templateUrl: 'partials/post-item.html'
			, controller: 'ShopSmileCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});
}]);