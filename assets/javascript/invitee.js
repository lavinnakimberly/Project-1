/*
http://127.0.0.1:64379/Project-1/invite.html?id=-Kl7SUDDhFTGfL_iGaet&event=-Kl7SSVov1dXTeWlQ29A
*/ 
var lat, lng;
$(document).ready(function(){
	//Get userID from URL
	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	var userID = $.urlParam("id");
	var eventID = $.urlParam("event");

	var database = firebase.database();
	var invites = database.ref("/invites/" + eventID);
	var invitesRef = database.ref("/invites/" + eventID + "/" + userID);

	//save IDs to local storage
	localStorage.setItem("inviteID", userID);
	localStorage.setItem("eventID", eventID);

	//show prompt
	$("#available-prompt").show();

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
					"isAvailable": "yes",
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
				"isAvailable": "no"
			});

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
