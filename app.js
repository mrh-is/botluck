var express = require("express");	// imports express
var app = express();				// create a new instance of express
var fs = require("fs");
// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// handling user log in and passwords
var userDB = {}; //map from username to id and password
var DBFile = "user-meta-data.txt";
var readUserData = function() {
	fs.readFile(DBFile, function(err, data) {
    if (err) {
    	userDB = {};
    } else {
     	userDB = JSON.parse(data);
    };
  });
};

readUserData();

var writeUserData = function() {
	fs.writeFile(DBFile, JSON.stringify(userDB), function(err) {
    if (err) {
      console.log("Error writing file: ", DBFile);
    } else {
      console.log("Success writing file: ", DBFile);
    }
  });
}

var checkPassword = function(username, password) {
	if (userDB[username].password !== undefined &&
		userDB[username].password === password) {
		return true;
	}
	return false;
}

var changePassword = function(username, password) {
	userDB[username].password = password;
}

app.post("/verify/:url", function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var verified = false;
	if (userDB[username].password === password) {
		verified = true;
	}
	response.send({
		"success": verified,
		"url": request.params.url,
		"uid": userDB[username].id
	});
});

// This is for serving user data
var userDir = "data/users/";
app.get("/user/:id", function(request, response) {
	var filename = userDir + "user-" + request.params.id + ".txt";
	fs.readFile(filename, function(err, data) {
    if (err) {
     	response.send({"success": false});
     } else {
     	var userData = JSON.parse(data);
     	userData.success = true;
     	response.send(userData);
     }
    };
});

// This is for serving meal data
var mealDir = "data/meals/";
app.get("/meal/:id", function(request, response) {
	var filename = mealDir + "meal-" + request.params.id + ".txt";
	fs.readFile(filename, function(err, data) {
    if (err) {
     	response.send({"success": false});
     } else {
     	var mealData = JSON.parse(data);
     	mealData.success = true;
     	response.send(mealData);
     }
    };
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