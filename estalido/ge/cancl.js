
 

for(var i = 0; i< Math.pow(2,8); i++) {


    var a0 = ((i & 1)>0)?1:0;
    var b0 = ((i & 2)>1)?1:0;
    var cn =( (i & 4)>2)?1:0;
    var m = ((i & 8)>3)?1:0;
    var s0 = ((i & 16)>4)?1:0;
    var s1 = ((i & 32)>5)?1:0;
    var s2 = ((i & 64)>6)?1:0;
    var s3 =( (i & 128)>7)?1:0;

    var result = a0 ? (b0?s0:s1) : (b0?s2:s3) ;


    
    if(m==0){
        result = result+ a0 + cn;
    } 
 
    // console.log(m, result,
    //     ((result & 2)>1)?1:0,
    //     ((result & 1)>0)?1:0,);

 
    console.log(
        a0?1:0,
        b0?1:0,
        cn?1:0,
        m?1:0,
        s0?1:0,
        s1?1:0,
        s2?1:0,
        s3?1:0,
          ((result & 2)>1)?1:0,
        ((result & 1)>0)?1:0,
    );
 
}
  
 