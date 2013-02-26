var user;
var meal;
var friendInfo;

var populatePageData = function() {
	$("#invitation-name").html("Invitation to " + meal.name);

	var startTime = new Date(meal.startTime);
	var timeString = startTime.toUTCString();
	$("#start-time").html(timeString);
	var endTime = new Date(meal.endTime);
	timeString = endTime.toUTCString();
	$("#end-time").html(timeString);
	populateFriendData();
};

var populateFriendData = function() {
	var wrapper = $("#friendRows").html("");
	var populate = function(usersData) {
		friendInfo = usersData;
		$.each(friendInfo, function(id, name) {
			if (parseInt(id) !== user.id) {
				var friend = $("<div>").addClass("friend");
				$("<div>").addClass("photo").html("a profile photo").appendTo(friend);
				$("<div>").addClass("caption").html(name).appendTo(friend);
				friend.appendTo(wrapper);
			}
		});
	};

	var userIds = meal.userIds;
	userIds.push(meal.ownerId);

	$.ajax({
		type: "get",
		url: "/friendsInfo/" + userIds.join(","),
		success: function(data) {
			if (data.success) {
				populate(data.usersData);
			}
		}
	});
};

// set the accept/not accept buttons on bottom of page
$("#accept-invite-bttn").click(function() {

	var i;
    var alreadyHas = false;
    // check if meal is currently in current meals
    // add it if not there
    for (i=0; i < user.currentMeals.length; i++) {
        if (parseInt(user.currentMeals[i]) === meal.id) {
            alreadyHas = true;
            break;
        }
    }
    if (!alreadyHas) {
        user.currentMeals.push(meal.id);
    }
    // remove invite from list
    for (i=0; i < user.invites.length; i++) {
        if (parseInt(user.invites[i].mealId) === meal.id) {
            user.invites.splice(i,1);
        }
    }

    // add userid to meal userIds
    if (meal.userIds === undefined) {
        meal.userIds = [];
        meal.userIds.push(userId);
    } else {
        alreadyHas = false;
        for (var i=0; i < meal.userIds.length; i++) {
            if (parseInt(meal.userIds[i]) === user.id) {
                alreadyHas = true;
                break;
            }
        }
        if (!alreadyHas) {
            meal.userIds.push(userId);
        }
    }

    var callbackfn = function() {
    	var callbackfn2 = function() {
    		window.location.href = "/static/home.html?uid=" + user.id;
    	};
    	user.updateServer(callbackfn2);
    }
    meal.updateServer(callbackfn);
});

$("#dont-accept-invite-bttn").click(function() {
	// remove invite from list
    for (var i=0; i < user.invites.length; i++) {
        if (parseInt(user.invites[i].mealId) === meal.id) {
            user.invites.splice(i,1);
            break;
        }
    }
    var callbackfn = function() {
    	window.location.href = "/static/home.html?uid=" + user.id;
    };
    user.updateServer(callbackfn);
});

// set the nav bar buttons on the right
$("#myBotlucksBttn").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#myKitchenBttn").click(function() {
	window.location.href = "/static/home/mykitchen.html?uid=" + user.id;
});

$("#myFriendsBttn").click(function() {
	window.location.href = "/static/home/friends.html?uid=" + user.id;
});

window.onload = function() {
	var url = window.location.href;
	var i = url.indexOf("uid=");
	var j = url.indexOf("mid=");
	var uid;
	var mid;
	if (i === -1 || j === -1) {
		console.log("You were redirected to meal without a vaild user id or meal id");
		return;
	}
	if (i <= j) { // mid after uid
		mid = parseInt(url.substring(j+4),10);
		uid = parseInt(url.substring(0, j).substring(i+4),10);
	} else {
		uid = parseInt(url.substring(i+4),10);
		mid = parseInt(url.substring(0, i).substring(j+4),10);
	}
	var id = parseInt(url.substring(i+4),10);
	if (isNaN(id)) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	var getMeal = function() {
		$("#karmaBadge").html(user.karma);
		// check if user created this meal
		$.each(user.currentMeals, function(i, mealId) {
			if (mealId === mid) {
				isOwner = true;
			}
		});
		meal = new Meal();
		meal.initFromServer(mid, populatePageData);
	};

	user = new User();
	user.initFromServer(uid, getMeal);
};