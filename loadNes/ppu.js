

class Ppu{
	constructor(){
		this.cicles = 0;
	}

 

	setMapper(mapper){
		this.mapper = mapper;
	}

	tick(){
		var position = this.cicles%(312*341); //A video frame consists of 312 scanlines, each 341 pixels long

		if(this.cicles >29658){
			

			if(position)
			{
				this.mapper.PPUSTATUS = 208
			}else{
				this.mapper.PPUSTATUS = 80

			}
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