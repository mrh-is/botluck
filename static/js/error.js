var user;

var populatePageData = function() {
	$("#karmaBadge").html(user.karma);

};

$("#home-bttn").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#myBotlucksBttn").click(function() {
	window.location.href = "/static/home.html?uid=" + user.id;
});

$("#startBotluckBttn").click(function() {
	window.location.href = "/static/home/meals/new.html?uid=" + user.id;
});

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
		alert("You were redirected here without a vaild user id. Redirecting to login screen.");
		window.location.href = "/static/index.html";
		return;
	}
	var id = parseInt(url.substring(i+4));
	if (id === NaN) {
		alert("You were redirected here without a vaild user id. Redirecting to login screen.");
		window.location.href = "/static/index.html";
		return;
	}

	user = new User();
	user.initFromServer(id, populatePageData);
};