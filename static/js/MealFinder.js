function MealFinder() {
	this.findMeals = function(ids, p) {
		var page = p;
		if (page === undefined) {
			page = 1;
		}
		$.ajax({
			type: "get",
			url: "/allIngredients/" + ids.join(","),
			success: function(data) {
				console.log(data);
				if (data.success) {
					getPossibleMeals(data.ingredients, p);
				} else {
					getPossibleMeals([], p);
				}
			}
		});	
	};

	// This makes the call to the Recipe Puppy Api 
	// which returns a 10 meals
	var getPossibleMeals = function(ingredients, page) {
	    var names = []
	    ingredients.forEach(function(i) {
	        names.push(i.name);
	    });

	     $.ajax({
		   type: "GET",
		   dataType: "jsonp",
		   url: "http://www.recipepuppy.com/api/?i=" + names.join(",") + "&p="+page,
		   jsonpCallback: 'callback',
		   success: function(data) {
		      console.log(data);
		   }
		});
	};
};