 

var data ;


var cpu;
var ppu;


 

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
fetch('SuperMarioBros.nes', {
	method: 'get'
}).then(function(response) {
	return response.arrayBuffer()
	
}).then(function(arrayBuffer) {

	var a = Array.from(new Uint8Array(arrayBuffer));  
	


	var mapper = new Mapper00(a);
	

	cpu = new P6502();
	ppu = new Ppu();
	cpu.setMapper(mapper);
	ppu.setMapper(mapper);


 

	console.time("cpu");
	while(cpu.cicles < 10000000 && !exit){
		if(ppu.cicles/5 > cpu.cicles / 16){
			cpu.tick();
			
		}else{
			ppu.tick();
			
		}

	}
	console.timeEnd("cpu");
	console.log(cpu.cicles)

})
