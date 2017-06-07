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
		/*person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
		$("#inviteList").append(person_div);*/

		//Create List to hold approved invites
		var invitee_li = $("<li>");
		invitee_li.addClass("available-text")
		invitee_li.html(invitee.inviteName + " " + invitee.isAvailable) ;
		$("#inviteList").append(invitee_li);
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
		/*var person_div = $("<div>");
		person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
		$("#inviteList").append(person_div);*/

		/*person_div.html(invitee.inviteName + " | " + invitee.isAvailable + " ["+ invitee.key + "]" + "( " + invitee.longitude + " , " + invitee.latitude + " )");
		$("#inviteList").append(person_div);*/

		//Create List to hold approved invites
		var invitee_li = $("<li>");
		invitee_li.html(invitee.inviteName + " " + invitee.isAvailable);
		$("#inviteList").append(invitee_li);

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
			title: peopleInvited[i].inviteName
		});
	}

	//create draggable marker
	var myLatlng = new google.maps.LatLng(32.78,-117.01);
	var selectCenter = new google.maps.Marker({
		"position": myLatlng, 
		"map": map, // handle of the map
		"icon": "assets/images/avatar.jpg",
		"draggable" :true
	});
	google.maps.event.addListener(
		selectCenter,
		'drag',
		function() {
			$("#longitude").val(selectCenter.position.lng());
			$("#latitude").val(selectCenter.position.lat());
			
		},recommendation("food")
	);
}

$(document).ready(function(){
	$("#add-invite").hide();
	$("#invite-person").hide();	
	$("#invite").append(
	//inviter enters their email address
	$("<input/>",{
		type: 'text',
		id: 'inviter',
		email: "email",
		placeholder: 'Enter Your Email',
		class: "invite"
	})
		);
	$("#invite").append(
	//create submit button	
	$("<input/>",{
		type: 'submit',
		id: 'submitButton',
		value: 'Submit'
	})
		);
	//saves email to local storage and displays who to invite
	$("#submitButton").on("click", function(){
		var inviter = $("#inviter").val()		
			$("#inviter").hide();
			$("#submitButton").hide();
			$("#add-invite").show();
			$("#invite-person").show();
		localStorage.setItem('email', inviter)		
		console.log(localStorage.getItem("email"));
	});				

	//Event Listener for doing invite
	$("#invite-person").on("click", function(){
		//Get person's details
		var invitee = $("#add-invite").val();
		console.log(invitee);
		//save to FireBase
		var inviteeKey = invitesRef.push({
			"name": invitee,
			"inviteKey": invitesRef.getKey(),
			"isAvailable": "Has not reponded"
		});

		sendEmail(eventID, inviteeKey.getKey(), invitee);
		//Clear input to add another invite
		$("#add-invite").val('');
	});	
})

function recommendation(category){
	var recommendLng = $("#longitude").val();
	var recommendLat = $("#latitude").val();
	console.log(recommendLng);
	console.log(recommendLat)
	//AJAX call to API to get recommedations
	queryURL = "https://www.chesteraustin.us/project1/api.cfc?method=getRecommendations&returnFormat=JSON&";
	$.ajax({
		url: queryURL,
		method: "GET",
		data: {
			"term": "food",
			"location": "",
			"latitude": recommendLat,
			"longitude": recommendLng,
			"categories": category,
			"radius": "5000",
			"open_now": "true",
			"sort_by": "best_match",
			"limit": "3",
			"key": "1234567890"
		}
	}).done(function(response) {
		var response = $.trim(response)
		var response = $.parseJSON(response)
		//check if response is json
		var recommendations = response.businesses;
		for (var i = 0; i < recommendations.length; i++){
			console.log(recommendations[i])
		}
	})
}

function sendEmail(eventID, userID, to){
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
			"key": key
		}
	}).done(function(response) {
		console.log(response)
	})
}