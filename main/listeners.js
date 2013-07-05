(function() {
  
  $(document).ajaxError(function(e, response) {
    alert(response.statusText + ' : ' + response.responseText);
  });


})();

function convertToJSON(selector) {
var json = {}
_.each(selector.serializeArray(), function(item) {
if (_.has(json, item.name)) {
  if (_.isArray(json[item.name])) {
    json[item.name].push(item.value);
  } else {
    json[item.name] = [json[item.name], item.value];
  }
} else {
  json[item.name] = item.value;  
}

});
return json;
}

function spinerize( el ) {
  el.attr( 'data-children', el.html() );
  el.html( '<i style="display:none;">A</i>' );
  $( el ).spin();
}
