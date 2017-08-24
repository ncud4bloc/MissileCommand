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
var myClicks = [];
var myMouses = [];
var mouseX;
var mouseY;
var firingGun;
var fireSlope;

var aa;
var theta;
var deltaX;
var deltaY;

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
        c.closePath();
        /*c.lineTo(i*260,470);*/
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
       /* cities.push(this.name);*/
        cities.push(this);
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
        /*guns.push(this.name);*/
        guns.push(this);
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
    myMouses.push(mouseX);
    myMouses.push(mouseY);
    myClicks[count] = myMouses;
    myMouses = [];
    
    console.log('Click Coordinates are X = ' + mouseX + ', Y = ' + mouseY);
    console.log('Clicks are: ' + myClicks[count]);
   /* var t = setTimeout(mouse_position,100);*/
}

function prepareToFire(targetX,targetY){
    /* Determine which gun fires */
    var cStr = count.toString();
    var alphaD = distance(alphaGun.x,alphaGun.y,targetX,targetY);
    var bravoD = distance(bravoGun.x,bravoGun.y,targetX,targetY);
    var charlieD = distance(charlieGun.x,charlieGun.y,targetX,targetY);
    if ((alphaD < bravoD) && (alphaD < charlieD) && (targetY < 400) && (alphaAmmo > 0)){
        var initX = alphaGun.x;
        var initY = alphaGun.y;
        firingGun = 'alphaGun';
        alphaGun.firing = 'firing';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        /*fireSlope = alphaS;*/
        aa = (targetX - alphaGun.x)/alphaD;
        console.log(firingGun +' will fire');
    } else if ((charlieD < bravoD) && (charlieD < alphaD) && (targetY < 400) && (charlieAmmo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'firing';
        /*fireSlope = charlieS;*/
        aa = (targetX - charlieGun.x)/charlieD;
        console.log(firingGun +' will fire');
    } else if ((bravoD <= alphaD) && (bravoD <= charlieD) && (targetY < 400) && (bravoAmmo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'firing';
        charlieGun.firing = 'standby';
        /*fireSlope = bravoS;*/
        aa = (targetX - bravoGun.x)/bravoD;
        console.log(firingGun +' will fire');
    } else {
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        console.log('No guns can fire');
    }
    
    theta = Math.asin(aa);
    deltaX = Math.sin(theta);
    deltaY = Math.cos(theta);

    shoot = new BulletGen(firingGun + cStr,initX,initY,1,true);
    shoot.addBullet();
    shoot.drawBullet();
    console.log('Bullet Array: ' + bullets);
}

function slope(x1,y1,x2,y2){
    return (y2 - y1)/(x2 - x1);
}

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((y2 - y1),2) + Math.pow((x2 - x1),2));
}

/* Create the Bullets  */
var BulletGen = function(bName,bPosX,bPosY,bRadius,bActive){
    this.name = bName;
    this.x = bPosX;
    this.y = bPosY;
    this.radius = bRadius;
    this.active = bActive;
    
    this.addBullet = function(){
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
        console.log('Old bullet X and Y: ' + oBx + ' & ' + oBy);
        bullets[i].x += deltaX;
        bullets[i].y -= deltaY;
        console.log('New bullet X and Y: ' + bullets[i].x + ' & ' + bullets[i].y)
        shoot.drawBullet();
    }
}




/* ---------------  Function Calls  --------------- */

$(function(){
    
    $start.on('click',function(){ 
        alphaGun = new GunGen('alphaGun',130,420,2,true);
            alphaGun.addGun();
            alphaGun.drawGun();
        bravoGun = new GunGen('bravoGun',390,420,2,true);
            bravoGun.addGun();
            bravoGun.drawGun();
        charlieGun = new GunGen('charlieGun',650,420,2,true);
            charlieGun.addGun();
            charlieGun.drawGun();
        console.log('Gun Array: ' + guns);
        
        groundGen();
        
        var alphaCity1 = new CityGen('alphaCity1',30,445,20,25,true);
            alphaCity1.addCity();
            alphaCity1.drawCity();
        var alphaCity2 = new CityGen('alphaCity2',210,445,20,25,true);
            alphaCity2.addCity();
            alphaCity2.drawCity();
        var bravoCity1 = new CityGen('bravoCity1',290,445,20,25,true);
            bravoCity1.addCity();
            bravoCity1.drawCity();
        var bravoCity2 = new CityGen('bravoCity2',470,445,20,25,true);
            bravoCity2.addCity();
            bravoCity2.drawCity();
        var charlieCity1 = new CityGen('charlieCity1',550,445,20,25,true);
            charlieCity1.addCity();
            charlieCity1.drawCity();
        var charlieCity2 = new CityGen('charlieCity2',730,445,20,25,true);
            charlieCity2.addCity();
            charlieCity2.drawCity();
        console.log('City Array: ' + cities);
        
        $canvas.on('click',function(){
            mouseXY();
            prepareToFire(mouseX,mouseY);
            /*for (var j = 0; j < myClicks.length; j++){
                prepareToFire(myClicks[count][0],myClicks[count][1]);
                count++;
            }*/
            
            /*groundGen();*/
           
            
            
            /*update();*/
            count++;
        });
        
        
        var FPS = 500;
        setInterval(function() {
        update();
        /*draw();*/
        }, 1000/FPS);
          
        
    }); 
    
});