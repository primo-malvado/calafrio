/* 
r
o0=a?0:1 o1=b?o0:a o2=b?a:o0 o3=c0?o2:o1 
o0=b?0:1 o1=a?o0:b o2=a?b:o0 o3=c0?o2:o1 
o0=a?0:1 o1=c0?o0:a o2=c0?a:o0 o3=b?o2:o1 
o0=c0?0:1 o1=a?o0:c0 o2=a?c0:o0 o3=b?o2:o1 
o0=a?0:1 o1=b?a:o0 o2=b?o0:a o3=c0?o1:o2 
o0=b?0:1 o1=a?b:o0 o2=a?o0:b o3=c0?o1:o2 
o0=b?0:1 o1=c0?b:o0 o2=c0?o0:b o3=a?o1:o2 
o0=c0?0:1 o1=b?c0:o0 o2=b?o0:c0 o3=a?o1:o2 
o0=b?0:1 o1=c0?o0:b o2=c0?b:o0 o3=a?o2:o1 
o0=c0?0:1 o1=b?o0:c0 o2=b?c0:o0 o3=a?o2:o1 
o0=a?0:1 o1=c0?a:o0 o2=c0?o0:a o3=b?o1:o2 
o0=c0?0:1 o1=a?c0:o0 o2=a?o0:c0 o3=b?o1:o2 

c
o0=a?1:c0 o1=a?c0:b o2=b?o0:o1 
o0=a?c0:0 o1=a?1:c0 o2=b?o1:o0 
o0=a?c0:0 o1=a?b:c0 o2=b?o1:o0 
o0=b?c0:0 o1=b?1:c0 o2=a?o1:o0 
o0=b?c0:0 o1=b?a:c0 o2=a?o1:o0 
o0=a?c0:a o1=a?1:c0 o2=b?o1:o0 
o0=a?c0:a o1=a?b:c0 o2=b?o1:o0 
o0=b?c0:a o1=b?1:c0 o2=a?o1:o0 
o0=b?c0:a o1=b?a:c0 o2=a?o1:o0  
o0=a?c0:b o1=a?1:c0 o2=b?o1:o0 
o0=a?c0:b o1=a?b:c0 o2=b?o1:o0 
o0=b?c0:b o1=b?1:c0 o2=a?o1:o0 
o0=b?c0:b o1=b?a:c0 o2=a?o1:o0 
o0=a?1:c0 o1=a?c0:0 o2=b?o0:o1 
o0=a?1:c0 o1=a?c0:a o2=b?o0:o1 
o0=b?1:c0 o1=b?c0:0 o2=a?o0:o1 
o0=b?1:c0 o1=b?c0:a o2=a?o0:o1 
o0=b?1:c0 o1=b?c0:b o2=a?o0:o1 
o0=b?a:c0 o1=b?c0:0 o2=a?o0:o1  
o0=b?a:c0 o1=b?c0:a o2=a?o0:o1  
o0=b?a:c0 o1=b?c0:b o2=a?o0:o1 
o0=a?b:c0 o1=a?c0:0 o2=b?o0:o1 
o0=a?b:c0 o1=a?c0:a o2=b?o0:o1 

*/

var xxx = [
 "a",
 "b",
 "c0",
 ];

 


var real = [];




for(var i = 0; i< Math.pow(2,3); i++) {

 var a = ((i & 1)>0)?1:0;
 var b = ((i & 2)>1)?1:0;
 var c0 = ((i & 4)>2)?1:0; 

 var v = a+b+c0;

 var c1 = ((v & 2)>1)?1:0; 
 var r = ((v & 1)>0)?1:0; 

 real.push( {
 i: [
 a,b, c0
 ],
 o: [

    //c1 //3 time | 2 !time
    r
 ]
 });

 
}
 
module.exports = {
 labels: xxx, 
 data: real,
 relayCount:4,
 time: false,
}


/*
c
    o0=c0?b:a    o1=o0?b:a    
    o0=b?c0:a    o1=o0?c0:a    
    o0=c0?a:b    o1=o0?a:b    
    o0=a?c0:b    o1=o0?c0:b    
    o0=b?a:c0    o1=o0?a:c0    
    o0=a?b:c0    o1=o0?b:c0    



 */