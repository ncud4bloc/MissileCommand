var level = 1;          // current game level
var FPS = 70;           // frame rate per second to control game speed
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
var shoot;              // variable for creating each individual firing anti-missile
var antiMissiles = [];  // array of all fired anti-missiles
var missiles = [];      // array of all attacking missiles
var missileDeltaAr = [];// array of all of the missile deltas (an array of eachDelta arrays)
var cities = [];        // array of all city objects
var guns = [];          // array of all city defensive artilliery objects
var firingGun;          // current gun that is active and firing
var explosionXY = [];   // array consisting of a single explosion X & Y
var explosionsAtk = [];    // array of all the attackers successful hits
var explosionsDef = [];    // array of all the defenders successful missile shootdowns

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var cMissile = canvas.getContext('2d');
var cAntiMissile = canvas.getContext('2d');
var cErase = canvas.getContext('2d');



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
    console.log('Clicks are: ' + myClicks[count]);
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
    this.ammo = 20;
    
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
    this.detonated = 'false';
    this.explodeR = 0;
    this.explodeEraseR = 27;
    
    this.addAntiMissile = function(){
        antiMissiles.push(this);
    }
    
    this.drawAntiMissile = function(){
        cAntiMissile.fillStyle = this.color;
        cAntiMissile.moveTo(this.x,this.y);
        cAntiMissile.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        cAntiMissile.fill();
    }
    
};

/* Determine Firing Gun and Fire Anti-Missile */
function defensiveFireControl(targetX,targetY){
    var cStr = count.toString();
    var alphaD = distance(alphaGun.x,alphaGun.y,targetX,targetY);
    var bravoD = distance(bravoGun.x,bravoGun.y,targetX,targetY);
    var charlieD = distance(charlieGun.x,charlieGun.y,targetX,targetY);
    if ((alphaD < bravoD) && (alphaD < charlieD) && (targetY < 400) && (alphaGun.ammo > 0)){
        var initX = alphaGun.x;
        var initY = alphaGun.y;
        firingGun = 'alphaGun';
        alphaGun.firing = 'firing';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        azimuth = (targetX - alphaGun.x)/alphaD;
        /*console.log(firingGun +' will fire');*/
    } else if ((bravoD <= alphaD) && (bravoD <= charlieD) && (targetY < 400) && (bravoGun.ammo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'firing';
        charlieGun.firing = 'standby';
        azimuth = (targetX - bravoGun.x)/bravoD;
        /*console.log(firingGun +' will fire');*/
    } else if ((charlieD < bravoD) && (charlieD < alphaD) && (targetY < 400) && (charlieGun.ammo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'firing';
        azimuth = (targetX - charlieGun.x)/charlieD;
        /*console.log(firingGun +' will fire');*/
    } else {
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'standby';
        /*console.log('No guns can fire');*/
    }
    
    vectorCalc(azimuth);
    gunDeltaAr.push(eachDelta);
    eachDelta = [];

    shoot = new AntiMissileGen(firingGun + cStr,initX,initY,1,true,"#f00");
    shoot.addAntiMissile();
    shoot.drawAntiMissile();
    /*console.log('Bullet Array: ' + antiMissiles);
    console.log('New Bullet Name: ' + antiMissiles[count].name);*/
}

/* Create the Anti-Missile Explosions and Erase Explosions  */
var antiMissileExplode = function(x,y,indexE,ebColor){
    antiMissiles[indexE].explodeR += 1;
    cAntiMissile.fillStyle = ebColor;
    cAntiMissile.moveTo(x,y);
    cAntiMissile.arc(x,y,antiMissiles[indexE].explodeR,0,Math.PI*2,false);
    cAntiMissile.fill();
    explosionXY.push(x);
    explosionXY.push(y);
    explosionsDef[indexE] = explosionXY;
    explosionXY = [];
};
var antiMissileExplodeErase = function(x,y,indexE,ebColor){
    antiMissiles[indexE].explodeEraseR -= 1;
    cAntiMissile.fillStyle = ebColor;
    cAntiMissile.moveTo(x,y);
    cAntiMissile.arc(x,y,antiMissiles[indexE].explodeEraseR,0,Math.PI*2,false);
    cAntiMissile.fill();
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
    this.explodeER = 1;
    
    this.addMissile = function(){
        missiles.push(this);
    }
    
    this.drawMissile = function(){
        cMissile.fillStyle = this.color;
        cMissile.moveTo(this.x,this.y);
        cMissile.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        cMissile.fill();
    }
    
    this.pickTarget = function(){
        var missleTarget = Math.floor(Math.random()*9 + 1);
            switch(missleTarget) {
                case 1:
                    this.tX = cities[0].x + 10;
                    this.tY = cities[0].y + 15;
                    break;
                case 2:
                    this.tX = cities[1].x + 10;
                    this.tY = cities[1].y + 15;
                    break;
                case 3:
                    this.tX = cities[2].x + 10;
                    this.tY = cities[2].y + 15;
                    break;
                case 4:
                    this.tX = cities[3].x + 10;
                    this.tY = cities[3].y + 15;
                    break;
                case 5:
                    this.tX = cities[4].x + 10;
                    this.tY = cities[4].y + 15;
                    break;
                case 6:
                    this.tX = cities[5].x + 10;
                    this.tY = cities[5].y + 15;
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
    
};

/* Create a Wave of Attack Missiles */
function offensiveFireControl(){
     var misslesPerIter = Math.floor(Math.random()*5 + 1);
        for (var i = 0; i < misslesPerIter; i++){
            var missEL = new MissileGen('missEL'+i,0.25,true,"#8d128d");
            missEL.pickTarget();
            missEL.vTarget = distance(missEL.x,missEL.y,missEL.tX,missEL.tY);
            missEL.vtAngle = (missEL.tX - missEL.x)/missEL.vTarget;
            missEL.addMissile();
            missEL.drawMissile();
        }   
}

/* Create the Attack Missile Explosions  */
var missileExplode = function(x,y,mIndexE,mxColor){
    missiles[mIndexE].explodeMR += 1;
    cMissile.fillStyle = mxColor;   
    cMissile.moveTo(x,y);
    cMissile.arc(x,y,missiles[mIndexE].explodeMR,0,Math.PI*2,false);
    cMissile.fill();
    explosionXY.push(x);
    explosionXY.push(y);
    explosionsAtk[mIndexE] = explosionXY;
    explosionXY = [];
};

/* Update the Anti-Missile Positions and Status */
function updateAntiMissiles(){
    
    for (var i = 0; i < antiMissiles.length; i++){
        if (antiMissiles[i].y < myClicks[i][1]){
            antiMissiles[i].x += 0;
            antiMissiles[i].y -= 0;
            antiMissiles[i].detonated = 'true';
            if ((antiMissiles[i].explodeR < 25) && (antiMissiles[i].active == true)){
                antiMissileExplode(antiMissiles[i].x,antiMissiles[i].y,i,"#f00");
                /*antiMissiles[i].active = false;*/
               
                /*               setTimeout(eraseBM(antiMissiles[i].xInit,antiMissiles[i].yInit,antiMissiles[i].x,antiMissiles[i].y,2 * antiMissiles[i].radius), 5000);
                antiMissiles[i].radius = 0;
                
                function myUnBEx(){
                    var bPlo = new Bexplodo('bPlo'+i,antiMissiles[i].x,antiMissiles[i].y,25,"#66cbf0",true);
                    bPlo.addExplodo();
                    for (var s = 0; s < explosions.length; s++){
                        explosions[s].drawExplosion();    
                    }
                }
                myUnBEx();
                */
                
                           
            }
            if ((antiMissiles[i].explodeR == 25) && (antiMissiles[i].explodeEraseR > 0)){
                antiMissileExplodeErase(antiMissiles[i].x,antiMissiles[i].y,i,"#66cbf0");
            }
        } else {
            antiMissiles[i].x += 3 * gunDeltaAr[i][0];
            antiMissiles[i].y -= 3 * gunDeltaAr[i][1];
        }
    }
    
}

/* Update the Missile Positions and Status */
function updateMissiles(){
    for (var k = 0; k < missiles.length; k++){
        vectorCalc(missiles[k].vtAngle);
        missileDeltaAr[k] = eachDelta;
        eachDelta = [];
        if (missiles[k].y >= missiles[k].tY){
            missiles[k].x += 0;
            missiles[k].y += 0;
            missiles[k].detonated = 'true';
            
            
            if (missiles[k].explodeMR < 25){
                missileExplode(missiles[k].x,missiles[k].y,k,"#faa");
                /*function myUnEx(){
                    setTimeout(missileExplode(missiles[k].x,missiles[k].y,k,"#66cbf0"),8000);
                }
                myUnEx();
                missiles[k].radius = 0;
                missiles[k].active = false;
                setTimeout(eraseBM(missiles[k].xInit,missiles[k].yInit,missiles[k].x,missiles[k].y,2 * missiles[k].radius), 8000); */   
            }  
            
        } else {
            missiles[k].x += missileDeltaAr[k][0];
            missiles[k].y += missileDeltaAr[k][1];
        }
    }

}

/* Update Everything  */
function update(){
    updateAntiMissiles();
    updateMissiles();
}

/* Draw Everything  */
function draw(){
    for (var i = 0; i < antiMissiles.length; i++){
        antiMissiles[i].drawAntiMissile();
    }
    for (var j = 0; j < missiles.length; j++){
        missiles[j].drawMissile();
    }
    return;
}



/* ---------------  Function Calls  --------------- */

$(function(){
    
    $('#gStart').on('click',function(){
        
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
        
        alphaGun = new GunGen('alphaGun',130,420,2,true);
            alphaGun.addGun();
            alphaGun.drawGun();
        bravoGun = new GunGen('bravoGun',390,420,2,true);
            bravoGun.addGun();
            bravoGun.drawGun();
        charlieGun = new GunGen('charlieGun',650,420,2,true);
            charlieGun.addGun();
            charlieGun.drawGun();
        
        offensiveFireControl();
        
        $('#canvas').on('click',function(){
            mouseXY();
            defensiveFireControl(mouseX,mouseY);
            count++;
        });
        
        setInterval(function() {
            update();
            draw();
        }, 1000/FPS);
        
    }); 
    
    
    
});
