// populates page data from the user object
var user;

var populatePageData = function(user) {

	$("#welcome-message").html("Welcome, " + user.name + "!");
	$("#karmaBadge").html(user.karma);
	$("#invitations").html("");
	if (user.invites.length === 0) {
		$("#invitations").html("No new invitations");
	}
	user.invites.forEach(function(i) {
		showInvite(i);
	});

	user.currentMeals.forEach(function(meal) {
		showMeal(meal);
	});

};

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// populate invites
var showInvite = function(invite) {
	var mainDiv = $("<div>").addClass("invitation").appendTo($("#invitations"));
	$("<div>").addClass("icon").appendTo(mainDiv);
	var content = $("<div>").addClass("content").appendTo(mainDiv);
	var date = new Date(invite.date);
	var dateString = weekday[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDay();
	$("<div>").addClass("date").html(dateString).appendTo(content);
	$("<div>").html(invite.username + " has invited you to a botluck").appendTo(content);
	var btn = $("<button>").addClass("navButton").attr("type","button").html("view").appendTo(mainDiv);
	// set it such that clicking the button takes them to the meal page
	(function() {
		var mealId = invite.mealId;
		btn.click(function() {
			window.location.href = "/static/home/invite.html?uid=" + user.id + "&mid=" + mealId;
		});
	})();
};

// populate current meals
var showMeal = function(meal) {
	var mainDiv = $("<div>").addClass("meal");
	$("<div>").addClass("date").html(meal.date).appendTo(mainDiv);
	$("<div>").addClass("photo").html("a meal photo").appendTo(mainDiv);
	var wrapper = $("<div>");
	$("<div>").addClass("caption").html(meal.name).appendTo(wrapper);
	var menu = $("<div>").addClass("menu");
	$("<span>").addClass("date").html("menu").appendTo(menu);
	$("<span>").html(meal.choice).appendTo(menu);
	menu.appendTo(wrapper);
	$("<div>").addClass("date bringing").html("i'm bringing").appendTo(wrapper);
	var contributionDiv = $("<div>").addClass("contributions");
	var contributions = meal.contributions[user.id];
	console.log(contributions);
	contributions.forEach(function(ingredient) {
		var div = $("<div>").addClass("contribution");
		$("<div>").addClass("photo").html("a food photo").appendTo(div);
		$("<div>").addClass("caption").html(ingredient.name).appendTo(div);
		div.appendTo(contributionDiv);
	});
	contributionDiv.appendTo(wrapper);
	var btn = $("<button class=\"navButton\" type=\"button\">").html("view");
	(function() {
		var mealId = meal.mealId;
		btn.click(function() {
			window.location.href = "/home/meal.html?uid=" + user.id + "&mid=" + mealId;
		});
	})();
	btn.appendTo($("<div>").addClass("right").appendTo(wrapper));
	wrapper.appendTo(mainDiv);
	mainDiv.appendTo($("#currentmeals"));
};

// set the nav bar buttons on the right
$("#startButton").click(function() {
	window.location.href = "/static/home/meals/new.html?uid=" + user.id;
});

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
	user.initFromServer(id, populatePageData);
};
