// Resources:
// http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/relationship-extraction.html
// http://stackoverflow.com/questions/30551074/bluemix-node-js-watson-relationship-extraction-using-watson-developer-cloud-modu

var watson = require('watson-developer-cloud');

var relationship_extraction = watson.relationship_extraction({
		username: '744602a2-6101-4f89-8d2f-39fe42699ba4',
		password: 'O0TMxSc7l0l8',
		version: 'v1-beta'
	});

// Parts of Speech of tokens of a sentence:
// *** Mostly ignoring these for now. For simplicity, if POS contains 'NN' its a type of noun.
// Resource: http://www.comp.leeds.ac.uk/amalgam/tagsets/upenn.html
// var GrammaticalFunctions = [];
var containsNoun = function(pos){
	return pos.indexOf('NNP') > -1;
};

// try to extract a subject from the relationship extraction response
var processResponse = function(response){
	// use this line to print the entire result if you want
	console.log(JSON.stringify(response, null, 2));

	// iterate over sentences
	var sentences = response.doc.sents.sent;
	for(var s = 0; s < sentences.length; s++){

		// iterate over tokens
		var tokens = sentences[s].tokens.token;
		for(var t = 0; t < tokens.length; t++){

			// it a token is a noun, print it
			if(containsNoun(tokens[t].POS)){
				console.log(tokens[t].text);
			}
		}
	}
};

// callback passed to relationship extraction
var callback = function(err, response){
    if (err)
      console.log('error:', err);
    else
      processResponse(response);
};

// perform some relationship extraction magic on some text
relationship_extraction.extract({
	text: "Amy had a lot of success selling in Dublin last week. She sold fifteen vacation packages. Let's plan a meeting for next week to try to analyze what went right. Ideally, we will be able to reproduce her results and sell more vacation packages in other cities.",
	dataset: 'ie-en-news' },
	callback
);
