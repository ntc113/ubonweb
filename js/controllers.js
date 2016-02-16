'use strict';

/* Controllers */

angular.module('ubon.controller', [
	'ubon.i18n',
	'ubon.services'
]).controller ('welcomeCtrl', function ($scope, $location, $modal, $modalStack, ErrorService) {
	$scope.login = function () {
		ErrorService.confirm({
	        type: 'REQUIRED_MOBILEAPP',
	    }).then(function () {
	        $location.url ('/login');
	    });
	}
}).controller ('loginCtrl', function () {

}).controller ('imCtrl', function () {
	
})
;