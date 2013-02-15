$.getScript("Recipe.js",function(){});
function Meal(id, ownerId, name, recipe, userIds) {
	this.id = id;
	this.ownerId = ownerId;
	this.name = name;
	this.recipe = recipe;
	this.userIds = userIds;
	this.startTime = new Date();

}

Meal.prototype.id = -1;
Meal.prototype.ownerId = -1;
Meal.prototype.name = "";
Meal.prototype.recipe = null;
Meal.prototype.userIds = [];
Meal.prototype.startTime = null;