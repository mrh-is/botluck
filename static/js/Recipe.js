$.getScript("/js/Ingredient.js",function(){});
$.getScript("/js/Utensil.js",function(){});
function Recipe(id, name, ingredients, instructions, prepTime) {
	this.id = id;
	this.name = name;
	this.ingredients = ingredients;
	this.instructions = instructions;
	this.prepTime = prepTime;
}

Recipe.prototype.id = -1;
Recipe.prototype.name = "";
Recipe.prototype.ingredients = [];
Recipe.prototype.instructions = [];
Recipe.prototype.prepTime = -1;