var missileDeltaAr = [];
var explosions = [];

/* Create the Bullet Explosions  */
var antiMissileExplode = function(x,y,indexE,ebColor){
    antiMissiles[indexE].explodeR += 1;
    c.fillStyle = ebColor;
    c.moveTo(x,y);
    c.arc(x,y,antiMissiles[indexE].explodeR,0,Math.PI*2,false);
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
    
    $start.on('click',function(){ 
        
        var FPS = 70;
        setInterval(function() {
            update();
            draw();
        }, 1000/FPS);
        
    }); 
    
});