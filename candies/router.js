(function(namespace) {

  var views = namespace.views;

  var Router = Backbone.Router.extend({
    
    routes: {
      'candies': 'main',
    },

    main: function() {
      new views.Main({
        el: $('#container')
      });
      // new views.New( {
      //   el: $( '#new-candy' )
      // })
    },

  });

  new Router();

})(candies);