var app = angular.module('meetingassistant', []);

app.controller('MeetingAssistantController', function() {
    this.meetingsList = meetingMentions;
    this.listening = false;
});

//JS Array containing the meetings
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
}, {
    date: new Date(2017, 8, 25),
    subject: "example subject future",
    description: "example description future",
    enddate: new Date()
}];

//function triggers when button is clicked
function btnListen_Click() {
    if (this.listening) {
        $('#btnListen').text("Start listening");
        $('#btnListen').addClass("btn-success");
        $('#btnListen').removeClass("btn-warning");
    } else {
        $('#btnListen').text("Stop listening");
        $('#btnListen').removeClass("btn-success");
        $('#btnListen').addClass("btn-warning");
    }

    this.listening = !this.listening;
};