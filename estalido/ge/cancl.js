
 

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
 

    var generate = 0;
    if(a0==1 &&   m == 0){
        if(b0 == 0 && s1 == 1){
            generate = 1;
        }
        if(b0 == 1 &&  s0 == 1){
            generate = 1;
        }
    }

    var propagate = 0;
    if( m == 0){
        if(a0 == 0 && b0 == 0 && s3 == 1){
            propagate = 1;
        }
         if(a0 == 0 && b0 == 1 && s2 == 1){
            propagate = 1;
        }
         if(a0 == 1 && b0 == 0 && s1 == 0){
              propagate = 1;
        }
         if(a0 == 1 && b0 == 1 && s0 == 0){
              propagate = 1;
        }
 
    }

    var c = generate | ( propagate & cn); 

 if( ((result & 2)>1)  != c){


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
         c,
    );
  }

}
  
 