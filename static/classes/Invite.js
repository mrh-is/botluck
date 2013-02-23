// Users have an array of invites
// the userId and username are from the user who sent the
// invite. The date is when created.
function Invite(userId, username, mealId, date) {
	this.userId = userId;
	this.username = username;
	this.mealId = mealId;
	this.date = date;
}