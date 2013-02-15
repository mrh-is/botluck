function Ingredient(id, name, amount, price) {
	this.id = id;
	this.name = name;
	this.amount = amount;
	this.price = price;
}
Ingredient.prototype.id = -1;
Ingredient.prototype.name = "";
Ingredient.prototype.amount = -1;
Ingredient.prototype.price = 0;