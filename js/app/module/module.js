'use strict';
var route = 'app/controllers/';
require( [ 
   route + 'ini',
   route + 'signin'
], function() {

   angular.module( 'candy', []).
   config([ 
      '$routeProvider',
      function( $routeProvider, $locationProvider) {
         $routeProvider.
         when( '/', {
            templateUrl: 'templates/ini.html',
            controller: ini
         }).
         when( '/signin', {
            templateUrl: 'templates/signin.html',
            controller: signin
         }).
         otherwise( {
            redirectTo: '/'
         })
   }]);
   
});