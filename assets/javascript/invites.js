/*Get list of people that are in this invite*/ 
var database = firebase.database();
var invites = database.ref("/invites");
var invitesRef = database.ref("/invites").push();
var peopleInvited = [];

//Read Database
invites.on("child_added", function(peopleRef) {
	peopleRef.forEach(function(personRef){
		var person = personRef.val();
		var invitee = {};
		invitee.inviteName = person.name;
		invitee.isAvailable = person.isAvailable;
		invitee.key = personRef.getKey();
		invitee.longitude  = person.lng;
		invitee.latitude  = person.lat;
		peopleInvited.push(invitee)
//		var inviteID = person.getKey();

		//Create DIV to hold data
		var person_div = $("<div>");
		person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
		$("#inviteList").append(person_div);

		//put markers on map
		showMap()
	})
})

function showMap() {
	console.log("initMap run");
	console.log(peopleInvited)
	var myLatLng = {"lat": peopleInvited[0].latitude, 
					"lng": peopleInvited[0].longitude};

	var bounds = new google.maps.LatLngBounds();

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: myLatLng
	});

	//Loop through peopleInvited array and create markers for each person
	for (var i = 0; i < peopleInvited.length; i++) {
		console.log(peopleInvited[i])

		var position = new google.maps.LatLng(peopleInvited[i].latitude, peopleInvited[i].longitude);
		console.log(position)
		bounds.extend(position);
		var marker = new google.maps.Marker({
			position: position,
			map: map,
			title: 'Hello World!'
		});
	}
}

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