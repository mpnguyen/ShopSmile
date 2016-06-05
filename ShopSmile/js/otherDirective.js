var app = angular.module('ShopSmileDirective', []);


app.directive('backImg', function () {
	return function (scope, element, attrs) {
		var url = attrs.backImg;
		element.css({
			'background-image': 'url(' + url + ')'
			, 'background-size': 'cover'
			, 'background-position': 'center'
		});
	};
});