//https://www.masswerk.at/6502/6502_instruction_set.html#SEI
//http://www.6502.org/tutorials/6502opcodes.html
//http://www.obelisk.me.uk/6502/index.html
/*
https://wiki.nesdev.com/w/index.php/PPU_power_up_state

https://wiki.nesdev.com/w/index.php/CPU_power_up_state

*/
exit = false;
//8212, f3ae

 
var toParse = [ 
 0x8082,
 0x8000,
  ]; 
var parsed = {}

function addToParsed(pc, asm){

}

class P6502{
	constructor(){
		this.mem = [];
		this.flags = {

		};

		this.reg = {
			a: 0,
			x:0,
			y:0,
			sp: 0x100,
			pc: 32768,
		}
	}
	setPrgRom(data){
		var _this = this;
		var init = 32768;
		data.forEach(function(item, idx){
			_this.mem[init+idx] = item;
		})
	}
 
	tick(){
		this.reg.pc= toParse.pop();

		this.next()
	}

	next(){

		if(exit ){
			throw "sdsd";
		}

		if(parsed[this.reg.pc] !== undefined){
			this.tick();
			return;
		}

		var opCode = this.mem[this.reg.pc].toString(16);

		var instruction = instructions[opCode];

		if(instruction === undefined)
		{

			console.error("erro ")
			return;
			debugger;
		}


	
		var assembler = null;
		var oper = null;
		var address = null;
		var value = null;



		if(instruction.addressing === 'implied' && instruction.assembler == ''){
			assembler = "";
		}else if(instruction.addressing === 'zeropage' && instruction.assembler === 'oper'){
			
			oper =  this.mem[this.reg.pc+1];

			assembler = `$${oper.toString(16)}`;
			address = oper;
			value = this.mem[address] | 0;


		}else if(instruction.addressing === 'accumulator' && instruction.assembler === 'a'){

			assembler = `a`;
			//address = oper;
			//value = this.mem[address] | 0;


		}else if(instruction.addressing === 'absolute,y' && instruction.assembler === 'oper,y'){

			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];


			assembler = `$${oper.toString(16)}, y`;
			//address = oper;
			//value = this.mem[address] | 0;


		}

		else if(instruction.addressing === '(indirect),y' && instruction.assembler === '(oper),y'){

			oper = this.mem[this.reg.pc+1];


			assembler = `($${oper.toString(16)}), y`;
			//address = oper;
			//value = this.mem[address] | 0;
			debugger



		}

		else if(instruction.addressing === 'indirect' && instruction.assembler === '(oper)'){

			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
 

			assembler = `($${oper.toString(16)})`;
			//address = this.mem[oper] | assembler;
			//value = this.mem[oper] ? this.mem[address] : 0;
			debugger



		}




		else if(instruction.addressing === 'absolute' && instruction.assembler === 'oper'){
			
			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

			assembler = `$${oper.toString(16)}`;
			address = oper;
			value = this.mem[address] | 0;


		}else if(instruction.addressing === 'immidiate' && instruction.assembler == '#oper'){

			
		 	oper = this.mem[this.reg.pc+1];
		 	assembler = `#$${oper.toString(16)}`;
		 	value = oper;

		}else if(instruction.addressing === 'relative' && instruction.assembler == 'oper'){
		 	
		 	//rel		....	relative	 	OPC $BB	 	branch target is PC + signed offset BB ***
		 	oper = this.mem[this.reg.pc+1];
		 	
 
		 	assembler = `$${oper.toString(16)}`;

		 	address = this.reg.pc + oper + instruction.bytes;

			if( ( oper & 128)>>7){
				address = this.reg.pc + oper  - 255 +1;
			}

		 	value = this.mem[address] | 0;


		}else if(instruction.addressing === 'absolute,x' && instruction.assembler === 'oper,x'){

			//abs,X		....	absolute, X-indexed	 	OPC $LLHH,X	 	operand is address; effective address is address incremented by X with carry **
			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
			assembler = `$${oper.toString(16)},x`;
			//value = this.mem[oper] + this.reg.x + this.flags.x;
		}


 



		switch(instruction.inst){ 

 

  			case "rts": 
  			case "rti": 
				console.log(`__${this.reg.pc.toString(16)}: ${instruction.inst} ${assembler}`)
parsed[this.reg.pc] = `${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`
				break;

			case "jsr": 
			//case "jmp": 
			case "bcc": 
			case "bcs": 
			case "beq": 
			case "bmi": 
			case "bne": 
			case "bpl": 
			case "bvc": 
			case "bvs": 

				console.log(`%c__${this.reg.pc.toString(16)}: ${instruction.inst} __${address.toString(16)}; ${address.toString(16)}`, 'background: #222; color: #bada55')
				parsed[this.reg.pc] = `${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`

				toParse.push(address)
 

				this.reg.pc = this.reg.pc+ instruction.bytes;
	
 		var _this = this;
setTimeout(function(){
		_this.next();
	}, 10)


				break;



			 case "jmp": 
				if(address){

					console.log(`__${this.reg.pc.toString(16)}: ${instruction.inst} __${address.toString(16)} ;${address.toString(16)}`)
					toParse.push(address)
				}else{
					console.log(`__${this.reg.pc.toString(16)}: ${instruction.inst} ${assembler}`)
				}
				parsed[this.reg.pc] = `${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`

				break;

			default: 

				if(assembler !== null){
					console.log(`__${this.reg.pc.toString(16)}: ${instruction.inst} ${assembler}`)


					parsed[this.reg.pc] = `${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`
 		var _this = this;
setTimeout(function(){
		_this.next();
	}, 10)


				}else{



					console.log(`----  ${this.reg.pc.toString(16)} ${instruction.inst} ${instruction.assembler} ${instruction.addressing} ${instruction.bytes} `)

					parsed[this.reg.pc] = `${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`
 		var _this = this;
setTimeout(function(){
		_this.next();
	}, 10)


				}

				this.reg.pc = this.reg.pc+ instruction.bytes;
		}
 		

 

	}
}