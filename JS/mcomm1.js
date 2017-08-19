var $content = $('#content');
var $status = $('<div class="topbar" id="gStatus">Ammo Supply</div>');
var $start = $('<div class="topbar" id="gStart">Start</div>');
var $data = $('<div class="topbar" id="gData">Game Info</div>');
var $gameBoard = $('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gameBoard"></div>');
var $canvas = $('<canvas width = "780" height = "510" id = "canvas"></canvas>');

var count = 0;
var alphaGun;
var bravoGun;
var charlieGun;
var mouseX;
var mouseY;
var firingGun;
var fireSlope;
var shoot;
var bullets = [];
var alphaAmmo = 5;      /* This will be modded later */
var bravoAmmo = 5;      /* This will be modded later */
var charlieAmmo = 5;    /* This will be modded later */

$content.append($status);
$content.append($start);
$content.append($data);
$content.append($gameBoard);
$gameBoard.append($canvas);

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
   
/* ---------------  CSS  --------------- */

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
    'background-color': '#66cbf0',
    'border': '5px ridge #898a8b'
});



/* ---------------  Functions  --------------- */

/* Create the Ground Graphics  */
var groundGen = function(){
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

var CityGen = function(cName,cPosX,cPosY,cWidth,cHeight,cActive){
    this.name = cName;
    this.x = cPosX;
    this.y = cPosY;
    this.width = cWidth;
    this.height = cHeight;
    this.active = cActive;
    
    this.addCity = function(){
        cities.push(this.name);
    }
    
    this.drawCity = function(){
        c.fillStyle = "#000";
        c.fillRect(this.x,this.y,this.width,this.height);
    }
};


/* Create the Guns  */
var guns = [];

var GunGen = function(gName,gPosX,gPosY,gRadius,gActive){
    this.name = gName;
    this.x = gPosX;
    this.y = gPosY;
    this.radius = gRadius;
    this.active = gActive;
    
    this.addGun = function(){
        guns.push(this.name);
    }
    
    this.drawGun = function(){
        c.fillStyle = "#f00";
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
    }
};

function mouseXY(){
    var e = window.event;
    mouseX = e.pageX - $('#canvas').offset().left;
    mouseY = e.pageY - $('#canvas').offset().top;
    
    console.log('Click Coordinates are X = ' + mouseX + ', Y = ' + mouseY);
   /* var t = setTimeout(mouse_position,100);*/
}

function prepareToFire(targetX,targetY){
    /* Determine which gun fires */
    var cStr = count.toString();
    var alphaS = slope(alphaGun.x,alphaGun.y,targetX,targetY);
    var bravoS = slope(bravoGun.x,bravoGun.y,targetX,targetY);
    var charlieS = slope(charlieGun.x,charlieGun.y,targetX,targetY);
    var alphaSabs = Math.abs(alphaS);
    var bravoSabs = Math.abs(bravoS);
    var charlieSabs = Math.abs(charlieS);
    if ((alphaSabs > bravoSabs) && (alphaSabs > charlieSabs) && (targetY < 400) && (alphaAmmo > 0)){
        var initX = alphaGun.x;
        var initY = alphaGun.y;
        firingGun = 'alphaGun';
        fireSlope = alphaS;
        console.log(firingGun +' will fire');
    } else if ((charlieSabs > bravoSabs) && (charlieSabs > alphaSabs) && (targetY < 400) && (charlieAmmo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        fireSlope = charlieS;
        console.log(firingGun +' will fire');
    } else if ((bravoSabs >= alphaSabs) && (bravoSabs >= charlieSabs) && (targetY < 400) && (bravoAmmo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        fireSlope = bravoS;
        console.log(firingGun +' will fire');
    } else {
        console.log('No guns can fire');
    }
    shoot = bullets[count];
    shoot = new BulletGen(firingGun + cStr,initX,initY,3,true,fireSlope);
    shoot.addBullet();
    shoot.drawBullet();
    console.log('Bullet Array: ' + bullets);
}

function slope(x1,y1,x2,y2){
    /*return (y2 - y1)/Math.abs((x2 - x1));*/
    return (y2 - y1)/(x2 - x1);
}

/* Create the Bullets  */
var BulletGen = function(bName,bPosX,bPosY,bRadius,bActive,bSlope){
    this.name = bName;
    this.x = bPosX;
    this.y = bPosY;
    this.radius = bRadius;
    this.active = bActive;
    this.slope = bSlope;
    
    this.addBullet = function(){
        /*bullets.push(this.name);*/
        bullets.push(this);
    }
    
    this.drawBullet = function(){
        c.fillStyle = "#0d0384";
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
    }
};

function update(){
    for (var i = 0; i < bullets.length; i++){
        var oBx = bullets[i].x;
        var oBy = bullets[i].y;
        var oBs = bullets[i].slope;
        console.log('Old bullet X, Y, and slope: ' + oBx + ' & ' + oBy + ' & ' + oBs);
        bullets[i].x += 1;
        bullets[i].y += bullets[i].slope;
        console.log('New bullet X and Y: ' + bullets[i].x + ' & ' + bullets[i].y)
        shoot.drawBullet();
    }
}




/* ---------------  Function Calls  --------------- */

$(function(){
    
    $start.on('click',function(){ 
        alphaGun = new GunGen('alphaGun',130,420,5,true);
            alphaGun.addGun();
            alphaGun.drawGun();
        bravoGun = new GunGen('bravoGun',390,420,5,true);
            bravoGun.addGun();
            bravoGun.drawGun();
        charlieGun = new GunGen('charlieGun',650,420,5,true);
            charlieGun.addGun();
            charlieGun.drawGun();
        console.log('Gun Array: ' + guns);
        
        groundGen();
        
        var alphaCity1 = new CityGen('alpha1',30,445,20,25,true);
            alphaCity1.addCity();
            alphaCity1.drawCity();
        var alphaCity2 = new CityGen('alpha2',210,445,20,25,true);
            alphaCity2.addCity();
            alphaCity2.drawCity();
        var bravoCity1 = new CityGen('bravo1',290,445,20,25,true);
            bravoCity1.addCity();
            bravoCity1.drawCity();
        var bravoCity2 = new CityGen('bravo2',470,445,20,25,true);
            bravoCity2.addCity();
            bravoCity2.drawCity();
        var charlieCity1 = new CityGen('charlie1',550,445,20,25,true);
            charlieCity1.addCity();
            charlieCity1.drawCity();
        var charlieCity2 = new CityGen('charlie2',730,445,20,25,true);
            charlieCity2.addCity();
            charlieCity2.drawCity();
        console.log('City Array: ' + cities);
        
        $canvas.on('click',function(){
            mouseXY();
            prepareToFire(mouseX,mouseY);
            groundGen();
           
            count++;
            
            /*update();*/
        });
        
        
        var FPS = 50;
        setInterval(function() {
        update();
        /*draw();*/
        }, 1000/FPS);
        
    }); 
    
});