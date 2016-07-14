var pointsArray = document.getElementsByClassName('point');
 
//var animatePoints = function(points) {
    
var revealPoint = function(pointArray){
     pointArray.style.opacity = 1;
     pointArray.style.transform = "scaleX(1) translateY(0)";
     pointArray.style.msTransform = "scaleX(1) translateY(0)";
     pointArray.style.WebkitTransform = "scaleX(1) translateY(0)";
};

// revealPoint(points);
 
//};

window.onload = function() {
    if (window.innerHeight > 950) {
         forEach(pointsArray, revealPoint);
     }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    window.addEventListener('scroll', function(event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             forEach(pointsArray, revealPoint);   
         }
     });
 }
