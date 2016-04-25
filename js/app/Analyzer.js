var AnalyzerSubjectDescriptionGetter = require('./Analyzer/AnalyzerSubjectDescriptionGetter.js');
var analyzerSubjectDescriptionGetter = new AnalyzerSubjectDescriptionGetter();
var DateGetter = require('./Analyzer/AnalyzerDateGetter.js');
var dateGetter = new DateGetter();

var Analyzer = function() {

};

Analyzer.prototype.handleMention = function(mention, callback) {
	console.log('Analyzer.handleMention');

	this.callback = callback;

	dateGetter.handleMention(mention)
	this.date = dateGetter.date;
	this.description = mention;

	// only allow times of meetings to be between 7am and 6pm
	if (this.date.getHours() < 7) {
		this.date = new Date(this.date.getTime() + (12 * 60 * 60 * 1000));
	}

	analyzerSubjectDescriptionGetter.getMeetingSubjectDescription(this, mention, this.subjectDescriptionCallback);
};

Analyzer.prototype.subjectDescriptionCallback = function(subjectDescription){
	console.log('Analyzer.subjectCallback');

	this.callback({
		date: this.date,
		subject: subjectDescription.subject,
		description: this.description
	});
};

module.exports = Analyzer;
