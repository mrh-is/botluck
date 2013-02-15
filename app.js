var express = require("express");	// imports express
var app = express();				// create a new instance of express

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

app.listen(8889);