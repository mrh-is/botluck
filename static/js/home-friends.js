// populates page data from the user object
var user;
var usersData;

var populatePageData = function(friendNames) {
	$("#karmaBadge").html(user.karma);
	$("#welcome-message").html("Your Friends!");
	// clear both lists
	$("#all-users").html("");
	$("#friends-list").html("");

	// get all user info
	$.ajax({
		type: "get",
		url: "/allUsersInfo",
		success: function(data) {
			if (data.success) {
				usersData = data.usersData;
				populateAllUsersData();
			}
		}
	})
};

var populateAllUsersData = function() {
	for (var id in usersData) {
		id = parseInt(id);
		if (id === user.id || user.hasFriend(id)) {
			continue;
		}
		var friendDiv = $("<div>").addClass("friend").attr("uid",id).appendTo($("#all-users"));
		$("<div>").addClass("photo").html("a profile photo").appendTo(friendDiv);
		$("<div>").addClass("caption").html(usersData[id]).appendTo(friendDiv);
		(function() {
			var uid = id;
			friendDiv.click(function() {
				$(this).hide();
				console.log(user.hasFriend(uid));
				if (!user.hasFriend(uid)) {
					user.friends.push(uid);
					user.updateServer(function() {
						window.location.href = ""; // reload page
					});
				} else {
					window.location.href = ""; // reload page
				}
			});
		})();
	}
	populateFriendData();
};

var populateFriendData = function() {
	var len = user.friends.length;
	for (var i = 0; i < len; i++) {
		var id = parseInt(user.friends[i]);
		var friendDiv = $("<div>").addClass("friend").attr("uid",id).appendTo($("#friends-list"));
		$("<div>").addClass("photo").html("a profile photo").appendTo(friendDiv);
		$("<div>").addClass("caption").html(usersData[id]).appendTo(friendDiv);
		(function() {
			var uid = id;
			friendDiv.click(function() {
				$(this).hide();
				user.removeFriend(uid);
				user.updateServer(function() {
					window.location.href = ""; // reload page
				});
			});
		})();
	}
}

// view meal
var viewMeal = function(mealID) {
	window.location.href = "/static/home/meal.html?uid=" + user.id;
};

// set the nav bar buttons on the right

$("#startButton").click(function() {
	window.location.href = "/static/home/meals/new.html?uid=" + user.id;
});
// $("#myBotlucksBttn").click(function() {
// 	window.location.href = "/static/home.html?uid=" + user.id;
// });

$("#mycanvas").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#botluckTitle").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#myKitchenBttn").click(function() {
	window.location.href = "/static/home/mykitchen.html?uid=" + user.id;
});

$("#myFriendsBttn").click(function() {
	window.location.href = "/static/home/friends.html?uid=" + user.id;
});

// on load, the user is initialized from the server
// and populatePageData is called
window.onload = function() {
	var url = window.location.href;
	var i = url.indexOf("uid=");
	if (i === -1) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}
	id = parseInt(url.substring(i+4),10);
	if (isNaN(id)) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	user = new User();
	user.initFromServer(id, populatePageData);
};
