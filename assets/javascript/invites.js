/*Get list of people that are in this invite*/ 
/*Check to see if there is an eventID already for this event */
var eventID = localStorage.getItem("eventID")
if (eventID != null) {
	var database = firebase.database();
	var invites = database.ref("/invites/");
	var invitesRef = database.ref("/invites/" + eventID);
	console.log("has already eventID = " + eventID);
}
else {
	var database = firebase.database();
	var invites = database.ref("/invites/");
	var invitesRef = database.ref("/invites/").push();
	var eventID = invitesRef.getKey();
	localStorage.setItem('eventID', eventID);
	console.log("has new eventID = " + eventID);
}
var peopleInvited = [];

//Initial load of firebase data
invitesRef.once("value", function(peopleRef) {
	peopleRef.forEach(function(personRef){
		var person = personRef.val();
		var invitee = {};
		invitee.inviteName = person.name;
		invitee.isAvailable = person.isAvailable;
		invitee.key = personRef.getKey();
		invitee.longitude  = person.lng;
		invitee.latitude  = person.lat;
		peopleInvited.push(invitee)

		//Create DIV to hold data
		var person_div = $("<div>");
		person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
		$("#inviteList").append(person_div);
	})
})

//Read Database
invites.on("child_changed", function(peopleRef) {
	//empty inviteList div
	$("#inviteList").empty();

	peopleRef.forEach(function(personRef){
		var person = personRef.val();
		var invitee = {};
		invitee.inviteName = person.name;
		invitee.isAvailable = person.isAvailable;
		invitee.key = personRef.getKey();
		invitee.longitude  = person.lng;
		invitee.latitude  = person.lat;
		peopleInvited.push(invitee)

		//Create DIV to hold data
		var person_div = $("<div>");
		person_div.html(inviteName);
		$("#inviteList").append(person_div);

		//put markers on map
//		showMap()
	})
})


$(document).ready(function(){
	//Event Listener for doing invite
	$("#invite-person").on("click", function(){
		//Get person's details
		var invitee = $("#add-invite").val();
		console.log(invitee);
		//save to FireBase
		var inviteeKey = invitesRef.push({
			"name": invitee,
			"inviteKey": invitesRef.getKey()
		});

		//Clear input to add another invite
		$("#add-invite").val('');
	});
})