var SpeechToText = require('../js/app/SpeechToText');
var PreAnalyzer = require('../js/app/PreAnalyzer.js');
var Analyzer = require('../js/app/Analyzer.js');
var $ = require('jquery');

var altMList =[]
var altScope = 0

var app = angular.module('meetingassistant', []);

app.controller('MeetingAssistantController', function($scope) {
	console.log('MeetingAssistantController constructor');

    altMList = this.meetingsList = [];
    this.listening = false;
    altScope = $scope

    $('#btnListen').click(function() {
		console.log("$('#btnListen').click");

		btnListen_Click();
    });

    // start speech to text
    var speechToText = new SpeechToText(onMessage, onEnd);
    var analyzer = new Analyzer();
    var preAnalyzer = new PreAnalyzer(function(meetingMention) {
      console.log('PreAnalyzer anonymous callback');
	  console.log('Meeting mention: ' + meetingMention);

      analyzer.handleMention(meetingMention, analyzerCallback);
    });

    function onMessage(json) {
		console.log('MeetingAssistantController.onMessage');

		preAnalyzer.processJson(json);
    }

    function onEnd() {
		console.log('MeetingAssistantController.onEnd');

		preAnalyzer.transcriptEnded();
    }

	function analyzerCallback(meeting){
		console.log('MeetingAssistantController.analyzerCallback');

		// one hour meeting
		meeting.enddate = new Date(meeting.date.getTime() + (60 * 60 * 1000));

		altMList.push(meeting);
		altScope.$apply()
		console.log(meeting);
	}
});

//function triggers when button is clicked
function btnListen_Click() {
	console.log('window.btnListen_Click');

    if (this.listening) {
        $('#btnListen').text("Start listening");
        $('#btnListen').addClass("btn-success");
        $('#btnListen').removeClass("btn-warning");
    } else {
        $('#btnListen').text("Stop listening");
        $('#btnListen').removeClass("btn-success");
        $('#btnListen').addClass("btn-warning");
    }
    this.listening = !this.listening;
};
