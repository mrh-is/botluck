$.getScript("/static/js/Ingredient.js",function(){});
$.getScript("/static/js/Utensil.js",function(){});

var recipeID = 0;

function Recipe(name, ingredients, instructions, prepTime) {
	this.id = recipeID++;
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