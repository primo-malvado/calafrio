
var s0 = 0;
var s1 = 0;
var s2 = 0;
var s3 = 0;


for(var i = 0; i< Math.pow(2,2); i++) {

    /* 
    var a0 = (i & 1)>0;
    var b0 = (i & 2)>1;
    var s2 = (i & 4)>2;
    var s3 = (i & 8)>3;
    var not12 = !b0;
    var and9 = not12 & s2 & a0;
   var and10 = a0 & s3 & b0;
    var nor5 = !(and9 | and10);
    */

 
    var cn = (i & 1)>0;
    var m = (i & 2)>1;
    var not11 = !m;
    var nand2 = !(cn & not11);
 
/*
   var cn = (i & 1)>0;
   var m = (i & 2)>1;
   var nor4 = (i & 4)>2;
   var nor5 = (i & 8)>3;


   var nor22 = (i & 16)>4;
   var nor23 = (i & 32)>5;

    var not11 = !m;

    var nand2 = !(cn & not11);

    var and16 = not11 & nor5 & cn;
    var and15 = not11 & nor4;
    var nor14 = !(and15 & and16);

    

    var and21 = not11 & nor23 & nor5 & cn;
    var and20 = not11 & nor4 & nor23;
    var and19 = not11 & nor22;
    var nor18 = !(and19 & and20 & and21);
*/
    // var nor5 = (i & 8)>3;
    // var nor22 = (i & 16)>4;
    // var nor23 = (i & 32)>5;
    
    
 

    // var and6 = a0;
    
    
    // var and7 = b0 & s0;
    // var and8 = s1 & not12;
    // var nor4 = !(and6 | and7 | and8);
    //var xor3 = nor4 ^nor5;
    
    //var xor1 = nand2 ^ xor3 ;

    //  var and16 = not11 & nor5 & cn;
    //  var and15 = not11 & nor4;
    //  var nor14 = !(and15 & and16);

    // var and21 = not11 & nor23 & nor5 & cn;
    // var and20 = not11 & nor4 & nor23;
    // var and19 = not11 & nor22;
    // var nor18 = !(and19 & and20 & and21);

    real.push( {
        i: [
           ! cn,
            m,
        ],
        o: [
            nand2
        ]
    });

    inCount =2
    outCount = 1;
}
  
 