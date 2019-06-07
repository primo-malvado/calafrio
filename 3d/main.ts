var cube = [
    [1,1,1],
    [1,-1,1],
    [-1,-1,1],
    [-1,1,1],

    [1,1,-1],
    [1,-1,-1],
    [-1,-1,-1],
    [-1,1,-1],
    


]

/*

                7--------------4
               /|             /|                 
              / |            / |                
             3--------------0  |                 
             |  |           |  |                 
             |  |           |  |      
             |  6-----------|--5                   
             | /            | /                 
             |/             |/                  
             2--------------1                   
                                               
                                               
*/                                     

var m_persProj= {
    Width:80,
    Height:60,
    zNear: 10,
    zFar: 1000,
    FOV: 30,

}

cube = cube.map(function(point){
    return [point[0]*100 , point[1]*100 , point[2]*100 ]
})
 /*
cube = cube.map(function(point){
    return [point[0]+200 , point[1]+200 , point[2] ]
})
 */



var screenHeight=768;
var screenWidth=1024;
 
 

var angleX = 0;
var angleY = 0;
var angleXRad = ToRadian(angleX);
var angleYRad = ToRadian(angleY);


//var viewMatrix = InitPerspectiveProj();

 function drawCube(){
    /*
    map = [
        [0, 1],
        [3, 0],
        [0, 4],

        [2, 6],
        [5, 6],
        [6, 7],


        [1, 2],
        [2, 3],
        [1, 5],
        [3, 7],

        [4, 5],
        [7, 4],
 
    ];
    */

    const cosX = Math.cos(angleXRad);
    const sinX = Math.sin(angleXRad);
    
    const cosY = Math.cos(angleYRad);
    const sinY = Math.sin(angleYRad);




    var translation = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,800,1],
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

    var cubeT = cube.map(function(point){
        
        point[3] = 1;

        
      //  var p2 = Matrix_MultiplyVector(up, point);
      var p2 = Matrix_MultiplyVector(rotationY, point);
        var p2 = Matrix_MultiplyVector(translation, p2);
        var p2 = Matrix_MultiplyVector(rotationX, p2);

        p2[0] = p2[0]/p2[2]*near + screenWidth/2 
        p2[1] = screenHeight - (p2[1]/p2[2]*near + screenHeight/2);

        //var p2 = Matrix_MultiplyVector(viewMatrix, p2);

        return p2;


    })

/*

    map.forEach((line, idx) => {
        
        var p = document.getElementById("line"+idx);
        p.setAttribute("x1",   cubeT[line[0]][0] );
        p.setAttribute("y1", cubeT[line[0]][1]  );
        p.setAttribute("x2",  cubeT[line[1]][0] );
        p.setAttribute("y2",   cubeT[line[1]][1] );
    });
*/
/*
 

                7--------------4
               /|             /|                 
              / |            / |                
             3--------------0  |                 
             |  |           |  |                 
             |  |           |  |      
             |  6-----------|--5                   
             | /            | /                 
             |/             |/                  
             2--------------1                   
                                               
                                               
*/   
    
 
    var faces = [
        [0,4,5,1],
        [4,7,6,5],
        [2,6,7,3],
        [0,1,2,3],
        
        [0,3,7,4],
        [1,5,6,2],
    ];

    faces.forEach(function(facePoints, faceIdx){


        var face = document.getElementById("face"+faceIdx);
    
        var points = facePoints.map(function(i){
            return cubeT[i][0]+" "+cubeT[i][1];
        }).join(", ")
    
        face.setAttribute("points",  points);

    });

 }
 

var fYaw = 0;
var vCamera = [0,0,0];	// Location of camera in world space

var vLookDir = [0,0,1];	// Direction vector along the direction camera points

 document.addEventListener("keydown", function(event) {
 
    console.log(event.keyCode);


  
    switch (event.keyCode) {
      case 38: //up
            angleX -= 1;
            angleXRad =ToRadian(angleX);
            break;
        
        case 40: //down
            angleX += 1.0;
            angleXRad = ToRadian(angleX);
            break;
 
        case 37: //left
            angleY -= 1.0;
            angleYRad = ToRadian(angleY);
            break;
    
        case 39: //right
            angleY += 1.0;
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


/*
function InitPerspectiveProj()
{

 
    var ar = m_persProj.Width / m_persProj.Height;
    var zNear = m_persProj.zNear;
    var zFar = m_persProj.zFar;
    var zRange = zNear - zFar;
    var tanHalfFOV = Math.atan(ToRadian(m_persProj.FOV / 2.0));

 

    var m = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ]

 
    m[0][0] = 1.0 ; 
    m[0][1] = 0.0;
    m[0][2] = 0.0;
    m[0][3] = 0.0;

    m[1][0] = 0.0;
    m[1][1] = 1.0 ; 
    m[1][2] = 0.0; 
    m[1][3] = 0.0;

    m[2][0] = 0.0; 
    m[2][1] = 0.0; 
    m[2][2] = (zNear - zFar) / zRange; 
    m[2][3] = 1.0 * zFar * zNear / zRange;

    m[3][0] = 0.0;
    m[3][1] = 0.0; 
    m[3][2] = -1.0; 
    m[3][3] = 0.0;
  
    return m;
 
}
*/

function ToRadian(angle){
    return angle*Math.PI/180;
}
 

setInterval(function(){
    angleY -= 1.0;
    angleYRad = ToRadian(angleY);
    drawCube();
}, 40)

 
//drawCube();