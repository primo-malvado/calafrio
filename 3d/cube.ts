var cubeVertices = [
    [1,1,1],
    [1,-1,1],
    [-1,-1,1],
    [-1,1,1],

    [1,1,-1],
    [1,-1,-1],
    [-1,-1,-1],
    [-1,1,-1],
    


]
cubeVertices = cubeVertices.map(function(point){
    return [point[0]*100 , point[1]*100 , point[2]*100 ]
})
/*


                7--------------4
               /|             /|                 
              / |            / |                
             3--+-----------0  |                 
             |  |           |  |                 
             |  |           |  |      
             |  6-----------+--5                   
             | /            | /                 
             |/             |/                  
             2--------------1                   
                                               
                                               
*/                                     

 

 



var faces = [
    [0,4,1],[4,5,1],
    [4,7,5],[7,6,5],
    [2,6,3],[6,7,3],
    [0,1,3],[1,2,3],        
    [0,3,4],[3,7,4],
    [1,5,2],[5,6,2],
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
