'use strict';

// Declare app
angular.module('ubon', [
  'ngRoute',
  'ubon.controller'
]).
config(function($locationProvider, $routeProvider) {

  $routeProvider.when('/', {templateUrl: templateUrl('welcome'), controller: 'welcomeCtrl'});
  // $routeProvider.when('/login', {templateUrl: templateUrl('login'), controller: 'loginCtrl'});
  // $routeProvider.when('/im', {templateUrl: templateUrl('im'), controller: 'imCtrl', reloadOnSearch: false});
  $routeProvider.otherwise({redirectTo: '/'});

})
;