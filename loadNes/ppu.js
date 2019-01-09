

class Ppu{
	constructor(){
		this.cicles = 0;
	}

 

	setMapper(mapper){
		this.mapper = mapper;
	}

	tick(){

		if(this.cicles%1000 > 80)
		{
			this.mapper.PPUSTATUS = 128
		}else{
			this.mapper.PPUSTATUS = 0

		}
		if(exit ){
			return ; 
		}
/*

		var opCode = this.getOpCode();
		var instruction = this.getInstruction(opCode);


		if(typeof(instruction) !== "function"){
//			debugger;


			exit = true

			return;
		}
 


		instruction(this)

*/
		this.cicles++;
	}
}