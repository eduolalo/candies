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
      'submit': 'onSearch',
    },
    initialize: function() {
      var me = this;
      me.model = new models.Candies();
      me.newCandy = new views.New ({
        model: me.model,
        parentView: me
      });;
      me.model.get('candies').fetch().done( function() {
        me.render();
      });
    },
    render: function() {
      var me = this;
      me.$el.html(me.template(me.model.toJSON()));
      me.newCandy.setElement( me.$( '#new-candy' ) )
      .render();
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
    },
    onSearch: function ( e ) {
      e.preventDefault();
      e.stopPropagation();
      var me = this;
      var query = me.$('#search').val();
      var pattern = new RegExp(query,'i');
      var candies = me.model.get('candies').toJSON().filter(function (item) {
        return pattern.test(item.name) || pattern.test(item.description);
      });
      me.$el.html(me.template({
        candies: candies,
      }));
      return me;
    },
  });

  views.New = Bb.View.extend({
    template: getTemplate('new'),
    events: {
      'click #cancel': 'onCancel',
      'submit': 'onSubmit'
    },
    initialize: function() {
      var me = this;
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
      var error = me.validate( form );
      if ( error ) {
        alert( error );
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
          me.options.parentView.initialize();
          $.colorbox.close();
        }
      });
    },
    validate: function( form ) {
     var error = false;
     _.each( form, function( item ) {
        if( item.trim() == ''){
        error = true;
        }
        item = item.trim();
      });
      if ( error ) {
        return __( 'fill empty fields' );
      }
      if ( /[^a-zA-Z0-9_ñ]/.test( form.name ) || /\s/.test( form.url ) )  {
        return  __( 'URL have white spaces. Name have white spaces and special characters' );
      }
      var url = form.url.split( '//' );
      url = url[1].split( '/' );
      if ( url[0] != 'github.com' ) {
        return  __( 'Is not a Git Hub url' );
      }
      return error;
    }
  }, [viewhelpers.widgets, viewhelpers.forms]);
})(candies);