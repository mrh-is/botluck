$('#loginBttn').click(function() {
	var username = $('#username-input').val();
	var password = $('#password-input').val();
	if (username === undefined || password === undefined || username === "" || password === "") {
		return;
	}

	$.ajax({
		type: "post",
		data: {
			"username": username, 
			"password": password
		},
		url: "/verify",
		success: function(data) {
			if (data.success) {
				window.location.href = "/static/home.html?uid=" + data.uid;
			} else {
				$('#success-message').html("The username and password are incorrect.");
			}
		}
	});
});

// allow you to click enter and sign in
$("#password-input").keypress(function(e) {
	if (e.which === 13) {// enter key pressed
		$("#loginBttn").click();
	}
});

$("#username-input").keypress(function(e) {
	if (e.which === 13) {// enter key pressed
		$("#loginBttn").click();
	}
});



/* display sign up form */
$('#signUpBttn').click(function() {
	$('#signup-form').show();
});

// on enter, submit form
window.
/* create new user */
$('#createNewUserBttn').click(function() {
	var name = $('#new-name-input').val();
	var username = $('#new-username-input').val();
	var password = $('#new-password-input').val();
	$.ajax({
		type: "post",
		url: "/user",
		data: {
			"username": username,
			"password": password,
			"name": name
		},
		success: function(data) {
					if (data.success) { // successfully created user
						$('#success-message').html("Success! You will be redirected in a few seconds...").delay(2500);
						window.location.href = "/static/home.html?uid=" + data.uid;
					} else if (data.usernameChosen) {
						$('#success-message').html("The username you have requested is already in use.");
					} else {
						$('#success-message').html("There was an error contacting the server. Please refresh and try again.");
					}
				}
			});
});
