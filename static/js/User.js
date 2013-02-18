$.getScript("/static/js/Ingredient.js", function(){});
$.getScript("/static/js/Utensils.js", function(){});
$.getScript("/static/js/Meal.js", function(){});
$.getScript("/static/js/Invite.js", function(){});

var userID = 0;

function User(userName, password, name) {
	this.id = userID++;
	if (userName !== undefined) this.userName = userName;
	if (password !== undefined) this.password = password;
	if (name !== undefined) this.name = name;
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
User.prototype.addFriend = function(id) {
	this.friends.push(id);
};
User.prototype.addFriend = function(friendID) {
	this.friends.push(friendID);
};

User.prototype.fromJSON = function(data) {
	if (data.id !== undefined) this.id = data.id;
	if (data.userName !== undefined) this.userName = data.userName;
	if (data.name !== undefined) this.name = data.name;
	if (data.ingredients !== undefined) this.ingredients = data.ingredients;
	if (data.friends !== undefined) this.friends = data.friends;
	if (data.utensils !== undefined) this.utensils = data.utensils;
	if (data.karma !== undefined) this.karma = data.karma;
	if (data.history !== undefined) this.history = data.history;
	if (data.currentMeals !== undefined) this.currentMeals = data.currentMeals;
	if (data.invites !== undefined) this.invites = data.invites;
};

/* Test User */
var TEST_USER = new User(1, "Beyonce");
TEST_USER.addIngredient(new Ingredient("tomatoes", 1, 1));