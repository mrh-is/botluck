function User(id, name) {
	this.self = 
	this.id = id;
	this.name = name;
	
	function addFriend(id) {
		this.friends.push(id);
	}

	function addIngredient(ingredient) {
		this.ingredients.push(ingredient);
	}

	function addUtensil(utensil) {
		this.utensils.push(utensil);
	}
}

User.prototype.id = -1;
User.prototype.name = "";
User.prototype.ingredients = [];
User.prototype.friends = [];
User.prototype.utensils = [];
User.prototype.karma = 0;
User.prototype.history = [];
User.prototype.currentMeals = [];
User.prototype.invites = [];
User.prototype.dirpath = "../../../data/users";

/* Test User */
var TEST_USER = new User(1, "Test User");
TEST_USER.addIngredient(new Ingredient(4, "tomatoes", 1, 1));