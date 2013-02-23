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
        console.log("Error reading meta user data: " + err);
    } else {
        var metadata = JSON.parse(data);
        if (metadata.userDB !== undefined) userDB = metadata.userDB;
        if (metadata.userCount !== undefined) userCount = metadata.userCount;
        if (metadata.mealCount !== undefined) mealCount = metadata.mealCount;
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

app.post("/verify", function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var verified = false;
	if (userDB[username] !== undefined && 
        userDB[username].password === password) {
		verified = true;
	}
    if (verified) {
    	response.send({
    		"success": verified,
    		"uid": userDB[username].id
    	});
    } else {
        response.send({ "success": false });
    }
});

// This is for serving user data
var readUserData = function(id, response, callbackfn, done) {
    var filename = userDir + "user-" + id + ".txt";
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log("Error reading user file: ", filename);
            console.log(err);
            if (response !== undefined) {
                response.send({ "success": false });
            }
        }
        else {
            var userData = JSON.parse(data);
            if (response !== undefined) {
                response.send({
                    "userData": JSON.parse(data),
                    "success": true
                });
            }
            if (callbackfn !== undefined) {
                callbackfn(userData);
            }
        }
        done = true;
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

var isValidId = function(id) {
    return (typeof(id) === typeof(1) &&
        id !== NaN && 
        id >= 0);
}

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
            "userName": username,
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

// given a list of user ids, 
// returns the real name of the user
app.get("/friendsInfo/:ids", function(request, response) {
    var idsString = request.params.ids;
    var idArr = idsString.split(",");
    var intIds = [];
    idArr.forEach(function(id) {
        intIds.push(parseInt(id));
    });

    var getFriendInfo = function(ids, friendInfo) {
        if (ids.length === 0) {
            response.send({
                "success": true,
                "usersData": friendInfo
            });
        }
        var id = ids[0];
        ids.splice(0,1);
        var recursive = function(userData) {
            var friendInfo1 = friendInfo;
            if (userData !== undefined &&
                userData.name !== undefined &&
                userData.id !== undefined) {
                friendInfo1[userData.id] = userData.name;
            }
            getFriendInfo(ids, friendInfo1);
        }
        if (isValidId(id)) {
            readUserData(id, undefined, recursive);
        }
    }

    getFriendInfo(intIds, {});
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

// takes list of ids and returns the combined ingredients
// of all the users, does this recursively to handle async
// requests
app.get("/allIngredients/:ids", function(request, response) {
    var idsString = request.params.ids;
    var idArr = idsString.split(",");
    idArr.forEach(function(id) {
        id = parseInt(id);
    });

    var addIngredients = function(ids, ingredients1) {
        if (ids.length === 0) {
            response.send({
                "success": true,
                "ingredients": ingredients1
            });
        }
        var id = ids[0];
        ids.splice(0,1);
        var add = function(userData) {
            var ingredients2 = ingredients1;
            if (userData !== undefined &&
                userData.ingredients !== undefined) {
                for (var i in userData.ingredients) {
                    ingredients2.push(userData.ingredients[i]);
                }
            }
            addIngredients(ids, ingredients2);
        }
        if (isValidId(id)) {
            readUserData(id, undefined, add);
        }
    }

    addIngredients(idArr, []);
});

// This is for serving javascript files
app.get("/static/js/:filename", function (request, response) {
    response.sendfile("static/js/" + request.params.filename);
});

app.get("/static/classes/:filename", function (request, response) {
    response.sendfile("static/classes/" + request.params.filename);
});

// This is for serving css files
app.get("/static/styles/:filename", function (request, response) {
	response.sendfile("static/styles/" + request.params.filename);
});

// This is for serving home pages
app.get("/static/home/meals/:filename", function (request, response) {
	response.sendfile("static/html/home-meals-" + request.params.filename);
});

app.get("/static/home/:query", function (request, response) {
    var query = request.params.query;
    var filename;
    var i = query.indexOf("?");
    if (i === -1) {
        filename = query;
    } else {
        filename = query.substring(0, i);
    }
	response.sendfile("static/html/home-" + query);
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
