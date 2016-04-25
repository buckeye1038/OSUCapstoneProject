var Constants = require('../Constants.js');
var today = new Date();

var DateGetter = function() {

};

DateGetter.prototype.handleMention = function(transcript) {

	var transcriptNoPunct = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	var tokenizedTranscript = transcriptNoPunct.split(" ");

	//find month and day
	var confirmedMeetingMonth = MonthSearch(tokenizedTranscript);
	var confirmedMeetingDay = DaySearch(tokenizedTranscript);
	
	//find time
	var time = TimeSearch(tokenizedTranscript);
	var confirmedMeetingHour = time.hour;
	var confirmedMeetingMinute = time.minute;

	//find days of week common phrases
	var additionalDays = DaysOfWeekSearch(tokenizedTranscript);
	confirmedMeetingDay = confirmedMeetingDay + additionalDays;

	//Error checking for Errors in the found date
	//Reset day value if given day is not valid
	if(confirmedMeetingMonth == "4" || confirmedMeetingMonth == "6" || confirmedMeetingMonth == "9" || confirmedMeetingMonth == "11"){
		if(confirmedMeetingDay == "31"){
			confirmedMeetingDay = 1;
		}

	} else if(confirmedMeetingMonth == "2"){
		if(confirmedMeetingDay == "29" || confirmedMeetingDay == "30" || confirmedMeetingDay == "31"){
			confirmedMeetingDay = 1;
		}
	}

	//Return date object to main analyzer
	this.date = new Date(2016, confirmedMeetingMonth, confirmedMeetingDay, confirmedMeetingHour, confirmedMeetingMinute);
	console.log(this.date);
};

var MonthSearch = function(transcript){
	var months = Constants.Analyzer.SearchWords.months;
	var confirmedMeetingMonth = today.getMonth();
	
	for (var i = 0; i < months.length; i++){
		if(transcript.indexOf(months[i]) != -1){
			confirmedMeetingMonth = i;
		}
	}
	
	return confirmedMeetingMonth;
};

var DaySearch = function(transcript){
	var days = Constants.Analyzer.SearchWords.days;
	var confirmedMeetingDay = today.getDate();
	
	for (var i = 0; i < days.length; i++){
		var datePosition = transcript.indexOf(days[i]);

		if(datePosition != -1){

			if(i == 20){
				for(var j = 0; j < 9; j++){
					if(transcript[datePosition + 1] === days[j]){
						confirmedMeetingDay = j + 1 + i;
					}
				}
			}else if(i == 22){
				if(transcript[datePosition + 1] === days[0]){
					confirmedMeetingDay = 31;
				}
			}else if(i == 21){
				confirmedMeetingDay = 30;
			}else{
				confirmedMeetingDay = i+1;
			}
		}
	}
	
	return confirmedMeetingDay;
};

var TimeSearch = function(transcript){
	var times_Hours = Constants.Analyzer.SearchWords.times_Hours;
	var times_Minutes_Partial = Constants.Analyzer.SearchWords.times_Minutes_Tens;
	
	var confirmedMeetingHour = 0;
	var confirmedMeetingMinute = 0;
	
	for (var i = 0; i < times_Hours.length; i++){
		var timePosition = transcript.indexOf(times_Hours[i]);

		if(timePosition != -1){
			confirmedMeetingHour = i + 1;

			for(var j = 0; j < 5; j++){
				if(transcript[timePosition + 1] === times_Minutes_Partial[j]){
					confirmedMeetingMinute = (j+1)*10;
				}
			}
		}
	}
	
	var time = {
		hour: confirmedMeetingHour,
		minute: confirmedMeetingMinute
	};
	
	return time;
};

var DaysOfWeekSearch = function(transcript){
	var days_of_week = Constants.Analyzer.SearchWords.days_of_week;
	var day = 0;
	var additionalDays = 0;
	var dayMention = false;
	
	for (var i = 0; i < days_of_week.length; i++){
		var dayPos = transcript.indexOf(days_of_week[i]);

		if(dayPos != -1){
			day = i;
			dayMention = true;
			//check for "next" common phrase
			if(transcript[dayPos - 1] === "next"){
				additionalDays += 7;
			}
		}
	}
	
	if(dayMention){
		if(day >= today.getDay()){
			additionalDays += day - today.getDay();
		}else{
			additionalDays += (6-today.getDay()) + (day+1);
		}
	}

	return additionalDays;
};

module.exports = DateGetter;