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


app.directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A'
		, link: function (scope, element, attrs) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit(attrs.onFinishRender);
				});
			}
		}
	}
});