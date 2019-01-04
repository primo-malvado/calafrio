var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);



var data ;


var cpu;



/*
Flags 7
76543210
||||||||
|||||||+- VS Unisystem
||||||+-- PlayChoice-10 (8KB of Hint Screen data stored after CHR data)
||||++--- If equal to 2, flags 8-15 are in NES 2.0 format
++++----- Upper nybble of mapper number
*/


//fetch('LegendZelda.nes', {
fetch('SuperMarioBros2.nes', {
	method: 'get'
}).then(function(response) {
	return response.arrayBuffer()
	
}).then(function(arrayBuffer) {

	var a = Array.from(new Uint8Array(arrayBuffer));  
	

	if(!(a[0] == 78 && a[1] == 69 && a[2] == 83 && a[3] == 26 )){
		throw "not nes"
	}

	var PrgRomSize = a[4]; // *16384
	var PrgChrSize = a[5]; // *8192
	var flags6 = a[6];
	var flags7 = a[7];
	var flags8 = a[8];
	var flags9 = a[9];
	var flags10 = a[10];

	  data = {
		header: {
			mirroring: flags6  & 1,
			batterybacked : ((flags6  & 2) >> 1),
			trainer : ((flags6  & 4) >> 2),
			ignoremirroring : ((flags6  & 8) >> 3),

			mapperNumber : (flags7  & 0b11110000) + ((flags6  & 0b11110000) >> 4)
		},
		trainer: []
	};

	pos = 16;

	if(data.header.trainer){
		data.trainer = a.slice(pos, pos+512);
		pos = pos+512;
	}


 
	data.prgRom = a.slice(pos, pos+16384*PrgRomSize);
	pos = pos+16384*PrgRomSize;


	cpu = new P6502();
	cpu.setPrgRom(data.prgRom);
 
 	data.chrRom = a.slice(pos, pos+8192*PrgChrSize);
	pos = pos+8192*PrgChrSize;
 

	var i = 0;

	var id = ctx.getImageData(0,0,canvasWidth, canvasHeight);
	var pixels = id.data;

	for(var i = 0; i< 8192*PrgChrSize/16; i++){
		
		for(var j = 0; j< 8; j = j+1){

			var layer1 = data.chrRom[i*16+j];
			var layer2 = data.chrRom[i*16+8+j];

			
			var xT = i   & 0b00001111;

			var y =  (i >>4) * 9   +j;

			for(var x = 0; x <8; x++){
				
				
				var off = (y * id.width + 7-x  +xT*9) * 4;

				var v1 = (layer1&Math.pow(2, x) ) >> x;
				var v2 = (layer2&Math.pow(2, x) ) >> x;

				pixels[off] = (v1+2*v2)<<6 ;
				pixels[off + 1] = (v1+2*v2)<<6 ;
				pixels[off + 2] = (v1+2*v2)<<6 ;

				pixels[off + 3] = (v1+v2)?255:0;



			}




  		}
	}
	ctx.putImageData(id, 0, 0);
	


	cpu.tick();
})
