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
    pla() {

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: pla ${this.operText}`);
    	}
    	this.reg.a = this.pull();
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
    	//debugger;
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
    		console.log(`${this.startPc.toString(16)}: txs ${this.operText}`);
    	}    	
    	this.reg.sp = this.reg.x
    }

    
    txa() {
    	//debugger;
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
    		console.log(`${this.startPc.toString(16)}: txa ${this.operText}`);
    	}    	
    	this.reg.a = this.reg.x
    }
        
    pha() {
    	//debugger;
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
    		console.log(`${this.startPc.toString(16)}: pha ${this.operText}`);
    	}    

    	this.push(  this.reg.a   );
    }
    
    tax() {
    	
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		
    		console.log(`${this.startPc.toString(16)}: tax ${this.operText}`);
    	}    	
    	this.reg.x = this.reg.a;
    }


	cmp() {

		var r = (this.reg.a + (255-this.getAddressValue()+1)) & 255;

		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.getAddressValue() <= this.reg.a ? 1:0;
 

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: cmp ${this.operText}`);
    	}
    }

/*SBC  Subtract Memory from Accumulator with Borrow

     A - M - C -> A                   N Z C I D V
                                      + + + - - +*/
	sbc() {

		var r = (this.reg.a + (255-this.getAddressValue()+1)) & 255;
		this.reg.a = (r + (255-this.flags.c+1)) & 255;



		this.flags.z = r === 0;
		this.flags.n = (r&128)? 1:0;
		this.flags.c = this.getAddressValue() <= this.reg.a ? 1:0;
 

    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: sbc ${this.operText}`);
    	}
    }


/*
ORA "OR" Memory with Accumulator
The ORA instruction transfers the memory and the accumulator
to the adder which performs a binary "OR" on a bit-by-bit basis and
stores the result in the accumulator.
This is indicated symbolically by A
V
M
A.
This instruction affects the accumulator; sets the zero flag
if the result in the accumulator is 0, otherwise resets the zero flag;
sets the negative flag if the result in the accumulator has bit 7 on,
otherwise resets the negative flag.
ORA is a "Group One" instruction.
It has the addressing modes Immediate; Absolute; Zero Page; Absolute,X
Absolute,Y; Zero Page,X; Indexed Indirect; and Indirect Indexed.
To set a bit, the OR instruction is used as shown below:
*/


	ora() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: ora ${this.operText}`);
    	}

    	this.reg.a = (this.reg.a | this.getAddressValue()) & 0xff;

		this.flags.z = this.reg.a === 0 ? 1:0;
		this.flags.n = (this.reg.a&128)? 1:0;

    }

	eor() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: eor ${this.operText}`);
    	}

    	this.reg.a = (this.reg.a ^ this.getAddressValue()) & 0xff;

		this.flags.z = this.reg.a === 0 ? 1:0;
		this.flags.n = (this.reg.a&128)? 1:0;

    }
	and() {
    	if(parsed[this.startPc] == undefined){
    		parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: and ${this.operText}`);
    	}

    	this.reg.a = (this.reg.a & this.getAddressValue()) & 0xff;

		this.flags.z = this.reg.a === 0 ? 1:0;
		this.flags.n = (this.reg.a&128)? 1:0;

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
    beq() {
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: beq ${this.operText};`);
    	}
    	this.branch(this.flags.z);
    }

    bcs() {
    			if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bcs ${this.operText};`);
    	}
    	this.branch(this.flags.c);
    }

    bcc() {
    			if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bcc ${this.operText};`);
    	}
    	this.branch(!this.flags.c);
    }
    bne() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: bne ${this.operText};`);
    	}
    	this.branch(!this.flags.z);
    } 
    jsr() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: jsr ${this.operText};`);
    	}
    	this.jumpAndStack(true);
    }

    jmp() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: jmp ${this.operText};`);
    	}
    	if(this.startPc == 0x8057){
    		debugger;
    		this.reg.pc = 0x8082
    	}else{

    		this.branch(true);
    	}
    }


    inc() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: inc ${this.operText};`);
    	}


    	var value = this.mapper.getCpuAddress(this.address);
    	value = (value+1) & 0xff;
    	this.mapper.setCpuAddress(this.address, value)
 
    	this.flags.z = value === 0 ? 1:0;
    	this.flags.n = value & 128 ? 1:0;
 
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

    	//if(this.reg.y==1)debugger;
    	this.reg.y = (this.reg.y + 255) & 255 ;
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
 
    }     

    lsr_a() {
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: lsr ${this.operText};`);
    	}

    	//if(this.reg.y==1)debugger;
    	this.reg.c = this.reg.a & 1;
    	this.reg.a = this.reg.a > 1;
    	this.flags.z = this.reg.a === 0 ? 1:0;
 
    }
    rol_a() {

/*
ROL  Rotate One Bit Left (Memory or Accumulator)

     C <- [76543210] <- C             N Z C I D V
                                      + + + - - -

*/

    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: rol ${this.operText};`);
    	}

    	var c = this.reg.c;
		this.reg.c = (this.reg.a & 128) ? 1:0;
    	this.reg.a = (this.reg.a < 1)+c;

    	this.flags.z = this.reg.a === 0 ? 1:0;
    	this.flags.n = this.reg.a & 128 ? 1:0;
 
    }  

    ror() {
 
    	if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: ror ${this.operText};`);
    	}
    	var value = this.mapper.getCpuAddress(this.address)
    	var c = this.reg.c;

    	this.reg.c = value & 1;

    	var res = (c << 7) + (value > 1);

    	this.mapper.setCpuAddress(this.address, res);



    	this.flags.z = res === 0 ? 1:0;
    	this.flags.n = res & 128 ? 1:0;
 
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
    	//debugger;
    	this.mapper.setCpuAddress(0x0100+this.reg.sp, value);
    	this.reg.sp--;
    }
    
    pull() {
    	//debugger;
    	this.reg.sp++;
    	return this.mapper.getCpuAddress(0x0100+this.reg.sp);
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
    sec() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: sec`);
    	}
    	this.flags.c = 1;
	}
    
    cld() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: cld`);
    	}
    	this.flags.d = 0;
	}    
    clc() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: clc`);
    	}
    	this.flags.c = 0;
	}

    iny() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: iny`);
    	}
    	this.reg.y = (this.reg.y + 1) & 255 ;
    	this.flags.z = this.reg.y === 0 ? 1:0;
    	this.flags.n = this.reg.y & 128 ? 1:0;
	}

    inx() { 
		if(parsed[this.startPc] == undefined){
			parsed[this.startPc] = true;
    		console.log(`${this.startPc.toString(16)}: inx`);
    	}
    	this.reg.x = (this.reg.x + 1) & 255 ;
    	this.flags.z = this.reg.x === 0 ? 1:0;
    	this.flags.n = this.reg.x & 128 ? 1:0;
	}

	setMapper(mapper){
		this.mapper = mapper;
	}

	getOpCode(){
		var value = this.mapper.getCpuAddress(this.reg.pc);

//		if(this.reg.pc == 0x8225){debugger;}


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

	accumulator(){
	
		this.startPc = this.reg.pc;

		this.oper = this.reg.a;
		this.address = null;
		this.operText = `a`;
		this.immidiateValue = this.reg.a

		this.reg.pc = this.reg.pc+1;
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


		var y = this.reg.y;
		/*if( ( y & 128)>>7){
			y = y  - 255 +1;
		}*/




		var temp = this.mapper.getCpuAddress(this.oper+0) + y;

		var c = (temp & 0b100000000 )? 1:0;

		var temp2_ = (this.mapper.getCpuAddress(this.oper+1) + c );
		var temp2  = temp2_ & 0xff;
		temp2  = temp2 << 8


		this.address = temp2+(temp&0xff);
		

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