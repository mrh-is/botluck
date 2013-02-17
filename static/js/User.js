$.getScript("/static/js/Ingredient.js", function(){});
$.getScript("/static/js/Utensils.js", function(){});
$.getScript("/static/js/Meal.js", function(){});
$.getScript("/static/js/Invite.js", function(){});

var userID = 0;

function User(userName, password, name) {
	this.id = userID++;
	this.userName = userName;
	this.password = password;
	this.name = name;
}

User.prototype.id = -1;
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

User.prototype.addIngredient = function(ingredient) {
	this.ingredients.push(ingredient);
};
User.prototype.addUtensil = function(utensil) {
	this.utensils.push(utensil);
};
User.prototype.addFriend = function(friendID) {
	this.friends.push(friendID);
};

User.prototype.fromJSON = function(data) {
	this.id = data.id;
	this.userName = data.userName;
	this.name = data.name;
	this.ingredients = data.ingredients;
	this.friends = data.friends;
	this.utensils = data.utensils;
	this.karma = data.karma;
	this.history = data.history;
	this.currentMeals = data.currentMeals;
	this.invites = data.invites;
};

/* Test User */
var TEST_USER = new User("Test User");
TEST_USER.addIngredient(new Ingredient("tomatoes", 1, 1));