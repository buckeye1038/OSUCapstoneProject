module.exports = {
  Analyzer: {
    SearchWords: {
    	months: ["january", "february", "march", "april", "may", "june", "july",
                  "august", "september", "october", "november", "december"],
    	days: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh",
    	           "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
    	           "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
    	           "nineteenth", "twentieth", "twenty", "thirtieth", "thirty"],
    	times_Hours: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"],
    	times_Minutes_Tens: ["ten", "twenty", "thirty", "fourty", "fifty"],
    	days_of_week: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }
  },
  PreAnalyzer: {
    MeetingMentionWords: ["meeting", "meet"]
  }
};
