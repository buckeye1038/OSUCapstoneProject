var $ = require('jquery');
var Constants = require('../Constants.js');

var AnalyzerSubjectDescriptionGetter = function(){
	
};

AnalyzerSubjectDescriptionGetter.prototype.getMeetingSubjectDescription = function(context, meetingMention, callback){
	console.log('AnalyzerSubjectDescriptionGetter.getMeetingSubject');
	that = this;
	
	$.get('/api/extract?text=' + meetingMention, function(data) {
		that.processRelationshipExtractionResponse(data, context, callback);
	});
};

// callback to pass to IBM Bluemix Relationship Extraction api
AnalyzerSubjectDescriptionGetter.prototype.processRelationshipExtractionResponse = function(response, context, callback){
	// console.log(JSON.stringify(response, null, 2)); // use this line to print the entire result if you want
	console.log('processRelationshipExtractionResponse');

	var subject = this.extractSubject(response);
	callback.bind(context)({
			subject: subject,
			description: ''
	});
};

// returns a subject extracted from the IBM Bluemix Relationship Extraction api response
AnalyzerSubjectDescriptionGetter.prototype.extractSubject = function(response){
	console.log('AnalyzerSubjectDescriptionGetter.extractSubject');

	var result = '';
	var addedWords = [];

	// iterate over sentences
	var sentences = response.doc.sents.sent;
	for(var s = 0; s < sentences.length; s++){

		// iterate over tokens
		var tokens = sentences[s].tokens.token;
		for(var t = 0; t < tokens.length; t++){

			// Inspect the tokens and their parts of speech.
			console.log(tokens[t].text + ': ' + tokens[t].POS);
		
			// if a token is a unique noun and isn't a common word
			if(this.containsNoun(tokens[t].POS) && !this.arrayContains(tokens[t].text.toLowerCase(), addedWords) && !this.isCommonWord(tokens[t].text.toLowerCase())){
				//console.log(tokens[t].text);
				
				addedWords.push(tokens[t].text.toLowerCase());

				// add the token to the result
				result += ' ' + tokens[t].text;
			}
		}
	}

	return result || 'Meeting';
};


// Checks if POS (Part of Speech) is a noun of interest. Resource: http://www.comp.leeds.ac.uk/amalgam/tagsets/upenn.html
AnalyzerSubjectDescriptionGetter.prototype.containsNoun = function(pos){
	return pos.indexOf('NN') > -1; //(pos.indexOf('NNP') > -1) || (pos.indexOf('NNS') > -1);
};

AnalyzerSubjectDescriptionGetter.prototype.isCommonWord = function(word){	
	var months = Constants.Analyzer.SearchWords.months;
	var days = Constants.Analyzer.SearchWords.days;
	var timesHours = Constants.Analyzer.SearchWords.times_Hours;
	var minutesTens = Constants.Analyzer.SearchWords.times_Minutes_Tens;
	var daysOfWeek = Constants.Analyzer.SearchWords.days_of_week;
	var meetingMentionWords = Constants.PreAnalyzer.MeetingMentionWords;
	var otherCommonWords = ['day', 'week', 'month', 'year', 'time', 'am', 'pm'];
	
	for(var i = 0; i < months.length; i++)
		if(word == months[i])
			return true;

	for(var i = 0; i < days.length; i++)
		if(word == days[i])
			return true;
		
	for(var i = 0; i < timesHours.length; i++)
		if(word == timesHours[i])
			return true;
		
	for(var i = 0; i < minutesTens.length; i++)
		if(word == minutesTens[i])
			return true;
		
	for(var i = 0; i < daysOfWeek.length; i++)
		if(word == daysOfWeek[i])
			return true;
		
	for(var i = 0; i < meetingMentionWords.length; i++)
		if(word == meetingMentionWords[i])
			return true;

	for(var i = 0; i < otherCommonWords.length; i++)
		if(word == otherCommonWords[i])
			return true;
		
	return false;
};

AnalyzerSubjectDescriptionGetter.prototype.arrayContains = function(word, arrayVal) {
	for(var i = 0; i < arrayVal.length; i++)
		if(word == arrayVal[i])
			return true;
		
	return false;
};

module.exports = AnalyzerSubjectDescriptionGetter;
