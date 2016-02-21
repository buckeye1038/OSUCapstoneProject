/**
 This class takes in input from the PreAnalyer, and outputs the processed data to the UI controller, via the provided callback.
 Parameters
	callback - function with one parameter in the following format
		{
			"date": <Date object>,
			"subject": "example subject",
			"description": "example description"
		}
*/
var Analyzer = function(callback) {
  this.callback = callback; // called whenever a meeting is processed
};

/**
 Callback function to pass to PreAnalyzer. Processes a meeting, and passes it to the callback.
 Parameters
	json - with the following format
		{
			beforeMentionTranscript: [array of strings],
			mentionTranscript: [array of strings],
			afterMentionTranscript: [array of strings]
		}
*/
Analyzer.prototype.processJson = function(json) {
	this.analyze(json);
};

// private functions
Analyzer.prototype.analyze = function(json) {
	this.callback({
		date: new Date(),
		subject: "example subject",
		description: "example description"
	});
}

module.exports = Analyzer;