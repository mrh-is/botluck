function MealFinder() {
	this.findUserIngredients = function(ids, callbackfn) {
		if (ids === undefined || ids.length === 0) {
			if (callbackfn !== undefined) {
				callbackfn([]);
			}
			return;
		}
		$.ajax({
			type: "get",
			url: "/allIngredients/" + ids.join(","),
			success: function(data) {
				if (data.success && 
					callbackfn !== undefined) {
					callbackfn(data.ingredients);
				}
			}
		});
	};

	// makes the call to the Recipe Puppy API
	// and calls callbackfn on the results
	this.findMeals = function(ingredients, p, callbackfn) {
		var page = p;
		if (page === undefined) {
			page = 1;
		}

		var names = [];
	    $.each(ingredients, function(i, ingredient) {
	        names.push(ingredient.name);
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