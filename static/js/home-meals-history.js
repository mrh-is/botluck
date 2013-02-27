// populates page data from the user object
var user;

var populatePageData = function(user) {
	$("#karmaBadge").html(user.karma);

	$("#title").html(user.name + "'s History");

	$("#currentmeals").html(""); // clear template data
	if (user.history === undefined || user.history.length === 0) {
		$("#currentmeals").html("No past meals");
	} else {
		user.history.forEach(function(mid) {
			showMeal(mid);
		});
	}
};

// populate current meals
var showMeal = function(mid) {
	var meal = new Meal();
	meal.initFromServer(mid, function() {
		var mainDiv = $("<div>").addClass("meal");
		$("<div>").addClass("date").html(meal.date).appendTo(mainDiv);
		$("<div>").addClass("photo").html("a meal photo").appendTo(mainDiv);
		var wrapper = $("<div>");
		$("<div>").addClass("caption").html(meal.name).appendTo(wrapper);
		var menu = $("<div>").addClass("menu");
		$("<span>").addClass("date").html("menu").appendTo(menu);
		if (meal.recipeChosen) {
			$("<span>").html(meal.recipe.title).appendTo(menu);
		} else {
			$("<span>").html("n/a").appendTo(menu);
		}
		menu.appendTo(wrapper);
		$("<div>").addClass("date bringing").html("i brought").appendTo(wrapper);
		var contributionDiv = $("<div>").addClass("contributions");
		var contributions = meal.contributions[user.id];
		console.log(contributions);
		if (contributions !== undefined && contributions.length !== 0) {
			$.each(contributions, function(i, ingredient) {
				var div = $("<div>").addClass("contribution");
				new ImageFinder(
					ingredient.name,
					$("<div>").addClass("photo").appendTo(div)
				);
				div.appendTo(contributionDiv);
			});
			contributionDiv.appendTo(wrapper);
		} else {
			$("<span>").html("nothing").appendTo(wrapper);
		}
		wrapper.appendTo(mainDiv);
		mainDiv.appendTo($("#currentmeals"));
	});
};

// view meal
var viewMeal = function(mealID) {
	window.location.href = "/static/home/meal.html?uid=" + user.id;
};

// set the nav bar buttons on the right

$("#startButton").click(function() {
	window.location.href = "/static/home/meals/new.html?uid=" + user.id;
});
// $("#myBotlucksBttn").click(function() {
// 	window.location.href = "/static/home.html?uid=" + user.id;
// });

$("#mycanvas").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#botluckTitle").click(function() {
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
