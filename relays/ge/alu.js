
var xxx = [
    "g",
    "p",
    "c0",
  ];

 


var real = [];




for(var i = 0; i< Math.pow(2,8); i++) {
    var a  = ((i & 1)>0)?1:0;
    var b  = ((i & 2)>1)?1:0;
    var s0 = ((i & 4)>2)?1:0;
    var s1 = ((i & 8)>3)?1:0;
    var s2 = ((i & 16)>4)?1:0;
    var s3 = ((i & 32)>5)?1:0;
    var m  = ((i & 64)>6)?1:0;
    var c0 = ((i & 128)>7) & m;



    //g:
    var g0=b?s3:s2   ;
    var g =a?g0:0;
//p:
    var p0=b?s1:s0;
    var p=a?1:p0;



    
    var f1 = (g ^ p ^ c0);

    real.push( {
        i: [
            g, p, c0
        ],
        o: [
            f1
        ]
    });

 
}
  
module.exports =  {
    labels: xxx, 
    data: real,
    relayCount: 3,
    time: true
}