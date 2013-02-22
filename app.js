var express = require("express");	// imports express
var app = express();				// create a new instance of express
var fs = require("fs");
// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

// handling user log in and passwords
var userDB = {}; //map from username to id and password
var DBFile = "user-meta-data.txt";
var userDir = "data/users/";
var userCount = 0;
var mealDir = "data/meals/";
var mealCount = 0;

var readMetaUserData = function() {
	fs.readFile(DBFile, function(err, data) {
    if (err) {
        userDB = {};
    }
    else {
        var metadata = JSON.parse(data);
        userDB = metadata.userDB;
        userCount = metadata.userCount;
        mealCount = metadata.mealCount;
    }
  });
};

readMetaUserData();

var writeMetaUserData = function() {
    var metadata = {
        "userDB": userDB,
        "userCount": userCount,
        "mealCount": mealCount
    };
    console.log(metadata);
	fs.writeFile(DBFile, JSON.stringify(metadata), function(err) {
    if (err) {
      console.log("Error writing file: ", DBFile);
      console.log(err);
    } else {
      console.log("Success writing file: ", DBFile);
    }
  });
};

var checkPassword = function(username, password) {
	if (userDB[username].password !== undefined &&
		userDB[username].password === password) {
		return true;
	}
	return false;
};

var changePassword = function(username, password) {
	userDB[username].password = password;
};

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
var readUserData = function(id, response) {
    var filename = userDir + "user-" + id + ".txt";
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log("Error reading user file: ", filename);
            console.log(err);
            response.send({ "success": false });
        }
        else {
            var userData = JSON.parse(data);
            response.send({
                "userData": JSON.parse(data),
                "success": true
            });
        }
    });
};

var writeUserData = function(id, data, response) {
    var filename = userDir + "user-" + id + ".txt";
    fs.writeFile(filename, data, function(err, data) {
        if (err) {
            console.log("Error writing user file: ", filename);
            console.log(err);
            if (response !== undefined) {
                response.send({ "success": false });
            }
        }
        else if (response !== undefined) {
            response.send({ "success": true });
        }
    });
};

app.get("/user/:id", function(request, response) {
	readUserData(request.params.id, response);
});

app.post("/user/:id", function(request, response) {
    var id = request.params.id;
    var data = request.body.userData;
    writeUserData(id, data, response);
});

app.post("/user", function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var name = request.body.name;
    var id = userCount;
    // user already exists
    if (userDB[username] !== undefined) {
        response.send({ 
            "success": false,
            "usernameChosen": true
        });
    } else {
        userDB[username] = {
            "password": password,
            "id": id
        };
        userCount++;
        writeMetaUserData();
        var userData = {
            "id": id,
            "username": username,
            "password": password,
            "name": name
        };
        writeUserData(id, JSON.stringify(userData));
        response.send({
            "uid": id,
            "success": true
        });
    }
});

// This is for serving meal data and storing meal data
var readMealData = function(id, response) {
    var filename = mealDir + "meal-" + id + ".txt";
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log("Error reading user file: ", filename);
            console.log(err);
            response.send({ "success": false });
        }
        else {
            response.send({
                "mealData": JSON.parse(data),
                "success": true
            });
        }
    });
};

var writeMealData = function(id, data, response) {
    var filename = mealDir + "meal-" + id + ".txt";
    fs.writeFile(filename, data, function(err, data) {
        if (err) {
            console.log("Error writing user file: ", filename);
            console.log(err);
            response.send({ "success": false });
        }
        else {
            response.send({ "success": true });
        }
    });
};

app.get("/mealId", function(request, response) {
    response.send({
        "id": mealCount,
        "success": true
    });
    mealCount++;
});

app.get("/meal/:id", function(request, response) {
	readMealData(request.params.id, response);
});

app.post("/meal/:id", function(request, response) {
    var id = request.params.id;
    var data = request.body.mealData;
    writeMealData(id, data, response);
});

// This is for handling user invitations
app.post("/invite", function(request, response) {
    var mealId = request.body.mealId;
    var userId = request.body.userId;
    var userData = readUserData(userId);
    if (userData === undefined) {
        response.send({"success": false});
    } else {
        userData.invites.push(mealId);
        data = JSON.stringify(userData);
        response.send({
            "success": writeUserData(userId, data)
        });
    }
});

app.post("/acceptInvite", function(request, response) {
    var mealId = request.body.mealId;
    var userId = request.body.userId;
    var data = readMealData(mealId);
    if (data === undefined) {
        response.send({"success": false});
    } else {
        var mealData = JSON.parse(data);
        mealData.userIds.push(userId);
        data = JSON.stringify(mealData);
        response.send({
            "success": writeMealData(userId, data)
        });
    }
});

// This is for serving javascript files
app.get("/static/js/:filename", function (request, response) {
	response.sendfile("static/js/" + request.params.filename);
});

// This is for serving css files
app.get("/static/styles/:filename", function (request, response) {
	response.sendfile("static/styles/" + request.params.filename);
});

// This is for serving home pages
app.get("/static/home/meals/:filename", function (request, response) {
	response.sendfile("static/html/home-meals-" + request.params.filename);
});

app.get("/static/home/:filename", function (request, response) {
	response.sendfile("static/html/home-" + request.params.filename);
});

// This is for serving assets
app.get("/static/assets/:filename", function (request, response) {
    response.sendfile("static/assets/" + request.params.filename);
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
	if (request.body.user !== undefined) {
		console.log(request.body.user);
		console.log(request.body.password);
	}
    response.sendfile("static/html/" + request.params.staticFilename);
});

app.listen(8889);
