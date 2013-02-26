function User(userName, password, id, name) {
	if (userName !== undefined) this.userName = userName;
	if (password !== undefined) this.password = password;
	if (id !== undefined) this.id = id;
	if (name !== undefined) this.name = name;

	this.name = "";
	this.ingredients = [];
	this.friends = [];
	this.utensils = [];
	this.karma = 0;
	this.history = [];
	this.currentMeals = [];
	this.invites = [];

	this.addIngredient = function(ingredient) {
		this.ingredients.push(ingredient);
	};

	this.addUtensil = function(utensil) {
		this.utensils.push(utensil);
	};

	this.addFriend = function(friendID) {
		this.friends.push(friendID);
	};

	this.addInvite = function(invite) {
		this.invites.push(invite);
	}

	this.addMeal = function(meal) {
		this.currentMeals.push(meal);
	}

	this.initFromServer = function(id, callbackfn) {
		var self = this;
		$.ajax({
			type: "get",
			url: "/user/" + id,
			success: function(data) {
				if (data.success) {
					self.fromJSON(data.userData);
				}
				if (callbackfn != undefined) {
					callbackfn(self);
				}
			}
		});
	};

	this.updateServer = function(callbackfn) {
		$.ajax({
			type: "post",
			url: "/user/" + this.id,
			data: { "userData": this.toJSON() },
			success: function(data) {
				if (callbackfn !== undefined) {
					callbackfn();
				}
			}
		});
	};

	this.acceptInvite = function(mealId) {
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
		var user = this;
		if (data.id !== undefined) user.id = parseInt(data.id);
		if (data.userName !== undefined) user.userName = data.userName;
		if (data.name !== undefined) user.name = data.name;
		if (data.ingredients !== undefined) {
			data.ingredients.forEach(function(ingredient) {
				user.ingredients.push(new Ingredient(ingredient.name, ingredient.amount, ingredient.price));
			});
		}
		if (data.friends !== undefined) user.friends = data.friends;
		if (data.utensils !== undefined) user.utensils = data.utensils;
		if (data.karma !== undefined) user.karma = data.karma;
		if (data.history !== undefined) user.history = data.history;
		if (data.currentMeals !== undefined) user.currentMeals = data.currentMeals;
		if (data.invites !== undefined) user.invites = data.invites;
	};
};