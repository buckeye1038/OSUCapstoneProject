# OSUCapstoneProject
This is the working repository for our OSU Capstone project for spring 2016. The project is to create a personal assistant utilizing voice analysis to determine what the user is trying to do. The primary object of this project is to distinguish when the user wants to set a meeting and create it automatically for them. The idea is for this to work while the user is talking to a colleague through video chat, or online voice service.

Special note, this page will be updated throughout development.

##Team Members
- John Haviland
  - Haviland.10@osu.edu
- Colin Kalnasy
  - Kalnasy.6@osu.edu
- Nick Ramage
  - Ramage.28@osu.edu
- Umang Sharaf
  - Sharaf.5@osu.edu
- Scott Weddendorf
  - Weddendorf.4@osu.edu

##Project Breakdown and contracts
The project is broken down into 4 sections, voice recognition, tokenizing, analysis, and the user interface. The voice recognition translates the spoken words into data fro us to work with. The tokenizer then splits the data into tokens for us to analyze. The analysis potation performs the operations to determine what needs to be done. Lastly the UI presents the what the analyzer has determined to be the end result.

###Formal Contracts
####Voice Recognition
This takes the voice input from the user's microphone and translates it into data that can be manipulated. Will be operating continuously, and will be passing data to the tokenizer whenever the user takes a small break, i.e. a pause.

- Input
  - Speech from Microphone
- Output
  - JavaScript array of strings

####Tokenizer/Pre-Analyzer
Sees when a meeting might have been mentioned. Takes the previous n words leading up to the mention of a meeting and the next m words after the mention of a meeting.
- Contract
```javascript
// Namespace
var Tokenizer = {...};

// Interface
	// Constructor. The provided callback is a SpeechToText function.
	PreAnalyzer(callback)
		// callback - function with one parameter in the following format
	    {
		    beforeMentionTranscript: [array of strings],
		    mentionTranscript: [array of strings],
		    afterMentionTranscript: [array of strings]
	    }

	// Call this function for each JSON message with results that the speech to text api returns.
	PreAnalyzer.procesJson = function(json){...};

	// Call this function after the last speech to text result has come back from IBM.
	PreAnalyzer.transcriptEnded = function(){...};
```

####Analyzer
Attempts to parse a date, subject, and description from the input text, puts that info in an object, and passes it to Reporting.
- Contract
```javascript
// Namespace
var Analyzer = {...};

// Interface
    // Constructor. The provided callback is a Reporting function.
    Analyzer(callback)
        // callback - function with one parameter in the following format
	    {
		    "date": <Date object>,
		    "subject": "example subject",
		    "description": "example description"
	    }

	// Callback to pass to PreAnalyzer constructor.
    // Passes results to callback provided by Reporting.
    Analyzer.processJson = function(json){...};
        // json format
	    {
		    beforeMentionTranscript: [array of strings],
		    mentionTranscript: [array of strings],
		    afterMentionTranscript: [array of strings]
	    }
```

####Reporting
Displays the JSON object from the Voice Analysis in a Panel with heading object using Bootstrap (http://getbootstrap.com/components/#panels-heading). Once the user makes a selection, it will be added to Google Calendar using the JS API.
- Contract
```javascript
// Namespace
var Reporting = {...};

// Interface
	// Constructor.
	Reporting()

	// Callback to pass to Analyzer constructor.
	Reporting.processJson = function(json){...};
		// json format
		{
			"date": <Date object>,
			"subject": "example subject",
			"description": "example description"
		}
```

- Output
	-set calendarId as either ‘primary’ or specific user calendar ID
	-pass event object with attributes (only start and end times are required in the API) as a ‘resource’
	-call events.insert()
	-example: https://developers.google.com/google-apps/calendar/create-events


##Running the Project
###Building the Environment

To bundleify or build the js files into one file. Run `npm run build` and let it continuously run. It will automatically update the bundle file when you save files. Then, only include the bundle.js file in the html webpages
