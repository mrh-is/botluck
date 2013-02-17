$.getScript("/static/js/Recipe.js",function(){});

var mealID = 0;

function Meal(ownerId, name, recipe, userIds) {
	this.id = mealID++;
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