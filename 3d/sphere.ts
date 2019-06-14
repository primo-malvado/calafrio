var radius = 100;

var sq = Math.sqrt(2);

var cubeVertices = [
    [0,0,1],

    [sq/2,0,sq/2],
    [0,sq/2,sq/2],
    [-sq/2,0,sq/2],
    [0,-sq/2,sq/2],


    [1,0 ,0],
    [sq/2,sq/2 ,0],

    [0,1, 0],
    [-sq/2,sq/2 ,0],

    [-1, 0, 0],
    [-sq/2,-sq/2 ,0],


    [0, -1, 0],
    [sq/2,-sq/2 ,0],



    [0,0,-1], // 13

    [sq/2,0,-sq/2],
    [0,sq/2,-sq/2],
    [-sq/2,0,-sq/2],
    [0,-sq/2,-sq/2],




]
cubeVertices = cubeVertices.map(function(point){
    return [point[0]*radius , point[1]*radius , point[2]*radius ]
})

 

 



var faces = [
    [0,2,1],
    [0,3,2],
    [0,4,3],
    [0,1,4],

    [5,1,6],
    [6,1,2],
    [6,2,7],

    [7,2,8],
    [8,2,3],
    [8,3,9],

    [9,3,10],
    [10,3,4],
    [10,4,11],
    [11,4,12],
    [12,4,1],
    [12,1,5],




    [14,15,13],
    [15,16,13],
    [16,17,13],
    [17,14,13],
    [6,14,5],
    [15,14,6],
    [7,15,6],
    [8,15,7],
    [16,15,8],
    [9,16,8],
    [10,16,9],
    [17,16,10],
    [11,17,10],
    [12,17,11],
    [14,17,12],
    [5,14,12],
    



];


var container = document.getElementById("container");
var dom = faces.map(function(){
    var poly=  document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    container.appendChild(poly);
    return poly;
})

export default  {
    vertices: cubeVertices,
    faces:faces,
    dom: dom
};
