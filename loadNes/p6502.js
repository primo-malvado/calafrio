//https://www.masswerk.at/6502/6502_instruction_set.html#SEI
//http://www.6502.org/tutorials/6502opcodes.html
//http://www.obelisk.me.uk/6502/index.html
/*
https://wiki.nesdev.com/w/index.php/PPU_power_up_state

https://wiki.nesdev.com/w/index.php/CPU_power_up_state

https://wiki.nesdev.com/w/index.php/Init_code
*/
exit = false;


var parsed = {}

 

class P6502{
	constructor(){
		this.cicles = 0;
		//this.mem = [];
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

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: lda ${this.operText}`);
    	}
    	this.reg.a = this.getAddressValue();
    	this.flags.z = this.reg.a === 0 ? 1:0;
    	this.flags.n = this.reg.a & 128 ? 1:0;
    }
    ldx() {

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
	    	console.log(`${this.startPc.toString(16)}: ldx ${this.operText}`);
    	}    	
    	this.reg.x = this.getAddressValue();
    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;
    }
    ldy() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: ldy ${this.operText}`);
    	}    	
    	this.reg.y = this.getAddressValue();
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
    }

    sta() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
	    	console.log(`${this.startPc.toString(16)}: sta ${this.operText};`); // ${this.address.toString(16)} = ${this.mapper.getCpuAddress(this.address).toString(16)}
    	}    	
    	//console.log(`${this.startPc.toString(16)}: sta ${this.operText}; ${this.address.toString(16)} = ${this.mapper.getCpuAddress(this.address).toString(16)}`);

    	this.mapper.setCpuAddress(this.address, this.reg.a)

    }

    stx() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
			console.log(`${this.startPc.toString(16)}: stx ${this.operText}`);
    	}

    	this.mapper.setCpuAddress(this.address, this.reg.x) ;
    }


    
    txs() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
    		console.log(`${this.startPc.toString(16)}: txs ${this.operText}`);
    	}    	
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

		var r = (this.reg.a + (255-this.getAddressValue()+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.getAddressValue() <= this.reg.a ? 1:0;
 

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: cmp ${this.operText}`);
    	}
 

    }
	cpx() {

		//This instruction subtracts the contents of memory from the contents of the accumulator.
/*The use of the CMP affects the following flags: 
Z flag is set on an equal comparison, reset otherwise; 
the N flag is set or reset by the result bit 7, 
the carry flag is set when the value in memory is less than or equal to the accumulator, reset when it is
greater than the accumulator.
*/

		var r = (this.reg.x + (255-this.getAddressValue()+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.getAddressValue() <= this.reg.x ? 1:0;
 
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: cpx ${this.operText}`);
    	}

    }
	cpy() {
		var r = (this.reg.y + (255-this.getAddressValue()+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.getAddressValue() <= this.reg.y ? 1:0;
 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
			console.log(`${this.startPc.toString(16)}: cpy ${this.operText}`);
		}

    }


    
    bpl() {
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bpl ${this.operText};`);
    	}
    	this.branch(this.flags.n == 0);
    }

    bcs() {
    			if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bcs ${this.operText};`);
    	}
    	this.branch(this.flags.c == 1);
    }
    bne() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bne ${this.operText};`);
    	}
    	this.branch(this.flags.z == 0);
    } 
    jsr() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: jsr ${this.operText};`);
    	}
    	this.jumpAndStack(true);
    }

    dex() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: dex ${this.operText};`);
    	}

    	this.reg.x = (this.reg.x + 255) & 255 ;
    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;
 
    }
     dey() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: dey ${this.operText};`);
    	}

    	this.reg.y = (this.reg.y + 255) & 255 ;
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
 
    }
 
     bit() {
/*
BIT  Test Bits in Memory with Accumulator

     bits 7 and 6 of operand are transfered to bit 7 and 6 of SR (N,V);
     the zeroflag is set to the result of operand AND accumulator.

     A AND M, M7 -> N, M6 -> V        N Z C I D V
                                     M7 + - - - M6

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      BIT oper      24    2     3
     absolute      BIT oper      2C    3     4
*/

    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bit ${this.operText};`);
    	}

//    	debugger;
    	var temp = this.getAddressValue();

    	this.flags.z = (temp &  this.reg.y ) === 0 ? 1:0;

    	this.flags.n = temp & 128 ? 1:0;
    	this.flags.v = temp & 1 ? 1:0;
 
    }
 


    push(value) {
    	this.mapper.setCpuAddress(this.reg.sp, value);
    	this.reg.sp++;
    }
    
    pull() {
    	this.reg.sp--;
    	return this.mapper.getCpuAddress(this.reg.sp);
    }
    
    branch(doBranch) {
    	if(doBranch){
    		this.reg.pc = this.address;
    	}
    }

    
    jumpAndStack(doJump) {
    	if(doJump){
    		this.push(this.reg.pc);
    		this.reg.pc = this.address;
    	}
    } 

    rts() {
		this.reg.pc = this.pull();
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: rts`);
    	}

    }



    sei() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: sei`);
    	}
    	this.flags.i = 1;
	}
    
    cld() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: cld`);
    	}
    	this.flags.d = 0;
	}

    

/*
INY  Increment Index Y by One

     Y + 1 -> Y                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       INY           C8    1     2

*/

    iny() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: iny`);
    	}
    	this.reg.y = (this.reg.y + 1) & 255 ;

    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;


	}



	setMapper(mapper){
		this.mapper = mapper;
	}

	getOpCode(){
		var value = this.mapper.getCpuAddress(this.reg.pc);

		var opCode = "00"+value.toString(16);
		return opCode.substring(opCode.length-2);
	}
 
	getInstruction(opCode){
		var oper = null
		var instruction = instructions[opCode];

		if(instruction === undefined)
		{

			//console.log(this.reg.pc.toString(16) ,opCode)
			//debugger;
			//throw "instrução nao definida";
		}

		return instruction;

	}


	getAddressValue(){
		return this.immidiateValue !== null ? this.immidiateValue: (this.mapper.getCpuAddress(this.address) | 0);
	}


	implied(){
		this.startPc = this.reg.pc;
		this.reg.pc = this.reg.pc+1;
		this.immidiateValue = this.oper;
		this.operText = ``;
	}

	immidiate(){
		this.startPc = this.reg.pc;
		this.oper = this.mapper.getCpuAddress(this.reg.pc+1);

		this.immidiateValue = this.oper;

		this.operText = `#${this.oper.toString(16)}`;
		this.reg.pc = this.reg.pc+2;
	}

	zeropage(){

		this.startPc = this.reg.pc;

		this.oper = this.mapper.getCpuAddress(this.reg.pc+1);
		this.address = this.oper;
		this.operText = `$${this.oper.toString(16)}`;
		this.immidiateValue = null

		this.reg.pc = this.reg.pc+2;
	}
	absolute(){

		this.startPc = this.reg.pc;

		this.oper = ((this.mapper.getCpuAddress(this.reg.pc+2))<<8)+this.mapper.getCpuAddress(this.reg.pc+1);
		this.address = this.oper;
		this.operText = `$${this.oper.toString(16)}`;
		this.immidiateValue = null

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

		this.oper = ((this.mapper.getCpuAddress(this.reg.pc+2))<<8)+this.mapper.getCpuAddress(this.reg.pc+1);
		
		this.address = this.mapper.getCpuAddress(this.oper) + this.reg.x + this.flags.c;

		this.operText = `$${this.oper.toString(16)}, x`;
		this.immidiateValue = null

		this.reg.pc = this.reg.pc+3;
	}


	absoluteY(){

/*
			//abs,y		....	absolute, y-indexed	 	OPC $LLHH,y	 	operand is address; effective address is address incremented by y with carry **
			oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
			assembler = `$${oper.toString(16)},y`;
			//value = this.mem[oper] + this.reg.y + this.flags.y;
*/



		this.startPc = this.reg.pc;

		this.oper = ((this.mapper.getCpuAddress(this.reg.pc+2))<<8)+this.mapper.getCpuAddress(this.reg.pc+1);
		
		this.address = this.mapper.getCpuAddress(this.oper) + this.reg.y + this.flags.c;

		this.operText = `$${this.oper.toString(16)}, y`;
		this.immidiateValue = null

		this.reg.pc = this.reg.pc+3;
	}




	relative(){

		this.startPc = this.reg.pc;

		this.oper = this.mapper.getCpuAddress(this.reg.pc+1);
		this.operText = `$${this.oper.toString(16)}`;
 
	 	this.address = this.reg.pc + this.oper + 2;

		if( ( this.oper & 128)>>7){
			this.address = this.reg.pc + this.oper  - 255 +1;
		}

	 	this.immidiateValue = null



		this.reg.pc = this.reg.pc+2;
 

	}
	_indirect_Y(){
/*
ind,Y		....	indirect, Y-indexed	 	OPC ($LL),Y	 	operand is zeropage address; 
effective address is word in (LL, LL + 1) incremented by Y with carry: C.w($00LL) + Y
*/
		this.startPc = this.reg.pc;

		this.oper = this.mapper.getCpuAddress(this.reg.pc+1);

		this.operText = `$(${this.oper.toString(16)}),y`;



		this.address = ((this.mapper.getCpuAddress(this.oper+1))<<8)+this.mapper.getCpuAddress(this.oper) + this.reg.y;

		if( ( this.reg.y & 128)>>7){
			this.address = ((this.mapper.getCpuAddress(this.oper+1))<<8)+this.mapper.getCpuAddress(this.oper) + this.reg.y - 255 +1;
		}

		

	 	this.immidiateValue = null;



		this.reg.pc = this.reg.pc+2;
		////console.log("_indirect_Y");
 

	}

 

	tick(){

		if(exit ){

			return ; 
		}

		var opCode = this.getOpCode();
		var instruction = this.getInstruction(opCode);

		this.cicles += duration[opCode];

		if(typeof(instruction) !== "function"){
			debugger;


			exit = true

			return;
		}
 


		instruction(this)


	}
}