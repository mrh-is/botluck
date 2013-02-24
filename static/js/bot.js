var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

//head
ctx.beginPath();
ctx.moveTo(60,180);
ctx.quadraticCurveTo(10,40,100,40);
ctx.quadraticCurveTo(190,40,140,180);
ctx.lineTo(60,180);
ctx.closePath();
ctx.fillStyle = "rgba(230, 230, 230, 1)";
ctx.fill();

//neck
ctx.fillStyle = "rgba(230, 230, 230, 1)";
ctx.fillRect(96, 180, 10, 20);

//mouth
ctx.beginPath();
ctx.moveTo(56,180);
ctx.lineTo(48,150);
ctx.lineTo(60,150);
ctx.lineTo(68,160);
ctx.quadraticCurveTo(100,168,150,160);
ctx.lineTo(140,185);
ctx.lineTo(56,180);
ctx.closePath();
ctx.fillStyle = "rgba(220,220,220,1)";
ctx.fill();

//headscrews
ctx.beginPath();
ctx.moveTo(54,150);
ctx.quadraticCurveTo(31,140,51,130);
ctx.quadraticCurveTo(74,140,54,150);
ctx.closePath();
ctx.fillStyle = "rgba(200,200,200,1)";
ctx.fill();
ctx.beginPath();
ctx.moveTo(155,130);
ctx.quadraticCurveTo(163,140,150,150);
ctx.lineTo(155,130)
ctx.closePath();
ctx.fillStyle = "rgba(200,200,200,1)";
ctx.fill();

//eyes
ctx.beginPath();
ctx.moveTo(90,140);
ctx.quadraticCurveTo(100,110,106,140);
ctx.quadraticCurveTo(100,160, 90,140);
ctx.closePath();
ctx.fillStyle = "rgba(180,180,180,1)";
ctx.fill();
ctx.beginPath();
ctx.moveTo(120,140);
ctx.quadraticCurveTo(130,110,136,140);
ctx.quadraticCurveTo(130,160, 120,140);
ctx.closePath();
ctx.fillStyle = "rgba(180,180,180,1)";
ctx.fill();

//whirlygig
ctx.fillStyle = "rgba(220,220,220,1)";
ctx.fillRect(98, 20, 5, 20);
ctx.beginPath();
ctx.arc(101, 12, 8, 0, 2*Math.PI, true);
ctx.fillStyle = "rgba(220,220,220,1)";
ctx.fill();

//legs
ctx.beginPath();
ctx.moveTo(90,285);
ctx.quadraticCurveTo(90,300,70,340);
ctx.lineWidth = 7;
ctx.strokeStyle = "rgba(230, 230, 230, 1)";
ctx.stroke();
ctx.beginPath();
ctx.moveTo(128,285);
ctx.quadraticCurveTo(130,310,125,345);
ctx.stroke();

//body
ctx.beginPath();
ctx.moveTo(70,200)
ctx.quadraticCurveTo(100,190,130,200);
ctx.quadraticCurveTo(140,220,140,280);
ctx.quadraticCurveTo(120,300,75,285);
ctx.quadraticCurveTo(65,220,70,200)
ctx.closePath();
ctx.fill();

//panel
ctx.beginPath();
ctx.moveTo(90,220);
ctx.lineTo(126,220);
ctx.lineTo(130,260);
ctx.lineTo(93,260);
ctx.lineTo(90,220);
ctx.closePath();
ctx.fillStyle = "rgba(98,196,180,0.4)";
ctx.fill();

//arms
ctx.beginPath();
ctx.moveTo(75,208);
ctx.quadraticCurveTo(15,220,30,270);
ctx.lineWidth = 7;
ctx.strokeStyle = "rgba(230, 230, 230, 1)";
ctx.stroke();
ctx.beginPath();
ctx.moveTo(135,208);
ctx.quadraticCurveTo(160,220,220,190);
ctx.stroke();

//armsockets
ctx.beginPath();
ctx.moveTo(80,215);
ctx.quadraticCurveTo(41,205,75,195);
ctx.quadraticCurveTo(92,205,80,215);
ctx.closePath();
ctx.fillStyle = "rgba(200,200,200,1)";
ctx.fill();
ctx.beginPath();
ctx.moveTo(129,198);
ctx.quadraticCurveTo(150,208,133,212);
ctx.lineTo(129,198);
ctx.closePath();
ctx.fillStyle = "rgba(200,200,200,1)";
ctx.fill();

//hands
ctx.beginPath();
ctx.moveTo(20,290);
ctx.quadraticCurveTo(25,260,50,280);
ctx.lineWidth = 9;
ctx.strokeStyle = "rgba(200,200,200,1)";
ctx.stroke();
ctx.moveTo(208,180);
ctx.quadraticCurveTo(220,195,245,183);
ctx.stroke();

//dish
ctx.beginPath();
ctx.moveTo(175,177);
ctx.lineTo(281,177);
ctx.lineWidth = 7;
ctx.strokeStyle = "rgba(98,196,180,1)";
ctx.stroke();
ctx.beginPath();
ctx.moveTo(212,133);
ctx.quadraticCurveTo(226,110,240,133);
ctx.lineWidth = 5;
ctx.strokeStyle = "rgba(98,196,180,1)";
ctx.stroke();
ctx.beginPath();
ctx.moveTo(185,177);
ctx.quadraticCurveTo(177,130,228,130)
ctx.quadraticCurveTo(273,130,272,175);
ctx.lineTo(185,177);
ctx.closePath();
ctx.fillStyle = "rgba(98,196,180,1)";
ctx.fill();



//feet
ctx.beginPath();
ctx.moveTo(65,340);
ctx.quadraticCurveTo(80,335,95,337);
ctx.quadraticCurveTo(105,350,96,360);
ctx.quadraticCurveTo(80,361,65,355);
ctx.quadraticCurveTo(60,348,65,340);
ctx.closePath();
ctx.fillStyle = "rgba(200,200,200,1)";
ctx.fill();
ctx.beginPath();
ctx.moveTo(120,340);
ctx.quadraticCurveTo(135,333,150,335);
ctx.quadraticCurveTo(158,340,151,358);
ctx.quadraticCurveTo(135,361,120,355);
ctx.quadraticCurveTo(115,348,120,340);
ctx.closePath();
ctx.fill();