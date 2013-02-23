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