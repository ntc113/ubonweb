'use strict';

// Declare app
angular.module('ubon', [
  'ngRoute',
  'ui.bootstrap',
  'ubon.filters',
  'ubon.controller',
  'ubon.directives',
  // 'ubon.services'
]).
config(function($locationProvider, $routeProvider) {

  $routeProvider.when('/', {templateUrl: templateUrl('welcome'), controller: 'welcomeCtrl'});
  $routeProvider.when('/login', {templateUrl: templateUrl('login'), controller: 'loginCtrl'});
  $routeProvider.when('/im', {templateUrl: templateUrl('im'), controller: 'imCtrl', reloadOnSearch: false});
  $routeProvider.otherwise({redirectTo: '/'});

})
;