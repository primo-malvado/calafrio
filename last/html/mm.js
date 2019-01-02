
var cReg;
var zReg;
var stack = [];
var data;

var pos = 0;
var array;



 

	//this.process();

var z80 = new Z80();

fetch('ManicMiner.tzx')
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(arrayBuffer) { 

  	var ram= [];
  	array = new Uint8Array(arrayBuffer);
    data =readTzx( );

    dRam = data.block6.data.slice(1, 32769);


	for(var i = 0; i< 32768;i++){
		ram[i+32768] = dRam[i];
	}

	z80.mem = ram;
	z80.reg.pc = 33792;
	z80.process();


  })

 ;





 






function pprocess(){
	var opCode = this.mem[this.reg.pc];

	var hexOp = toHex(opCode);


	switch(hexOp){
		case "f3":
			console.log("di");
			this.reg.pc++;
			this.process();
			break;
		case "1a":
			console.log(`${this.reg.pc}: ld a,(de)`);
			this.reg.pc++;
			this.process();
			break;




		case "b6":
			console.log(`${this.reg.pc}: or (hl)`);
			this.reg.pc++;
			this.process();
			break;
		case "77":
			console.log(`${this.reg.pc}: ld (hl),a`);
			this.reg.pc++;
			this.process();
			break;






		case "36":
			var value = this.mem[this.reg.pc+1];
			console.log(`ld (hl), ${value}`);
			this.reg.pc= this.reg.pc+2;
			this.process();
			break;
 








		case "01":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`ld bc, ${value}`);
			this.reg.pc= this.reg.pc+3;
			this.process();
			break; 







		case "32":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`ld (${value}),a`);
			this.reg.pc= this.reg.pc+3;
			this.process();
			break;

		case "21":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`ld hl, ${value}`);
			this.reg.pc= this.reg.pc+3;
			this.process();
			break;










		default: 
			console.log(opCode, hexOp );
			break;
	}




}

