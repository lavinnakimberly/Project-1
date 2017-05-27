/*Get list of people that are in this invite*/ 
var database = firebase.database();
var invites = database.ref("/invites");
var invitesRef = database.ref("/invites").push();

//Read Database
invites.on("child_added", function(peopleRef) {
	peopleRef.forEach(function(personRef){
		var person = personRef.val();
		var key = personRef.getKey();
		var inviteName = person.name;
		var isAvailable = person.isAvailable;
		var longitude  = person.lng;
		var latitude  = person.lat;
//		var inviteID = person.getKey();

		//Create DIV to hold data
		var person_div = $("<div>");
		person_div.html(inviteName + " | " + isAvailable + " ["+ key + "]" + "( " + longitude + " , " + latitude + " )");
		$("#inviteList").append(person_div);

		//put markers on map
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