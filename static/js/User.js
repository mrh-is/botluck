$.getScript("/static/js/Ingredient.js", function(){});
$.getScript("/static/js/Utensils.js", function(){});
$.getScript("/static/js/Meal.js", function(){});
$.getScript("/static/js/Invite.js", function(){});

function User(userName, passwowrd, name) {
	this.userName = userName;
	this.password = password;
	this.name = name;
}

User.prototype.userName = "";
User.prototype.password = "";
User.prototype.name = "";
User.prototype.ingredients = [];
User.prototype.friends = [];
User.prototype.utensils = [];
User.prototype.karma = 0;
User.prototype.history = [];
User.prototype.currentMeals = [];
User.prototype.invites = [];
User.prototype.dirpath = "../../../data/users";

User.prototype.addIngredient = function(ingredient) {
	this.ingredients.push(ingredient);
};
User.prototype.addUtensil = function(utensil) {
	this.utensils.push(utensil);
};
User.prototype.addFriend = function(friendID) {
	this.friends.push(friendID);
};


/* Test User */
var TEST_USER = new User("Test User");
TEST_USER.addIngredient(new Ingredient("tomatoes", 1, 1));