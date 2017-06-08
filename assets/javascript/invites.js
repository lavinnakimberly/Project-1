/*Get list of people that are in this invite*/ 
/*Check to see if there is an eventID already for this event */
var eventID = localStorage.getItem("eventID")
var name = localStorage.getItem("name")
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

//Watch for new invites
invitesRef.on("value", function(peopleRef) {
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

		//Create List to hold approved invites
		var invitee_li = $("<li>");
		invitee_li.addClass("available-text")
		invitee_li.html(invitee.inviteName + " " + invitee.isAvailable) ;
		$("#inviteList").append(invitee_li);
	})
})

//Read Database
invitesRef.on("child_changed", function(peopleRef) {
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

		//Create List to hold approved invites
		var invitee_li = $("<li>");
		invitee_li.html(invitee.inviteName + " " + invitee.isAvailable);
		$("#inviteList").append(invitee_li);

	})
})


$(document).ready(function(){
	var name = localStorage.getItem("name")
	var email = localStorage.getItem("email")

	//If these variables have already been set previously, no need to ask the user again.
	if (name === null) {
		$("#invitee-name").show();
	} else {
		if (email === null) {
			$("#invitee-address").show();
		} else {
			$("#invitee-address").hide();
			$("#invite-send").show();
		}
	}

	//Save name to local storage
	$("#save-name").on("click", function(){
		name = $("#name").val();
		localStorage.setItem("name", name);
		//Save name to firebase for original person
		var inviteeKey = invitesRef.push({
			"name": name,
			"inviteKey": invitesRef.getKey(),
			"isAvailable": "has initiated an event!"
		});
		$("#invitee-name").hide();
		$("#invitee-address").show();
	});	

	//Save email to local storage
	$("#save-email").on("click", function(){
		var email = $("#email").val();
		localStorage.setItem("email", email);
		$("#invitee-address").hide();
		$("#invite-send").show();
	});	

	//Event Listener for doing invite
	$("#invite-person").on("click", function(){
		//Get person's details
		var invitee = $("#add-invite").val();
		//save to FireBase
		//add default value for isAvailable field
		var inviteeKey = invitesRef.push({
			"name": invitee,
			"inviteKey": invitesRef.getKey(),
			"isAvailable": "has not responded yet."
		});

		sendEmail(eventID, inviteeKey.getKey(), invitee, name);
		//Clear input to add another invite
		$("#add-invite").val('');
	});	
})

function sendEmail(eventID, userID, to, name){
	var email = localStorage.getItem("email")
	var key = "1234567890"
	queryURL = "https://www.chesteraustin.us/project1/api.cfc?method=sendEmail&returnFormat=JSON&";
	$.ajax({
		url: queryURL,
		method: "GET",
		data: {
			"to": to,
			"from": email,
			"eventID": eventID,
			"userID": userID,
			"personName": name,
			"key": key
		}
	}).done(function(response) {
		console.log(response)
	})
}