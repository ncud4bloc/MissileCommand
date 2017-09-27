var level = 1;          // current game level
var count = 0;          // counts the number of screen clicks (firing events)
var mouseX;             // variable to capture mouse X coord relative to the canvas screen
var mouseY;             // variable to capture mouse Y coord relative to the canvas screen
var myMouses = [];      // array consisting of a single mouseX & mouseY
var myClicks = [];      // coordinate array of firing event target points (an array of myMouses arrays)
var azimuth;            // sin of the firing azimuth angle
var theta;              // firing azimuth angle in radians
var deltaX;             // projectile delta X per time increment
var deltaY;             // projectile delta Y per time increment
var eachDelta = [];     // array consisting of a single deltaX & deltaY
var cities = [];        // array of all city objects
var guns = [];          // array of all city defensive artilliery objects

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var cErase = canvas.getContext('2d');



/* ---------------  Functions  --------------- */


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

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((y2 - y1),2) + Math.pow((x2 - x1),2));
}

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


/* Create the Guns  */

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
        
        var alphaGun = new GunGen('alphaGun',130,420,2,true);
            alphaGun.addGun();
            alphaGun.drawGun();
        var bravoGun = new GunGen('bravoGun',390,420,2,true);
            bravoGun.addGun();
            bravoGun.drawGun();
        var charlieGun = new GunGen('charlieGun',650,420,2,true);
            charlieGun.addGun();
            charlieGun.drawGun();
        
        $canvas.on('click',function(){
            mouseXY();
            prepareToFire(mouseX,mouseY);
            count++;
        });
        
    }); 
    
    
    
});
