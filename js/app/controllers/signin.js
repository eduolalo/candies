function signin( $scope ) {
  var me = $scope;


  me.match = function() {
    if ( me.conf == me.password ) {
      me.signin.conf.$error.match = false;
      return;
    }
    me.signin.conf.$error.match = true;
  }

  me.submit = function() {
    if ( me.signin.conf.$error.match ) {
      return;
    }
    var data = {
      password: me.password,
      user: me.name,
      email: me.email
    }
    signIn( data ).done( function(out) {
      console.log(out);
    })
  }

}