// populates page data from the user object
var user;

var populatePageData = function(user) {

	/* user.addInvite(new Invite(5, "Mishq", 4, "Feb 4"));
	user.addInvite(new Invite(2, "Beyonce", 3, "Jan 29"));

	var m = new Meal(4, 3, "Jack's Dinner Party", [1,4,3], "Feb 6");
	m.contributions[user.id] = [user.ingredients[0]];
	user.addMeal(m);
	m = new Meal(4, 3, "MadHatter's Tea Party", [4,2,1], "Oct 20", "Tea and Biscuits");
	m.contributions[user.id] = [user.ingredients[1]];
	user.addMeal(m);
	user.karma = 10; */

	$("#welcome-message").html("Welcome, " + user.name + "!");
	$("#karmaBadge").html(user.karma);

	user.invites.forEach(function(i) {
		addInvite(i);
	});

	user.currentMeals.forEach(function(meal) {
		addMeal(meal);
	});

};

// populate invites
var addInvite = function(invite) {
	var mainDiv = $("<div class=\"invitation\">");
	$("<img src=\"static/assets/invitation-icon.png\">")
	.appendTo($("<div class=\"icon\">"))
	.appendTo(mainDiv);
	var content = $("<div>").addClass("content");
	$("<div>").addClass("date").html(invite.date).appendTo(content);
	$("<div>").html(invite.username + " has invited you to a botluck").appendTo(content);
	content.appendTo(mainDiv);
	var btn = $("<button class=\"navButton\" type=\"button\">").html("view");
	// set it such that clicking the button takes them to the meal page
	(function() {
		var mealId = invite.mealId;
		btn.click(function() {
			window.location.href = "/home/meal.html?uid=" + user.id + "&mid=" + mealId;
		});
	})();
	btn.appendTo(mainDiv);
	mainDiv.appendTo($(".invitations"));
};

// populate current meals
var addMeal = function(meal) {
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
$("#myBotlucksBttn").click(function() {
			// go to your botluck page
		});

$("#myKitchenBttn").click(function() {
	window.location.href = "/static/home/mykitchen.html?uid=" + user.id;
});

$("#myFriendsBttn").click(function() {
	// go to some friends page
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
