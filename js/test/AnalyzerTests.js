var assert = require('assert');
var Subject = require('../app/Analyzer/AnalyzerSubjectDescriptionGetter.js');
var Date = require('../app/Analyzer/AnalyzerDateGetter.js');

describe('AnalyzerDateGetter', function() {
	describe('#date-recognized', function() {
		it('should return true', function() {
			var transcript = "Let's have a meeting on March fourth at five thirty.";
			var date = new Date();
			date.handleMention(transcript);
			var actual = date.date;
			assert.equal(3, actual.getMonth());
			assert.equal(4, actual.getDate());
			assert.equal(5, actual.getHours());
			assert.equal(30, actual.getMinutes());
		});
	});
});

describe('AnalyzerSubjectDescriptionGetter', function() {	
	describe('#arrayContains-true', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.arrayContains('foo', ['yes', 'foo', 'bar']);
			assert.equal(true, actual);
		});
	});
	
	describe('#arrayContains-false', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.arrayContains('foo', ['no', 'bar']);
			assert.equal(false, actual);
		});
	});
	
	describe('#containsNoun-true', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.containsNoun('XNNX');
			assert.equal(true, actual);
		});
	});
	
	describe('#containsNoun-false', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.containsNoun('XX');
			assert.equal(false, actual);
		});
	});
	
	
	describe('#isCommonWord-months', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('january');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-days', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('monday');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-timesHours', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('one');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-minutesTens', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('twenty');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-daysOfWeek', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('monday');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-meetingMentionWords', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('meeting');
			assert.equal(true, actual);
		});
	});
	
	describe('#isCommonWord-otherCommonWords', function() {
		it('should return true', function() {
			var subject = new Subject();
			var actual = subject.isCommonWord('pm');
			assert.equal(true, actual);
		});
	});
});
