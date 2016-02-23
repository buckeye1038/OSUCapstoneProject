var Analyzer = require('../app/Analyzer.js');
var assert = require('assert');

describe('Analyzer', function() {
	describe('#handleMention', function() {
		it('should return a meeting', function() {
			var analyzer = new Analyzer();
			var meeting = analyzer.handleMention({
					beforeMentionTranscript: ['let\'s', 'have', 'a'],
					mentionTranscript: ['meeting'],
					afterMentionTranscript: ['on', 'may', 'fifteenth', 'at', 'one', 'thirty']
				});

			var expected = {
				date: new Date(2016, 5, 15),
				time: '1:30',
				subject: 'Meeting',
				description: 'Sample description'
			};
			assert.equal(JSON.stringify(expected), JSON.stringify(meeting));
		});
	});
});
