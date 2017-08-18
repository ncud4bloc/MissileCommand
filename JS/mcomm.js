var $content = $('#content');
var $status = $('<div class="topbar" id="gStatus">Missile Data</div>');
var $start = $('<div class="topbar" id="gStart">Start</div>');
var $data = $('<div class="topbar" id="gData">Game Info</div>');
var $gameBoard = $('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gameBoard"></div>');
var $canvas = $('<canvas width = "780" height = "510" id = "canvas"></canvas>');

$content.append($status);
$content.append($start);
$content.append($data);
$content.append($gameBoard);
$gameBoard.append($canvas);

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
   
/* -----  CSS  ----- */

$('body').css({
    'width': '100%',
    'background-color': '#0e1f83'
});

$content.css({
    'width': '800px',
    'height': '600px',
    'border': '5px solid #000',
    'margin': '25px auto',
    'background-color': '#b5b6b7'
});

$status.css({
    'height': '70px',
    'width': '200px',
    'float': 'left',
    'text-align': 'center',
    'color': '#000',
    'margin-right': '100px',
    'background-color': '#5e5c95',
    'border': '1px solid #f00',
    'padding-top': '22px',
    'padding-left': '25px',
    'padding-right': '25px',
    'font-size': '18px'
});

$start.css({
    'height': '70px',
    'width': '200px',
    'float': 'left',
    'text-align': 'center',
    'color': '#000',
    'margin': '0 auto',
    'background-color': '#5e5c95',
    'border': '1px solid #f00',
    'padding-top': '5px',
    'padding-left': '25px',
    'padding-right': '25px',
    'font-family': '"Courgette",cursive',
    'font-family': '"Lemonada"',
    'font-size': '25px',
    'font-weight': '900'
});

$data.css({
    'height': '70px',
    'width': '200px',
    'float': 'right',
    'text-align': 'center',
    'color': '#000',
    'margin': '0',
    'background-color': '#5e5c95',
    'border': '1px solid #f00',
    'padding-top': '22px',
    'padding-left': '25px',
    'padding-right': '25px',
    'font-size': '18px'
});

$gameBoard.css({
    'height': '520px',
    'width': '790px',
    'margin': '0 auto',
    'padding-right': '0px',
    /*'background-image': 'url(../IMAGES/MC2.jpg)',
    'background-repeat': 'no-repeat',
    'background-position': 'center',
    'background-size': 'cover',*/
    'background-color': '#66cbf0',
    'border': '5px ridge #898a8b'
});



/* -----  Functions  ----- */

/* Create the Ground Graphics  */
var groundDupe = function(){
    for(var i = 0;i < 3;i++){
        c.fillStyle = "#14f514";
        c.beginPath();
        c.moveTo(i*260,470);
        c.lineTo(i*260+80,470);
        c.lineTo(i*260+130,420);
        c.lineTo(i*260+180,470);
        c.lineTo(i*260+260,470);
        c.lineTo(i*260+260,530);
        c.lineTo(i*260,530);
        c.lineTo(i*260,470);
        c.fill();
    }
};

/* Create the Cities  */

var cities = [];

var CityGen = function(cName,xPos){
    c.fillStyle = "#000";
    c.fillRect(xPos,445,20,30);
    cities.push(cName);
    console.log('Cities: ' + cities);
};

/*function City(Metro,xPos){
    Metro = Metro || {};
    Metro.active = true;
    Metro.color = "#000";
    Metro.x = xPos;
    Metro.y = 400;
    Metro.width = 40;
    Metro.height = 40;
    Metro.draw = function(){
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    };
    cities.push(Metro);
    return Metro;
};*/

/* Create the Guns  */

var guns = [];

var GunGen = function(gName,xPos,yPos){
    c.fillStyle = "#f00";
    c.moveTo(xPos,yPos);
    c.arc(xPos,yPos,5,0,Math.PI*2,false);
    c.fill();
    guns.push(gName);
};



/* -----  Function Calls  ----- */

$(function(){
    
    $start.on('click',function(){ 
        var alphaGun = new GunGen('alphaGun',130,420);
        var bravoGun = new GunGen('bravoGun',390,420);
        var charlieGun = new GunGen('charlieGun',650,420);
        groundDupe();
        
        var alphaCity1 = new CityGen('alpha1',30);
        var alphaCity2 = new CityGen('alpha2',210);
        var bravoCity1 = new CityGen('bravo1',290);
        var bravoCity2 = new CityGen('bravo2',470);
        var charlieCity1 = new CityGen('charlie1',550);
        var charlieCity2 = new CityGen('charlie2',730);
        
    }); 
    
});