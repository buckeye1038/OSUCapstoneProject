/**
 * all parameters are optional. month, day, hour, and minute are all integers.
 */
var Meeting = function(month, day, hour, minute, subject, description) {
  // TODO: handle cases where month, day, hour, or minute are `null`


  this.date = new Date(2016, month, day, hour, minute);
  this.subject = subject;
  this.description = description;
  this.enddate = new Date(2016,month, day, hour+1, minute);
};

// Another constructor. day is a day of the week (e.g. monday, tuesday, etc.)
Meeting.initWithDayOfWeek = function(day, hour, minute, subject, description) {
  // convert day of week to month and day as integers

  var month = 0;
  var day = 0;
  return new Meeting(2016, month, day, hour, minute, subject, description);
}

module.exports = Meeting;
