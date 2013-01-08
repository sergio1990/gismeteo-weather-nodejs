(function() {
  var gw = {};

  /* Library settings */

  // Module version:
  gw.version = '0.0.1';

  // API base URL:
  gw.api_url = 'http://gismeteo.ua'

  // If something went wrong, you'll hear about it via `gw.error`
  gw.error = '';

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
    var agent = require('http-agent').create('', [{
      method: 'GET',
      uri: url
    }]);

    agent.addListener('next', function(err, agent){
      var data = (agent && agent.body) ? agent.body : null;
      gw.error = err;

      if ( !gw.error ) {
        gw.parse.call(gw, data, gw);
      }

      if ( typeof callback === 'function' ) {
        callback(gw.error, data);
      }      
    });

    agent.start();
    return gw;
  }

  gw.parse = function(data, gw){
    try{
      var xmlDoc = libxmljs.parseXml(data);      
      var fact = xmlDoc.get('//fact').childNodes()[0];
      data = gw.default_weather;
      data.temp_c = parseInt(fact.attr('t').text());
      data.temp_f = parseInt(parseFloat(9)/5 * data.temp_c + 32);
      data.icon = parseInt(fact.attr('icon').text());
      data.description = parseInt(fact.attr('descr').text());
    }catch(err){
      gw.error = "Error XML parsing"
      return gw;
    }
    return gw;
  }

  // Export the library module:
  module.exports = gw;

}())
