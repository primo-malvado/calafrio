
import solid from "./sphere";

var screenHeight=768;
var screenWidth=1024;
 
 

var angleX = 0;
var angleY = 0;
var angleXRad = ToRadian(angleX);
var angleYRad = ToRadian(angleY);

var light = [2,-2,-5];
light = normalize(light);
 
 function drawCube(){

    const cosX = Math.cos(angleXRad);
    const sinX = Math.sin(angleXRad);
    
    const cosY = Math.cos(angleYRad);
    const sinY = Math.sin(angleYRad);




    var translation = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,500,1],
    ]



    var rotationX = [
        [1,0,0,0],
        [0,cosX,-sinX,0],
        [0,sinX,cosX,0],
        [0,0,0,1],
    ]

   

    var rotationY = [
        [cosY,0,sinY,0],
        [0,1,0,0],
        [-sinY,0,cosY,0],
        [0,0,0,1],
    ]






    var near = 600;

    var solidT = solid.vertices.map(function(point){
        
        point[3] = 1;

        
      //  var p2 = Matrix_MultiplyVector(up, point);
      var p2 = Matrix_MultiplyVector(rotationX, point);
      var p2 = Matrix_MultiplyVector(rotationY, p2);
      var p2 = Matrix_MultiplyVector(translation, p2);


        p2[0] = p2[0]/p2[2]*near + screenWidth/2 ;
        p2[1] = screenHeight - (p2[1]/p2[2]*near + screenHeight/2);
  
 
        return p2;


    })

 


    solid.faces.forEach(function(facePoints, faceIdx){


        var face = solid.dom[faceIdx];

        var normal = CalculateSurfaceNormal(solidT[facePoints[0]], solidT[facePoints[1]] , solidT[facePoints[2]]);

        
        
        if(normal[2] > 0 ){
            face.style.opacity= "0";
        }else{
            var lightVal = dotProduct(normal, light);

            var color = 255 * lightVal;
            var points = facePoints.map(function(i){
                return solidT[i][0]+" "+solidT[i][1];
            }).join(", ")
        
            face.setAttribute("points",  points); 


            face.style.opacity= "1";
            face.style.fill = "rgb("+color+","+color+","+color+")";

        }

    });

 }
 

 
 document.addEventListener("keydown", function(event) {
 
    console.log(event.keyCode);


  
    switch (event.keyCode) {
      case 38: //up
            angleX += 1;
            angleXRad =ToRadian(angleX);
            break;
        
        case 40: //down
            angleX -= 1.0;
            angleXRad = ToRadian(angleX);
            break;
 
        case 37: //left
            angleY += 1.0;
            angleYRad = ToRadian(angleY);
            break;
    
        case 39: //right
            angleY -= 1.0;
            angleYRad = ToRadian(angleY);
            break;


    }
    drawCube();
});





function Matrix_MultiplyVector(m, i)
{
    return [

        i[0] * m[0][0] + i[1] * m[1][0] + i[2] * m[2][0] + i[3] * m[3][0],
        i[0] * m[0][1] + i[1] * m[1][1] + i[2] * m[2][1] + i[3] * m[3][1],
        i[0] * m[0][2] + i[1] * m[1][2] + i[2] * m[2][2] + i[3] * m[3][2],
        i[0] * m[0][3] + i[1] * m[1][3] + i[2] * m[2][3] + i[3] * m[3][3],
     
    ]
}



function ToRadian(angle){
    return angle*Math.PI/180;
}
 


function CalculateSurfaceNormal(p1, p2 , p3) {
    var u = [
        p2[0]-p1[0], 
        p2[1]-p1[1], 
        p2[2]-p1[2]
    ];

    var v = [
        p3[0]-p1[0], 
        p3[1]-p1[1], 
        p3[2]-p1[2]
    ]

    var n = [0,0,0];
  
    n[0]=u[1]*v[2] - u[2]*v[1];
    n[1]=u[2]*v[0] - u[0]*v[2];
    n[2]=u[0]*v[1] - u[1]*v[0];
    
 
    return normalize(n);

//    return n;
  }


function normalize(n) {
    var d = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]  );
    return [
        n[0]/d,
        n[1]/d,
        n[2]/d,
    ];
  }



function dotProduct (v0, v1) {
    return v0[0] * v1[0]  +  v0[1] * v1[1]  +  v0[2] * v1[2];
};
 
/*
setInterval(function(){
    angleY -= 1.0;
    angleYRad = ToRadian(angleY);
    drawCube();
}, 40)
*/ 
drawCube();