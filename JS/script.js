var level = 1;          // current game level
var gScore = 0;         // initial game score
var FPS = 50;           // frame rate per second to control game speed
var alphaGun;           // initialize alphaGun variable in global scope
var bravoGun;           // initialize bravoGun variable in global scope
var charlieGun;         // initialize charlieGun variable in global scope
var count = 0;          // counts the number of screen clicks (firing events)
var mouseX;             // variable to capture mouse X coord relative to the canvas screen
var mouseY;             // variable to capture mouse Y coord relative to the canvas screen
var myMouses = [];      // array consisting of a single mouseX & mouseY
var myClicks = [];      // coordinate array of firing event target points (an array of myMouses arrays)
var azimuth;            // sine of the firing azimuth angle
var theta;              // firing azimuth angle in radians
var deltaX;             // anti-missile delta X per time increment
var deltaY;             // anti-missile delta Y per time increment
var eachDelta = [];     // array consisting of a single deltaX & deltaY
var gunDeltaAr = [];    // array of all of the anti-missile deltas (an array of eachDelta arrays)
var antiMissiles = [];  // array of all fired anti-missiles
var missiles = [];      // array of all attacking missiles
var missileDeltaAr = [];// array of all of the missile deltas (an array of eachDelta arrays)
var numCities = 6;      // initial number of cities at game start
var numGuns = 3;        // initial number of guns at game start
var cities = [];        // array of all city objects
var guns = [];          // array of all city defensive artilliery objects
var allTargets = [];    // array of all targets for attacking missiles
var firingGun;          // current gun that is active and firing
var explosionXY = [];   // array consisting of a single explosion X & Y
var explosionsAtk = []; // array of all the attackers successful hits
var explosionsDef = []; // array of all the defenders successful missile shootdowns
var detonatePrev = 900; // initial detonation distance used to calcuate time of explosion
var myIncrement;        // variable for controlling iterative graphic updates
var myLevel;            // variable for controlling iterative levels
var endNote;            // end of game message

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');



/* ---------------  Functions  --------------- */

/* Create the Ground Graphics  */
var GroundGen = function(){
    for(var i = 0;i < 3;i++){
        /*c.fillStyle = "#14f514";*/
        c.beginPath();
        c.fillStyle = "#14f514";
        c.moveTo(i*260,470);
        c.lineTo(i*260+80,470);
        c.lineTo(i*260+130,420);
        c.lineTo(i*260+180,470);
        c.lineTo(i*260+260,470);
        c.lineTo(i*260+260,530);
        c.lineTo(i*260,530);
        c.fill();
        c.closePath();
    }
};

var SkyGen = function(){
    c.beginPath();
    c.fillStyle = "#66cbf0";
    c.moveTo(0,0);
    c.lineTo(780,0);
    c.lineTo(780,418);
    c.lineTo(0,418);
    c.fill();
    c.closePath();
};

/* Create the Cities  */
var CityGen = function(cName,cPosX,cPosY,cWidth,cHeight,cActive){
    this.name = cName;
    this.x = cPosX;
    this.y = cPosY;
    this.width = cWidth;
    this.height = cHeight;
    this.active = cActive;
    
    this.addCity = function(){
        cities.push(this);
        allTargets.push(this);
    }
    
    this.drawCity = function(){
        c.fillStyle = "#000";
        c.fillRect(this.x,this.y,this.width,this.height);
    }
};

/* Determine Mouse Click Location  */
function mouseXY(){
    var e = window.event;
    mouseX = e.pageX - $('#canvas').offset().left;
    mouseY = e.pageY - $('#canvas').offset().top;
    myMouses.push(mouseX);
    myMouses.push(mouseY);
    myClicks[count] = myMouses;
    myMouses = [];
    
    console.log('Click Coordinates are X = ' + mouseX + ', Y = ' + mouseY);
    /*console.log('Clicks are: ' + myClicks[count]);*/
}

/* Calculate Distance to Target */
function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((y2 - y1),2) + Math.pow((x2 - x1),2));
}

/* Calculate Vector to Target */
function vectorCalc(disToTarget){
    theta = Math.asin(disToTarget);
        /*console.log('Theta = ' + theta + ' radians');*/
    deltaX = Math.sin(theta);
    deltaY = Math.cos(theta);
    eachDelta.push(deltaX);
    eachDelta.push(deltaY);
}

/* Create the Guns to Fire Anti-Missiles  */
var GunGen = function(gName,gPosX,gPosY,gRadius,gActive){
    this.name = gName;
    this.x = gPosX;
    this.y = gPosY;
    this.radius = gRadius;
    this.active = gActive;
    this.firing = 'standby';
    this.destroyed = false;
    this.ammo = 20;
    
    this.addGun = function(){
        guns.push(this);
        allTargets.push(this);
    }
    
    this.drawGun = function(){
        c.beginPath();
        c.fillStyle = "#f00";
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }
};

/* Create the antiMissiles  */
var AntiMissileGen = function(bName,bPosX,bPosY,bRadius,bActive,bColor){
    this.name = bName;
    this.color = bColor;
    this.x = bPosX;
    this.y = bPosY;
    this.xInit = bPosX;
    this.yInit = bPosY;
    this.radius = bRadius;
    this.active = bActive;
    this.color = bColor;
    this.detonated = 'false';
    this.explodeR = 1;
    this.explodeEraseR = 35;
    
    this.addAntiMissile = function(){
        antiMissiles.push(this);
    }
    
    this.drawAntiMissile = function(){
        c.beginPath();
        c.fillStyle = this.color;
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }
    
};

/* Determine Firing Gun and Fire Anti-Missile */
function defensiveFireControl(targetX,targetY){
    var cStr = count.toString();
    var alphaD = distance(alphaGun.x,alphaGun.y,targetX,targetY);
    var bravoD = distance(bravoGun.x,bravoGun.y,targetX,targetY);
    var charlieD = distance(charlieGun.x,charlieGun.y,targetX,targetY);
    
    if (guns[0].destroyed == true){
        alphaD = 5000;
    }
    if (guns[1].destroyed == true){
        bravoD = 4999;
    }
    if (guns[2].destroyed == true){
        charlieD = 5001;
    }
    
    if ((guns[0].active == true) && (alphaD < bravoD) && (alphaD < charlieD) && (targetY < 387) && (alphaGun.ammo > 0)){
        var initX = alphaGun.x;
        var initY = alphaGun.y;
        firingGun = 'alphaGun';
        alphaGun.ammo -= 1;
        alphaGun.firing = 'firing';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        azimuth = (targetX - alphaGun.x)/alphaD;
        console.log(firingGun +' will fire');
    } else if ((guns[1].active == true) && (bravoD <= alphaD) && (bravoD <= charlieD) && (targetY < 387) && (bravoGun.ammo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        bravoGun.ammo -= 1;
        alphaGun.firing = 'standby';
        bravoGun.firing = 'firing';
        charlieGun.firing = 'standby';
        azimuth = (targetX - bravoGun.x)/bravoD;
        console.log(firingGun +' will fire');
    } else if ((guns[2].active == true) && (charlieD < bravoD) && (charlieD < alphaD) && (targetY < 387) && (charlieGun.ammo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        charlieGun.ammo -= 1;
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'firing';
        azimuth = (targetX - charlieGun.x)/charlieD;
        console.log(firingGun +' will fire');
    } else {
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        console.log('No guns can fire');
    }
    
    vectorCalc(azimuth);
    gunDeltaAr.push(eachDelta);
    eachDelta = [];

    var shoot = new AntiMissileGen(firingGun + cStr,initX,initY,1,true,"#f00");
    shoot.addAntiMissile();
    shoot.drawAntiMissile();
    /*console.log('Bullet Array: ' + antiMissiles);
    console.log('New Bullet Name: ' + antiMissiles[count].name);*/
    
    $('#alphaI').text('Alpha: '+ alphaGun.ammo);
    $('#bravoI').text('Bravo: '+ bravoGun.ammo);
    $('#charlieI').text('Charlie: '+ charlieGun.ammo);
}

/* Create the Anti-Missile Explosions and Erase Tracer & Explosions  */
var antiMissileExplode = function(x,y,indexE,ebColor){
    antiMissiles[indexE].explodeR += 1;
    c.beginPath();
    c.fillStyle = ebColor;
    c.moveTo(x,y);
    c.arc(x,y,antiMissiles[indexE].explodeR,0,Math.PI*2,false);
    c.fill();
    c.closePath();
    explosionXY.push(x);
    explosionXY.push(y);
    explosionsDef[indexE] = explosionXY;
    explosionXY = [];
};
var antiMissileExplodeErase = function(x,y,indexE,ebColor){
    antiMissiles[indexE].explodeEraseR -= 1;
    c.beginPath();
    c.fillStyle = ebColor;
    c.moveTo(x,y);
    c.arc(x,y,antiMissiles[indexE].explodeEraseR,0,Math.PI*2,false);
    c.fill();
    c.closePath();
};
var antiMissilePathErase = function(x1,y1,x2,y2,t){
        c.beginPath();
        c.strokeStyle = "#66cbf0";
        c.lineWidth = t;
        /*c.lineCap = "round";*/
        c.moveTo(x1,y1);
        c.lineTo(x2,y2);
        c.stroke();
        c.closePath();
};

/* Create the Missiles  */
var MissileGen = function(mName,mRadius,mActive,mColor){
    this.name = mName;
    this.x = Math.floor(Math.random()*741 + 10);
    this.y = 0;
    this.xInit = this.x;
    this.yInit = 0;
    this.radius = mRadius;
    this.active = mActive;
    this.color = mColor;
    this.detonated = 'false';
    this.explodeMR = 1;
    this.explodeEraseMR = 40;
    
    this.addMissile = function(){
        missiles.push(this);
    }
    
    this.drawMissile = function(){
        c.beginPath();
        c.fillStyle = this.color;
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }
    
    this.pickTarget = function(){
        var missleTarget = Math.floor(Math.random()*9 + 1);
            switch(missleTarget) {
                case 1:
                    this.tX = allTargets[0].x + 10;
                    this.tY = allTargets[0].y + 15;
                    break;
                case 2:
                    this.tX = allTargets[1].x + 10;
                    this.tY = allTargets[1].y + 15;
                    break;
                case 3:
                    this.tX = allTargets[2].x + 10;
                    this.tY = allTargets[2].y + 15;
                    break;
                case 4:
                    this.tX = allTargets[3].x + 10;
                    this.tY = allTargets[3].y + 15;
                    break;
                case 5:
                    this.tX = allTargets[4].x + 10;
                    this.tY = allTargets[4].y + 15;
                    break;
                case 6:
                    this.tX = allTargets[5].x + 10;
                    this.tY = allTargets[5].y + 15;
                    break;
                case 7:
                    this.tX = allTargets[6].x;
                    this.tY = allTargets[6].y;
                    break;
                case 8:
                    this.tX = allTargets[7].x;
                    this.tY = allTargets[7].y;
                    break;
                case 9:
                    this.tX = allTargets[8].x;
                    this.tY = allTargets[8].y;
            }
    } 
    
};

/* Create a Wave of Attack Missiles */
function offensiveFireControl(){
     missiles =[];
     var misslesPerIter = Math.floor(Math.random()*8 + 1);
        for (var i = 0; i < misslesPerIter; i++){
            var missEL = new MissileGen('missEL'+i,0.25,true,"#8d128d");
            missEL.pickTarget();
            missEL.vTarget = distance(missEL.x,missEL.y,missEL.tX,missEL.tY);
            missEL.vtAngle = (missEL.tX - missEL.x)/missEL.vTarget;
            missEL.addMissile();
            missEL.drawMissile();
        }
    return;
}

/* Create the Attack Missile Explosions and Erase Tracer & Explosions  */
var missileExplode = function(x,y,mIndexE,mxColor){
    missiles[mIndexE].explodeMR += 1;
    c.beginPath();
    c.fillStyle = mxColor;   
    c.moveTo(x,y);
    c.arc(x,y,missiles[mIndexE].explodeMR,0,Math.PI*2,false);
    c.fill();
    c.closePath();
    explosionXY.push(x);
    explosionXY.push(y);
    explosionsAtk[mIndexE] = explosionXY;
    explosionXY = [];
};
var missileExplodeErase = function(x,y,indexE,ebColor){
    missiles[indexE].explodeEraseMR -= 1;
    c.beginPath();
    c.fillStyle = ebColor;
    c.moveTo(x,y);
    c.arc(x,y,missiles[indexE].explodeEraseMR,0,Math.PI*2,false);
    c.fill();
    c.closePath();
};
var missilePathErase = function(x1,y1,x2,y2,t){
    c.beginPath();
    c.strokeStyle = "#66cbf0";
    c.lineWidth = t;
    /*c.lineCap = "round";*/
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.stroke();
    c.closePath();
};

/* Determine if Anti-Missile Intercepted Attack Missile */
function intercept(killzone){
    for (var i=0; i< antiMissiles.length; i++){
        var xPlus = antiMissiles[i].x + killzone;
        var xMinus = antiMissiles[i].x - killzone;
        var yPlus = antiMissiles[i].y + killzone;
        var yMinus = antiMissiles[i].y - killzone;
        for (var j=0; j< missiles.length; j++){
            if((antiMissiles[i].active == true) && (missiles[j].active == true) && (missiles[j].x < xPlus) && (missiles[j].x > xMinus) && (missiles[j].y < yPlus) && (missiles[j].y > yMinus) && (antiMissiles[i].y <= myClicks[i][1])){
                var detonate = distance(antiMissiles[i].x,antiMissiles[i].y,missiles[j].x,missiles[j].y);
                /*console.log('Prev dist: '+detonatePrev+' , Current dist: '+detonate);*/
                if (detonate > detonatePrev){
                    console.log(antiMissiles[i].name + ' scored a hit!');
                    
                    if (antiMissiles[i].y < 200){
                        gScore += 100;
                    } else {
                        gScore += 50;
                    }
                    showScore();
                    
                    if (antiMissiles[i].explodeR < 25){
                        antiMissileExplode(antiMissiles[i].x,antiMissiles[i].y,i,"#f00");    
                    }
                    if (antiMissiles[i].explodeEraseR > 0){
                    /*if ((antiMissiles[i].explodeR == 25) && (antiMissiles[i].explodeEraseR > 0)){*/
                        antiMissileExplodeErase(antiMissiles[i].x,antiMissiles[i].y,i,"#66cbf0");
                        setTimeout(samPE(antiMissiles[i].xInit,antiMissiles[i].yInit,antiMissiles[i].x,antiMissiles[i].y,4), 5000);
                        antiMissiles[i].radius = 0;
                        antiMissiles[i].drawAntiMissile();
                        
                    }
                    missiles[j].explodeMR = 25;
                    if ((missiles[j].explodeMR == 25) && (missiles[j].explodeEraseMR > 0)){
                        missileExplodeErase(missiles[j].x,missiles[j].y,j,"#66cbf0");
                        setTimeout(missilePathErase(missiles[j].xInit,missiles[j].yInit,missiles[j].x,missiles[j].y,4), 5000);
                        missiles[j].radius = 0;
                        missiles[j].drawMissile();
                       
                    } 
                    antiMissiles[i].active = false;
                    missiles[j].active = false;
                } else {
                    detonatePrev = detonate;
                }    
            }
        }
    }
}

/* Erase the anti-missile hit path */
function samPE(x0,y0,xE,yE,w){
    c.beginPath();
    c.fillStyle = "#66cbf0";
    c.lineTo(x0 - w, y0);
    c.lineTo(xE - w, yE);
    c.lineTo(xE + w, yE);
    c.lineTo(x0 + w, y0);
    c.fill();
    c.closePath();
}

/* Determine if Missile Hit Target City */
function hitCity(killzone){
    for (var i=0; i< missiles.length; i++){
        var xPlus = missiles[i].x + killzone;
        var xMinus = missiles[i].x - killzone;
        for (var j=0; j< cities.length; j++){
            if ((missiles[i].y > cities[j].y) && (cities[j].x < xPlus) && (cities[j].x > xMinus)){
                /*console.log('City '+ cities[j].name +' hit');*/
                gScore -= 20;
                showScore();
                cities[j].active = false; 
            }
        }
    }
}

/* Determine if Missile Hit Target Gun */
function hitGun(killzone){
    for (var i=0; i< missiles.length; i++){
        var xPlus = missiles[i].x + killzone;
        var xMinus = missiles[i].x - killzone;
        for (var j=0; j< guns.length; j++){
            if ((missiles[i].y > guns[j].y) && (guns[j].x < xPlus) && (guns[j].x > xMinus)){
                /*gScore -= 10;
                showScore();*/
                guns[j].active = false;
                guns[j].destroyed = true;
                guns[j].ammo = 0;
            }
        }
    }
}

/* Update the Anti-Missile Positions and Status */
function updateAntiMissiles(){
    for (var i = 0; i < antiMissiles.length; i++){
        if (antiMissiles[i].active == true){   
            if (antiMissiles[i].y < myClicks[i][1]){
                antiMissiles[i].x += 0;
                antiMissiles[i].y -= 0;
                /*antiMissiles[i].detonated = 'true';*/
                if (antiMissiles[i].explodeR < 25){
                    antiMissileExplode(antiMissiles[i].x,antiMissiles[i].y,i,"#f00");    
                }
                if ((antiMissiles[i].explodeR == 25) && (antiMissiles[i].explodeEraseR > 0)){
                    antiMissileExplodeErase(antiMissiles[i].x,antiMissiles[i].y,i,"#66cbf0");
                    setTimeout(antiMissilePathErase(antiMissiles[i].xInit,antiMissiles[i].yInit,antiMissiles[i].x,antiMissiles[i].y,4), 5000);
                    antiMissiles[i].radius = 0;
                }
            } else {
                antiMissiles[i].x += 3 * gunDeltaAr[i][0];
                antiMissiles[i].y -= 3 * gunDeltaAr[i][1];
            }
        }    
    }
}

/* Update the Missile Positions and Status */
function updateMissiles(){
    for (var k = 0; k < missiles.length; k++){
        if (missiles[k].active == true){   
            vectorCalc(missiles[k].vtAngle);
            missileDeltaAr[k] = eachDelta;
            eachDelta = [];
            if (missiles[k].y >= missiles[k].tY){
                missiles[k].x += 0;
                missiles[k].y += 0;
                /*missiles[k].detonated = 'true';*/
                if (missiles[k].explodeMR < 25){
                    missileExplode(missiles[k].x,missiles[k].y,k,"#8d128d"); 
                }
                if ((missiles[k].explodeMR == 25) && (missiles[k].explodeEraseMR > 0)){
                    missileExplodeErase(missiles[k].x,missiles[k].y,k,"#66cbf0");
                    setTimeout(missilePathErase(missiles[k].xInit,missiles[k].yInit,missiles[k].x,missiles[k].y,2 * missiles[k].radius), 5000);
                    missiles[k].radius = 0;
                }  
            } else {
                missiles[k].x += missileDeltaAr[k][0];
                missiles[k].y += missileDeltaAr[k][1];
            }
        }   
    }
}

function cityNum(){
    for (var i = 0; i < cities.length; i++){
        if (cities[i].active == false){
            cities.splice(i,1);
        }
    }
    numCities = cities.length;
    $('#cityI').text('Cities: '+ numCities);
}

function gunNum(){
    for (var i = 0; i < guns.length; i++){
        if (guns[i].active == false){
            numGuns -= 1;
            gScore -= 10;
            showScore();
        }
    }
}

function reArm(){
    for (var i = 0; i < guns.length; i++){
        if ((level % 5 == 0) && (guns[i].active == true)){
            guns[i].ammo = 20;
            $('#alphaI').text('Alpha: '+ alphaGun.ammo);
            $('#bravoI').text('Bravo: '+ bravoGun.ammo);
            $('#charlieI').text('Charlie: '+ charlieGun.ammo);
            console.log('Gun ' + guns[i].name + ' re-armed');
        }
    }
}

function showScore(){
    $('#scoreI').text('Score: ' + gScore);
}

function victoryConditions(){
    if (numCities < 1){
        endNote = 'Game ends in defeat...all cities destroyed \n \n Reload for new game';
        endGame();
        stopStep(myIncrement);
        stopStep(myLevel);
        var loseSky = new SkyGen();
    } else {
        console.log('Continuing to level ' + level);
    }
    
    if ((numCities > 0) && ((level > 16) || (gScore > 5000))){
        console.log('Game won in level ' + level);
        var finalLev = level -1;
        endNote = 'Game Victory! Level: ' + finalLev + ' Score: ' + gScore + '\n \n Reload for new game';
        endGame();
        stopStep(myIncrement);
        stopStep(myLevel);
        var winSky = new SkyGen();
    }
}

function endGame(){
    alert(endNote);
}

/* Update Everything  */
function update(){
    updateAntiMissiles();
    updateMissiles();
    intercept(15);
    hitCity(20);
    hitGun(20);
    cityNum();
}

/* Draw Everything  */
function draw(){
    for (var i = 0; i < antiMissiles.length; i++){
        antiMissiles[i].drawAntiMissile();
    }
    for (var j = 0; j < missiles.length; j++){
        missiles[j].drawMissile();
    }
    for (var k = 0; k < 3; k++){
        if (guns[k].active == true){
            guns[k].drawGun();
        } 
    }
    return;
}

/* Play the Game */
function eachStep(){
    update();
    draw();
    victoryConditions();
}

function eachLevel(){
    var newSky = new SkyGen();
    gunNum();
    /*victoryConditions();*/
    stopStep(myIncrement);
    antiMissiles = []; 
    missiles = [];
    myClicks = [];
    gunDeltaAr = [];
    count = 0;
    playMC();
    reArm();
}

function stopStep(incID){
    clearInterval(incID);
}

function playMC(){
      $('#levelI').text('Level: ' + level);
      offensiveFireControl();
        /*console.log('Level ' + level + ' missiles generated and targets selected');*/
      myIncrement = setInterval(function(){eachStep()}, 1000/FPS);
      level +=1;
}

function continuePlay(){
    myLevel = setInterval(function(){eachLevel()}, 20000);
}



/* ---------------  Function Calls  --------------- */

$(function(){
    
        var ground = new GroundGen();
        
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
        
        alphaGun = new GunGen('alphaGun',130,420,2,true);
            alphaGun.addGun();
            alphaGun.drawGun();
        bravoGun = new GunGen('bravoGun',390,420,2,true);
            bravoGun.addGun();
            bravoGun.drawGun();
        charlieGun = new GunGen('charlieGun',650,420,2,true);
            charlieGun.addGun();
            charlieGun.drawGun();
        
    $('#gStart').on('click',function(){
        
        $('#canvas').on('click',function(){
        mouseXY();
        defensiveFireControl(mouseX,mouseY);
          /*console.log('Level ' + level + ' firing gun determined and anti-missile fired');*/
        count++;
        });
        
        $('#levelI').text('Level: ' + level);
        
        alert('Welcome to Missile Command! To win, you must: \n \n 1. Survive 15 levels, or \n \n 2. Score more than 5000 points \n \n \n - Taking out a missile at long range gives 100 pts \n \n - Shorter range missile hits give 50 pts \n \n - Each destroyed city costs 20 pts \n \n - Each destroyed anti-missile battery costs 10 pts \n \n \n Anti-missile batteries are reloaded at the start of turns 4, 9, and 14 \n \n \n                                               GOOD LUCK!');
        
        playMC();
        continuePlay();
        
    });   
});