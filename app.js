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
        }
        else {
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
      }
      else {
          console.log("Success writing file: ", DBFile);
      }
  });
};

var checkPassword = function(username, password) {
	if (userDB[username].password !== undefined && userDB[username].password === password) {
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
	if (userDB[username] !== undefined && userDB[username].password === password) {
		verified = true;
    }
    if (verified) {
        response.send({
            "success": verified,
            "uid": userDB[username].id
        });
    }
    else {
        response.send({ "success": false });
    }
});

// This is for serving user data
var readUserData = function(id, callbackfn) {
    id = parseInt(id);
    if (!isValidId(id)) {
        return;
    }
    var filename = userDir + "user-" + id + ".txt";
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log("Error reading user file: ", filename);
            console.log(err);
        }
        else {
            var userData = JSON.parse(data);
            if (callbackfn !== undefined) {
                callbackfn(userData);
            }
        }
    });
};

var writeUserData = function(id, data, response) {
    id = parseInt(id,10);
    if (!isValidId(id)) {
        return;
    }
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
    return (typeof(id) === typeof(1) && !isNaN(id) &&  id >= 0);
};

app.get("/user/:id", function(request, response) {
    var sendResponse = function(userData) {
        response.send({
            "userData": userData,
            "success": true
        });
    };
    readUserData(request.params.id, sendResponse);
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
    }
    else {
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
        intIds.push(parseInt(id,10));
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
            if (userData !== undefined && userData.name !== undefined && userData.id !== undefined) {
                friendInfo1[userData.id] = userData.name;
            }
            getFriendInfo(ids, friendInfo1);
        };
        if (isValidId(id)) {
            readUserData(id, recursive);
        }
    };

    getFriendInfo(intIds, {});
});

app.get("/friendsInfo", function(request, response) {
    response.send({
        "success": true,
        "usersData": {}
    });
});

// This is for serving meal data and storing meal data
var readMealData = function(id, callbackfn) {
    var filename = mealDir + "meal-" + id + ".txt";
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log("Error reading user file: ", filename);
            console.log(err);
        }
        else {
            if (callbackfn !== undefined) {
                callbackfn(JSON.parse(data));
            }
        }
    });
};

var writeMealData = function(id, data, response) {
    var filename = mealDir + "meal-" + id + ".txt";
    fs.writeFile(filename, data, function(err, data) {
        if (err) {
            console.log("Error writing user file: ", filename);
            console.log(err);
            if (response !== undefined) {
                response.send({ "success": false });
            }
        }
        else {
            if (response !== undefined) {
                response.send({ "success": true });
            }
        }
    });
};

app.get("/mealId", function(request, response) {
    response.send({
        "mid": mealCount,
        "success": true
    });
    mealCount++;
    writeMetaUserData();
});

app.get("/meal/:id", function(request, response) {
    var callbackfn = function(data) {
        response.send({
            "success": true,
            "mealData": data
        });
    };
	readMealData(request.params.id, callbackfn);
});

app.post("/meal/:id", function(request, response) {
    var id = request.params.id;
    var data = request.body.mealData;
    writeMealData(id, data, response);
});

// This is for handling user invitations
app.post("/invite", function(request, response) {
    var invite = {
        "mealId": request.body.mid,
        "userId": request.body.uid,
        "username": request.body.name,
        "date": request.body.date
    };
    
    var addInvite = function(userData) {
        if (userData.invites !== undefined) {
            userData.invites.push(invite);
        }
        else {
            userData.invites = [invite];
        }
        writeUserData(userData.id, JSON.stringify(userData));
        response.send({ "success": true });
    };

    readUserData(invite.userId, addInvite);
});

// takes list of ids and returns the combined ingredients
// of all the users, does this recursively to handle async
// requests
app.get("/allIngredients/:ids", function(request, response) {
    var idArr = request.params.ids.split(",");
    var ids = [];
    idArr.forEach(function(id) {
        ids.push(parseInt(id));
    });

    var addIngredients = function(ids, data1) {
        if (ids.length === 0) {
            console.log(data1);
            response.send({
                "success": true,
                "ingredients": data1
            });
        }
        var id = ids[0];
        ids.splice(0,1);
        var add = function(userData) {
            var data2 = data1;
            if (userData !== undefined &&
                userData.ingredients !== undefined) {
                data2[userData.id] = userData.ingredients;
            }
            addIngredients(ids, data2);
        }
        if (isValidId(id)) {
            readUserData(id, add);
        }
    };

    addIngredients(ids, {});
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

app.get("/static/home/:filename", function (request, response) {
    var filename = request.params.filename;
    response.sendfile("static/html/home-" + filename);
});

// This is for serving assets
app.get("/static/assets/:filename", function (request, response) {
    response.sendfile("static/assets/" + request.params.filename);
});

// This is for serving files in the static directory
app.get("/static/:filename", function (request, response) {
	var filename = request.params.filename;
    response.sendfile("static/html/" + filename);
});

app.listen(8889);
