function Meal(id, ownerId, name, recipe, userIds) {
	if (id !== undefined) this.id = id;
	if (ownerId !== undefined) this.ownerId = ownerId;
	if (name !== undefined) this.name = name;
	if (recipe !== undefined) this.recipe = recipe;
	if (userIds !== undefined) this.userIds = userIds;
	this.startTime = new Date();

	this.initFromServer = function(id) {
		var self = this;
		$.ajax({
			type: "get",
			url: "/meal/" + id,
			success: function(data) {
				if (data.success) {
					self.fromJSON(data.mealData);
				}
				if (callbackfn != undefined) {
					callbackfn();
				}
			}
		});
	};

	this.updateServer = function(callbackfn) {
		$.ajax({
			type: "post",
			url: "/meal/" + this.id,
			data: { "mealData": this.toJSON() },
			success: function(data) {
				if (callbackfn !== undefined) {
					callbackfn();
				}
			}
		});
	};

	this.inviteUser = function(userId) {
		$.ajax({
			type: "post",
			url: "/invite",
			data: {
				"mealId": this.id,
				"userId": userId
			},
			success: function(data) {}
		});
	};

	this.fromJSON = function(data) {
		if (data.id !== undefined) this.id = data.id;
		if (data.ownerId !== undefined) this.ownerId = data.ownerId;
		if (data.name !== undefined) this.name = data.name;
		var recipe = new Recipe();
		if (data.recipe !== undefined) this.recipe = recipe.fromJSON(data.recipe);
		if (data.userIds !== undefined) this.userIds = data.userIds;
		if (data.contributions !== undefined) this.contributions = JSON.parse(data.contributions);
		if (data.startTime !== undefined) this.startTime = data.startTime;
		if (data.endTime !== undefined) this.endTime = data.endTime;
	};

	this.toJSON = function() {
		return JSON.stringify(this);
	};
}

// initiates a new meal on the server side
// returns the id of the meal
var createNewMeal = function(ownerId, name, recipe, userIds) {
	var id;
	$.ajax({
		type: "get",
		url: "/mealId",
		success: function(data) {
			if (data.success) {
				console.log(data.id);
				return (new Meal(data.id, ownerId, name, recipe, userIds));
			}
		}
	});
};
