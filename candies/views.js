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
      'click #newCandy': 'onOpen',
      
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
        inline: true,
        overlayClose: false,
        closeButton: false,
        fadeOut: 200,
        onLoad: function() {
          $( '#cboxClose' ).remove();
        }
      });
    }
  });

  views.New = Bb.View.extend({
    template: getTemplate('new'),
    events: {
      'click #cancel': 'onCancel',
      'submit': 'onSubmit'
    },
    initialize: function() {
      var me = this;
      me.model = new models.Candies();
      me.render();
    },
    render: function() {
      var me = this;
      me.$el.html(me.template());
      return me;
    },
    onCancel: function() {
      var me = this;
      me.$( ':input' ).val( '' );
      $.colorbox.close();
    },
    onSubmit: function(e){
      e.preventDefault();
      e.stopPropagation();
      var me = this;
      var form = convertToJSON( me.$( 'form' ) );
      var error = '';
      _.each( form, function( item ) {
        if ( item.trim() == '' ) {
          error = __( 'Fill the empty fields' );
        }
      });
      form.name = form.name.trim();
      if ( /[^a-zA-Z0-9_ñ]/.test( form.name ) || /\s/.test( form.url ) )  {
        alert( __( 'Remove white spaces at Name or URL' ))
        return;
      }
      var url = form.url.split( '//' );
      url = url[1].split( '/' );
      if ( url[0] != 'github.com' ) {
        alert( __( 'Is not a Git Hub url' ) );
        return;

      }
      var git = url[2].split( '.' );
      if ( git[1] != 'git' ) {
        alert( __( 'Is not a Git Hub repository' ) );
        return;
      }
      var candy = me.model.get( 'candy' );
      candy.addParams( form ).save().done( function(out) {
        if ( out.error ) {
          var error = [];
          _.each( out.error, function( item ) {
            error.push( item[0] );
          });
          var errors = error.join( ', ' );
          alert( errors );
          return;
        }
        if ( out.ok ) {
          alert( out. ok );
          location.reload();
        }
      });
    }
  }, [viewhelpers.widgets, viewhelpers.forms]);
})(candies);
