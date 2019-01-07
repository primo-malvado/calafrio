
function adc(a, m, c){

	var result = 0;

	for (var i = 0; i < 9; i++) {
		var bit = 1<<i;
	 
		var aBit = (a&bit)>>i;
	    var mBit = (m&bit)>>i;

	 


		var r = aBit + mBit + c;


	    var r2 = (r&2)>>1;
	    var r1 = r&1;
	 
		result = result + (r1<<i);
	    
	    c = r2;
	}

	return result;
}

var r = adc(90,30,0);
console.log(90,30, r.toString(2) , r&256, r&128 );


var r = adc(5,7,0);
console.log(5,7, r.toString(2) , r&256, r&128 );

var r = adc(127,2,0);
console.log(127,2, r.toString(2) , r&256, r&128 );
 
console.log(5,-3,  adc(5,0b11111101,0).toString(2) );
console.log(5, -7,  adc(5,0b11111001,0).toString(2) );
console.log(-66, -65,  adc(0b10111110,0b10111111,0).toString(2) );

