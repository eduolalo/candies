(function(namespace) {

  var views = namespace.views;
  var collections = namespace.collections;
  var models = namespace.models;

  var getTemplate = function(name) {
    return hbs.compile($('#candies-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    template: getTemplate('main'),
    events: {
      'click #newCandy': 'onOpen'
    },
    initialize: function() {
      var me = this;
      me.model = new models.Candies();
      var candies = me.model.get( 'candies' );
      candies.fetch().done( function() {
        me.render();
      });
    },
    render: function() {
      var me = this;
      me.$el.html(me.template(me.model.toJSON()));
      return me;
    },
    onOpen: function( e ){
      var me = this;
      var target = me.$( e.currentTarget );
      me.$( target ).colorbox( {
        inline: true
      });
    }
  });

  views.New = Bb.View.extend({
    template: getTemplate('new'),
    initialize: function() {
      var me = this;
      me.render();
    },
    render: function() {
      var me = this;
      me.$el.html(me.template());
      return me;
    }
  });
})(candies);
