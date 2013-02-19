$.getScript("/static/js/Recipe.js",function(){});
function Meal(id, ownerId, name, recipe, userIds) {
	if (id !== undefined) this.id = id;
	if (ownerId !== undefined) this.ownerId = ownerId;
	if (name !== undefined) this.name = name;
	if (recipe !== undefined) this.recipe = recipe;
	if (userIds !== undefined) this.userIds = userIds;
	this.startTime = new Date();
}

Meal.prototype.id = -1;
Meal.prototype.ownerId = -1;
Meal.prototype.name = "";
Meal.prototype.recipe = null;
Meal.prototype.userIds = [];
Meal.prototype.startTime = null;

Meal.prototype.fromJSON = function(data) {
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

Meal.prototype.toJSON = function() {
	return JSON.stringify(this);
}

Meal.prototype.initFromServer = function(id) {
	var self = this;
	$.ajax({
		type: "get",
		url: "/meal/" + id,
		success: function(data) {
			if (data.success) {
				self.fromJSON(data.mealData);
			}
		}
	});
};

Meal.prototype.updateServer = function() {
	$.ajax({
		type: "post",
		url: "/meal/" + this.id,
		data: this.toJSON(),
		success: function(data) {

		}
	});
};

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
}