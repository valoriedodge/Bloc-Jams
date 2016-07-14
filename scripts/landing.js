var animatePoints = function() {
 
     var points = document.getElementsByClassName('point');
    
     var revealPoint = function(pointArray){
         for(var i = 0; i<pointArray.length; i++){
             pointArray[i].style.opacity = 1;
//             pointArray[i].style.color = "#7bd4af";
             pointArray[i].style.transform = "scaleX(1) translateY(0)";
             pointArray[i].style.msTransform = "scaleX(1) translateY(0)";
             pointArray[i].style.WebkitTransform = "scaleX(1) translateY(0)";
         }
     }
 
     revealPoint(points);
 
 };