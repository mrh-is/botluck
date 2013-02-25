var NOCHOICE = new Recipe("n/a", [], "", "");
function Meal(id, ownerId, name, userIds, startTime, endTime, choice) {
	if (id !== undefined) this.id = id;
	if (ownerId !== undefined) this.ownerId = ownerId;
	if (name !== undefined) this.name = name;
	if (userIds !== undefined) this.userIds = userIds;
	if (startTime !== undefined) this.startTime = startTime;
	if (endTime !== undefined) this.endTime = endTime;
	if (choice !== undefined) {
<<<<<<< HEAD
		this.choice = choice;
	}
	else {
		this.choice = NOCHOICE;
=======
>>>>>>> recipe finding
	}

	this.contributions = {};
	this.recipeChosen = false;

	this.contribute = function(id, ingredients) {
		this.contributions[id] = ingredients;
	};

	this.chooseRecipe = function(data) {
		this.recipeChosen = true;
		this.recipe = new Recipe();
		this.recipe.parse(data);
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
		if (data.id !== undefined) this.id = data.id;
		if (data.ownerId !== undefined) this.ownerId = data.ownerId;
		if (data.name !== undefined) this.name = data.name;
		if (data.userIds !== undefined) this.userIds = data.userIds;
		if (data.contributions !== undefined) this.contributions = data.contributions;
		if (data.startTime !== undefined) this.startTime = data.startTime;
		if (data.endTime !== undefined) this.endTime = data.endTime;
<<<<<<< HEAD
		if (data.choice !== undefined) {
			this.choice = data.choice;
		}
		else {
			this.choice = NOCHOICE;
=======
		if (data.recipe !== undefined) {
			this.recipe = data.recipe;
		} else {
			this.recipe = NOCHOICE;
>>>>>>> recipe finding
		}
		if (data.recipeChosen !== undefined) this.recipeChosen = data.recipeChosen;
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
			"recipeChosen": this.recipeChosen
		};
		return JSON.stringify(data);
	};
}