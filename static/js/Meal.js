$.getScript("/js/Recipe.js",function(){});
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
	/*var res = {};
	res.id = this.id;
	res.ownerId = this.ownerId;
	res.name = this.name;
	res.recipe = this.recipe.toJSON();
	res.userIds = data.userIds;
	res.contributions = JSON.stringify(this.contributions);
	res.startTime = this.startTime;
	res.endTime = this.endTime;*/
}