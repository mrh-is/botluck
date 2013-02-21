$.getScript("/static/js/Ingredient.js", function(){});
$.getScript("/static/js/Utensil.js", function(){});
$.getScript("/static/js/Meal.js", function(){});
$.getScript("/static/js/Invite.js", function(){});

function User(userName, password, id) {
	if (userName !== undefined) this.userName = userName;
	if (password !== undefined) this.password = password;
	if (id !== undefined) this.id = id;

	var self = this;

	this.toJSON = function() {
		var data = {
			"id": this.id,
			"userName": this.userName,
			"password": this.password,
			"name": this.name,
			"ingredients": this.ingredients,
			"friends": this.friends,
			"utensils": this.utensils,
			"karma": this.karma,
			"history": this.history,
			"currentMeals": this.currentMeals,
			"invites": this.invites
		};
		return JSON.stringify(data);
	};

	this.fromJSON = function(data) {
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
};

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

User.prototype.initUserFromServer = function(id) {
	$.ajax({
		type: "get",
		url: "/user/" + id,
		success: function(data) {
			if (data.success) {
				this.fromJSON(data.userData);
			}
		}
	});
};

User.prototype.updateServer = function() {
	console.log(this);
	$.ajax({
		type: "post",
		url: "/user/" + this.id,
		data: this.stringify(),
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
};

console.log("here");