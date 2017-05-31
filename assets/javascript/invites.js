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
		}
	);
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

	$("#get-recommendations").on("click", function(){
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
				"categories": "mexican",
				"radius": "20000",
				"open_now": "true",
				"sort_by": "best_match",
				"limit": "3",
				"key": "1234567890"
			}
		}).done(function(response) {
			var recommendations = response.businesses;
			console.log(response)
			for (var i = 0; i < recommendations.length; i++){
				console.log(recommendations[i])
			}
		})

	})

})