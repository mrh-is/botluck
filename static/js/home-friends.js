// populates page data from the user object
var user;

var getFriendNames = function(user) {
	$.ajax({
		type: "get",
		url: "/friendsInfo/" + user.friends.join(","),
		success: function(data) {
			if (data.success) {
				populatePageData(data.usersData);
			}
		}
	});
};

var populatePageData = function(friendNames) {
	$("#karmaBadge").html(user.karma);

	for (var id in friendNames) {
		showFriend(friendNames[id]);
	}
};

// populate meals
var showFriend = function(friend) {
	var friendDiv = $("<div>").addClass("friend").appendTo($("#mainCol"));
	$("<div>").addClass("photo").html("a profile photo").appendTo(mealDiv);
	$("<div>").addClass("caption").html(friend).appendTo(mealDiv);
};

// view meal
var viewMeal = function(mealID) {
	window.location.href = "/static/home/meal.html?uid=" + user.id;
};

// set the nav bar buttons on the right
$("#myBotlucksBttn").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
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
	user.initFromServer(id, getFriendNames);
};
