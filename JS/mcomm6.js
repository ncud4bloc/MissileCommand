var $content = $('#content');
var $status = $('<div class="topbar" id="gStatus">Ammo Supply</div>');
var $start = $('<div class="topbar" id="gStart">Start</div>');
var $data = $('<div class="topbar" id="gData">Game Info</div>');
var $gameBoard = $('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="gameBoard"></div>');
var $canvas = $('<canvas width = "780" height = "510" id = "canvas"></canvas>');

var count = 0;
var iter = 0;
var tick = 420;
var alphaGun;
var bravoGun;
var charlieGun;
var myClicks = [];
var myMouses = [];
var mouseX;
var mouseY;
var firingGun;

var aa;
var theta;
var deltaX;
var deltaY;
var gunDeltaAr = [];
var missileDeltaAr = [];
var eachDelta = [];

var shoot;
var bullets = [];
var missiles = [];
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
    for(var i = 0;i < 4;i++){
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
    
    /*console.log('Click Coordinates are X = ' + mouseX + ', Y = ' + mouseY);
    console.log('Clicks are: ' + myClicks[count]);*/
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
        aa = (targetX - alphaGun.x)/alphaD;
        /*console.log(firingGun +' will fire');*/
    } else if ((charlieD < bravoD) && (charlieD < alphaD) && (targetY < 400) && (charlieAmmo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'firing';
        aa = (targetX - charlieGun.x)/charlieD;
        /*console.log(firingGun +' will fire');*/
    } else if ((bravoD <= alphaD) && (bravoD <= charlieD) && (targetY < 400) && (bravoAmmo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'firing';
        charlieGun.firing = 'standby';
        aa = (targetX - bravoGun.x)/bravoD;
        /*console.log(firingGun +' will fire');*/
    } else {
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        /*console.log('No guns can fire');*/
    }
    
    vectorCalc(aa);
    gunDeltaAr.push(eachDelta);
    eachDelta = [];

    shoot = new BulletGen(firingGun + cStr,initX,initY,1,true);
    shoot.addBullet();
    shoot.drawBullet();
    /*console.log('Bullet Array: ' + bullets);
    console.log('New Bullet Name: ' + bullets[count].name);*/
}

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((y2 - y1),2) + Math.pow((x2 - x1),2));
}

function vectorCalc(disToTarget){
    theta = Math.asin(disToTarget);
        console.log('Theta = ' + theta + ' radians');
    deltaX = Math.sin(theta);
    deltaY = Math.cos(theta);
    eachDelta.push(deltaX);
    eachDelta.push(deltaY);
        console.log('The deltas from eachDelta array: ' + deltaX + 'x, ' + deltaY + 'y');
}

/* Create the Bullets  */
var BulletGen = function(bName,bPosX,bPosY,bRadius,bActive){
    this.name = bName;
    this.x = bPosX;
    this.y = bPosY;
    this.radius = bRadius;
    this.active = bActive;
    this.bLoop = 0;
    this.explodeR = 1;
    
    this.addBullet = function(){
        bullets.push(this);
    }
    
    this.drawBullet = function(){
        c.fillStyle = "#f00";
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
    }
};

/* Create the Bullet Explosions  */
var bulletExplode = function(x,y,indexE){
    bullets[indexE].explodeR += 1;
    c.fillStyle = "#f00";
    c.moveTo(x,y);
    c.arc(x,y,bullets[indexE].explodeR,0,Math.PI*2,false);
    c.fill();
    /*bulletImplode(bullets[indexE].x,bullets[indexE].y,indexE);*/
};

var bulletImplode = function(x,y,indexI){
    console.log('It sees Implode');
    while (bullets[indexI].explodeR > 0){
        c.fillStyle = "#66cbf0";
        c.moveTo(x,y);
        c.arc(x,y,bullets[indexI].explodeR,0,Math.PI*2,false);
        c.fill();
        console.log('Explosion radius = ' + bullets[indexI].explodeR);
        bullets[indexI].explodeR -= 1;
    }
        
};

/* Create the Missile Explosions  */
var missileExplode = function(x,y,mIndexE){
    missiles[mIndexE].explodeMR += 1;
    c.fillStyle = "#1d00ff";
    c.moveTo(x,y);
    c.arc(x,y,missiles[mIndexE].explodeMR,0,Math.PI*2,false);
    c.fill();
};

/* Create the Missiles  */
var MissileGen = function(mName,mRadius,mActive){
    this.name = mName;
    this.x = Math.floor(Math.random()*741 + 10);
    this.y = 100;
    /*this.tX = 0;
    this.tY = 0;*/
    this.vTarget = distance(this.x,this.y,this.tX,this.tY);
    this.vtAngle = (this.tX - this.x)/this.vTarget;
    this.radius = mRadius;
    this.active = mActive;
    this.explodeMR = 1;
    
    this.addMissile = function(){
        missiles.push(this);
    }
    
    this.drawMissile = function(){
        c.fillStyle = "#8d128d";
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
    }
    
    this.pickTarget = function(){
        var missleTarget = Math.floor(Math.random()*9 + 1);
            switch(missleTarget) {
                case 1:
                    this.tX = cities[0].x;
                    this.tY = cities[0].y;
                    break;
                case 2:
                    this.tX = cities[1].x;
                    this.tY = cities[1].y;
                    break;
                case 3:
                    this.tX = cities[2].x;
                    this.tY = cities[2].y;
                    break;
                case 4:
                    this.tX = cities[3].x;
                    this.tY = cities[3].y;
                    break;
                case 5:
                    this.tX = cities[4].x;
                    this.tY = cities[4].y;
                    break;
                case 6:
                    this.tX = cities[5].x;
                    this.tY = cities[5].y;
                    break;
                case 7:
                    this.tX = guns[0].x;
                    this.tY = guns[0].y;
                    break;
                case 8:
                    this.tX = guns[1].x;
                    this.tY = guns[1].y;
                    break;
                case 9:
                    this.tX = guns[2].x;
                    this.tY = guns[2].y;
            }
    } 
    
    /*this.vTarget = function(){
        return Math.sqrt(Math.pow((this.tY - this.y),2) + Math.pow((this.tX - this.x),2));
    }*/
};

/* Update Everything  */
function update(){
    for (var i = 0; i < bullets.length; i++){
        if (bullets[i].y < myClicks[i][1]){
            bullets[i].x += 0;
            bullets[i].y -= 0;
            if ((bullets[i].explodeR < 25) && (bullets[i].active = true)){
                bulletExplode(bullets[i].x,bullets[i].y,i);
                bullets[i].active = false;
            }
        } else {
            bullets[i].x += 3 * gunDeltaAr[i][0];
            bullets[i].y -= 3 * gunDeltaAr[i][1];
        }
    }
    
    /*for (var j = 0; j < 1; j++){*/
    for (var j = 0; j < missiles.length; j++){
        console.log('Missile x, y, tX, tY = ' + missiles[j].x + ', ' + missiles[j].y + ', ' + missiles[j].tX + ', ' + missiles[j].tY);
        
        console.log('Missile Distance to Target = ' + missiles[j].vTarget);
        
        vectorCalc(missiles[j].vtAngle);
        console.log('Vector to target = ' + missiles[j].vtAngle);
        
        missileDeltaAr[j] = eachDelta;
        eachDelta = [];
        console.log('Array missileDeltaAr: ' + missileDeltaAr);
    }
    
    for (var k = 0; k < missiles.length; k++){
        if (missiles[k].y >= missiles[k].tY){
            missiles[k].x += 0;
            missiles[k].y += 0;
            if ((missiles[k].explodeMR < 25) && (missiles[k].active = true)){
                missileExplode(missiles[k].x,missiles[k].y,k);
                missiles[k].active = false;
            }
        } else {
            missiles[k].x += missileDeltaAr[k][0];
            missiles[k].y += missileDeltaAr[k][1];
        }
    } 
    
    return;
}


/* Draw Everything  */
function draw(){
    for (var i = 0; i < bullets.length; i++){
        bullets[i].drawBullet();
    }
    for (var j = 0; j < missiles.length; j++){
        missiles[j].drawMissile();
    }
    return;
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
        /*console.log('Gun Array: ' + guns);*/
        
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
        /*console.log('City Array: ' + cities);*/
        
        var misslesPerIter = Math.floor(Math.random()*5 + 1);
        for (var i = 0; i < misslesPerIter; i++){
            var missEL = new MissileGen('missEL'+i,2,true);
            missEL.pickTarget();
            missEL.addMissile();
            missEL.drawMissile();
            console.log('Missile Array: ' + missiles + ', Target X = ' + missEL.tX + ', Target Y = ' + missEL.tY);
        }
        
        
        $canvas.on('click',function(){
            mouseXY();
            prepareToFire(mouseX,mouseY);
            count++;
        });
        
        
        var FPS = 70;
        setInterval(function() {
            update();
            draw();
            iter++;
        }, 1000/FPS);
        
        
    }); 
    
});