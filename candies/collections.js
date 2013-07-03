(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;

  collections.Candies = Backbone.Collection.extend( {
    model: models.Candy,
    url: function() {
      var me = this;
      return  uri( 'candies.json' ) + me.getParamsQuery();
    }
  });
})(candies);
