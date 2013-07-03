(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;

  models.Candies = Backbone.Model.extend({
    initialize: function() {
      var me = this;
      me.set( 'candies', new collections.Candies() );
      me.set( 'candy', new models.Candy() );
    }
  });  

  models.Candy = Backbone.Model.extend({
    url: function() {
      var me = this;
      return uri( 'candies.json' ) + me.getParamsQuery();
    }
  });   

})(candies);
