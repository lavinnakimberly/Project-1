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

		//Create DIV to hold data
		var person_div = $("<div>");
		person_div.html(inviteName);
		$("#inviteList").append(person_div);
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