//https://www.masswerk.at/6502/6502_instruction_set.html#SEI
//http://www.6502.org/tutorials/6502opcodes.html
//http://www.obelisk.me.uk/6502/index.html
/*
https://wiki.nesdev.com/w/index.php/PPU_power_up_state

https://wiki.nesdev.com/w/index.php/CPU_power_up_state

https://wiki.nesdev.com/w/index.php/Init_code


*/
exit = false;
//8212, f3ae

/* 
var toParse = [ 
 0x8082,
 0x8000,
  ]; 
*/

var parsed = {}

function addToParsed(pc, asm){

}

class P6502{
	constructor(){
		this.mem = [];
		this.flags = {

			n: 0 , //negative result
			v: 0 , // overflow 
			 	   // expansion
			b: 0 , // break command
			d: 0 , // decimal mode 
			i: 0 , //interrupt disable
			z: 0 , // zero result
			c: 0 , //carry

		};

		this.reg = {
			a: 0,
			x:0,
			y:0,
			sp: 0x100,
			pc: 32768,
		}
	}


    lda() {
    	console.log(`${this.startPc.toString(16)}: lda ${this.operText}`);
    	this.reg.a = this.addressValue;
    	this.flags.z = this.reg.a === 0 ? 1:0;
    	this.flags.n = this.reg.a & 128 ? 1:0;
    }
    ldx() {
    	console.log(`${this.startPc.toString(16)}: ldx ${this.operText}`);
    	this.reg.x = this.addressValue;
    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;
    }
    ldy() {
    	console.log(`${this.startPc.toString(16)}: ldy ${this.operText}`);
    	this.reg.y = this.addressValue;
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
    }

    sta() {
    	console.log(`${this.startPc.toString(16)}: sta ${this.operText}`);
    	this.mem[this.address] = this.reg.a ;
    }

    stx() {
    	console.log(`${this.startPc.toString(16)}: stx ${this.operText}`);
    	this.mem[this.address] = this.reg.x ;
    }


    
    txs() {
    	console.log(`${this.startPc.toString(16)}: txs ${this.operText}`);
    	this.reg.sp = this.reg.x
    }


	cmp() {

		//This instruction subtracts the contents of memory from the contents of the accumulator.
/*The use of the CMP affects the following flags: 
Z flag is set on an equal comparison, reset otherwise; 
the N flag is set or reset by the result bit 7, 
the carry flag is set when the value in memory is less than or equal to the accumulator, reset when it is
greater than the accumulator.
*/

		var r = (this.reg.a + (255-this.addressValue+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.addressValue <= this.reg.a ? 1:0;
 
    	console.log(`${this.startPc.toString(16)}: cmp ${this.operText}`);

    }
	cpx() {

		//This instruction subtracts the contents of memory from the contents of the accumulator.
/*The use of the CMP affects the following flags: 
Z flag is set on an equal comparison, reset otherwise; 
the N flag is set or reset by the result bit 7, 
the carry flag is set when the value in memory is less than or equal to the accumulator, reset when it is
greater than the accumulator.
*/

		var r = (this.reg.x + (255-this.addressValue+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.addressValue <= this.reg.x ? 1:0;
 
    	console.log(`${this.startPc.toString(16)}: cpx ${this.operText}`);

    }
	cpy() {
		var r = (this.reg.y + (255-this.addressValue+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.addressValue <= this.reg.y ? 1:0;
 
    	console.log(`${this.startPc.toString(16)}: cpy ${this.operText}`);

    }


    
    bpl() {
    	console.log(`${this.startPc.toString(16)}: bpl ${this.operText}; ${this.addressValue.toString(16)}`);
    	this.branch(this.flags.n == 0);
    }

    bcs() {
    	console.log(`${this.startPc.toString(16)}: bcs ${this.operText}; ${this.addressValue.toString(16)}`);
    	this.branch(this.flags.c == 1);
    }
    bne() {
    	console.log(`${this.startPc.toString(16)}: bne ${this.operText}; ${this.addressValue.toString(16)}`);
    	this.branch(this.flags.z == 0);
    } 
    jsr() {
    	console.log(`${this.startPc.toString(16)}: jsr ${this.operText}; ${this.addressValue.toString(16)}`);
    	this.branch(true);
    }

    dex() {
    	console.log(`${this.startPc.toString(16)}: dex ${this.operText};`);

    	this.reg.x = (this.reg.x + 255) & 255 ;
    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;
 
    }
     dey() {
    	console.log(`${this.startPc.toString(16)}: dey ${this.operText};`);

    	this.reg.x = (this.reg.y + 255) & 255 ;
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
 
    }
 


    push(value) {
    	this.mem[this.reg.sp] = value;
    	this.reg.sp++;
    }





    
    branch(doBranch) {
    	if(doBranch){
    		this.push(this.reg.pc);
    		this.reg.pc = this.address;
    	}
    }



    sei() { 
		console.log(`${this.startPc.toString(16)}: sei`);
    	this.flags.i = 1;
	}
    
    cld() { 
		console.log(`${this.startPc.toString(16)}: cld`);
    	this.flags.d = 0;
	}



	setPrgRom(data){
		var _this = this;
		var init = 32768;
		data.forEach(function(item, idx){
			_this.mem[init+idx] = item;
		})
	}

	getOpCode(){
		var opCode = "00"+this.mem[this.reg.pc].toString(16);
		return opCode.substring(opCode.length-2);
	}
 
	getInstruction(opCode){
		var oper = null
		var instruction = instructions[opCode];

		if(instruction === undefined)
		{
			throw "instrução nao definida";
		}

		return instruction;

	}


	implied(){
		this.startPc = this.reg.pc;
		this.reg.pc = this.reg.pc+1;
		this.operText = ``;
	}

	immidiate(){
		this.startPc = this.reg.pc;

		this.oper = this.mem[this.reg.pc+1];
		this.addressValue = this.oper;

		this.operText = `#${this.oper.toString(16)}`;
		this.reg.pc = this.reg.pc+2;
	}

	zeropage(){

		this.startPc = this.reg.pc;

		this.oper = this.mem[this.reg.pc+1];
		this.address = this.oper;
		this.operText = `$${this.oper.toString(16)}`;
		this.addressValue = this.mem[this.address] | 0;

		this.reg.pc = this.reg.pc+2;
	}
	absolute(){

		this.startPc = this.reg.pc;

		this.oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
		this.address = this.oper;
		this.operText = `$${this.oper.toString(16)}`;
		this.addressValue = this.mem[this.oper] | 0;

		this.reg.pc = this.reg.pc+3;
	}

	absoluteX(){

/*
			//abs,X		....	absolute, X-indexed	 	OPC $LLHH,X	 	operand is address; effective address is address incremented by X with carry **
			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
			assembler = `$${oper.toString(16)},x`;
			//value = this.mem[oper] + this.reg.x + this.flags.x;
*/



		this.startPc = this.reg.pc;

		this.oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
		
		this.address = this.mem[this.oper] + this.reg.x + this.flags.c;

		this.operText = `$${this.oper.toString(16)}, x`;
		this.addressValue = this.mem[this.address] | 0;

		this.reg.pc = this.reg.pc+3;
	}

	relative(){

		this.startPc = this.reg.pc;

		this.oper = this.mem[this.reg.pc+1];
		this.operText = `$${this.oper.toString(16)}`;
 
	 	this.address = this.reg.pc + this.oper + 2;

		if( ( this.oper & 128)>>7){
			this.address = this.reg.pc + this.oper  - 255 +1;
		}

	 	this.addressValue = this.mem[this.address] | 0;



		this.reg.pc = this.reg.pc+2;
 

	}
	_indirect_Y(){
/*
ind,Y		....	indirect, Y-indexed	 	OPC ($LL),Y	 	operand is zeropage address; 
effective address is word in (LL, LL + 1) incremented by Y with carry: C.w($00LL) + Y
*/
		this.startPc = this.reg.pc;

		this.oper = this.mem[this.reg.pc+1];

		this.operText = `$(${this.oper.toString(16)}),y`;



		this.address = ((this.mem[this.oper+1])<<8)+this.mem[this.oper] + this.reg.y;

		if( ( this.reg.y & 128)>>7){
			this.address = ((this.mem[this.oper+1])<<8)+this.mem[this.oper] + this.reg.y - 255 +1;
		}

		

	 	this.addressValue = this.mem[this.address] | 0;



		this.reg.pc = this.reg.pc+2;
		console.log("_indirect_Y");
 

	}

 

	tick(){

		if(exit ){
			throw "sdsd";
		}

		var opCode = this.getOpCode();
		var instruction = this.getInstruction(opCode);


		if(typeof(instruction) !== "function"){
			debugger;
		}
 


		instruction(this)
		var _this = this
		setTimeout(function(){
			_this.tick();

		},10);
	}
}