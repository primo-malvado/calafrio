/*
c1:
    o0=a?1:c  

r:
    o0=a?0:1    o1=c?a:o0    
    o0=c?0:1    o1=a?c:o0    

*/



var xxx = [
    "a",
    "c",
  ];

 


var real = [];




for(var i = 0; i< Math.pow(2,2); i++) {

    var a  = ((i & 1)>0)?1:0;
    var c  = ((i & 2)>1)?1:0; 

    var v = a+c+1;

    var c1 =  ((v & 2)>1)?1:0; 
    var r =  ((v & 1)>0)?1:0; 

    real.push( {
        i: [
            a,c
        ],
        o: [
            c1
            //r
        ]
    });

 
}
  
module.exports =  {
    labels: xxx, 
    data: real,
    relayCount: 1,
    time: false,
}