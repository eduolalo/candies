requirejs.config( {
  baseUrl: 'js',
  paths: {
    angular: 'lib/angular/angular.min',
    jquery: 'lib/vendor/jquery',
    twitter: 'lib/plugins/bootstrap.min',
    angularResource: 'lib/angular/angular-resource'
  },
  shim: {
    twitter: {
      deps: [ 'jquery' ]
    },
    angular: {
      deps: [ 
        'jquery',
        'twitter'
      ],
      exports: 'angular'
    },
    angularResource: {
      deps: [ 'angular' ]
    }
  }
});

requirejs( [
  'angular',
  'jquery'
], function( angular ) {
  requirejs([
    'app/listeners',
    'app/module/module',
    'app/services/services'
  ], function() {
    requirejs( [
      'app/app'
    ]);
  });
});