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
- Requirements
  - Only works in Google Chrome browser
- Input
  - JavaScript array of string results (from Google Web Speech API)
- Output
  - JavaScript array of strings

####Tokenizer/Pre-Analyzer
Sees when a meeting might have been mentioned. Takes the previous n words leading up to the mention of a meeting and the next m words after the mention of a meeting.
- Contract
```javascript
// namespace
var Tokenizer = {...};

// interface
Tokenizer.handleResults = function(results){...}; // results is array of strings
```

####Analysis
Attempts to parse a date, subject, and description from the input text, puts that info in an object, and passes it to the UI controller.
- Contract
```javascript
// namespace
var Analysis = {...};

// interface
Analysis.handleMention = function(unprocessedMention){...};

// UnprocessesMention object
{
	"pre": "example words before meeting mention",
	"mention": "example words of meeting mention",
	"post": "example words after meeting mention",
}
```

####UI
Displays the JSON object from the Voice Analysis in a Panel with heading object using Bootstrap (http://getbootstrap.com/components/#panels-heading). Once the user makes a selection, it will be added to Google Calendar using the JS API.
- Contract
```javascript
// namespace
var UIController = {...};

// interface
UIController.handleMention = function(processedMention){...};

// ProcessedMention object
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
Install node.js. For Linux, the default package manager will have it. For os x, I use [homebrew](http://brew.sh/). For Windows, idk, I think there might be a .exe file you can download.
From the project root, run `npm install` to install the node modules defined in package.json
To run the unit tests, run `npm test`. Mocha is the testing framework
