//https://www.masswerk.at/6502/6502_instruction_set.html#SEI
//http://www.6502.org/tutorials/6502opcodes.html
//http://www.obelisk.me.uk/6502/index.html

class P6502{
	constructor(){
		this.mem = [];
		this.flags = {

		};

		this.reg = {
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
		var instruction = this.mem[this.reg.pc];

		var opCode = instruction.toString(16);



 


		switch(opCode){
/*
INC  Increment Memory by One

     M + 1 -> M                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      INC oper      E6    2     5
     zeropage,X    INC oper,X    F6    2     6
     absolute      INC oper      EE    3     6
     absolute,X    INC oper,X    FE    3     7


*/
			case "ee": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: inc ${value}`);
				this.mem[value] = this.mem[value] + 1;
				
				this.reg.pc = this.reg.pc+3;

 

				break;



/*
JMP  Jump to New Location

     (PC+1) -> PCL                    N Z C I D V
     (PC+2) -> PCH                    - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     absolute      JMP oper      4C    3     3
     indirect      JMP (oper)    6C    3     5
*/
			case "4c": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: jmp ${value}`);

				this.reg.pc = value;
 

				break;


/*
ADC  Add Memory to Accumulator with Carry

     A + M + C -> A, C                N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     ADC #oper     69    2     2
     zeropage      ADC oper      65    2     3
     zeropage,X    ADC oper,X    75    2     4
     absolute      ADC oper      6D    3     4
     absolute,X    ADC oper,X    7D    3     4*
     absolute,Y    ADC oper,Y    79    3     4*
     (indirect,X)  ADC (oper,X)  61    2     6
     (indirect),Y  ADC (oper),Y  71    2     5*
*/
		case "69": 
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc.toString(16)}: adc #${value}`);


			var result  = this.reg.a + value + this.flags.c;
			this.reg.a = result & 255;

			this.flags.n = (this.reg.a & 0b10000000) >> 7;
			this.flags.z = this.reg.a  === 0;
			this.flags.c = result>255; // ???? 


			this.reg.pc = this.reg.pc+2;


			break;








/*

SEI  Set Interrupt Disable Status

     1 -> I                           N Z C I D V
                                      - - - 1 - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       SEI           78    1     2
*/

			case "78": 
				console.log(`${this.reg.pc}: sei`);
				this.flags.i = true;
				this.reg.pc = this.reg.pc+1;
				break;





/*
SBC  Subtract Memory from Accumulator with Borrow

     A - M - C -> A                   N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     SBC #oper     E9    2     2
     zeropage      SBC oper      E5    2     3
     zeropage,X    SBC oper,X    F5    2     4
     absolute      SBC oper      ED    3     4
     absolute,X    SBC oper,X    FD    3     4*
     absolute,Y    SBC oper,Y    F9    3     4*
     (indirect,X)  SBC (oper,X)  E1    2     6
     (indirect),Y  SBC (oper),Y  F1    2     5*
*/
			case "ed": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: sbc ${value}`);

				var result  = this.reg.a - this.mem[value] - this.flags.c;
				this.reg.a = result & 255;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a  === 0;
				this.flags.c = false; //?? todo


				this.reg.pc = this.reg.pc+3;
 

				break;



/*
BEQ  Branch on Result Zero

     branch on Z = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BEQ oper      F0    2     2**
*/
			case "f0": 
				var value = this.mem[this.reg.pc+1];

				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

				console.log(`${this.reg.pc.toString(16)}: beq`);
				if(this.flags.z){

					this.reg.pc = this.reg.pc+value;
				}else{
					this.reg.pc = this.reg.pc+2;
					
				}

				break;

/*
TXA  Transfer Index X to Accumulator

     X -> A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TXA           8A    1     2

*/
			case "8a": 

				console.log(`${this.reg.pc.toString(16)}: txa`);
				this.reg.a = this.reg.x;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a  === 0;

				this.reg.pc = this.reg.pc+1;
				break;

/*
AND  AND Memory with Accumulator

     A AND M -> A                     N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     AND #oper     29    2     2
     zeropage      AND oper      25    2     3
     zeropage,X    AND oper,X    35    2     4
     absolute      AND oper      2D    3     4
     absolute,X    AND oper,X    3D    3     4*
     absolute,Y    AND oper,Y    39    3     4*
     (indirect,X)  AND (oper,X)  21    2     6
     (indirect),Y  AND (oper),Y  31    2     5*
*/
			case "29": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: and ${value}`);

				this.reg.a = this.reg.a & value;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a  === 0;

				this.reg.pc = this.reg.pc+2;
				break;
/*
ORA  OR Memory with Accumulator

     A OR M -> A                      N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     ORA #oper     09    2     2
     zeropage      ORA oper      05    2     3
     zeropage,X    ORA oper,X    15    2     4
     absolute      ORA oper      0D    3     4
     absolute,X    ORA oper,X    1D    3     4*
     absolute,Y    ORA oper,Y    19    3     4*
     (indirect,X)  ORA (oper,X)  01    2     6
     (indirect),Y  ORA (oper),Y  11    2     5*

*/
			case "9": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: ORA ${value}`);

				this.reg.a = this.reg.a | value;

				this.flags.n = (this.reg.a & 0b10000000) >> 7;
				this.flags.z = this.reg.a  === 0;

				this.reg.pc = this.reg.pc+2;
				break;


/*

INY  Increment Index Y by One

     Y + 1 -> Y                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       INY           C8    1     2
*/
			case "c8": 
 				console.log(`${this.reg.pc}: iny`);

				this.reg.y = this.reg.y +1;
				this.flags.n = (this.reg.y & 0b1000000000000000) >> 15;
				this.flags.z = this.reg.y  === 0;

				this.reg.pc = this.reg.pc+1;
				break;


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
			case "2c": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: bit ${value}`);

				this.flags.n = (value & 0b10000000) >> 7;
				this.flags.v = (value & 0b01000000) >> 6;
				this.flags.z = (value & this.mem[value])  === 0;

				this.reg.pc = this.reg.pc+3;
				break;
			case "24": 
				var oper = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: bit ${oper}`);

				this.flags.n = (value & 0b10000000) >> 7;
				this.flags.v = (value & 0b01000000) >> 6;
				this.flags.z = (value & this.mem[value])  === 0;

				this.reg.pc = this.reg.pc+3;
				break;

/*

CPY  Compare Memory and Index Y

     Y - M                            N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     CPY #oper     C0    2     2
     zeropage      CPY oper      C4    2     3
     absolute      CPY oper      CC    3     4
*/


			case "c0": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: cpy ${value}`);
				this.flags.n = (this.reg.y - value)>=128;
				this.flags.z = this.reg.y === value;
				this.flags.c = this.reg.y >= value;

				this.reg.pc = this.reg.pc+2;
				break;





/*
CLD  Clear Decimal Mode

0 -> D                           N Z C I D V
                                 - - - - 0 -

addressing    assembler    opc  bytes  cyles
--------------------------------------------
implied       CLD           D8    1     2
*/
			case "d8": 
				console.log(`${this.reg.pc}: cld`);
				this.flags.d = false;
				this.reg.pc = this.reg.pc+1;
				break;


/*
LDA  Load Accumulator with Memory

     M -> A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     LDA #oper     A9    2     2
     zeropage      LDA oper      A5    2     3
     zeropage,X    LDA oper,X    B5    2     4
     absolute      LDA oper      AD    3     4
     absolute,X    LDA oper,X    BD    3     4*
     absolute,Y    LDA oper,Y    B9    3     4*
     (indirect,X)  LDA (oper,X)  A1    2     6
     (indirect),Y  LDA (oper),Y  B1    2     5*

a1	10100001
a5	10100101
a9	10101001
ad	10101101

b1	10110001
b5	10110101
b9	10111001
bd	10111101


*/

			case "a9": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: lda ${value}`);
				this.reg.a = value;
				this.flags.n = false; // ???
				this.flags.z = value === 0;

				this.reg.pc = this.reg.pc+2;
				break;



			case "bd": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];


				console.log(`${this.reg.pc}: lda ${value}, x`);
				this.reg.pc = this.reg.pc+3;
				break;

/*
BCS  Branch on Carry Set

     branch on C = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BCS oper      B0    2     2**
*/
			case "b0": 
				var value = this.mem[this.reg.pc+1];

				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

				console.log(`${this.reg.pc.toString(16)}: bcs ${value}`);

				if(this.flags.c){
					this.reg.pc = this.reg.pc+value;
				}else{
					this.reg.pc = this.reg.pc+2;
				}
				break;

/*
BCC  Branch on Carry Clear

     branch on C = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BCC oper      90    2     2**
*/
			case "90": 
				var value = this.mem[this.reg.pc+1];

				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

				console.log(`${this.reg.pc.toString(16)}: bcs ${value}`);

				if(!this.flags.c){
					this.reg.pc = this.reg.pc+value;
				}else{
					this.reg.pc = this.reg.pc+2;
				}
				break;


/*

DEX  Decrement Index X by One

     X - 1 -> X                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       DEC           CA    1     2

*/
			case "ca": 

				console.log(`${this.reg.pc.toString(16)}: dex`);
				this.reg.x = this.reg.x -1;
				this.flags.n = (this.reg.x)>=128;
				this.flags.z = this.reg.x === 0;


				this.reg.pc = this.reg.pc+1;
				break;


/*
DEY  Decrement Index Y by One

     Y - 1 -> Y                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       DEC           88    1     2
*/
			case "88": 

				console.log(`${this.reg.pc.toString(16)}: dey`);
				this.reg.y = this.reg.y -1;
				this.flags.n = (this.reg.y)>=128;
				this.flags.z = this.reg.y === 0;


				this.reg.pc = this.reg.pc+1;
				break;



/*
CMP  Compare Memory with Accumulator

A - M                            N Z C I D V
                                 + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     CMP #oper     C9    2     2
     zeropage      CMP oper      C5    2     3
     zeropage,X    CMP oper,X    D5    2     4
     absolute      CMP oper      CD    3     4
     absolute,X    CMP oper,X    DD    3     4*
     absolute,Y    CMP oper,Y    D9    3     4*
     (indirect,X)  CMP (oper,X)  C1    2     6
     (indirect),Y  CMP (oper),Y  D1    2     5*

Compare sets flags as if a subtraction had been carried out.
If the value in the accumulator is equal or greater than the compared value, the Carry will be set.
The equal (Z) and sign (S) flags will be set based on equality or lack thereof and the sign (i.e. A>=$80) of the accumulator.


*/
			case "c9": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: cmp ${value}`);
				this.flags.n = (this.reg.a - value)>=128;
				this.flags.z = this.reg.a === value;
				this.flags.c = this.reg.a >= value;

				this.reg.pc = this.reg.pc+2;
				break;

/*

CPX  Compare Memory and Index X

     X - M                            N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     CPX #oper     E0    2     2
     zeropage      CPX oper      E4    2     3
     absolute      CPX oper      EC    3     4
*/
			case "e0": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc.toString(16)}: cpx ${value}`);
				this.flags.n = (this.reg.x - value)>=128;
				this.flags.z = this.reg.x === value;
				this.flags.c = this.reg.x >= value;

				this.reg.pc = this.reg.pc+2;
				break;


/*

LDY  Load Index Y with Memory

     M -> Y                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     LDY #oper     A0    2     2
     zeropage      LDY oper      A4    2     3
     zeropage,X    LDY oper,X    B4    2     4
     absolute      LDY oper      AC    3     4
     absolute,X    LDY oper,X    BC    3     4*

*/

			case "a0": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: ldy ${value}`);
				this.reg.y = value;
				this.flags.n = false; // ???
				this.flags.z = value === 0;

				this.reg.pc = this.reg.pc+2;
				break;


			case "ad": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];


				console.log(`${this.reg.pc}: lda ${value}`);
				this.reg.a = value;
				this.flags.n = false; // ???
				this.flags.z = value === 0;

				this.reg.pc = this.reg.pc+3;
				break;


/*
STA  Store Accumulator in Memory

     A -> M                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      STA oper      85    2     3
     zeropage,X    STA oper,X    95    2     4
     absolute      STA oper      8D    3     4
     absolute,X    STA oper,X    9D    3     5
     absolute,Y    STA oper,Y    99    3     5
     (indirect,X)  STA (oper,X)  81    2     6
     (indirect),Y  STA (oper),Y  91    2     6


*/
			case "99": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: sta ${value}, y`);
				var pos = this.reg.y + value; 
				this.mem[pos]  = this.reg.a;

				this.flags.n = false;  // ???
				this.flags.z = this.mem[pos] === 0;

				this.reg.pc = this.reg.pc+3;
				break;
			case "85": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: sta ${value}`);
				this.mem[value] = this.reg.a;

				this.flags.n = false;  // ???
				this.flags.z = this.mem[value] === 0;

				this.reg.pc = this.reg.pc+2;
				break;


			case "8d": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: sta ${value}`);
				this.mem[value] = this.reg.a;

				this.flags.n = false;  // ???
				this.flags.z = this.mem[value] === 0;

				this.reg.pc = this.reg.pc+3;
				break;

			case "91": 
				var value = this.mem[this.reg.pc+1];


				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

 
				console.log(`${this.reg.pc}: sta (${value}), y`);

				var pos = this.reg.y + this.mem[ value]; 
				this.mem[ pos]  = this.reg.a;

				this.flags.n = false;  // ???
				this.flags.z = this.mem[pos] === 0;

				this.reg.pc = this.reg.pc+2;
				break;


/*

STX  Store Index X in Memory

     X -> M                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      STX oper      86    2     3
     zeropage,Y    STX oper,Y    96    2     4
     absolute      STX oper      8E    3     4
*/

			case "86": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: stx ${value}`);
				this.mem[value] = this.reg.x;

				this.flags.n = false;  // ???
				this.flags.z = this.mem[value] === 0;

				this.reg.pc = this.reg.pc+2;
				break;

			case "8e": 
				var oper = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];
				console.log(`${this.reg.pc}: stx ${oper}`);

				this.reg.x = this.mem[oper];
				this.reg.pc = this.reg.pc+3;
				break;




/*
LDX  Load Index X with Memory

     M -> X                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     LDX #oper     A2    2     2
     zeropage      LDX oper      A6    2     3
     zeropage,Y    LDX oper,Y    B6    2     4
     absolute      LDX oper      AE    3     4
     absolute,Y    LDX oper,Y    BE    3     4*

*/
			case "a2": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: ldx ${value}`);
				this.reg.x = value;
				this.flags.n = false; // ???
				this.flags.z = value === 0;

				this.reg.pc = this.reg.pc+2;
				break;

/*
TXS  Transfer Index X to Stack Register

     X -> SP                          N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TXS           9A    1     2
*/
			case "9a": 

				console.log(`${this.reg.pc}: txs`);
				this.reg.sp = this.reg.x;
				this.reg.pc = this.reg.pc+1;
				break;




/*
BPL  Branch on Result Plus

     branch on N = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BPL oper      10    2     2**



*/
			case "10": 
				var value = this.mem[this.reg.pc+1];



				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

				console.log(`${this.reg.pc}: bpl ${value}`);

				if(this.flags.n === 0){
					this.reg.pc = this.reg.pc + value;
				}else{
					this.reg.pc = this.reg.pc+2;
				}


 
				break;
/*
JSR  Jump to New Location Saving Return Address

     push (PC+2),                     N Z C I D V
     (PC+1) -> PCL                    - - - - - -
     (PC+2) -> PCH

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     absolute      JSR oper      20    3     6
*/
			case "20": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: jsr ${value}`);
				this.mem[this.reg.sp] = this.reg.pc+3;
				this.reg.sp = this.reg.sp +1;
				this.reg.pc = value;


 
				break;
/*
RTS  Return from Subroutine

     pull PC, PC+1 -> PC              N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       RTS           60    1     6
     */
			case "60": 
				console.log(`${this.reg.pc}: rts`);
				this.reg.sp = this.reg.sp - 1;
				this.reg.pc = this.mem[this.reg.sp];



 
				break;


/*

BNE  Branch on Result not Zero

     branch on Z = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BNE oper      D0    2     2**
*/
			case "d0": 
				var value = this.mem[this.reg.pc+1];



				if( ( value & 128)>>7){
					value = value - 255 +1;
				}

				console.log(`${this.reg.pc}: bne ${value}`);

				if(this.flags.z === 0){
					this.reg.pc = this.reg.pc + value;
				}else{
					this.reg.pc = this.reg.pc+2;
				}


 
				break;


			default: 
				throw(`${this.reg.pc} ${opCode}`)
		}

		this.tick();

	}
}