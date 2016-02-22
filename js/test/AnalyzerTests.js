var Analyzer = require('../app/Analyzer.js');
var assert = require('assert');

describe('Analyzer', function() {
	describe('#processJson', function() {
		it('output a meeting', function(done) {
			
			var callback = function(meeting) {
				var expected = {			
					date: new Date(2016, 1, 24),
					subject: "example subject",
					description: "example description"
				};
			
				assert.equal(JSON.stringify(expected), JSON.stringify(meeting));
				done();
			};

			var analyzer = new Analyzer(callback);
			analyzer.processJson(
				{
					beforeMentionTranscript: ["example before mention"],
					mentionTranscript: ["example mention"],
					afterMentionTranscript: ["example after mention"]
				}
			);
		});
	});
});