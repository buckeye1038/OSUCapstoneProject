var PreAnalyzer = require('../app/PreAnalyzer.js');
var sampleSpeechToTextOutput = require('./SampleSpeechToTextOutput.js');
var assert = require('assert');

describe('PreAnalyzer', function() {
  describe('#processJson', function() {
    it('should find a meeting mention', function(done) {
      var meetingFoundCallback = function(meeting) {
        var expectedMeeting = {
          beforeMentionTranscript: ['let\'s', 'have', 'a'],
          mentionTranscript: ['meeting'],
          afterMentionTranscript: ['Tuesday', 'at', 'four', 'thirty']
        };
        assert.equal(JSON.stringify(expectedMeeting), JSON.stringify(meeting));
        done();
      };
      var preAnalyzer = new PreAnalyzer(meetingFoundCallback);

      for (var i = 0; i < sampleSpeechToTextOutput.length; i++) {
        preAnalyzer.processJson(sampleSpeechToTextOutput[i], meetingFoundCallback);
      }
      preAnalyzer.transcriptEnded(meetingFoundCallback);
    });
  });
});
