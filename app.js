var express = require("express");	// imports express
var app = express();				// create a new instance of express
var fs = require("fs");
// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// handling user log in and passwords
var passwordDB = {};
var passwordFile = "user-password-info.txt";
var readPasswords = function() {
	fs.readFile(passwordFile, function(err, data) {
    if (err) {
    	passwordDB = {};
    } else {
     	passwordDB = JSON.parse(data);
    }
  });
};

readPasswords();

var writePasswords = function() {
	fs.writeFile(passwordFile, JSON.stringify(passwordDB), function(err) {
    if (err) {
      console.log("Error writing file: ", passwordFile);
    } else {
      console.log("Success writing file: ", passwordFile);
    }
  });
}

var checkPassword = function(username, password) {
	if (passwordDB[username] !== undefined &&
		passwordDB[username] === password) {
		return true;
	}
	return false;
}

var changePassword = function(username, password) {
	passwordDB[username] = password;
}

app.post("/verify/:url", function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var verified = false;
	if (passwordDB[username] === password) {
		verified = true;
	}
	response.send({
		"success": verified,
		"url": request.params.url
	});
});

// This is for serving javascript files
app.get("/js/:filename", function (request, response) {
	response.sendfile("static/js/" + request.params.filename);
});

// This is for serving css files
app.get("/css/:filename", function (request, response) {
	response.sendfile("static/js/" + request.params.filename);
});

// This is for serving home pages
app.get("/static/home/meals/:filename", function (request, response) {
	response.sendfile("static/home-meals-" + request.params.filename)
});

app.get("/static/home/:filename", function (request, response) {
	response.sendfile("static/home-" + request.params.filename);
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
	if (request.body.user !== undefined) {
		console.log(request.body.user);
		console.log(request.body.password);
	}
    response.sendfile("static/" + request.params.staticFilename);
});

app.listen(8889);