var PreAnalyzer = require('../app/PreAnalyzer.js');
var SampleSpeechToTextOutputOneMentionOneMeeting = require('./PreAnalyzerTestInputs/SampleSpeechToTextOutputOneMentionOneMeeting.js');
var SampleSpeechToTextOutputTwoMentionsOneMeeting = require('./PreAnalyzerTestInputs/SampleSpeechToTextOutputTwoMentionsOneMeeting.js');
var SampleSpeechToTextOutputTwoMentionsTwoMeetings = require('./PreAnalyzerTestInputs/SampleSpeechToTextOutputTwoMentionsTwoMeetings.js');
var assert = require('assert');

describe('PreAnalyzer', function() {
  describe('#processJson', function() {
    it('should find a single meeting mention', function(done) {
      var meetingFoundCallback = function(meeting) {
        var expectedMeeting = "let's have a meeting tuesday at four thirty";
        assert.equal(expectedMeeting, meeting);
        done();
      };
      var preAnalyzer = new PreAnalyzer(meetingFoundCallback);

      for (var i = 0; i < SampleSpeechToTextOutputOneMentionOneMeeting.length; i++) {
        preAnalyzer.processJson(SampleSpeechToTextOutputOneMentionOneMeeting[i], meetingFoundCallback);
      }
      preAnalyzer.transcriptEnded(meetingFoundCallback);
    });

    it('should find only one meeting mention when 2 meeting keywords are mentioned in succession', function(done) {
      var numCallbacks = 0;
      var meetingFoundCallback = function(meeting) {
        var expectedMeeting = "let's have a meeting tuesday at four thirty. we'll meet to discuss the upcoming launch";
        assert.equal(expectedMeeting, meeting);

        numCallbacks++;
        setTimeout(function() {
          assert.equal(1, numCallbacks);
          done();
        }, 10);
      };
      var preAnalyzer = new PreAnalyzer(meetingFoundCallback);

      for (var i = 0; i < SampleSpeechToTextOutputTwoMentionsOneMeeting.length; i++) {
        preAnalyzer.processJson(SampleSpeechToTextOutputTwoMentionsOneMeeting[i], meetingFoundCallback);
      }
      preAnalyzer.transcriptEnded(meetingFoundCallback);
    });

    it('should find two meeting mentions when 2 meeting keywords are not mentioned in succession', function(done) {
      var numCallbacks = 0;
      var meetingFoundCallback = function(meeting) {
        numCallbacks++;
        if (numCallbacks == 1) {
          var expectedMeeting = "let's have a meeting tuesday at four thirty. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit";
          assert.equal(expectedMeeting, meeting);
        } else {
          var expectedMeeting = "ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. we'll meet to discuss the upcoming launch";
          assert.equal(expectedMeeting, meeting);
          done();
        }
      };
      var preAnalyzer = new PreAnalyzer(meetingFoundCallback);

      for (var i = 0; i < SampleSpeechToTextOutputTwoMentionsTwoMeetings.length; i++) {
        preAnalyzer.processJson(SampleSpeechToTextOutputTwoMentionsTwoMeetings[i], meetingFoundCallback);
      }
      preAnalyzer.transcriptEnded(meetingFoundCallback);
    });
  });
});

