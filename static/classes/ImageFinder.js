function ImageFinder(searchTerm, element) {
	var self = this;
	this.element = element;

	setTimeout(function(){
		google.load('search', '1', {"callback":""});
		setTimeout(function(){
			self.searcher = new google.search.ImageSearch();
			self.searcher.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_MEDIUM);
			self.searcher.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search.SAFESEARCH_STRICT);
			self.searcher.setRestriction(google.search.ImageSearch.RESTRICT_RIGHTS, google.search.ImageSearch.RIGHTS_MODIFICATION);
			self.searcher.setResultSetSize(8);
			self.searcher.setSearchCompleteCallback(self, self.searchComplete, [self.searcher]);
			self.searcher.execute(searchTerm);
		}, 100);
	}, 1);

	this.searchComplete = function(searcher) {
		var result = searcher.results[Math.floor(Math.random()*searcher.results.length)];
		self.element.css("background-image","url('"+result.tbUrl+"')");
		self.element.css("background-repeat","no-repeat");
		self.element.css("background-size","cover");
		self.element.css("background-position","center");
		self.element.html("");
	};

}