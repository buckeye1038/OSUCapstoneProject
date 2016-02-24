var app = angular.module('meetingassistant', []);
var SpeechToTextMock = require('./SpeechToTextMock.js');
var PreAnalyzer = require('../js/app/PreAnalyzer.js');
var Analyzer = require('../js/app/Analyzer.js');

app.controller('MeetingAssistantController', function($scope) {
    this.meetingsList = [];
    this.listening = false;

    var self = this;
    //function triggers when button is clicked
    $scope.btnListen_Click = function() {
        if (this.listening) {
            $('#btnListen').text("Start listening");
            $('#btnListen').addClass("btn-success");
            $('#btnListen').removeClass("btn-warning");
        } else {
            $('#btnListen').text("Stop listening");
            $('#btnListen').removeClass("btn-success");
            $('#btnListen').addClass("btn-warning");

            var analyzer = new Analyzer();
            var preAnalyzer = new PreAnalyzer((function(meetingMention) {
              var meeting = analyzer.handleMention(meetingMention);
              meeting.enddate = new Date();
              this.meetingsList.push(meeting);
            }).bind(self));
            var speechToTextMock = new SpeechToTextMock(function(json) {
              preAnalyzer.processJson(json);
            });

            speechToTextMock.startListening($('#text').text());
            preAnalyzer.transcriptEnded();
        }

        this.listening = !this.listening;
    };
});
