var NOCHOICE = "n/a";
function Meal(id, ownerId, name, userIds, startTime, endTime, choice) {
	if (id !== undefined) this.id = id;
	if (ownerId !== undefined) this.ownerId = ownerId;
	if (name !== undefined) this.name = name;
	if (userIds !== undefined) this.userIds = userIds;
	if (startTime !== undefined) this.startTime = startTime;
	if (endTime !== undefined) this.endTime = endTime;
	if (choice !== undefined) {
		this.choice = choice;
	} else {
		this.choice = NOCHOICE;
	}

	this.contributions = {};

	this.contribute = function(id, ingredients) {
		this.contributions[id] = ingredients;
	}

	this.initFromServer = function(id) {
		var self = this;
		$.ajax({
			type: "get",
			url: "/meal/" + id,
			success: function(data) {
				if (data.success) {
					self.fromJSON(data.mealData);
				}
				if (callbackfn != undefined) {
					callbackfn();
				}
			}
		});
	};

	this.updateServer = function(callbackfn) {
		var mealData = this.toJSON();
		$.ajax({
			type: "post",
			url: "/meal/" + this.id,
			data: { 
				"mealData": mealData 
			},
			success: function(data) {
				if (callbackfn !== undefined) {
					callbackfn(data);
				}
			}
		});
	};

	this.inviteUser = function(userId) {
		$.ajax({
			type: "post",
			url: "/invite",
			data: {
				"mid": this.id,
				"uid": userId
			},
			success: function(data) {}
		});
	};

	this.fromJSON = function(data) {
		if (data.id !== undefined) this.id = data.id;
		if (data.ownerId !== undefined) this.ownerId = data.ownerId;
		if (data.name !== undefined) this.name = data.name;
		if (data.userIds !== undefined) this.userIds = data.userIds;
		if (data.contributions !== undefined) this.contributions = JSON.parse(data.contributions);
		if (data.startTime !== undefined) this.startTime = data.startTime;
		if (data.endTime !== undefined) this.endTime = data.endTime;
		if (data.choice !== undefined) {
			this.choice = data.choice;
		} else {
			this.choice = NOCHOICE;
		}
	};

	this.toJSON = function() {
		var data = {
			"id": this.id,
			"ownerId": this.ownerId,
			"name": this.name,
			"userIds": this.userIds,
			"contributions": this.contributions,
			"startTime": this.startTime,
			"endTime": this.endTime,
			"choice": this.choice
		};
		return JSON.stringify(data);
	};
}