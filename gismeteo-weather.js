

(function() {
  var gw = {};

  var request = require('request');
  var libxmljs = require('libxmljs');

  /* Library settings */

  // Module version:
  gw.version = '0.0.4';

  // API base URL:
  gw.api_url = 'http://gismeteo.ua'

  // If something went wrong, you'll hear about it via `gw.error`
  gw.error = '';

  gw.weather = {};

  gw.default_weather = {
    icon: "icy.png",
    temp_c: '?',
    temp_f: '?',
    description: ''
  }

  /* Library methods */

  // Sets API module parameters:
  // Currently only app_id is implemented (advanced params coming soon)
  gw.set = function(opts) {
    gw.api_url = opts.api_url;
    return gw;
  }

  // Get city gismeteo id by name
  gw.getCityWeather = function(id, callback){
    var url = gw.api_url + id;
    
    request(url, function (error, response, body) {
      var data = body ? body : null;
      gw.error = error;

      if (!error && response.statusCode == 200) {
        gw.parse.call(gw, data, gw);
      }

      if ( typeof callback === 'function' ) {
        callback(gw.error, gw.weather);
      }
    });

    return gw;
  }

  gw.parse = function(data, gw){
    try{
      var xmlDoc = libxmljs.parseXml(data);
      var gchild = xmlDoc.get('//fact');
      var children = gchild.childNodes();
      var fact = children[0];
      gw.weather = gw.default_weather;
      gw.weather.temp_c = parseInt(fact.attr('t').value());
      gw.weather.temp_f = parseInt(9/5 * gw.weather.temp_c + 32);
      gw.weather.icon = fact.attr('icon').value();
      gw.weather.description = fact.attr('descr').value();
    }catch(err){
      console.log(err);
      gw.error = "Error XML parsing"
      return gw;
    }
    return gw;
  }

  // Export the library module:
  module.exports = gw;

}())
