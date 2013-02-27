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

	this.removeMeal = function(mid) {
		if (this.currentMeals === undefined) {
			return false;
		}
		var len = this.currentMeals.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.currentMeals[i]) === mid) {
				this.currentMeals.splice(i,1);
				return true;
			}
		}
		return false;
	};

	this.hasFriend = function(uid) {
		if (this.friends === undefined) {
			return false;
		}
		var len = this.friends.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.friends[i]) === uid) {
				return true;
			}
		}
		return false;
	};

	this.removeFriend = function(uid) {
		if (this.friends === undefined) {
			return;
		}
		var len = this.friends.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.friends[i]) === uid) {
				user.friends.splice(i, 1);
				break;
			}
		}
	};

	this.isInHistory = function(mid) {
		if (this.history === undefined) {
			return false;
		}
		var len = this.history.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.history[i]) === meal.id) {
				return true;
			}
		}
		return false;
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