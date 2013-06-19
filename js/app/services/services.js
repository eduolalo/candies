'use strict';

var api = 'http://localhost/candiesapi/';

var signIn = function( params ) {
  var data = {model: params }
  $.ajax( {
    type: 'POST',
    url: api + 'users/add/',
    data: data,
    crossDomain: true,
    // contentType: 'application/x-www-form-urlencoded'
  });
}