var user; //user initialized on load

// creates a new meal from input data
$("#createNewMealBttn").click(function() {
	var mealname = $("#meal-name-input").val();
	if (mealname === "") {
		alert("Please give a valid meal name");
		return;
	}
	var date = new Date();
	var startTime = new Date(
		date.getFullYear(),
		parseInt($("#startMonth").val(),10),
		parseInt($("#startDay").val(),10),
		parseInt($("#startHour").val(),10) + 12*parseInt($("#startAMPM").val(),10),
		0,0,0);
	var endTime = new Date(
		date.getFullYear(),
		parseInt($("#endMonth").val(),10),
		parseInt($("#endDay").val(),10),
		parseInt($("#endHour").val(),10) + 12*parseInt($("#endAMPM").val(),10),
		0,0,0);
	if (startTime.valueOf() > endTime.valueOf()) {
		alert("Your meal ends before it even begins! Check your times and try again.");
		return;
	}
	if (startTime.valueOf() === endTime.valueOf()) {
		alert("That's a short meal! Check your times and try again.");
		return;
	}

	if ($("#friendList input:checked").length === 0) {
		alert("You forgot to invite your friends! Check some boxes and try again.");
		return;
	}

	$.ajax({
		type: "get",
		url: "/mealId",
		success: function(data) {
			if (data.success) {
				alert("Created meal successfully! Sending invitations");
				var mid = data.mid;
				var uid = user.id;
				var name = mealname;
				var invites = [];
				$.each($("#friendList input:checked"),
					function() {
						invites.push(parseInt(this.id));
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
				user.karma += 1;
				user.updateServer();

				// send invites
				var recurseSend = function(ids) {
					if (ids.length === 0) {
						window.location.href = "/static/home/meal.html?uid=" + user.id + "&mid=" + meal.id;
						return;
					}
					var id = parseInt(ids.splice(0, 1)[0]);
					meal.inviteUser(id, user.name, date, function() {
						recurseSend(ids);
					});
				}
				recurseSend(invites);
			}
		}
	});
});

var populateFriendList = function(data) {
	var wrapper = $("#friendList").html("");
	$("#invitedFriends").html("");
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
	var date = new Date();
	var month = date.getMonth();
	var day = date.getDate();
	var hour = date.getHours();

	$("#startMonth,#endMonth").val(month);
	$("#startDay,#endDay").val(day);
	$("#startHour,#endHour").val(hour%12);
	$("#startAMPM,#endAMPM").val((hour < 12) ? 0 : 1);

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