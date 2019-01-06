//https://www.masswerk.at/6502/6502_instruction_set.html#SEI
//http://www.6502.org/tutorials/6502opcodes.html
//http://www.obelisk.me.uk/6502/index.html
/*
https://wiki.nesdev.com/w/index.php/PPU_power_up_state

https://wiki.nesdev.com/w/index.php/CPU_power_up_state

*/
exit = false;
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

	load(register){
		//lda
	}

	tick(){

		if(exit ){
			throw "sdsd";
		}

		var opCode = this.mem[this.reg.pc].toString(16);

		var instruction = instructions[opCode];
/*
Address Modes:

A		....	Accumulator	 	OPC A	 	operand is AC (implied single byte instruction)
abs		....	absolute	 	OPC $LLHH	 	operand is address $HHLL *
abs,X		....	absolute, X-indexed	 	OPC $LLHH,X	 	operand is address; effective address is address incremented by X with carry **
abs,Y		....	absolute, Y-indexed	 	OPC $LLHH,Y	 	operand is address; effective address is address incremented by Y with carry **
#		....	immediate	 	OPC #$BB	 	operand is byte BB
impl		....	implied	 	OPC	 	operand implied
ind		....	indirect	 	OPC ($LLHH)	 	operand is address; effective address is contents of word at address: C.w($HHLL)
X,ind		....	X-indexed, indirect	 	OPC ($LL,X)	 	operand is zeropage address; effective address is word in (LL + X, LL + X + 1), inc. without carry: C.w($00LL + X)
ind,Y		....	indirect, Y-indexed	 	OPC ($LL),Y	 	operand is zeropage address; effective address is word in (LL, LL + 1) incremented by Y with carry: C.w($00LL) + Y
rel		....	relative	 	OPC $BB	 	branch target is PC + signed offset BB ***
zpg		....	zeropage	 	OPC $LL	 	operand is zeropage address (hi-byte is zero, address = $00LL)
zpg,X		....	zeropage, X-indexed	 	OPC $LL,X	 	operand is zeropage address; effective address is address incremented by X without carry **
zpg,Y		....	zeropage, Y-indexed	 	OPC $LL,Y	 	operand is zeropage address; effective address is address incremented by Y without carry **
 
*   16-bit address words are little endian, lo(w)-byte first, followed by the hi(gh)-byte.
(An assembler will use a human readable, big-endian notation as in $HHLL.)

**  The available 16-bit address space is conceived as consisting of pages of 256 bytes each, with
address hi-bytes represententing the page index. An increment with carry may affect the hi-byte
and may thus result in a crossing of page boundaries, adding an extra cycle to the execution.
Increments without carry do not affect the hi-byte of an address and no page transitions do occur.
Generally, increments of 16-bit addresses include a carry, increments of zeropage addresses don't.
Notably this is not related in any way to the state of the carry bit of the accumulator.

*** Branch offsets are signed 8-bit values, -128 ... +127, negative offsets in two's complement.
Page transitions may occur and add an extra cycle to the exucution.

 
*/		
		var assembler = null;
		var oper = null;
		var address = null;
		var value = null;



		if(instruction.addressing === 'implied' && instruction.assembler == ''){
			assembler = "";
		}else if(instruction.addressing === 'absolute' && instruction.assembler === 'oper'){
			
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

		 	address = this.reg.pc + oper;

			if( ( oper & 128)>>7){
				address = this.reg.pc + oper - 255 +1;
			}

		 	value = this.mem[address] | 0;


		}else if(instruction.addressing === 'absolute,x' && instruction.assembler === 'oper,x'){

			//abs,X		....	absolute, X-indexed	 	OPC $LLHH,X	 	operand is address; effective address is address incremented by X with carry **
			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
			assembler = `$${oper.toString(16)},x`;
			//value = this.mem[oper] + this.reg.x + this.flags.x;
		}


 



		switch(instruction.inst){ 

 
			case "dec": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.mem[address] = value -1;
				this.flags.n = (this.mem[address] & 0b10000000) >> 7;
				this.flags.z = this.mem[address] === 0;

				this.reg.pc = this.reg.pc+ instruction.bytes;

				break;
 
			case "cmp": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.flags.n = (this.reg.a - value)>=128;
				this.flags.z = this.reg.a === value;
				this.flags.c = this.reg.a >= value;

				this.reg.pc = this.reg.pc+ instruction.bytes;

				break;

 
			case "cld": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.flags.d = false;
				this.reg.pc = this.reg.pc+ instruction.bytes;
				break;


			case "sei":
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.flags.i = true;
				this.reg.pc = this.reg.pc+ instruction.bytes;
				 
				break;

			case 'bcs':
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				if(this.flags.c){
					this.reg.pc = this.reg.pc + value;
				}else{
					
					this.reg.pc = this.reg.pc+ instruction.bytes;
				}
				break;

		


			case "jsr": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)
				this.mem[this.reg.sp] = this.reg.pc+ instruction.bytes;
				this.reg.sp = this.reg.sp +1;

				this.reg.pc = value;
				break;


			case "bpl": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)
 
				if(!this.flags.n){
					this.reg.pc = address;
				}else{
					
					this.reg.pc = this.reg.pc+ instruction.bytes;
				}
				break;


			case "lda": 

				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.reg.a = value & 255;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a === 0;

				this.reg.pc = this.reg.pc+ instruction.bytes;
 
				break;
			case "ldx": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.reg.x = value & 255;

				this.flags.n = (this.reg.x & 0b10000000) >> 7;
				this.flags.z = this.reg.x === 0;

				this.reg.pc = this.reg.pc+ instruction.bytes;
				break;
			case "ldy": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.reg.y = value & 255;

				this.flags.n = (this.reg.y & 0b10000000) >> 7;
				this.flags.z = this.reg.y === 0;

				this.reg.pc = this.reg.pc+ instruction.bytes;
				break;
			case "sta": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)
				this.mem[address] = this.reg.a;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a === 0;

				this.reg.pc = this.reg.pc+ instruction.bytes;
				break;
  			case "txs": 
				console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)

				this.reg.sp = this.reg.x;
				this.reg.pc = this.reg.pc+ instruction.bytes;
				break;
  
			default: 



				if(assembler !== null){
					console.log(`---${this.reg.pc.toString(16)} ${instruction.inst} ${assembler}`)
				}else{



					console.log(`${this.reg.pc.toString(16)} ${instruction.inst} ${instruction.assembler} ${instruction.addressing} ${instruction.bytes} `)
 
				}

				this.reg.pc = this.reg.pc+ instruction.bytes;
		}
 		

 		var _this = this;
setTimeout(function(){
		_this.tick();
	}, 100) 

	}
}