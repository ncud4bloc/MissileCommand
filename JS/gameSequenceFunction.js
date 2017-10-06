$('#gStart').on('click',function(){
        
    $('#levelI').text('Level: ' + level);
    if (level == 1){
        playMC();
    } else {
        setInterval(function() {
            playMC();
        }, 10000);
    }
        
});    
    
    
  function playMC(){
      $('#levelI').text('Level: ' + level);
      offensiveFireControl();
        console.log('Level ' + level + ' missiles generated and targets selected');
      
      $('#canvas').on('click',function(){
        mouseXY();
        defensiveFireControl(mouseX,mouseY);
          console.log('Level ' + level + ' firing gun determined and anti-missile fired');
        count++;
      });
      
      setInterval(function() {
        update();
        draw();
      }, 1000/(FPS/70));
      
      var antiMissiles = []; 
      var missiles = [];
      level +=1;
  }  
    









        
       for (var levelC = 1; levelC < 6; levelC++){
            if (levelC == 1) {
                setInterval(function() {
                    update();
                    draw();
                    /*upLevel();*/
                }, 1000/FPS);  
            } else {
                $('#levelI').text('Level: ' + level);
                
                setInterval(function() {
                    offensiveFireControl();
                    
                }, 10000);
            }
        }
              
     