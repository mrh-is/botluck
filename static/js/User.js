$.getScript("/static/js/Ingredient.js", function(){});
$.getScript("/static/js/Utensil.js", function(){});
$.getScript("/static/js/Meal.js", function(){});
$.getScript("/static/js/Invite.js", function(){});

function User(userName, password, id) {
	if (userName !== undefined) this.userName = userName;
	if (password !== undefined) this.password = password;
	if (id !== undefined) this.id = id;
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

User.prototype.toJSON = function() {
	return JSON.stringify(this);
}

User.prototype.initFromServer = function(id) {
	var self = this;
	$.ajax({
		type: "get",
		url: "/user/" + id,
		success: function(data) {
			if (data.success) {
				self.fromJSON(data.userData);
			}
		}
	});
};

User.prototype.updateServer = function() {
	$.ajax({
		type: "post",
		url: "/user/" + this.id,
		data: this.toJSON(),
		success: function(data) {

		}
	});
};

User.prototype.acceptInvite = function(mealId) {
	$.ajax({
		type: "post",
		url: "/acceptInvite",
		data: {
			"userId": this.id,
			"mealId": mealId
		},
		success: function(data) {}
	});
}

// takes a username and password, and tells the server to create
// a new user. The server returns the new user id
var createNewUser = function(username, password) {
	var id;
	var wait = true;
	var user = undefined;
	$.ajax({
		type: "post",
		url: "/user",
		data: {
			"username": username,
			"password": password
		},
		success: function(data) {
			if (data.success) {
				user = new User(username, password, data.id);
				wait = false;
			}
		}
	});
	while (wait) {}
	return user;
}


/* Test User */
var TEST_USER = createNewUser("Beyonce", "1234");
TEST_USER.addIngredient(new Ingredient("tomatoes", 1, 1));
TEST_USER.addIngredient(new Ingredient("onions", 1, 1));
TEST_USER.addIngredient(new Ingredient("garlic", 1, 1));
TEST_USER.addIngredient(new Ingredient("potatoes", 1, 1));
TEST_USER.addIngredient(new Ingredient("pasta", 1, 1));
TEST_USER.addIngredient(new Ingredient("chicken breast", 1, 1));
TEST_USER.name = "Beyonce Knowles";
TEST_USER.addUtensil(new Utensil("spoons", 1, 1));
TEST_USER.addUtensil(new Utensil("forks", 1, 1));
TEST_USER.addUtensil(new Utensil("knives", 1, 1));
TEST_USER.karma = 10;
TEST_USER.updateServer();