var lat, lng;
var category;
var peopleInvited = [];
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

$(document).ready(function(){
	$.urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	category = $.urlParam("category");
//	recommendation(category);
})

invitesRef.on("value", function(peopleRef) {
	//empty inviteList div

	peopleRef.forEach(function(personRef){
		var person = personRef.val();
		var invitee = {};
		invitee.inviteName = person.name;
		invitee.isAvailable = person.isAvailable;
		invitee.key = personRef.getKey();
		invitee.longitude  = person.lng;
		invitee.latitude  = person.lat;
		peopleInvited.push(invitee)

		//put markers on map
	})
	showMap()
})

function showMap() {
//	console.log("initMap run");
//	console.log(peopleInvited)
	var myLatLng = {"lat": 32.7157, 
					"lng": -117.1611};

	var bounds = new google.maps.LatLngBounds();
	var myLatlng;

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: myLatLng
	});

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		var myLatLng = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		map.setCenter(myLatLng);
		}, function() {
		handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	//Loop through peopleInvited array and create markers for each person
	for (var i = 0; i < peopleInvited.length; i++) {
		console.log(peopleInvited[i])

		var position = new google.maps.LatLng(peopleInvited[i].latitude, peopleInvited[i].longitude);
		console.log(position)
		bounds.extend(position);
		var marker = new google.maps.Marker({
			"position": position,
			"map": map,
			"icon": "assets/images/pin-friends.jpg",
			"title": peopleInvited[i].inviteName
		});
	}

	//create draggable marker
	var markerLatlng = new google.maps.LatLng(32.78,-117.01);
	var selectCenter = new google.maps.Marker({
		"position": markerLatlng, 
		"map": map, // handle of the map
		"icon": "assets/images/pin.jpg",
		"draggable" :true
	});
	google.maps.event.addListener(
		selectCenter,
		'dragend',
		function() {
			$("#longitude").val(selectCenter.position.lat());
			$("#latitude").val(selectCenter.position.lng());
			recommendation(category);
		}
	);

//	newMarker.addListener('drag', recommendation);
//	newMarker.addListener('dragend', recommendation);
}

function recommendation(category){
	var recommendLng = $("#longitude").val();
	var recommendLat = $("#latitude").val();
	console.log(recommendLng);
	console.log(recommendLat);
	//AJAX call to API to get recommedations
	queryURL = "https://www.chesteraustin.us/project1/api.cfc?method=getRecommendations&returnFormat=JSON&";
	$.ajax({
		url: queryURL,
		method: "GET",
		data: {
			"term": "food",
			"location": "",
			"latitude": recommendLng,
			"longitude": recommendLat,
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
			var recommendations_div = $("<div>");
			recommendations_div.html(recommendations[i].name);
			$("#recommendations").append(recommendations_div);

//			console.log(recommendations[i])
		}
	})
}