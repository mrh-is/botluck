// populates page data from the user object
var user;

var populatePageData = function(user) {
	$("#karmaBadge").html(user.karma);

	user.history.forEach(function(meal) {
		showMeal(meal);
	});
};

// populate meals
var showMeal = function(meal) {
	var mealDiv = $("<div>").addClass("meal").appendTo($("#currentmeals"));
	$("<div>").addClass("date").html(ingredient.date).appendTo(mealDiv);
	$("<div>").addClass("photo").html("a meal photo").appendTo(mealDiv);
	var infoDiv = $("<div>").appendTo(mealDiv);
	$("<div>").addClass("caption").html(meal.name).appendTo(infoDiv);
	$("<div>").addClass("menu").appendto(infoDiv).append($("<span>").addClass("date").html("menu")).append($("<span>").html(meal.choice)).append($("<br>"));
	$("<div>").addClass("date").addClass("bringing").html("i'm bringing").appendTo(infoDiv);
	var contributionsDiv = $("<div>").addClass("contributions").appendTo(infoDiv);
	meal.contributions.forEach(function(contribution) {
		$("<div>").addClass("contribution").append($("<div>").addClass("photo").html("a food photo")).append($("<div>").addClass("caption").html(contribution)).appendTo(contributionsDiv);
	});
	$("<div>").addClass("right").append($("<button>").addClass("navButton").attr("mealID",meal.id).attr("type","button").html("view").click(function(evt) {
		viewMeal($(evt.currentTarget).attr("mealID"));
	})).appendTo(infoDiv);
};

// view meal
var viewMeal = function(mealID) {
	window.location.href = "/static/home/meal.html?uid=" + user.id;
};

// set the nav bar buttons on the right
$("#myBotlucksBttn").click(function() {
	window.location.href = "/static/home/meals/history.html?uid=" + user.id;
});

$("#myKitchenBttn").click(function() {
	window.location.href = "/static/home/mykitchen.html?uid=" + user.id;
});

$("#myFriendsBttn").click(function() {
	window.location.href = "/static/home/friends.html?uid=" + user.id;
});

// on load, the user is initialized from the server
// and populatePageData is called
window.onload = function() {
	var url = window.location.href;
	var i = url.indexOf("uid=");
	if (i === -1) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}
	id = parseInt(url.substring(i+4),10);
	if (isNaN(id)) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	user = new User();
	user.initFromServer(id, populatePageData);
};
