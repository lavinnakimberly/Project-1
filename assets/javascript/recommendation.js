var lat, lng;
var category;
var peopleInvited = [];
var eventID = localStorage.getItem("eventID")

if (eventID != null) {
	var database = firebase.database();
	var invites = database.ref("/invites/");
	var invitesRef = database.ref("/invites/" + eventID);
	var locationRef = database.ref("/locations/" + eventID);
	console.log("has already eventID = " + eventID);
}
else {
	var database = firebase.database();
	var invites = database.ref("/invites/");
	var invitesRef = database.ref("/invites/").push();
	var eventID = invitesRef.getKey();
	var locationRef = database.ref("/invites/" + eventID + "/location");
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
	//empty peopleInvited array
	peopleInvited = [];

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
var map,geocoder;
function showMap() {
//	console.log("initMap run");
//	console.log(peopleInvited)
	var myLatLng = {"lat": 32.7157,
					"lng": -117.1611};
	geocoder = new google.maps.Geocoder();
	var bounds = new google.maps.LatLngBounds();
	//var myLatlng;
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: myLatLng
	});
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLatLng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			map.setCenter(myLatLng);
			selectCenter.setMap(null);
			selectCenter.position = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				$("#longitude").val(selectCenter.position.lat());
				$("#latitude").val(selectCenter.position.lng());
			selectCenter.setMap(map);
			recommendation(category)
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
	
console.log("peopleInvited ", peopleInvited)
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
var markers = [];
function recommendation(category){
	markers.forEach(function(marker){
		marker.setMap(null);
	});
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
		//clear #recommendations first
		$("#recommendations").empty();

		//check if response is json
		var recommendations = response.businesses;
		console.log(recommendations)
		recommendations.forEach(function(recommendation){
			var recommendations_div = $("<div><h1></h1><h2></h2></div>");

			recommendations_div.find("h1").text(recommendation.name);
			recommendations_div.find("h2").text(recommendation.location.city);
			recommendations_div.addClass("result")
			recommendations_div.attr("data-id",markers.length);
			recommendations_div.attr("data-name",recommendation.name);
			recommendations_div.attr("data-address",recommendation.location.display_address[0] + " " + recommendation.location.display_address[1]);
			var icon = category == "bars" ? "beer" : category == "coffee" ? "coffee" : "food";
			markers.push(new google.maps.Marker({
				scale: 0.5,
				"position": new google.maps.LatLng(recommendation.coordinates.latitude,recommendation.coordinates.longitude),
				"map": map, // handle of the map
				"icon": {
					url: "assets/images/"+icon+".png", // url
					scaledSize: new google.maps.Size(20, 20)
				}
			}));
			$("#recommendations").append(recommendations_div);
		})

	})
}
$("#recommendations").on("click",".result",function(){
	event.stopPropagation();
	stopAnimation();
	var i = $(this).attr("data-id");
	$(this).addClass("selected");
	markers[i].setAnimation(google.maps.Animation.BOUNCE);

	//Show modal for clarification
	var selectedPlace = $(this).attr("data-name");
	var selectedAddress = $(this).attr("data-address");
	$("#selectedPlace").html(selectedPlace);
	$("#select-place").val(selectedPlace);
	$("#select-address").val(selectedAddress);
	$('#myModal').modal('show') 
});

$("#selectLocation").on("click",function(){
	var selectedPlace = $("#select-place").val();
	var selectedAddress = $("#select-address").val()
	console.log(selectedPlace);
	console.log(selectedAddress);
	var selectedLocation = locationRef.set({
		"name": selectedPlace,
		"address": selectedAddress
	});
	window.location.href = "final-choice.html?eventID=" + eventID;
});

function stopAnimation(){
	markers.forEach(function(marker){
		marker.setAnimation(null);
	});
}