(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;

  collections.Candy = Backbone.Collection.extend( {
    url: function() {
      var me = this;
      return  uri( 'candies' ) + me.getParamsQuery();
    }
  });
})(candies);
