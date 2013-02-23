// populates page data from the user object
var user;

var populatePageData = function(user) {
	$("#karmaBadge").html(user.karma);

	user.ingredients.forEach(function(ingredient) {
		showIngredient(ingredient);
	});

	user.utensils.forEach(function(utensil) {
		showUtensil(utensil);
	});

};

// populate ingredients
var showIngredient = function(ingredient) {
	var ingredientDiv = $("<div>").addClass("ingredient").appendTo($("#ingredients"));
	$("<div>").addClass("photo").html(ingredient.name).appendTo(ingredientDiv);
	$("<div>").addClass("caption").html(ingredient.name).appendTo(ingredientDiv);
	$("<button>").addClass("navButton").attr("type","button").html("delete").appendTo(ingredientDiv);
};

// populate utensils
var showUtensil = function(utensil) {
	var utensilDiv = $("<div>").addClass("utensil").appendTo($("#utensils"));
	$("<div>").addClass("photo").html(utensil.name).appendTo(utensilDiv);
	$("<div>").addClass("caption").html(utensil.name).appendTo(utensilDiv);
	$("<button>").addClass("navButton").attr("type","button").html("delete").appendTo(utensilDiv);
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
