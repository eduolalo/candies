(function(namespace) {

  var models = namespace.models;

  models.Candies = Backbone.Model.extend({
    url: function() {
      var me = this;
      return  uri( 'candies' ) + me.getParamsQuery();
    }
  });
    
})(candies);