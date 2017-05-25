$(document).ready(function(){
	search();
})
function search(term){
	var apiKey = "&key=1234567890";
	var location = "&location=" + encodeURIComponent("Louisville");
	var term = "&term=" + encodeURIComponent("pizza");

	queryURL = "https://www.chesteraustin.us/project1/api.cfc?method=getRecommendations&returnFormat=JSON&" + apiKey + location + term;
	console.log(queryURL)
	$.ajax({
		url: queryURL,
		method: "GET",
	}).done(function(response) {
		console.log(response)
	})
}