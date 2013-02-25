var user;
var friendInfo;
var userIngredientsMap = {};
var meal;
var mealfinder = new MealFinder();
var isOwner = false;
var page = 1;
var allIngredients = [];

var populatePageData = function() {
	$("#meal-name").html(meal.name);

	var startTime = new Date(meal.startTime);
	var timeString = startTime.toUTCString();
	$("#start-time").html(timeString);
	var endTime = new Date(meal.endTime);
	timeString = endTime.toUTCString();
	$("#end-time").html(timeString);
	populateMyData();
};

var populateMyData = function() {
	var mainDiv = $("#my-contributions");
	var list;
	if (meal.recipeChosen) {
		list = meal.contributions[user.id];
	} else {
		list = user.ingredients;
		allIngredients = allIngredients.concat(list);
	}
	$.each(list, function(i, ingredient) {
		var wrapper = $("<div>").addClass("contribution");
		$("<div>").addClass("photo").html("a food photo").appendTo(wrapper);
		$("<div>").addClass("caption").html(ingredient.name).appendTo(wrapper);
		wrapper.appendTo(mainDiv);
	});

	populateFriendData();
};

var populateFriendData = function() {
	var wrapper = $("#friendRows").html("");
	var populate = function(userIngredients, usersData) {
		friendInfo = usersData;
		userInredientsMap = userIngredients;
		$.each(userIngredients, function(id, ingredients) {
			if (id !== user.id) {
				allIngredients = allIngredients.concat(ingredients);
				var friendRow = $("<div>").addClass("friendRow");
				$("<div>").addClass("caption")
					.html(usersData[id])
					.appendTo(friendRow);
				var friend = $("<div>").addClass("friend");
				$("<div>").addClass("photo").html("a profile photo").appendTo(friend);
				friend.appendTo(friendRow);
				if (meal.recipeChosen) { // displaying contributions
					$("<div>").addClass("date").html("is bringing").appendTo(friendRow);
				} else { // display all user ingedients
					$("<div>").addClass("date").html("has").appendTo(friendRow);
				}				
				var contributions = $("<div>").addClass("friendContributions");
				$.each(ingredients, function(i, ingredient) {
					var contribution = $("<div>").addClass("contribution");
					$("<div>").addClass("photo").html("a food photo").appendTo(contribution);
					$("<div>").addClass("caption").html(ingredient.name).appendTo(contribution);
					contribution.appendTo(contributions);
				});

				contributions.appendTo(friendRow);
				friendRow.appendTo(wrapper);
			}
		});
	};

	var getUserInfo = function(userIngredients) {
		$.ajax({
			type: "get",
			url: "/friendsInfo/" + meal.userIds.join(","),
			success: function(data) {
				if (data.success) {
					populate(userIngredients, data.usersData);
				}
			}
		})
	};

	if (meal.recipeChosen) { // get ingredients from contributions
		getUserInfo(meal.contributions);
	} else { //display all ingredients from everyone 
		mealfinder.findUserIngredients(meal.userIds, getUserInfo);
	}

	populateRecipeData();
};

var populateRecipeData = function() {
	var wrapper = $("#recipe-list").html("");
	var addRecipesToList = function(list) {
		$.each(list, function(i, recipe) {
			var item = $("<li>").addClass("recipe");
			$("<img>").attr("src", recipe.thumbnail).appendTo(
				$("<div>").addClass("photo").appendTo(item));
			// insert break lines into every 30 characters of the title
			var titleString = "";
			var line = "";
			var words = recipe.title.split(" ");
			$.each(words, function(i, word) {
				if (line.length + word.length > 25) {
					titleString += line + "<br>";
					line = word;
				} else {
					line += word + " ";
				}
			})
			titleString += line;
			$("<div>").addClass("caption").html(titleString).appendTo(item);
			var bttn = $("<button class='navButton' type='button'>view recipe</button>");
			(function() {
				var url = recipe.url;
				bttn.click(function() {
					window.location.href = url;
				});
			})();
			bttn.appendTo(item);
			(function() {
				var r = recipe;
				item.click(function() {
					meal.chooseRecipe(r);
					$("#current-choice").html(r.title);
				});
			})();
			item.appendTo(wrapper);
		});
	}
	if (meal.recipeChosen) {
		addRecipesToList([meal.recipe]);
		$("#ingredients-title").html("What I'm Bringing");
	} else {
		mealfinder.findMeals(allIngredients, page, addRecipesToList);
	}
};

$("#next-page").click(function() {
	page++;
	populateRecipeData();
});

$("#prev-page").click(function() {
	page--;
	if (page < 1) page = 1;
	populateRecipeData();
});

// this button handles the logic behind contributions
$("#choose-recipe-bttn").click(function() {
	if (meal.recipe === undefined) {
		return;
	}
	var ingredients = meal.recipe.ingredients;
	$.each(ingredients, function(i, ingredient) {
		var contributed = false;
		$.each(userIngredientsMap, function(id, uingreds) {
			for (var j = 0; j < uingreds.length; j++) {
				if (uingreds[j].name === ingredient.name) {
					contributed = true;
					if (meal.contributions[id] === undefined) {
						meal.contributions[id] = [ingredient];
					} else {
						meal.contributions[id].push(ingredient);
					}
					break;
				}
			}
			return (!contributed);
		});
	});
	console.log(meal);
});

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

window.onload = function() {
	var url = window.location.href;
	var i = url.indexOf("uid=");
	var j = url.indexOf("mid=");
	var uid;
	var mid;
	if (i === -1 || j === -1) {
		console.log("You were redirected to meal without a vaild user id or meal id");
		return;
	}
	if (i <= j) { // mid after uid
		mid = parseInt(url.substring(j+4));
		uid = parseInt(url.substring(0, j).substring(i+4));
	} else {
		uid = parseInt(url.substring(i+4));
		mid = parseInt(url.substring(0, i).substring(j+4));
	}
	var id = parseInt(url.substring(i+4));
	if (id === NaN) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	var getMeal = function() {
		// check if user created this meal
		$.each(user.currentMeals, function(i, mealId) {
			if (mealId === mid) {
				isOwner = true;
			}
		});
		meal = new Meal();
		meal.initFromServer(mid, populatePageData);
	};

	user = new User();
	user.initFromServer(uid, getMeal);
};