function MealFinder() {
	this.findMeals = function(ids, p, callbackfn) {
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
					getPossibleMeals(data.ingredients, p, callbackfn);
				} else {
					getPossibleMeals([], p, callbackfn);
				}
			}
		});	
	};

	// This makes the call to the Recipe Puppy Api 
	// which returns a 10 meals
	var getPossibleMeals = function(ingredients, page, callbackfn) {
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
		      if (callbackfn !== undefined && 
		      	data.results !== undefined) {
		      	callbackfn(data.results);
		      }
		   }
		});
	};
};