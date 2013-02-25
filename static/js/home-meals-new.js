var user; //user initialized on load

// creates a new meal from input data
$("#createNewMealBttn").click(function() {
	$.ajax({
		type: "get",
		url: "/mealId",
		success: function(data) {
			if (data.success) {
				alert("Created meal successfully! Sending invitations...");
				var mid = data.mid;
				var uid = user.id;
				var name = "" + uid + mid;
				var date = new Date();
				var startTime = new Date(
					date.getFullYear(), 
					parseInt($("#startMonth").val()), 
					parseInt($("#startDay").val()),
					parseInt($("#startHour").val()) + 12*parseInt($("#startAMPM").val()),
					0,0,0);
				var endTime = new Date(
					date.getFullYear(),
					parseInt($("#endMonth").val()), 
					parseInt($("#endDay").val()),
					parseInt($("#endHour").val()) + 12*parseInt($("#endAMPM").val()),
					0,0,0);
				var invites = [];
				$.each($("#friendList input:checked"),
					function() {
						invites.push(this.id);
					}
				);

				// update meal
				var meal = new Meal(mid, uid, name, invites, startTime, endTime);
				meal.updateServer();

				// update user
				if (user.currentMeals === undefined) {
					user.currentMeals = [mid];
				} else {
					user.currentMeals.push(mid);
				}
				user.updateServer();

				// send invites
				var length = invites.length;
				for (var i=0; i < length; i++) {
					meal.inviteUser(invites[i], user.name, date);
				}
			}
		}
	});
});

var populateFriendList = function(data) {
	var wrapper = $("#friendList");
	for (var id in data) {
		var checkbox = $("<input type=\"checkbox\" class=\"friend-check-box\" name=\"friends\" id=\"" + id + "\">").appendTo(wrapper);
		checkbox.click(function() {
			if (this.checked) {
				var id = this.id;
				$.each($("#invitedFriends > .friend"), 
					function() {
						if (this.id === id) {
							$(this).show();
						}
				})
			} else {
				var id = this.id;
				$.each($("#invitedFriends > .friend"), 
					function(i, v) {
						if (this.id === id) {
							$(this).hide();
						}
				})
			}
		});
		wrapper.append(data[id]);
		$("<br>").appendTo(wrapper);

		var invitedBox = $("<div>").addClass("friend").attr("id", id);
		$("<div>").addClass("photo").html("a profile photo").appendTo(invitedBox);
		$("<div>").addClass("caption").html(data[id]).appendTo(invitedBox);
		invitedBox.appendTo($("#invitedFriends"));
		invitedBox.hide();
	}
};

var populatePageData = function() {
	$("#karmaBadge").html(user.karma);

	// set start/end date to today
	// DOESNT WORK!!!
	var date = new Date();
	var month = date.getMonth();
	var day = date.getDate();


	$("#startMonth").attr("selectedIndex", month);
	$("#startDay:nth-child(" + day + ")").attr("selected", "selected");
	$("#endMonth:nth-child(" + month + ")").attr("selected", "selected");
	$("#endDay:nth-child(" + day + ")").attr("selected", "selected");

	// populate friends list
	$.ajax({
		type: "get",
		url: "/friendsInfo/" + user.friends.join(","),
		success: function(data) {
			if (data.success) {
				populateFriendList(data.usersData);
			}
		}
	});
};

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
	if (i === -1) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}
	var id = parseInt(url.substring(i+4));
	if (id === NaN) {
		console.log("You were redirected to home without a vaild user id");
		return;
	}

	user = new User();
	user.initFromServer(id, populatePageData);
};