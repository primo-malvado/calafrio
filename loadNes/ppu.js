

class Ppu{
	constructor(){
		this.cicles = 0;

		this.leastSignificantBits = 0 ;
		this.spriteOverflow = 0 ;
		this.sprite0Hit = 0 ;
		this.verticalBlank = 0 ;

 
 		this.scanLine = 0; //312
 		this.pixels = 0; //341
 		this.frameCount = 0;
//A video frame consists of 312 scanlines, each 341 pixels long.
	}

 

	setMapper(mapper){
		this.mapper = mapper;
	}

	tick(){
		//debugger;
 		this.pixels =this.frameCount%312;

 		this.scanLine = ((this.frameCount - this.pixels) / 312)%341;
 		this.frameCount = this.scanLine * 312 + this.pixels ;

 		if(this.frameCount === 0){

 			console.log(this.frameCount, this.scanLine, this.pixels)
 		}




 		if(this.scanLine == 241 && this.pixels == 1) 
 		{
 			debugger;
 			this.verticalBlank = 0;
 		}
 		if(this.scanLine == 261 && this.pixels == 1) 
 		{
 			debugger;
 			this.verticalBlank = 1;
 		}


		var position = this.cicles%(312*341); //A video frame consists of 312 scanlines, each 341 pixels long

 
		var ppuStatus = (this.verticalBlank ? 128 : 0)+
		(this.sprite0Hit ? 64 : 0)+
		(this.spriteOverflow ? 32 : 0)+
		(this.leastSignificantBits  & 0b11111);

		if(this.mapper.PPUSTATUS != ppuStatus){
			debugger;
			this.mapper.PPUSTATUS = ppuStatus;
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
		this.frameCount++;
		this.cicles++;
	}
}