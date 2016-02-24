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
