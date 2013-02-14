$.getScript("Supply.js",function(){});

function Utensil(id, name, amount) {
	Supply.call(this, id, name, amount);
}