$.getScript("/js/Ingredient.js", function(){});
$.getScript("/js/Utensils.js", function(){});
$.getScript("/js/Meal.js", function(){});
function User(id, name) {
	this.id = id;
	this.name = name;
}

User.prototype.id = -1;
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
User.prototype.addFriend = function(id) {
	this.friends.push(id);
};

/* Test User */
var TEST_USER = new User(1, "Test User");
TEST_USER.addIngredient(new Ingredient(4, "tomatoes", 1, 1));