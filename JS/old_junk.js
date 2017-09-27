
var iter = 0;
var tick = 420;


var firingGun;



var gunDeltaAr = [];
var missileDeltaAr = [];


var shoot;
var bullets = [];
var missiles = [];
var explosions = [];
var alphaAmmo = 5;      /* This will be modded later */
var bravoAmmo = 5;      /* This will be modded later */
var charlieAmmo = 5;    /* This will be modded later */
   


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
        azimuth = (targetX - alphaGun.x)/alphaD;
        /*console.log(firingGun +' will fire');*/
    } else if ((charlieD < bravoD) && (charlieD < alphaD) && (targetY < 400) && (charlieAmmo > 0)){
        var initX = charlieGun.x;
        var initY = charlieGun.y;
        firingGun = 'charlieGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'standby';
        charlieGun.firing = 'firing';
        azimuth = (targetX - charlieGun.x)/charlieD;
        /*console.log(firingGun +' will fire');*/
    } else if ((bravoD <= alphaD) && (bravoD <= charlieD) && (targetY < 400) && (bravoAmmo > 0)){
        var initX = bravoGun.x;
        var initY = bravoGun.y;
        firingGun = 'bravoGun';
        alphaGun.firing = 'standby';
        bravoGun.firing = 'firing';
        charlieGun.firing = 'standby';
        azimuth = (targetX - bravoGun.x)/bravoD;
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

    shoot = new BulletGen(firingGun + cStr,initX,initY,1,true,"#f00");
    shoot.addBullet();
    shoot.drawBullet();
    /*console.log('Bullet Array: ' + bullets);
    console.log('New Bullet Name: ' + bullets[count].name);*/
}


function vectorCalc(disToTarget){
    theta = Math.asin(disToTarget);
        /*console.log('Theta = ' + theta + ' radians');*/
    deltaX = Math.sin(theta);
    deltaY = Math.cos(theta);
    eachDelta.push(deltaX);
    eachDelta.push(deltaY);
}

/* Create the Bullets  */
var BulletGen = function(bName,bPosX,bPosY,bRadius,bActive,bColor){
    this.name = bName;
    this.color = bColor;
    this.x = bPosX;
    this.y = bPosY;
    this.xInit = bPosX;
    this.yInit = bPosY;
    this.radius = bRadius;
    this.active = bActive;
    this.bLoop = 0;
    this.explodeR = 0;
    this.explodeBI = 0;
    
    this.addBullet = function(){
        bullets.push(this);
    }
    
    this.drawBullet = function(){
        c.fillStyle = this.color;
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
    }
    
};

/* Create the Bullet Explosions  */
var bulletExplode = function(x,y,indexE,ebColor){
    bullets[indexE].explodeR += 1;
    c.fillStyle = ebColor;
    c.moveTo(x,y);
    c.arc(x,y,bullets[indexE].explodeR,0,Math.PI*2,false);
    c.fill();
};

var Bexplodo = function(bname,bx,by,brad,bcolor,bactive){
    this.name = bname;
    this.color = bcolor;
    this.x = bx;
    this.y = by;
    this.radius = brad;
    this.active = bactive;
    this.explodeBR = 0;
    
    this.addExplodo = function(){
        explosions.push(this);
    }
    
    this.drawExplosion = function(){
        cErase.strokeStyle = this.color;
        cErase.lineWidth = 5;
        cErase.fillStyle = this.color;
        cErase.moveTo(this.x,this.y);
        cErase.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        cErase.fill();
        cErase.stroke();
    }
};


/* Create the Missile Explosions  */
var missileExplode = function(x,y,mIndexE,mxColor){
    missiles[mIndexE].explodeMR += 1;
    c.fillStyle = mxColor;   
    c.moveTo(x,y);
    c.arc(x,y,missiles[mIndexE].explodeMR,0,Math.PI*2,false);
    c.fill();
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
    this.explodeMR = 1;
    this.explodeER = 1;
    
    this.addMissile = function(){
        missiles.push(this);
    }
    
    this.drawMissile = function(){
        c.fillStyle = this.color;
        c.moveTo(this.x,this.y);
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fill();
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

var eraseBM = function(x1,y1,x2,y2,t){
        cErase.strokeStyle = "#66cbf0";
        cErase.beginPath();
        cErase.lineWidth = t;
        cErase.lineCap = "round";
        cErase.moveTo(x1,y1);
        cErase.lineTo(x2,y2);
        cErase.stroke();
};

var eraseMissileXP = function(x,y,emIndexE){
        console.log('Missile explosion radius = ' + missiles[emIndexE].explodeER);
    missiles[emIndexE].explodeER += 1;
    cErase.strokeStyle = "#66cbf0";
    cErase.lineWidth = 30;
    cErase.fillStyle = "#66cbf0";
    cErase.moveTo(x,y);
    cErase.arc(x,y,missiles[emIndexE].explodeER,0,Math.PI*2,false);
    cErase.fill();
    cErase.stroke();
};

/* Update Everything  */
function update(){
    for (var i = 0; i < bullets.length; i++){
        if (bullets[i].y < myClicks[i][1]){
            bullets[i].x += 0;
            bullets[i].y -= 0;
            if ((bullets[i].explodeR < 25) && (bullets[i].active = true)){
                bulletExplode(bullets[i].x,bullets[i].y,i,"#f00");
                bullets[i].active = false;
                setTimeout(eraseBM(bullets[i].xInit,bullets[i].yInit,bullets[i].x,bullets[i].y,2 * bullets[i].radius), 5000);
                bullets[i].radius = 0;
                
                function myUnBEx(){
                    var bPlo = new Bexplodo('bPlo'+i,bullets[i].x,bullets[i].y,25,"#66cbf0",true);
                    bPlo.addExplodo();
                    for (var s = 0; s < explosions.length; s++){
                        explosions[s].drawExplosion();    
                    }
                }
                myUnBEx();
                           
            }
        } else {
            bullets[i].x += 3 * gunDeltaAr[i][0];
            bullets[i].y -= 3 * gunDeltaAr[i][1];
        }
    }
    
    for (var j = 0; j < missiles.length; j++){
        vectorCalc(missiles[j].vtAngle);
        missileDeltaAr[j] = eachDelta;
        eachDelta = [];
    }
    
    for (var k = 0; k < missiles.length; k++){
        if (missiles[k].y >= missiles[k].tY){
            missiles[k].x += 0;
            missiles[k].y += 0;
            if (missiles[k].explodeMR < 25){
                /*missileExplode(missiles[k].x,missiles[k].y,k,"#faa");*/
                function myUnEx(){
                    setTimeout(missileExplode(missiles[k].x,missiles[k].y,k,"#66cbf0"),8000);
                }
                myUnEx();
                missiles[k].radius = 0;
                missiles[k].active = false;
                setTimeout(eraseBM(missiles[k].xInit,missiles[k].yInit,missiles[k].x,missiles[k].y,2 * missiles[k].radius), 8000);    
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
       
        
        var misslesPerIter = Math.floor(Math.random()*5 + 1);
        for (var i = 0; i < misslesPerIter; i++){
            var missEL = new MissileGen('missEL'+i,0.25,true,"#8d128d");
            missEL.pickTarget();
            missEL.vTarget = distance(missEL.x,missEL.y,missEL.tX,missEL.tY);
            missEL.vtAngle = (missEL.tX - missEL.x)/missEL.vTarget;
            missEL.addMissile();
            missEL.drawMissile();
        }
        
        var FPS = 70;
        setInterval(function() {
            update();
            draw();
            iter++;
        }, 1000/FPS);
        
        /*window.requestAnimFrame = (function(){
            return  window.requestAnimFrame  ||
                    window.webkitRequestAnimFrame  ||
                    window.mozRequestAnimFrame  ||
                    window.oRequestAnimFrame  ||
                    window.msRequestAnimFrame  ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            
        })();
        window.requestAnimFrame(update);
        window.requestAnimFrame(draw);*/
        
    }); 
    
});