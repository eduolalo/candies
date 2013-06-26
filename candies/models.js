(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;

  models.Candies = Backbone.Model.extend({
    initialize: function() {
      var me = this;
      me.set( 'candies', new collections.Candy() );
    }
  });    
})(candies);
