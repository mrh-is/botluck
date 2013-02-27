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
	new ImageFinder(
		ingredient.name,
		$("<div>").addClass("photo").appendTo(ingredientDiv)
	);
	$("<div>").addClass("caption").html(ingredient.name).appendTo(ingredientDiv);
	$("<button>").addClass("navButton").attr("ingredient",user.ingredients.indexOf(ingredient)).attr("type","button").html("delete").click(function(evt) {
		deleteIngredient($(evt.currentTarget).attr("ingredient"));
	}).appendTo(ingredientDiv);
};

// populate utensils
var showUtensil = function(utensil) {
	var utensilDiv = $("<div>").addClass("utensil").appendTo($("#utensils"));
	new ImageFinder(
		utensil.name,
		$("<div>").addClass("photo").appendTo(utensilDiv)
	);
	$("<div>").addClass("caption").html(utensil.name).appendTo(utensilDiv);
	$("<button>").addClass("navButton").attr("utensil",user.utensils.indexOf(utensil)).attr("type","button").html("delete").click(function(evt) {
		deleteUtensil($(evt.currentTarget).attr("utensil"));
	}).appendTo(utensilDiv);
};

// add new ingredient
$("#addIngredientButton").click(function() {
	$("#new-ingredient").parent().show();
});

$("#add-ingredient").click(function() {
	if ($("#ingredient-name").val() === undefined) {
		alert("Your ingredient needs a name!");
		return;
	}
	if (isNaN($("#ingredient-qty").val())) {
		alert("Your ingredient needs a numerical quantity!");
		return;
	}
	if (isNaN($("#ingredient-price").val())) {
		alert("Your ingredient needs a numerical price!");
		return;
	}
    user.ingredients.push(new Ingredient($("#ingredient-name").val(), $("#ingredient-qty").val(), $("#ingredient-price").val()));
    user.updateServer(showIngredient(user.ingredients[user.ingredients.length-1]));
	$("#new-ingredient").parent().hide();
	$("#new-ingredient")[0].reset();
});

$("#cancel-ingredient").click(function() {
	$("#new-ingredient").parent().hide();
	$("#new-ingredient")[0].reset();
});

// add new utensil
$("#addUtensilButton").click(function() {
	$("#new-utensil").parent().show();
});

$("#add-utensil").click(function() {
	if ($("#utensil-name").val() === undefined) {
		alert("Your utensil needs a name!");
		return;
	}
	if (isNaN($("#utensil-qty").val())) {
		alert("Your utensil needs a numerical quantity!");
		return;
	}
    user.utensils.push(new Utensil($("#utensil-name").val(), $("#utensil-qty").val()));
    user.updateServer(showUtensil(user.utensils[user.utensils.length-1]));
	$("#new-utensil").parent().hide();
	$("#new-utensil")[0].reset();
});

$("#cancel-utensil").click(function() {
	$("#new-utensil").parent().hide();
	$("#new-utensil")[0].reset();
});

// delete ingredient
var deleteIngredient = function(index) {
	user.ingredients.splice(index,1);
	user.updateServer($(".ingredient")[index].remove());
};

// delete utensil
var deleteUtensil = function(index) {
	user.utensils.splice(index,1);
	user.updateServer($(".utensil")[index].remove());
};

// set the nav bar buttons on the right

$("#startButton").click(function() {
	window.location.href = "/static/home/meals/new.html?uid=" + user.id;
});

$("#myBotlucksBttn").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#mycanvas").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#botluckTitle").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
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
