//https://www.masswerk.at/6502/6502_instruction_set.html#SEI

class P6502{
	constructor(){
		this.mem = [];
		this.flags = {

		};

		this.reg = {
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
			case "78": 
				console.log(`${this.reg.pc}: sei`);
				this.flags.I = true;
				this.reg.pc = this.reg.pc+1;
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
				this.flags.D = false;
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
*/

			case "a9": 
				var value = this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: lda ${value}`);
				this.reg.A = value;
				this.flags.N = false; // ???
				this.flags.Z = value === 0;

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
				this.reg.Y = value;
				this.flags.N = false; // ???
				this.flags.Z = value === 0;

				this.reg.pc = this.reg.pc+2;
				break;


			case "ad": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];


				console.log(`${this.reg.pc}: lda ${value}`);
				this.reg.A = value;
				this.flags.N = false; // ???
				this.flags.Z = value === 0;

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

			case "8d": 
				var value = ((this.mem[this.reg.pc+2])<<8)+this.mem[this.reg.pc+1];

				console.log(`${this.reg.pc}: sta ${value}`);
				this.mem[value] = this.reg.A;

				this.flags.N = false;  // ???
				this.flags.Z = this.mem[value] === 0;

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
				this.reg.X = value;
				this.flags.N = false; // ???
				this.flags.Z = value === 0;

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
				this.reg.SP = this.reg.X;
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

				if(this.flags.Z === 0){
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