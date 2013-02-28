var avatarSrc;

var avatarCanvas = document.getElementById("avatarCanvas");
var avatarCtx = avatarCanvas.getContext("2d");
var drawing = false;
var strokes = new Array();
var pointsX = new Array();
var pointsY = new Array();

$('#avatarCanvas').mousedown(function(e){
	// console.log("mousedown");
	drawing = true;
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	updatePosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	refreshCanvas();
});

$('#avatarCanvas').mouseup(function(e){
	drawing = false;
	var storePointsX = pointsX;
	var storePointsY = pointsY;
	strokes.push(storePointsX, storePointsY);
	// pointsX = [];
	// pointsY = [];
});

$('#avatarCanvas').mousemove(function(e){
	if(drawing === true){
		updatePosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		refreshCanvas();
	}
});

$('#avatarCanvas').mouseleave(function(e){
	drawing = false;
});

function updatePosition(x, y, dragging)
{
	pointsX.push(x);
	pointsY.push(y);
}

function refreshCanvas(){
	avatarCtx.fillStyle = "#62C4B4";
	avatarCtx.fillRect(0,0,avatarCanvas.width, avatarCanvas.height);

	avatarCtx.strokeStyle = "#F2D03A";
	avatarCtx.lineWidth = 15;
	avatarCtx.lineJoin = "round";

	for(var i=0; i < pointsX.length; i++) {
		avatarCtx.beginPath();
		avatarCtx.moveTo(pointsX[i], pointsY[i]);
		avatarCtx.lineTo(pointsX[i+1], pointsY[i+1]);
		avatarCtx.closePath();
		avatarCtx.stroke();
	}
}

$("#bttnCreateAvatar").click(function() {
	avatarSrc = avatarCanvas.toDataURL("image/png");
	$("#newPng").attr("src", avatarSrc);
});