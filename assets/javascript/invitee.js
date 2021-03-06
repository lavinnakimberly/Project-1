/*
http://127.0.0.1:64379/Project-1/invite.html?id=-Kl7SUDDhFTGfL_iGaet&event=-Kl7SSVov1dXTeWlQ29A
*/ 
var lat, lng;
var invites;
var invitesRef;
var peopleInvited = [];

$(document).ready(function(){
	//Get userID from URL
	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	var userID = $.urlParam("id");
	var eventID = $.urlParam("eventID");

	var database = firebase.database();
	invites = database.ref("/invites/" + eventID);
	invitesRef = database.ref("/invites/" + eventID + "/" + userID);
	locationRef = database.ref("locations/" + eventID);

	//save IDs to local storage
	localStorage.setItem("inviteID", userID);
	localStorage.setItem("eventID", eventID);

	var nameInvite = localStorage.getItem("nameInvite")

	//If these variables have already been set previously, no need to ask the user again.
	if (nameInvite === null) {
		$("#invite-name").show();
	} else {
		$("#invite-response").show();
	}

	//Save name to local storage
	$("#save-name").on("click", function(){
		var nameInvite = $("#name").val();
		localStorage.setItem("nameInvite", nameInvite);
		var inviteeResponse = invitesRef.update({
			"name": nameInvite
		});

		$("#invite-name").hide();
		$("#invite-response").show();
	});	

	//listener for available button
	$(".availableBtn").on("click", function(){
		var response = $(this).attr("data-isAvailable");
		console.log(response);
		if (response === "yes") {
			//get location
			navigator.geolocation.getCurrentPosition(handle_geolocation_query);  

			function handle_geolocation_query(position){  
				lat = position.coords.latitude;
				lng =  position.coords.longitude; 
				savePosition(lat, lng)
			}  
			console.log(lat);
			console.log(lng);

			function savePosition(lat, lng) {
				var inviteeResponse = invitesRef.update({
					"isAvailable": "is available",
					"lat": lat,
					"lng": lng
				});
			}

			function saveLocation(position) {
				return position;	
			}
		}
		else if (response === "no") {
			//mark as not available on FIREBASE
			var inviteeResponse = invitesRef.update({
				"isAvailable": "is not available",
				"lat": "",
				"lng": ""
			});

		}
	})

	invites.on("value", function(peopleRef) {
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
			invitee_li.addClass("available-text");
			invitee_li.html(invitee.inviteName + " " + invitee.isAvailable);
			$("#inviteList").append(invitee_li);
		})
	})

	locationRef.on("value", function(locations) {
		selectionSelcted = locations.val();
		console.log(selectionSelcted);
		if (selectionSelcted != undefined) {
			window.location.href = "final-choice.html?eventID=" + eventID;
		}
	})
})


function getLocation() {
	var myLocation;
	if (navigator.geolocation) {
		myLocation = navigator.geolocation.getCurrentPosition(showPosition);
		console.log(myLocation)
	} else {
		console.log("Geolocation is not supported by this browser.");
		return false;
	}
	console.log(myLocation)
	return myLocation;
}
function showPosition(position) {
	return position.coords
}
