'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('ShopSmile', [
  'ngRoute'
	
	, 'myApp.version'
	
	, 'ShopSmileController'
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
		.otherwise({
			redirectTo: '/home'
		});
}]);