/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var vcapServices = require('vcap_services');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');

// credentials from the bluemix console (specific for each api)
var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: 'e58da531-2eb3-46f0-b96d-3792eb5cee96',
  password: 'Lz351H1oOCdw'
}, vcapServices.getCredentials('speech_to_text'));
var authService = watson.authorization(config);

var relationshipExtractionCredentials = extend({
  url: 'https://gateway.watsonplatform.net/relationship-extraction-beta/api',
  username: '744602a2-6101-4f89-8d2f-39fe42699ba4',
  password: 'O0TMxSc7l0l8',
  version: 'v1-beta'
}, vcapServices.getCredentials('relationship_extraction'));
var relationshipExtraction = watson.relationship_extraction(relationshipExtractionCredentials);

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.send(token);
    }
  });
});

app.get('/api/extract', function(req, res, next) {
  relationshipExtraction.extract({
    text: req.query.text,
    dataset: 'ie-en-news'
  }, function(err, results) {
    if (err)
      return next(err);
    else
      res.json(results);
  });
});

// serve the files out of ./public as our main files
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/bundle.js', function(req, res) {
  res.sendFile(__dirname + '/public/bundle.js');
});
app.get('/stylesheets/style.css', function(req, res) {
  res.sendFile(__dirname + '/public/stylesheets/style.css');
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
