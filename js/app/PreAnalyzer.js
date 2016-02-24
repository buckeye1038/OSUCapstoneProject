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
