var NORECIPE = new Recipe("n/a", [], "", "");
function Meal(id, ownerId, name, invitedIds, startTime, endTime) {
	if (id !== undefined) this.id = id;
	if (ownerId !== undefined) this.ownerId = ownerId;
	if (name !== undefined) this.name = name;
	if (startTime !== undefined) this.startTime = startTime;
	if (endTime !== undefined) this.endTime = endTime;
	if (invitedIds !== undefined) this.invitedIds = invitedIds;
	this.recipe = NORECIPE;

	this.userIds = [];
	this.contributions = {};
	this.recipeChosen = false;
	this.voteCount = {};
	this.missingIngredients = [];

	this.contribute = function(id, ingredients) {
		this.contributions[id] = ingredients;
	};

	this.chooseRecipe = function(data) {
		this.recipe = new Recipe();
		this.recipe.parse(data);
	};

	this.userIsInMeal = function(uid) {
		if (this.ownerId === uid) {
			return true;
		}
		if (this.userIds === undefined) {
			return false;
		}
		var len = this.userIds.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.userIds[i]) === uid) {
				return true;	
			}
		}
		return false;
	};

	this.userIsInvited = function(uid) {
		if (this.ownerId === uid) {
			return true;
		}
		if (this.invitedIds === undefined) {
			return false;
		}
		var len = this.invitedIds.length;
		for (var i = 0; i < len; i++) {
			if (parseInt(this.invitedIds[i]) === uid) {
				return true;
			}
		}
		return false;
	};

	this.initFromServer = function(id, callbackfn) {
		var self = this;
		$.ajax({
			type: "get",
			url: "/meal/" + id,
			success: function(data) {
				if (data.success) {
					self.fromJSON(data.mealData);
				}
				if (callbackfn !== undefined) {
					callbackfn();
				}
			}
		});
	};

	this.updateServer = function(callbackfn) {
		var mealData = this.toJSON();
		$.ajax({
			type: "post",
			url: "/meal/" + this.id,
			data: {
				"mealData": mealData
			},
			success: function(data) {
				if (callbackfn !== undefined) {
					callbackfn(data);
				}
			}
		});
	};

	this.inviteUser = function(userId, name, date) {
		$.ajax({
			type: "post",
			url: "/invite",
			data: {
				"mid": this.id,
				"uid": userId,
				"name": name,
				"date": date
			},
			success: function(data) {}
		});
	};

	this.fromJSON = function(data) {
		if (data.id !== undefined) this.id = parseInt(data.id);
		if (data.ownerId !== undefined) this.ownerId = parseInt(data.ownerId);
		if (data.name !== undefined) this.name = data.name;
		if (data.userIds !== undefined) this.userIds = data.userIds;
		if (data.contributions !== undefined) this.contributions = data.contributions;
		if (data.startTime !== undefined) this.startTime = data.startTime;
		if (data.endTime !== undefined) this.endTime = data.endTime;
		if (data.recipe !== undefined) {
			this.recipe = data.recipe;
		} else {
			this.recipe = NORECIPE;
		}
		if (data.recipeChosen !== undefined) this.recipeChosen = data.recipeChosen;
		if (data.voteCount !== undefined) this.voteCount = data.voteCount;
		if (data.missingIngredients !== undefined) this.missingIngredients = data.missingIngredients;
		if (data.invitedIds !== undefined) this.invitedIds = data.invitedIds;
	};

	this.toJSON = function() {
		var data = {
			"id": this.id,
			"ownerId": this.ownerId,
			"name": this.name,
			"userIds": this.userIds,
			"contributions": this.contributions,
			"startTime": this.startTime,
			"endTime": this.endTime,
			"recipe": this.recipe,
			"recipeChosen": this.recipeChosen,
			"voteCount": this.voteCount,
			"missingIngredients": this.missingIngredients,
			"invitedIds": this.invitedIds
		};
		return JSON.stringify(data);
	};
}