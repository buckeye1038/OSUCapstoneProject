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
  - JavaScript array - to save data to for the tokenizer to work with
- Output
  - None

####Tokenizer

####Analysis
Attempts to parse a date, subject, and description from the input text, puts that info in an object, and passes it to the UI controller.
- Input
	- chunk_transcript: {string}    // sent by the tokenizer whenever it believes that a date/time has been mentioned to schedule
- Output
	(object with the following fields)
	- date: {date},
	- subject: {string},
	- description: {string}
	
####UI
