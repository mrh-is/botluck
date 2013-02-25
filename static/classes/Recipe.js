function Recipe(title, ingredients, url, thumbnail) {
	if (title !== undefined) this.title = title;
	if (ingredients !== undefined) this.ingredients = ingredients;
	if (url !== undefined) this.url = url;
	if (thumbnail !== undefined) this.thumbnail = thumbnail;

	// parse according to format from Puppy Recipes
	this.parse = function(data) {
		this.title = $.trim(data.title);
		this.url = decodeURI(data.href);
		this.thumbnail = decodeURI(data.thumbnail);
		var ingredients = [];
		var ingredientNames = data.ingredients.split(", ");
		$.each(ingredientNames, function(i, name) {
			ingredients.push(new Ingredient(name));
		});
		this.ingredients = ingredients;
	};
};