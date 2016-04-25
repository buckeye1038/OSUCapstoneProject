var Microphone = require('./Speech-to-Text/Microphone');
var handleMicrophone = require('./Speech-to-Text/handlemicrophone').handleMicrophone;
var $ = require('jquery');
var pubsub = require('pubsub-js');
var models = require('./Speech-to-Text/models.JSON').models;
var utils = require('./Speech-to-Text/utils');

// onMessageCallback is a function with one parameter that is the JSON results from the speech to text api
// onEndCallback takes no paramters
var SpeechToText = function(onMessageCallback, onEndCallback) {
  var tokenGenerator = utils.createTokenGenerator();

  // Make call to API to try and get token
  tokenGenerator.getToken(function(err, token) {
    window.onbeforeunload = function() {
      localStorage.clear();
    };

    var BUFFERSIZE = 1892;
    if (!token) {
      console.error('No authorization token available');
      console.error('Attempting to reconnect...');

      if (err && err.code){
        console.log('Server error ' + err.code + ': '+ err.error);
      }
      else{
        console.log('Server error ' + err.code + ': please refresh your browser and try again');
      }
    }

    var viewContext = {
      currentModel: 'en-US_BroadbandModel',
      models: models,
      token: token,
      bufferSize: BUFFERSIZE
    };

    localStorage.setItem('models', JSON.stringify(models));
    localStorage.setItem('currentModel', 'en-US_BroadbandModel');
    localStorage.setItem('sessionPermissions', 'true');

    initRecordButton(viewContext, onMessageCallback, onEndCallback);
  });
};

function initRecordButton(ctx, onMessageCallback, onEndCallback) {
  var recordButton = $('#btnListen');
  recordButton.click((function() {
	  
    var running = false;
    var token = ctx.token;
    var micOptions = {
      bufferSize: ctx.buffersize
    };
    var mic = new Microphone(micOptions);

    return function(evt) {
      // Prevent default anchor behavior
      evt.preventDefault();

      var currentModel = localStorage.getItem('currentModel');
      var currentlyDisplaying = localStorage.getItem('currentlyDisplaying');

      if (currentlyDisplaying=='sample'||currentlyDisplaying=='fileupload') {
        console.log('Currently another file is playing, please stop the file or wait until it finishes');
        return;
      }
      localStorage.setItem('currentlyDisplaying', 'record');
      if (!running) {
        $('#resultsText').val('');   // clear hypotheses from previous runs
        console.log('Not running, handleMicrophone()');
        handleMicrophone(token, currentModel, mic, function(err) {
          if (err) {
            var msg = 'Error: ' + err.message;
            console.log(msg);
            console.log(msg);
            running = false;
            localStorage.setItem('currentlyDisplaying', 'false');
          } else {
            recordButton.css('background-color', '#d74108');
            recordButton.find('img').attr('src', 'images/stop.svg');
            console.log('starting mic');
            mic.record();
            running = true;
          }
        }, onMessageCallback);
      } else {
        console.log('Stopping microphone, sending stop action message');
        recordButton.removeAttr('style');
        recordButton.find('img').attr('src', 'images/microphone.svg');
        pubsub.publish('hardsocketstop');
        mic.stop();
        running = false;
        localStorage.setItem('currentlyDisplaying', 'false');

        onEndCallback();
      }
    };
  })());
}

module.exports = SpeechToText;
