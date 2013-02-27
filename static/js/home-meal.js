var user;
var friendInfo; // map of userid to username
var userIngredientsMap = {}; // map of userids to ingredients list
var meal;
var mealfinder = new MealFinder();
var isOwner = false;
var page = 1;
var allIngredients = [];

var checkValidIds = function() {
	var len;
	// check that meal is valid by checking ownerId
	if (meal.ownerId === -1) {
		// ensure that meal is removed from users current meals
		if (user.removeMeal(meal.id)) {
			var callbackfn = function() {
				alert("You are not invited to this meal.");
				window.location.href = "/static/error.html?uid=" + user.id;
			};
			user.history.push(meal.id);
			user.updateServer(callbackfn);
		} else {
			alert("You have tried to access a deleted meal");
			window.location.href = "/static/error.html?uid=" + user.id;
		}
		return;
	}

	// check that user is part of meal
	if (!meal.userIsInMeal(user.id)) {
		// ensure that meal is removed from users current meals
		if (user.removeMeal(meal.id)) {
			var callbackfn = function() {
				alert("You are not invited to this meal.");
				window.location.href = "/static/error.html?uid=" + user.id;
			};
			if (!user.isInHistory(meal.id)) {
				user.history.push(meal.id);
			}
			user.updateServer(callbackfn);
		} else {
			alert("You are not invited to this meal.");
			window.location.href = "/static/error.html?uid=" + user.id;
		}
		return;
	}

	populatePageData();
};

var populatePageData = function() {
	$("#meal-name").html(meal.name);

	var startTime = new Date(meal.startTime);
	var timeString = startTime.toUTCString();
	$("#start-time").html(timeString);
	var endTime = new Date(meal.endTime);
	timeString = endTime.toUTCString();
	$("#end-time").html(timeString);
	$("#prev-page").hide(); // hide prev page bttn until page > 1
	if (user.id !== meal.ownerId) {
		$("#choose-recipe-bttn").hide();
	}
	populateMyData();
};

var populateMyData = function() {
	var mainDiv = $("#my-contributions").html("");
	var list;
	if (meal.recipeChosen) {
		list = meal.contributions[user.id];
	} else {
		list = user.ingredients;
		allIngredients = allIngredients.concat(list);
	}
	$.each(list, function(i, ingredient) {
		var wrapper = $("<div>").addClass("contribution");
		var thing = new ImageFinder(ingredient.name,$("<div>").addClass("photo").html("a food photo").appendTo(wrapper));
		$("<div>").addClass("caption").html(ingredient.name).appendTo(wrapper);
		wrapper.appendTo(mainDiv);
	});

	populateFriendData();
};

var populateFriendData = function() {
	var wrapper = $("#friendRows").html("");
	var populate = function(userIngredients, usersData) {
		friendInfo = usersData;
		userIngredientsMap = userIngredients;
		$.each(userIngredients, function(id, ingredients) {
			if (parseInt(id) !== user.id) {
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
				if (ingredients.length === 0) {
					$("<div>").addClass("date").html(" nothing").appendTo(contributions);
				}
				$.each(ingredients, function(i, ingredient) {
					var contribution = $("<div>").addClass("contribution");
					new ImageFinder(
						ingredient.name,
						$("<div>").addClass("photo").appendTo(contribution)
					);
					$("<div>").addClass("caption").html(ingredient.name).appendTo(contribution);
					contribution.appendTo(contributions);
				});

				contributions.appendTo(friendRow);
				friendRow.appendTo(wrapper);
			}
		});
	};

	var getUserInfo = function(userIds, userIngredients) {
		if (userIds === undefined || userIds.length === 0) {
			populate(userIngredients, {});
		} else {
			$.ajax({
				type: "get",
				url: "/friendsInfo/" + userIds.join(","),
				success: function(data) {
					if (data.success) {
						populate(userIngredients, data.usersData);
					}
				}
			});
		}
	};

	var users = [];
	meal.userIds.forEach(function(id) {
		if (id !== user.id) {
			users.push(id);
		}
	});
	if (user.id !== meal.ownerId) {
		users.push(meal.ownerId);
	}

	if (meal.recipeChosen) { // get ingredients from contributions
		getUserInfo(users, meal.contributions);
	}
	else { //display all ingredients from everyone
		mealfinder.findUserIngredients(users, function(userIngredients) {
			getUserInfo(users, userIngredients);
		});
	}

	populateRecipeData();
};

var populateRecipeData = function() {

	var generateRecipeDiv = function(recipe) {
		var div = $("<div>").addClass("recipe");
		$("<img>").attr("src", recipe.thumbnail).appendTo(
			$("<div>").addClass("photo").appendTo(div));
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
		});
		titleString += line;
		$("<div>").addClass("caption").html(titleString).appendTo(div);
		return div;
	};

	var addRecipesToList = function(list) {
		$("#recipe-list").html("");
		$.each(list, function(i, recipe) {
			var item = $("<li>");
			var recipeDiv = generateRecipeDiv(recipe);
			recipeDiv.appendTo(item);
			var bttn = $("<button class='navButton' type='button'>view recipe</button>");
			var newbttn = $("<button class='navButton like' type='button'>");
			if (meal.voteCount[recipe.title] !== undefined) {
				var votes = meal.voteCount[recipe.title].length;
				newbttn.html("like (votes: " + votes + ")");
			} else {
				newbttn.html("like");
			}
			(function() {
				var url = recipe.href;
				bttn.click(function() {
					window.location.href = url;
				});

				var recipeTitle = recipe.title;
				newbttn.click(function() {
					if (meal.voteCount === undefined) {
						meal.voteCount = {};
					}
					var voters = meal.voteCount[recipeTitle];
					if (voters === undefined) {
						meal.voteCount[recipeTitle] = [user.id];
						meal.updateServer();
					} else {
						// check if user already voted
						var alreadyVoted = false;
						for (var i=0; i < voters.length; i++) {
							if (parseInt(voters[i]) === user.id) {
								alreadyVoted = true;
								break;
							}
						}
						if (!alreadyVoted) {
							meal.voteCount[recipeTitle].push(user.id);
							meal.updateServer();
						}
					}
					$(this).html("like (votes: " + meal.voteCount[recipeTitle].length + ")");
				});
			})();
			bttn.appendTo(recipeDiv);
			if (!meal.recipeChosen) {
				newbttn.appendTo(recipeDiv);
			}
			(function() {
				var r = recipe;
				item.click(function() {
					meal.chooseRecipe(r);
					$("#current-choice").html(r.title);
				});
			})();
			item.appendTo(wrapper);
		});
	};
	if (meal.recipeChosen) { // hide some stuff
		$("#choose-recipe-bttn").hide();
		$("#prev-page").hide();
		$("#next-page").hide();
		$("#choice-title").hide();
		$("#recipe-list").hide();
		$("#remove-user-bttn").hide();
		var choiceDiv = generateRecipeDiv(meal.recipe);
		var bttn = $("<button class='navButton' type='button'>view recipe</button>");
		(function() {
			var url = meal.recipe.url;
			bttn.click(function() {
				window.location.href = url;
			});
		})();
		bttn.appendTo(choiceDiv);
		$("#current-choice").after(choiceDiv);
		$("#ingredients-title").html("What I'm Bringing");

		// generate meal finished button if it is the owner
		if (user.id === meal.ownerId) {
			var finishedBttn = $("<button class='navButton' type='button'>Finished Meal!</button>");
			finishedBttn.click(function() {
				alert("This meal is finished and is being deleted");
				// update all users  by removing meal from currentMeals
				// and adding meal to history
				var updateUser = function(ids) {
					if (ids.length === 0) {
						window.location.href = "/static/home.html?uid=" + user.id;
					} else {
						var id = ids.splice(0,1)[0];
						var user2 = new User();
						user2.initFromServer(id, function(){
							user2.removeMeal(meal.id);
							if (!user2.isInHistory(meal.id)) {
								user2.history.push(meal.id);
							}
							user2.updateServer(function() {
								updateUser(ids);
							});
						});
					}
				};

				// set meal to deleted
				meal.ownerId = -1;
				var callbackfn = function() {
					var uids = meal.userIds;
					uids.push(user.id);
					updateUser(uids);
				};
				meal.updateServer(callbackfn);
			});
			var msg = $("<div>").text("Click finished when you've eaten your meal!");
			$("<br>").appendTo(msg);
			finishedBttn.appendTo(msg);
			choiceDiv.after(msg);
		}

		// generate missing ingredients
		$.each(meal.missingIngredients, function(i, ingredient) {
			var missing = $("<div>").addClass("contribution");
			$("<div>").addClass("photo").html("a food photo").appendTo(missing);
			$("<div>").addClass("caption").html(ingredient.name).appendTo(missing);
			missing.appendTo($("#missing"));
		});
	} else {
		var wrapper = $("#recipe-list").html("LOADING");
		$("#missing-ingredients").hide();
		mealfinder.findMeals(allIngredients, page, addRecipesToList);
	}
};

$("#next-page").click(function() {
	page++;
	populateRecipeData();
	if (page > 1) {
		$("#prev-page").show();
	}
});

$("#prev-page").click(function() {
	page--;
	if (page <= 1) {
		page = 1;
		$(this).hide();
	}
	populateRecipeData();
});

// can't make it bttn
$("#remove-user-bttn").click(function() {
	var len;
	if (user.id === meal.ownerId) {
		alert("You are the creator of this meal. This will delete the planned meal.");
		meal.ownerId = -1; // default value for deleted meal
	} else {
		alert("You are being removed from this meal.");
		len = meal.userIds.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(meal.userIds[i]) === user.id) {
				meal.userIds.splice(i,1);
				break;
			}
		}
	}
	len = user.currentMeals.length;
	for (var i = 0; i < len; i++) {
		if (parseInt(user.currentMeals[i]) === meal.id) {
			user.currentMeals.splice(i,1);
			break;
		}
	}
	var callbackfn = function() {
		var goBack = function() {
			window.location.href = "/static/home.html?uid=" + user.id;
		}
		user.updateServer(goBack);
	};
	meal.updateServer(callbackfn);
});

// this button handles the logic behind contributions
$("#choose-recipe-bttn").click(function() {
	if (meal.recipe === undefined || 
		meal.ownerId !== user.id) {
		return;
	}
	meal.recipeChosen = true;
	var ingredients = meal.recipe.ingredients;
	meal.contributions = {};
	meal.missingIngredients = [];
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
			return !contributed;
		});
		if (!contributed) {
			meal.missingIngredients.push(ingredient)
		}
	});

	// ensure each userid is a key in contributions map
	var users = meal.userIds;
	users.push(meal.ownerId);
	$.each(users, function(i, id) {
		id = parseInt(id);
		if (meal.contributions[id] === undefined) {
			meal.contributions[id] = [];
		}
	});

	// load same page with recipe chosen this time
	var callbackfn = function() {
		window.location.href = "/static/home/meal.html?uid=" + user.id + "&mid=" + meal.id;
	}

	meal.updateServer(callbackfn);
});

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
		mid = parseInt(url.substring(j+4),10);
		uid = parseInt(url.substring(0, j).substring(i+4),10);
	} else {
		uid = parseInt(url.substring(i+4),10);
		mid = parseInt(url.substring(0, i).substring(j+4),10);
	}
	var id = parseInt(url.substring(i+4),10);
	if (isNaN(id)) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	var getMeal = function() {
		$("#karmaBadge").html(user.karma);
		// check if user created this meal
		$.each(user.currentMeals, function(i, mealId) {
			if (mealId === mid) {
				isOwner = true;
			}
		});
		meal = new Meal();
		meal.initFromServer(mid, checkValidIds);
	};

	user = new User();
	user.initFromServer(uid, getMeal);
};