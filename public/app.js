var app = angular.module('meetingassistant', []);

app.controller('MeetingAssistantController', function() {
    this.meetingsList = meetingMentions;
});

var meetingMentions = [{
    date: new Date(2015, 1, 1),
    subject: "example subject",
    description: "example description",
    enddate: new Date()
}, {
    date: new Date(),
    subject: "example subject222",
    description: "example description222",
    enddate: new Date()
},{
    date: new Date(2017,8,25),
    subject: "example subject future",
    description: "example description future",
    enddate: new Date()
}];