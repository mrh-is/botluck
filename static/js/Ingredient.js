$.getScript("Supply.js",function(){});

function Ingredient(id, name, amount, price) {
	Supply.call(this, id, name, amount);
	this.price = price;
}

Ingredient.prototype.price = 0;