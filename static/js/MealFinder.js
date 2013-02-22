function MealFinder() {
	this.findMeals = function(ids) {
		$.ajax({
			type: "get",
			url: "/allIngredients/" + ids.join(","),
			success: function(data) {
				console.log(data);
				if (data.success) {
					getPossibleMeals(data.ingredients);
				} else {
					getPossibleMeals([]);
				}
			}
		});	
	};

	// This makes the call to the Recipe Puppy Api 
	// which returns a nice JSON file
	var getPossibleMeals = function(ingredients) {
	    var names = []
	    ingredients.forEach(function(i) {
	        names.push(i.name);
	    });

	    $.ajax({
	        type: "get",
	        url: "http://www.recipepuppy.com/api/?i=" + names.join(","),
	        success: function(data) {
	            if (data.results.length === 0) {
	                console.log(data.results);
	            } else {
	                
	            }
	        }
	    });
	};
};