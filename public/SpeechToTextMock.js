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
