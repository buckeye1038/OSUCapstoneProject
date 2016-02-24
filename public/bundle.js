(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 This class takes in input from the PreAnalyer, and outputs the processed data to Reporting, via the provided callback.
 Parameters
		{
			"date": <Date object>,
			"time": "time string",
			"subject": "example subject",
			"description": "example description"
		}
*/
var Analyzer = function() {

};

/**

 Parameters
	json - with the following format
		{
			beforeMentionTranscript: [array of strings],
			mentionTranscript: [array of strings],
			afterMentionTranscript: [array of strings]
		}
*/
Analyzer.prototype.handleMention = function(json) {

	var beforeMentionTranscript = json.beforeMentionTranscript;
	var mentionTranscript = json.mentionTranscript;
	var afterMentionTranscript = json.afterMentionTranscript;


	var months = ["january", "february", "march", "april", "may", "june", "july",
	              "august", "september", "october", "november", "december"];
	var days = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh",
		           "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
		           "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
		           "nineteenth", "twentieth", "twenty", "thirtieth", "thirty"];
	var times_Hours = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
	var times_Minutes_Partial = ["ten", "twenty", "thirty", "fourty", "fifty"];



	var containsMonth = false;
	var containsDay = false;
	var containsTime = false;


	var confirmedMeetingMonth;
	var confirmedMeetingDay;
	var confirmedMeetingHour;
	var confirmedMeetingMinute;

	if(mentionTranscript.indexOf("meeting") != -1){
	//**************************************search for month**************************************
		for (var i = 0; i < months.length; i++){
			if(beforeMentionTranscript.indexOf(months[i]) != -1){
				confirmedMeetingMonth = i+1;
				containsMonth = true;
			}
		}

		for(var i = 0; i < months.length; i++){
			if(afterMentionTranscript.indexOf(months[i]) != -1){
				confirmedMeetingMonth = i+1;
				containsMonth = true;
			}
		}


	//****************************************find the day***************************************
		for (var i = 0; i < days.length; i++){
			var datePosition = beforeMentionTranscript.indexOf(days[i]);

			if(datePosition != -1){

				if(i == 20){
					for(var j = 0; j < 9; j++){
						if(beforeMentionTranscript[datePosition + 1] === days[j]){
							confirmedMeetingDay = j + 1 + i;
							containsDay = true;
						}
					}
				}else if(i == 22){
					if(beforeMentionTranscript[datePosition + 1] === days[0]){
						confirmedMeetingDay = 31;
						containsDay = true;
					}
				}else if(i == 21){
					confirmedMeetingDay = 30;
					containsDay = true;
				}else{
					confirmedMeetingDay = i+1;
					containsDay = true;
				}
			}
		}


		for (var i = 0; i < days.length; i++){
			var datePosition = afterMentionTranscript.indexOf(days[i]);

			if(datePosition != -1){

				if(i == 20){

					for(var j = 0; j < 9; j++){
						if(afterMentionTranscript[datePosition + 1] === days[j]){
							confirmedMeetingDay = j + 1 + i;
							containsDay = true;
						}
					}
				}else if(i == 22){
					if(afterMentionTranscript[datePosition + 1] === days[0]){
						confirmedMeetingDay = 31;
						containsDay = true;
					}
				}else if(i == 21){
					confirmedMeetingDay = 30;
					containsDay = true;
				}else{
					confirmedMeetingDay = i+1;
					containsDay = true;
				}
			}
		}


	//*************************************Date error checking**************************************
		if(confirmedMeetingMonth == "4" || confirmedMeetingMonth == "6" || confirmedMeetingMonth == "9" || confirmedMeetingMonth == "11"){
			if(confirmedMeetingDay == "31"){
				containsDay = false;
			}

		} else if(confirmedMeetingMonth == "2"){
			if(confirmedMeetingDay == "29" || confirmedMeetingDay == "30" || confirmedMeetingDay == "31"){
				containsDay = false;
			}
		}

		if(!containsMonth || !containsDay){
			console.log("Invalid Date")
		}


	//****************************************find the time***************************************

		for (var i = 0; i < times_Hours.length; i++){
			var timePosition = beforeMentionTranscript.indexOf(times_Hours[i]);

			if(timePosition != -1){
				confirmedMeetingHour = i + 1;

				for(var j = 0; j < 5; j++){
					if(beforeMentionTranscript[timePosition + 1] === times_Minutes_Partial[j]){
						confirmedMeetingMinute = (j + 1) * 10;
						containsTime = true;
					}
					break;
				}
			}
		}


		for (var i = 0; i < times_Hours.length; i++){
			var timePosition = afterMentionTranscript.indexOf(times_Hours[i]);

			if(timePosition != -1){
				confirmedMeetingHour = i + 1;

				for(var j = 0; j < 5; j++){
					if(afterMentionTranscript[timePosition + 1] === times_Minutes_Partial[j]){
						confirmedMeetingMinute = (j + 1) * 10;
						containsTime = true;
					}
				}
				break;
			}
		}
	}

	console.log(confirmedMeetingMonth);
	console.log(confirmedMeetingDay);
	console.log(confirmedMeetingHour);
	console.log(confirmedMeetingMinute);

	console.log(JSON.stringify({
		date: new Date(2016, confirmedMeetingMonth, confirmedMeetingDay, confirmedMeetingHour, confirmedMeetingMinute),
		subject: "Meeting",
		description: "Sample description"
	}));

	return {
		date: new Date(2016, confirmedMeetingMonth-1, confirmedMeetingDay, confirmedMeetingHour + 12, confirmedMeetingMinute),
		subject: "Meeting",
		description: "Sample description"
	};
};

module.exports = Analyzer;

},{}],2:[function(require,module,exports){
var MEETING_MENTION_LENGTH = 50; // number of words before/after mention to include

/*
 * This class takes in input from IBM Watson's Speech to Text API and when a meetingIndex
 * is mentioned, it calls a callback function with the context of the conversation (i.e. the
 * words leading up to the mention of the meeting and words after the meeting).
 * The meeting context is a JSON object in the following format:
 * {
 *   beforeMentionTranscript: [array of words before the meeting was mentioned],
 *   mentionTranscript: [array of words of the meeting mention],
 *   afterMentionTranscript: [array of words after the meeting was mentioned]
 * }
 *
 * TODO list:
 * search for more than just 'meeting' when trying to find a meeting mention
 * handle multple mentions of meeting keywords referencing the same meeting (i.e. no duplicate meetings)
 */
var PreAnalyzer = function(callback) {
  // this function is called whenever a meeting is mentioned. It's only parameter
  // is a json object in the format described above
  this.callback = callback;

  // array of individual words from the transcript
  this.transcript = [];
  // array of MeetingMention objects
  // objects are added when a meeting is mentioned and kept the array until 50 more words are read in
  // after 50 words are read in, the callback is called with the full context of the meeting mention
  this.currentMeetingMentions = [];
};

/**
 * Call this function for each JSON message with results that the speech to text api returns
 */
PreAnalyzer.prototype.processJson = function(json) {
  json = json['results'][0];
  if (json['final'] === true) {
    var transcript = json['alternatives'][0]['transcript'];
    var tokenizedTranscript = tokenizeTranscript(transcript);

    if (transcript.includes('meeting')) {
      var meetingIndex = tokenizedTranscript.indexOf('meeting') + this.transcript.length;// - tokenizedTranscript.length;
      var mention = new MeetingMention(meetingIndex);
      this.currentMeetingMentions.push(mention);
    }
    this.transcript = this.transcript.concat(tokenizedTranscript);

    this.updateCurrentMeetingMentions(transcript);
  }
};

/**
 * Call this function after the last speech to text result has come back from IBM
 */
PreAnalyzer.prototype.transcriptEnded = function() {
  this.currentMeetingMentions.forEach(function(mention) {
    this.callback({
      beforeMentionTranscript: mention.beforeMentionTranscript,
      mentionTranscript: mention.mentionTranscript,
      afterMentionTranscript: mention.afterMentionTranscript
    });
  }, this);
}

// Private functions. Do not call these from outside this file

PreAnalyzer.prototype.updateCurrentMeetingMentions = function(transcript) {
  for (var i = 0; i < this.currentMeetingMentions.length; i++) {
    var mention = this.currentMeetingMentions[i];
    // if the mention just happened, add the before mention and mention transcript also
    if (mention.mentionTranscript.length === 0) {
      var beforeMentionTranscriptStartIndex = Math.max(0, mention.mentionTranscriptStartIndex - MEETING_MENTION_LENGTH);
      mention.beforeMentionTranscript = this.transcript.slice(beforeMentionTranscriptStartIndex, mention.mentionTranscriptStartIndex);

      mention.mentionTranscript = [this.transcript[mention.mentionTranscriptStartIndex]];

      var afterMentionTranscriptEndIndex = Math.min(mention.mentionTranscriptStartIndex + 1 + MEETING_MENTION_LENGTH, this.transcript.length);
      mention.afterMentionTranscript = this.transcript.slice(mention.mentionTranscriptStartIndex + 1, afterMentionTranscriptEndIndex);
    } else {
      mention.afterMentionTranscript = mention.afterMentionTranscript.concat(transcript);
    }

    if (mention.afterMentionTranscript.length >= MEETING_MENTION_LENGTH) {
      // cut off any extra words
      mention.afterMentionTranscript = mention.afterMentionTranscript.slice(0, MEETING_MENTION_LENGTH);
      this.callback({
        beforeMentionTranscript: mention.beforeMentionTranscript,
        mentionTranscript: mention.mentionTranscript,
        afterMentionTranscript: mention.afterMentionTranscript
      });
      this.currentMeetingMentions.splice(i--, 1);
    }
  }
};

// private functions
function tokenizeTranscript(str) {
  var tokens = []
  var index = str.indexOf(' ');

  while (index >= 0) {
    var token = str.substring(0, index);
    tokens.push(token.trim());

    // remove word from string and update next index of a space
    str = str.substring(index + 1);
    index = str.indexOf(' ');
  }
  return tokens;
}

// MeetingMention class
var MeetingMention = function(mentionTranscriptStartIndex) {
  this.mentionTranscriptStartIndex = mentionTranscriptStartIndex;
  this.beforeMentionTranscript = []; // array of words
  this.mentionTranscript = []; // array of words
  this.afterMentionTranscript = []; // array of words
};

module.exports = PreAnalyzer;

},{}],3:[function(require,module,exports){
var SpeechToTextMock = function(callback) {
  this.callback = callback;
};

SpeechToTextMock.prototype.startListening = function(text) {
  this.callback({
    "results": [
      {
        "alternatives": [
          {
            "transcript": text.substring(0, 474),
          },
        ],
        "final": true
      }
    ],
    "result_index": 0
  });

  this.callback({
    "results": [
      {
        "alternatives": [
          {
            "transcript": text.substring(474),
          },
        ],
        "final": true
      }
    ],
    "result_index": 0
  });
};

module.exports = SpeechToTextMock;

},{}],4:[function(require,module,exports){
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

},{"../js/app/Analyzer.js":1,"../js/app/PreAnalyzer.js":2,"./SpeechToTextMock.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAvQW5hbHl6ZXIuanMiLCJqcy9hcHAvUHJlQW5hbHl6ZXIuanMiLCJwdWJsaWMvU3BlZWNoVG9UZXh0TW9jay5qcyIsInB1YmxpYy9kZW1vQXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiBUaGlzIGNsYXNzIHRha2VzIGluIGlucHV0IGZyb20gdGhlIFByZUFuYWx5ZXIsIGFuZCBvdXRwdXRzIHRoZSBwcm9jZXNzZWQgZGF0YSB0byBSZXBvcnRpbmcsIHZpYSB0aGUgcHJvdmlkZWQgY2FsbGJhY2suXG4gUGFyYW1ldGVyc1xuXHRcdHtcblx0XHRcdFwiZGF0ZVwiOiA8RGF0ZSBvYmplY3Q+LFxuXHRcdFx0XCJ0aW1lXCI6IFwidGltZSBzdHJpbmdcIixcblx0XHRcdFwic3ViamVjdFwiOiBcImV4YW1wbGUgc3ViamVjdFwiLFxuXHRcdFx0XCJkZXNjcmlwdGlvblwiOiBcImV4YW1wbGUgZGVzY3JpcHRpb25cIlxuXHRcdH1cbiovXG52YXIgQW5hbHl6ZXIgPSBmdW5jdGlvbigpIHtcblxufTtcblxuLyoqXG5cbiBQYXJhbWV0ZXJzXG5cdGpzb24gLSB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0XG5cdFx0e1xuXHRcdFx0YmVmb3JlTWVudGlvblRyYW5zY3JpcHQ6IFthcnJheSBvZiBzdHJpbmdzXSxcblx0XHRcdG1lbnRpb25UcmFuc2NyaXB0OiBbYXJyYXkgb2Ygc3RyaW5nc10sXG5cdFx0XHRhZnRlck1lbnRpb25UcmFuc2NyaXB0OiBbYXJyYXkgb2Ygc3RyaW5nc11cblx0XHR9XG4qL1xuQW5hbHl6ZXIucHJvdG90eXBlLmhhbmRsZU1lbnRpb24gPSBmdW5jdGlvbihqc29uKSB7XG5cblx0dmFyIGJlZm9yZU1lbnRpb25UcmFuc2NyaXB0ID0ganNvbi5iZWZvcmVNZW50aW9uVHJhbnNjcmlwdDtcblx0dmFyIG1lbnRpb25UcmFuc2NyaXB0ID0ganNvbi5tZW50aW9uVHJhbnNjcmlwdDtcblx0dmFyIGFmdGVyTWVudGlvblRyYW5zY3JpcHQgPSBqc29uLmFmdGVyTWVudGlvblRyYW5zY3JpcHQ7XG5cblxuXHR2YXIgbW9udGhzID0gW1wiamFudWFyeVwiLCBcImZlYnJ1YXJ5XCIsIFwibWFyY2hcIiwgXCJhcHJpbFwiLCBcIm1heVwiLCBcImp1bmVcIiwgXCJqdWx5XCIsXG5cdCAgICAgICAgICAgICAgXCJhdWd1c3RcIiwgXCJzZXB0ZW1iZXJcIiwgXCJvY3RvYmVyXCIsIFwibm92ZW1iZXJcIiwgXCJkZWNlbWJlclwiXTtcblx0dmFyIGRheXMgPSBbXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwiZm91cnRoXCIsIFwiZmlmdGhcIiwgXCJzaXh0aFwiLCBcInNldmVudGhcIixcblx0XHQgICAgICAgICAgIFwiZWlnaHRoXCIsIFwibmludGhcIiwgXCJ0ZW50aFwiLCBcImVsZXZlbnRoXCIsIFwidHdlbGZ0aFwiLCBcInRoaXJ0ZWVudGhcIixcblx0XHQgICAgICAgICAgIFwiZm91cnRlZW50aFwiLCBcImZpZnRlZW50aFwiLCBcInNpeHRlZW50aFwiLCBcInNldmVudGVlbnRoXCIsIFwiZWlnaHRlZW50aFwiLFxuXHRcdCAgICAgICAgICAgXCJuaW5ldGVlbnRoXCIsIFwidHdlbnRpZXRoXCIsIFwidHdlbnR5XCIsIFwidGhpcnRpZXRoXCIsIFwidGhpcnR5XCJdO1xuXHR2YXIgdGltZXNfSG91cnMgPSBbXCJvbmVcIiwgXCJ0d29cIiwgXCJ0aHJlZVwiLCBcImZvdXJcIiwgXCJmaXZlXCIsIFwic2l4XCIsIFwic2V2ZW5cIiwgXCJlaWdodFwiLCBcIm5pbmVcIiwgXCJ0ZW5cIiwgXCJlbGV2ZW5cIiwgXCJ0d2VsdmVcIl07XG5cdHZhciB0aW1lc19NaW51dGVzX1BhcnRpYWwgPSBbXCJ0ZW5cIiwgXCJ0d2VudHlcIiwgXCJ0aGlydHlcIiwgXCJmb3VydHlcIiwgXCJmaWZ0eVwiXTtcblxuXG5cblx0dmFyIGNvbnRhaW5zTW9udGggPSBmYWxzZTtcblx0dmFyIGNvbnRhaW5zRGF5ID0gZmFsc2U7XG5cdHZhciBjb250YWluc1RpbWUgPSBmYWxzZTtcblxuXG5cdHZhciBjb25maXJtZWRNZWV0aW5nTW9udGg7XG5cdHZhciBjb25maXJtZWRNZWV0aW5nRGF5O1xuXHR2YXIgY29uZmlybWVkTWVldGluZ0hvdXI7XG5cdHZhciBjb25maXJtZWRNZWV0aW5nTWludXRlO1xuXG5cdGlmKG1lbnRpb25UcmFuc2NyaXB0LmluZGV4T2YoXCJtZWV0aW5nXCIpICE9IC0xKXtcblx0Ly8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKnNlYXJjaCBmb3IgbW9udGgqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9udGhzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmKGJlZm9yZU1lbnRpb25UcmFuc2NyaXB0LmluZGV4T2YobW9udGhzW2ldKSAhPSAtMSl7XG5cdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdNb250aCA9IGkrMTtcblx0XHRcdFx0Y29udGFpbnNNb250aCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vbnRocy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZihhZnRlck1lbnRpb25UcmFuc2NyaXB0LmluZGV4T2YobW9udGhzW2ldKSAhPSAtMSl7XG5cdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdNb250aCA9IGkrMTtcblx0XHRcdFx0Y29udGFpbnNNb250aCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0Ly8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqZmluZCB0aGUgZGF5KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXlzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBkYXRlUG9zaXRpb24gPSBiZWZvcmVNZW50aW9uVHJhbnNjcmlwdC5pbmRleE9mKGRheXNbaV0pO1xuXG5cdFx0XHRpZihkYXRlUG9zaXRpb24gIT0gLTEpe1xuXG5cdFx0XHRcdGlmKGkgPT0gMjApe1xuXHRcdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCA5OyBqKyspe1xuXHRcdFx0XHRcdFx0aWYoYmVmb3JlTWVudGlvblRyYW5zY3JpcHRbZGF0ZVBvc2l0aW9uICsgMV0gPT09IGRheXNbal0pe1xuXHRcdFx0XHRcdFx0XHRjb25maXJtZWRNZWV0aW5nRGF5ID0gaiArIDEgKyBpO1xuXHRcdFx0XHRcdFx0XHRjb250YWluc0RheSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZihpID09IDIyKXtcblx0XHRcdFx0XHRpZihiZWZvcmVNZW50aW9uVHJhbnNjcmlwdFtkYXRlUG9zaXRpb24gKyAxXSA9PT0gZGF5c1swXSl7XG5cdFx0XHRcdFx0XHRjb25maXJtZWRNZWV0aW5nRGF5ID0gMzE7XG5cdFx0XHRcdFx0XHRjb250YWluc0RheSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZihpID09IDIxKXtcblx0XHRcdFx0XHRjb25maXJtZWRNZWV0aW5nRGF5ID0gMzA7XG5cdFx0XHRcdFx0Y29udGFpbnNEYXkgPSB0cnVlO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRjb25maXJtZWRNZWV0aW5nRGF5ID0gaSsxO1xuXHRcdFx0XHRcdGNvbnRhaW5zRGF5ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXlzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBkYXRlUG9zaXRpb24gPSBhZnRlck1lbnRpb25UcmFuc2NyaXB0LmluZGV4T2YoZGF5c1tpXSk7XG5cblx0XHRcdGlmKGRhdGVQb3NpdGlvbiAhPSAtMSl7XG5cblx0XHRcdFx0aWYoaSA9PSAyMCl7XG5cblx0XHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgOTsgaisrKXtcblx0XHRcdFx0XHRcdGlmKGFmdGVyTWVudGlvblRyYW5zY3JpcHRbZGF0ZVBvc2l0aW9uICsgMV0gPT09IGRheXNbal0pe1xuXHRcdFx0XHRcdFx0XHRjb25maXJtZWRNZWV0aW5nRGF5ID0gaiArIDEgKyBpO1xuXHRcdFx0XHRcdFx0XHRjb250YWluc0RheSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZihpID09IDIyKXtcblx0XHRcdFx0XHRpZihhZnRlck1lbnRpb25UcmFuc2NyaXB0W2RhdGVQb3NpdGlvbiArIDFdID09PSBkYXlzWzBdKXtcblx0XHRcdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdEYXkgPSAzMTtcblx0XHRcdFx0XHRcdGNvbnRhaW5zRGF5ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNlIGlmKGkgPT0gMjEpe1xuXHRcdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdEYXkgPSAzMDtcblx0XHRcdFx0XHRjb250YWluc0RheSA9IHRydWU7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdEYXkgPSBpKzE7XG5cdFx0XHRcdFx0Y29udGFpbnNEYXkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0Ly8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqRGF0ZSBlcnJvciBjaGVja2luZyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0aWYoY29uZmlybWVkTWVldGluZ01vbnRoID09IFwiNFwiIHx8IGNvbmZpcm1lZE1lZXRpbmdNb250aCA9PSBcIjZcIiB8fCBjb25maXJtZWRNZWV0aW5nTW9udGggPT0gXCI5XCIgfHwgY29uZmlybWVkTWVldGluZ01vbnRoID09IFwiMTFcIil7XG5cdFx0XHRpZihjb25maXJtZWRNZWV0aW5nRGF5ID09IFwiMzFcIil7XG5cdFx0XHRcdGNvbnRhaW5zRGF5ID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2UgaWYoY29uZmlybWVkTWVldGluZ01vbnRoID09IFwiMlwiKXtcblx0XHRcdGlmKGNvbmZpcm1lZE1lZXRpbmdEYXkgPT0gXCIyOVwiIHx8IGNvbmZpcm1lZE1lZXRpbmdEYXkgPT0gXCIzMFwiIHx8IGNvbmZpcm1lZE1lZXRpbmdEYXkgPT0gXCIzMVwiKXtcblx0XHRcdFx0Y29udGFpbnNEYXkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZighY29udGFpbnNNb250aCB8fCAhY29udGFpbnNEYXkpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJJbnZhbGlkIERhdGVcIilcblx0XHR9XG5cblxuXHQvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipmaW5kIHRoZSB0aW1lKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzX0hvdXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciB0aW1lUG9zaXRpb24gPSBiZWZvcmVNZW50aW9uVHJhbnNjcmlwdC5pbmRleE9mKHRpbWVzX0hvdXJzW2ldKTtcblxuXHRcdFx0aWYodGltZVBvc2l0aW9uICE9IC0xKXtcblx0XHRcdFx0Y29uZmlybWVkTWVldGluZ0hvdXIgPSBpICsgMTtcblxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgNTsgaisrKXtcblx0XHRcdFx0XHRpZihiZWZvcmVNZW50aW9uVHJhbnNjcmlwdFt0aW1lUG9zaXRpb24gKyAxXSA9PT0gdGltZXNfTWludXRlc19QYXJ0aWFsW2pdKXtcblx0XHRcdFx0XHRcdGNvbmZpcm1lZE1lZXRpbmdNaW51dGUgPSAoaiArIDEpICogMTA7XG5cdFx0XHRcdFx0XHRjb250YWluc1RpbWUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lc19Ib3Vycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgdGltZVBvc2l0aW9uID0gYWZ0ZXJNZW50aW9uVHJhbnNjcmlwdC5pbmRleE9mKHRpbWVzX0hvdXJzW2ldKTtcblxuXHRcdFx0aWYodGltZVBvc2l0aW9uICE9IC0xKXtcblx0XHRcdFx0Y29uZmlybWVkTWVldGluZ0hvdXIgPSBpICsgMTtcblxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgNTsgaisrKXtcblx0XHRcdFx0XHRpZihhZnRlck1lbnRpb25UcmFuc2NyaXB0W3RpbWVQb3NpdGlvbiArIDFdID09PSB0aW1lc19NaW51dGVzX1BhcnRpYWxbal0pe1xuXHRcdFx0XHRcdFx0Y29uZmlybWVkTWVldGluZ01pbnV0ZSA9IChqICsgMSkgKiAxMDtcblx0XHRcdFx0XHRcdGNvbnRhaW5zVGltZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnNvbGUubG9nKGNvbmZpcm1lZE1lZXRpbmdNb250aCk7XG5cdGNvbnNvbGUubG9nKGNvbmZpcm1lZE1lZXRpbmdEYXkpO1xuXHRjb25zb2xlLmxvZyhjb25maXJtZWRNZWV0aW5nSG91cik7XG5cdGNvbnNvbGUubG9nKGNvbmZpcm1lZE1lZXRpbmdNaW51dGUpO1xuXG5cdGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgyMDE2LCBjb25maXJtZWRNZWV0aW5nTW9udGgsIGNvbmZpcm1lZE1lZXRpbmdEYXksIGNvbmZpcm1lZE1lZXRpbmdIb3VyLCBjb25maXJtZWRNZWV0aW5nTWludXRlKSxcblx0XHRzdWJqZWN0OiBcIk1lZXRpbmdcIixcblx0XHRkZXNjcmlwdGlvbjogXCJTYW1wbGUgZGVzY3JpcHRpb25cIlxuXHR9KSk7XG5cblx0cmV0dXJuIHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgyMDE2LCBjb25maXJtZWRNZWV0aW5nTW9udGgtMSwgY29uZmlybWVkTWVldGluZ0RheSwgY29uZmlybWVkTWVldGluZ0hvdXIgKyAxMiwgY29uZmlybWVkTWVldGluZ01pbnV0ZSksXG5cdFx0c3ViamVjdDogXCJNZWV0aW5nXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiU2FtcGxlIGRlc2NyaXB0aW9uXCJcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5hbHl6ZXI7XG4iLCJ2YXIgTUVFVElOR19NRU5USU9OX0xFTkdUSCA9IDUwOyAvLyBudW1iZXIgb2Ygd29yZHMgYmVmb3JlL2FmdGVyIG1lbnRpb24gdG8gaW5jbHVkZVxuXG4vKlxuICogVGhpcyBjbGFzcyB0YWtlcyBpbiBpbnB1dCBmcm9tIElCTSBXYXRzb24ncyBTcGVlY2ggdG8gVGV4dCBBUEkgYW5kIHdoZW4gYSBtZWV0aW5nSW5kZXhcbiAqIGlzIG1lbnRpb25lZCwgaXQgY2FsbHMgYSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIHRoZSBjb250ZXh0IG9mIHRoZSBjb252ZXJzYXRpb24gKGkuZS4gdGhlXG4gKiB3b3JkcyBsZWFkaW5nIHVwIHRvIHRoZSBtZW50aW9uIG9mIHRoZSBtZWV0aW5nIGFuZCB3b3JkcyBhZnRlciB0aGUgbWVldGluZykuXG4gKiBUaGUgbWVldGluZyBjb250ZXh0IGlzIGEgSlNPTiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gKiB7XG4gKiAgIGJlZm9yZU1lbnRpb25UcmFuc2NyaXB0OiBbYXJyYXkgb2Ygd29yZHMgYmVmb3JlIHRoZSBtZWV0aW5nIHdhcyBtZW50aW9uZWRdLFxuICogICBtZW50aW9uVHJhbnNjcmlwdDogW2FycmF5IG9mIHdvcmRzIG9mIHRoZSBtZWV0aW5nIG1lbnRpb25dLFxuICogICBhZnRlck1lbnRpb25UcmFuc2NyaXB0OiBbYXJyYXkgb2Ygd29yZHMgYWZ0ZXIgdGhlIG1lZXRpbmcgd2FzIG1lbnRpb25lZF1cbiAqIH1cbiAqXG4gKiBUT0RPIGxpc3Q6XG4gKiBzZWFyY2ggZm9yIG1vcmUgdGhhbiBqdXN0ICdtZWV0aW5nJyB3aGVuIHRyeWluZyB0byBmaW5kIGEgbWVldGluZyBtZW50aW9uXG4gKiBoYW5kbGUgbXVsdHBsZSBtZW50aW9ucyBvZiBtZWV0aW5nIGtleXdvcmRzIHJlZmVyZW5jaW5nIHRoZSBzYW1lIG1lZXRpbmcgKGkuZS4gbm8gZHVwbGljYXRlIG1lZXRpbmdzKVxuICovXG52YXIgUHJlQW5hbHl6ZXIgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAvLyB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuZXZlciBhIG1lZXRpbmcgaXMgbWVudGlvbmVkLiBJdCdzIG9ubHkgcGFyYW1ldGVyXG4gIC8vIGlzIGEganNvbiBvYmplY3QgaW4gdGhlIGZvcm1hdCBkZXNjcmliZWQgYWJvdmVcbiAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gIC8vIGFycmF5IG9mIGluZGl2aWR1YWwgd29yZHMgZnJvbSB0aGUgdHJhbnNjcmlwdFxuICB0aGlzLnRyYW5zY3JpcHQgPSBbXTtcbiAgLy8gYXJyYXkgb2YgTWVldGluZ01lbnRpb24gb2JqZWN0c1xuICAvLyBvYmplY3RzIGFyZSBhZGRlZCB3aGVuIGEgbWVldGluZyBpcyBtZW50aW9uZWQgYW5kIGtlcHQgdGhlIGFycmF5IHVudGlsIDUwIG1vcmUgd29yZHMgYXJlIHJlYWQgaW5cbiAgLy8gYWZ0ZXIgNTAgd29yZHMgYXJlIHJlYWQgaW4sIHRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgZnVsbCBjb250ZXh0IG9mIHRoZSBtZWV0aW5nIG1lbnRpb25cbiAgdGhpcy5jdXJyZW50TWVldGluZ01lbnRpb25zID0gW107XG59O1xuXG4vKipcbiAqIENhbGwgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBKU09OIG1lc3NhZ2Ugd2l0aCByZXN1bHRzIHRoYXQgdGhlIHNwZWVjaCB0byB0ZXh0IGFwaSByZXR1cm5zXG4gKi9cblByZUFuYWx5emVyLnByb3RvdHlwZS5wcm9jZXNzSnNvbiA9IGZ1bmN0aW9uKGpzb24pIHtcbiAganNvbiA9IGpzb25bJ3Jlc3VsdHMnXVswXTtcbiAgaWYgKGpzb25bJ2ZpbmFsJ10gPT09IHRydWUpIHtcbiAgICB2YXIgdHJhbnNjcmlwdCA9IGpzb25bJ2FsdGVybmF0aXZlcyddWzBdWyd0cmFuc2NyaXB0J107XG4gICAgdmFyIHRva2VuaXplZFRyYW5zY3JpcHQgPSB0b2tlbml6ZVRyYW5zY3JpcHQodHJhbnNjcmlwdCk7XG5cbiAgICBpZiAodHJhbnNjcmlwdC5pbmNsdWRlcygnbWVldGluZycpKSB7XG4gICAgICB2YXIgbWVldGluZ0luZGV4ID0gdG9rZW5pemVkVHJhbnNjcmlwdC5pbmRleE9mKCdtZWV0aW5nJykgKyB0aGlzLnRyYW5zY3JpcHQubGVuZ3RoOy8vIC0gdG9rZW5pemVkVHJhbnNjcmlwdC5sZW5ndGg7XG4gICAgICB2YXIgbWVudGlvbiA9IG5ldyBNZWV0aW5nTWVudGlvbihtZWV0aW5nSW5kZXgpO1xuICAgICAgdGhpcy5jdXJyZW50TWVldGluZ01lbnRpb25zLnB1c2gobWVudGlvbik7XG4gICAgfVxuICAgIHRoaXMudHJhbnNjcmlwdCA9IHRoaXMudHJhbnNjcmlwdC5jb25jYXQodG9rZW5pemVkVHJhbnNjcmlwdCk7XG5cbiAgICB0aGlzLnVwZGF0ZUN1cnJlbnRNZWV0aW5nTWVudGlvbnModHJhbnNjcmlwdCk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2FsbCB0aGlzIGZ1bmN0aW9uIGFmdGVyIHRoZSBsYXN0IHNwZWVjaCB0byB0ZXh0IHJlc3VsdCBoYXMgY29tZSBiYWNrIGZyb20gSUJNXG4gKi9cblByZUFuYWx5emVyLnByb3RvdHlwZS50cmFuc2NyaXB0RW5kZWQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jdXJyZW50TWVldGluZ01lbnRpb25zLmZvckVhY2goZnVuY3Rpb24obWVudGlvbikge1xuICAgIHRoaXMuY2FsbGJhY2soe1xuICAgICAgYmVmb3JlTWVudGlvblRyYW5zY3JpcHQ6IG1lbnRpb24uYmVmb3JlTWVudGlvblRyYW5zY3JpcHQsXG4gICAgICBtZW50aW9uVHJhbnNjcmlwdDogbWVudGlvbi5tZW50aW9uVHJhbnNjcmlwdCxcbiAgICAgIGFmdGVyTWVudGlvblRyYW5zY3JpcHQ6IG1lbnRpb24uYWZ0ZXJNZW50aW9uVHJhbnNjcmlwdFxuICAgIH0pO1xuICB9LCB0aGlzKTtcbn1cblxuLy8gUHJpdmF0ZSBmdW5jdGlvbnMuIERvIG5vdCBjYWxsIHRoZXNlIGZyb20gb3V0c2lkZSB0aGlzIGZpbGVcblxuUHJlQW5hbHl6ZXIucHJvdG90eXBlLnVwZGF0ZUN1cnJlbnRNZWV0aW5nTWVudGlvbnMgPSBmdW5jdGlvbih0cmFuc2NyaXB0KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jdXJyZW50TWVldGluZ01lbnRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1lbnRpb24gPSB0aGlzLmN1cnJlbnRNZWV0aW5nTWVudGlvbnNbaV07XG4gICAgLy8gaWYgdGhlIG1lbnRpb24ganVzdCBoYXBwZW5lZCwgYWRkIHRoZSBiZWZvcmUgbWVudGlvbiBhbmQgbWVudGlvbiB0cmFuc2NyaXB0IGFsc29cbiAgICBpZiAobWVudGlvbi5tZW50aW9uVHJhbnNjcmlwdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBiZWZvcmVNZW50aW9uVHJhbnNjcmlwdFN0YXJ0SW5kZXggPSBNYXRoLm1heCgwLCBtZW50aW9uLm1lbnRpb25UcmFuc2NyaXB0U3RhcnRJbmRleCAtIE1FRVRJTkdfTUVOVElPTl9MRU5HVEgpO1xuICAgICAgbWVudGlvbi5iZWZvcmVNZW50aW9uVHJhbnNjcmlwdCA9IHRoaXMudHJhbnNjcmlwdC5zbGljZShiZWZvcmVNZW50aW9uVHJhbnNjcmlwdFN0YXJ0SW5kZXgsIG1lbnRpb24ubWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4KTtcblxuICAgICAgbWVudGlvbi5tZW50aW9uVHJhbnNjcmlwdCA9IFt0aGlzLnRyYW5zY3JpcHRbbWVudGlvbi5tZW50aW9uVHJhbnNjcmlwdFN0YXJ0SW5kZXhdXTtcblxuICAgICAgdmFyIGFmdGVyTWVudGlvblRyYW5zY3JpcHRFbmRJbmRleCA9IE1hdGgubWluKG1lbnRpb24ubWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4ICsgMSArIE1FRVRJTkdfTUVOVElPTl9MRU5HVEgsIHRoaXMudHJhbnNjcmlwdC5sZW5ndGgpO1xuICAgICAgbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0ID0gdGhpcy50cmFuc2NyaXB0LnNsaWNlKG1lbnRpb24ubWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4ICsgMSwgYWZ0ZXJNZW50aW9uVHJhbnNjcmlwdEVuZEluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0ID0gbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0LmNvbmNhdCh0cmFuc2NyaXB0KTtcbiAgICB9XG5cbiAgICBpZiAobWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0Lmxlbmd0aCA+PSBNRUVUSU5HX01FTlRJT05fTEVOR1RIKSB7XG4gICAgICAvLyBjdXQgb2ZmIGFueSBleHRyYSB3b3Jkc1xuICAgICAgbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0ID0gbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0LnNsaWNlKDAsIE1FRVRJTkdfTUVOVElPTl9MRU5HVEgpO1xuICAgICAgdGhpcy5jYWxsYmFjayh7XG4gICAgICAgIGJlZm9yZU1lbnRpb25UcmFuc2NyaXB0OiBtZW50aW9uLmJlZm9yZU1lbnRpb25UcmFuc2NyaXB0LFxuICAgICAgICBtZW50aW9uVHJhbnNjcmlwdDogbWVudGlvbi5tZW50aW9uVHJhbnNjcmlwdCxcbiAgICAgICAgYWZ0ZXJNZW50aW9uVHJhbnNjcmlwdDogbWVudGlvbi5hZnRlck1lbnRpb25UcmFuc2NyaXB0XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY3VycmVudE1lZXRpbmdNZW50aW9ucy5zcGxpY2UoaS0tLCAxKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIHByaXZhdGUgZnVuY3Rpb25zXG5mdW5jdGlvbiB0b2tlbml6ZVRyYW5zY3JpcHQoc3RyKSB7XG4gIHZhciB0b2tlbnMgPSBbXVxuICB2YXIgaW5kZXggPSBzdHIuaW5kZXhPZignICcpO1xuXG4gIHdoaWxlIChpbmRleCA+PSAwKSB7XG4gICAgdmFyIHRva2VuID0gc3RyLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgdG9rZW5zLnB1c2godG9rZW4udHJpbSgpKTtcblxuICAgIC8vIHJlbW92ZSB3b3JkIGZyb20gc3RyaW5nIGFuZCB1cGRhdGUgbmV4dCBpbmRleCBvZiBhIHNwYWNlXG4gICAgc3RyID0gc3RyLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgIGluZGV4ID0gc3RyLmluZGV4T2YoJyAnKTtcbiAgfVxuICByZXR1cm4gdG9rZW5zO1xufVxuXG4vLyBNZWV0aW5nTWVudGlvbiBjbGFzc1xudmFyIE1lZXRpbmdNZW50aW9uID0gZnVuY3Rpb24obWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4KSB7XG4gIHRoaXMubWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4ID0gbWVudGlvblRyYW5zY3JpcHRTdGFydEluZGV4O1xuICB0aGlzLmJlZm9yZU1lbnRpb25UcmFuc2NyaXB0ID0gW107IC8vIGFycmF5IG9mIHdvcmRzXG4gIHRoaXMubWVudGlvblRyYW5zY3JpcHQgPSBbXTsgLy8gYXJyYXkgb2Ygd29yZHNcbiAgdGhpcy5hZnRlck1lbnRpb25UcmFuc2NyaXB0ID0gW107IC8vIGFycmF5IG9mIHdvcmRzXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByZUFuYWx5emVyO1xuIiwidmFyIFNwZWVjaFRvVGV4dE1vY2sgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG59O1xuXG5TcGVlY2hUb1RleHRNb2NrLnByb3RvdHlwZS5zdGFydExpc3RlbmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgdGhpcy5jYWxsYmFjayh7XG4gICAgXCJyZXN1bHRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJhbHRlcm5hdGl2ZXNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidHJhbnNjcmlwdFwiOiB0ZXh0LnN1YnN0cmluZygwLCA0NzQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFwiZmluYWxcIjogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgXCJyZXN1bHRfaW5kZXhcIjogMFxuICB9KTtcblxuICB0aGlzLmNhbGxiYWNrKHtcbiAgICBcInJlc3VsdHNcIjogW1xuICAgICAge1xuICAgICAgICBcImFsdGVybmF0aXZlc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0cmFuc2NyaXB0XCI6IHRleHQuc3Vic3RyaW5nKDQ3NCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgXCJmaW5hbFwiOiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBcInJlc3VsdF9pbmRleFwiOiAwXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcGVlY2hUb1RleHRNb2NrO1xuIiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtZWV0aW5nYXNzaXN0YW50JywgW10pO1xudmFyIFNwZWVjaFRvVGV4dE1vY2sgPSByZXF1aXJlKCcuL1NwZWVjaFRvVGV4dE1vY2suanMnKTtcbnZhciBQcmVBbmFseXplciA9IHJlcXVpcmUoJy4uL2pzL2FwcC9QcmVBbmFseXplci5qcycpO1xudmFyIEFuYWx5emVyID0gcmVxdWlyZSgnLi4vanMvYXBwL0FuYWx5emVyLmpzJyk7XG5cbmFwcC5jb250cm9sbGVyKCdNZWV0aW5nQXNzaXN0YW50Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgIHRoaXMubWVldGluZ3NMaXN0ID0gW107XG4gICAgdGhpcy5saXN0ZW5pbmcgPSBmYWxzZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvL2Z1bmN0aW9uIHRyaWdnZXJzIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAkc2NvcGUuYnRuTGlzdGVuX0NsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmluZykge1xuICAgICAgICAgICAgJCgnI2J0bkxpc3RlbicpLnRleHQoXCJTdGFydCBsaXN0ZW5pbmdcIik7XG4gICAgICAgICAgICAkKCcjYnRuTGlzdGVuJykuYWRkQ2xhc3MoXCJidG4tc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICQoJyNidG5MaXN0ZW4nKS5yZW1vdmVDbGFzcyhcImJ0bi13YXJuaW5nXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI2J0bkxpc3RlbicpLnRleHQoXCJTdG9wIGxpc3RlbmluZ1wiKTtcbiAgICAgICAgICAgICQoJyNidG5MaXN0ZW4nKS5yZW1vdmVDbGFzcyhcImJ0bi1zdWNjZXNzXCIpO1xuICAgICAgICAgICAgJCgnI2J0bkxpc3RlbicpLmFkZENsYXNzKFwiYnRuLXdhcm5pbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBhbmFseXplciA9IG5ldyBBbmFseXplcigpO1xuICAgICAgICAgICAgdmFyIHByZUFuYWx5emVyID0gbmV3IFByZUFuYWx5emVyKChmdW5jdGlvbihtZWV0aW5nTWVudGlvbikge1xuICAgICAgICAgICAgICB2YXIgbWVldGluZyA9IGFuYWx5emVyLmhhbmRsZU1lbnRpb24obWVldGluZ01lbnRpb24pO1xuICAgICAgICAgICAgICBtZWV0aW5nLmVuZGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICB0aGlzLm1lZXRpbmdzTGlzdC5wdXNoKG1lZXRpbmcpO1xuICAgICAgICAgICAgfSkuYmluZChzZWxmKSk7XG4gICAgICAgICAgICB2YXIgc3BlZWNoVG9UZXh0TW9jayA9IG5ldyBTcGVlY2hUb1RleHRNb2NrKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICAgICAgcHJlQW5hbHl6ZXIucHJvY2Vzc0pzb24oanNvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3BlZWNoVG9UZXh0TW9jay5zdGFydExpc3RlbmluZygkKCcjdGV4dCcpLnRleHQoKSk7XG4gICAgICAgICAgICBwcmVBbmFseXplci50cmFuc2NyaXB0RW5kZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGlzdGVuaW5nID0gIXRoaXMubGlzdGVuaW5nO1xuICAgIH07XG59KTtcbiJdfQ==
