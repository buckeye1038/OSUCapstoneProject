var Meeting = require('./Meeting.js');
var Constants = require('./Constants.js');

var MEETING_MENTION_LENGTH = 50; // number of words before/after mention to include

/*
 * This class takes in input from IBM Watson's Speech to Text API and when a meetingIndex
 * is mentioned, it calls a callback function with the context of the conversation (i.e. the
 * words leading up to the mention of the meeting and words after the meeting) once a meeting
 * is mentioned.
 * The meeting context is a MeetingMention object.
 *
 * TODO list:
 * search for more than just 'meeting' when trying to find a meeting mention
 * handle multple mentions of meeting keywords referencing the same meeting (i.e. no duplicate meetings)
 */
var PreAnalyzer = function(callback) {
  // this function is called whenever a meeting is mentioned. It's only parameter is a MeetingMention object
  this.callback = callback;

  // string of the entire transcript
  this.transcript = "";

  // when a meeting keyword is mentioned, a MeetingMention object is created to
  // keep track of the transcript surrounding the mention. Once the conversation
  // about the meeting is over (i.e. after 50 words w/o the mention of another
  // meeting keyword), this property is set to null until another meeting keyword mentioned
  this.currentMeetingMention = null;
};

/**
 * Call this function for each JSON message with results that the speech to text api returns
 */
PreAnalyzer.prototype.processJson = function(json) {
  json = json['results'][0];
  if (json['final'] === true) {
    var transcript = parseTranscript(json['alternatives'][0]['transcript']);

    if (!this.currentMeetingMention) {
      var index = getFirstIndexOfMeetingMention(transcript);
      if (index >= 0) {
        // + 1 for the space added below
        this.currentMeetingMention = new MeetingMention(this.transcript.length + 1 + index);
      }
    }

    this.transcript += " " + transcript;
    this.updateCurrentMeetingMention(transcript);
  }
};

/**
 * Call this function after the last speech to text result has come back from IBM
 */
PreAnalyzer.prototype.transcriptEnded = function() {
  if (this.currentMeetingMention) {
    this.callCallback();
  }
}

// Private functions

PreAnalyzer.prototype.updateCurrentMeetingMention = function(transcript) {
  if (!this.currentMeetingMention) { return; }

  if (getLastIndexOfMeetingMention(transcript) >= 0) {
    var index = getLastIndexOfMeetingMention(this.transcript);
    if (index != this.currentMeetingMention.firstMentionIndex) {
      this.currentMeetingMention.lastMentionIndex = index;
    }
  }

  // if we have enough context about the meeting, call the callback with the context
  if (getIndexOfFutureWordFromIndex(this.transcript, this.currentMeetingMention.lastMentionIndex, MEETING_MENTION_LENGTH) >= 0) {
    this.callCallback();
  }
};

PreAnalyzer.prototype.callCallback = function() {
  var beginIndex = getIndexOfPastWordFromIndex(this.transcript, this.currentMeetingMention.firstMentionIndex, MEETING_MENTION_LENGTH);
  var endIndex = getIndexOfFutureWordFromIndex(this.transcript, this.currentMeetingMention.lastMentionIndex || this.currentMeetingMention.firstMentionIndex, MEETING_MENTION_LENGTH);
  if (endIndex == -1) { // if not enough words, send what we have
    endIndex = this.transcript.length;
  }

  this.callback(this.transcript.substring(beginIndex, endIndex).trim());
  this.currentMeetingMention = null;
}

// private functions

// standarizes the transcript text
// list of what this function does:
//   - lower cases all words
function parseTranscript(str) {
  return str.toLowerCase();
}


function getFirstIndexOfMeetingMention(str) {
  return Math.min.apply(null, getMeetingMentionIndices(str));
}

function getLastIndexOfMeetingMention(str) {
  return Math.max.apply(null, getMeetingMentionIndices(str));
}

function getMeetingMentionIndices(str) {
  var mentionIndices = [];
  var mentionWords = Constants.PreAnalyzer.MeetingMentionWords;
  for (var i = 0; i < mentionWords.length; i++) {
    if (str.includes(mentionWords[i])) {
      // bug: doesn't find all occurances
      // mentionIndices.push(str.indexOf(mentionWords[i]));
      var indices = indicesOf(str, ' ' + mentionWords[i] + '[ ,.?!\'"-]');
      for (var j = 0; j < indices.length; j++) {
        mentionIndices.push(indices[j]);
      }
    }
  }
  return mentionIndices;
}

// returns the index in `str` of `numWords` words away from `index`
// -1 is returned if `str` doesn't have `numWords` words in it past `index`
function getIndexOfFutureWordFromIndex(str, index, numWords) {
  // start at -1 since the first space is only for the word that is a meeting mention, so don't count it
  var wordsCount = -1;
  for (var i = index; i < str.length; i++) {
    if (str.charAt(i) === ' ') {
      wordsCount++;
      if (wordsCount >= numWords) {
        return i;
      }
    }
  }
  return -1;
}

// returns the index in `str` of `numWords` words before `index`
// 0 is returned if `str` doesn't have `numWords` words in it before `index`
function getIndexOfPastWordFromIndex(str, index, numWords) {
  var wordsCount = 0;
  for (var i = index; i >= 0; i--) {
    if (str.charAt(i) === ' ') {
      wordsCount++;
      if (wordsCount >= numWords) {
        return i;
      }
    }
  }
  return 0;
}

// returns all indices of `regex` in `string`. regex is a string, not a regex object
function indicesOf(string, regex) {
  var match;
  var indices = [];

  regex = new RegExp(regex);
  while (match = regex.exec(string)) {
    indices.push(match.index);
    string = string.substring(match.index + 1);
  }
  return indices;
}

// Meeting mention class
var MeetingMention = function(transcriptMentionIndex) {
  this.firstMentionIndex = transcriptMentionIndex;
  this.lastMentionIndex = null;
}

module.exports = PreAnalyzer;
