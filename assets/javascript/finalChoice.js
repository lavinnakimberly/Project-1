/*Get list of people that are in this invite*/ 
/*Check to see if there is an eventID already for this event */
var peopleInvited = [];

$(document).ready(function(){
	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	var eventID = $.urlParam("eventID");
	var database = firebase.database();

	invites = database.ref("/invites/" + eventID);
	locations = database.ref("/locations/" + eventID);

	//save IDs to local storage
	localStorage.setItem("eventID", eventID);

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

			//Create DIV to hold data
			/*var person_div = $("<div>");
			person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
			$("#inviteList").append(person_div);*/

			/*person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
			$("#inviteList").append(person_div);*/

			//Create List to hold approved invites
			var invitee_li = $("<li>");
			invitee_li.addClass("available-text");
			invitee_li.html(invitee.inviteName + " " + invitee.isAvailable);
			$("#inviteList").append(invitee_li);
		})
	})

	locations.on("value", function(location) {
		selectedLocation = location.val();
		console.log(selectedLocation);
		$("#location-name").html(selectedLocation.name)
		$("#location-address").html(selectedLocation.address)
		$("#location-address").attr("href", "http://maps.google.com/maps?f=d&daddr=" + encodeURI(selectedLocation.address))
	})

})
