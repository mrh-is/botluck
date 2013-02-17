var utensilID = 0;

function Utensil(name, amount) {
	this.id = utensilID++;
	this.name = name;
	this.amount = amount;
}
Utensil.prototype.id = -1;
Utensil.prototype.name = "";
Utensil.prototype.amount = -1;