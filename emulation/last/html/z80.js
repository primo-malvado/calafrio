function toHex(yourNumber){
	var hexString = yourNumber.toString(16);
	if (hexString.length % 2) {
  		hexString = '0' + hexString;
	}
	return hexString;

}

 
function bin2r(value){
	switch(value){
		case 7:
			return "a";
		case 0:
			return "b";
		case 1:
			return "c";
		case 2:
			return "d";
		case 3:
			return "e";
		case 4:
			return "h";
		case 5:
			return "l";

																					


	}


	console.error("zczxczxc")
	throw "ssss"

}


 
function bin2dd(value){
	switch(value){

		case 0:
			return "bc";
		case 1:
			return "de";
		case 2:
			return "hl";
		case 3:
			return "sp";

	}


	console.error("zczxczxc")
	throw "ssss"

}



class Z80{
 constructor() {
 	this.mem;
 	this.int_enabled = true;
    this.reg = {
    	_h:0,
    	_l:0,
    	_hl:0,

    	a: 0,
    	c:0,
    	pc:0,
    	sp:0,

	    get hl() {
	        return this._hl;
	    },
	    set hl (value) {
	        this._hl = value;
	        this._h = this._hl & 0b0000000011111111;
	        this._l = ((this._hl & 0b1111111100000000 )>> 8)
	    },
	    get l() {
	        return this._l;
	    },
	    set l (value) {
	    	this._l = value;
	        this._hl = this._h + (this._l <<8 );
	        
	    },
	    get h(){
	        return this._h;
	   
	    },
	    set h (value) {
	    	this._h = value;
	        this._hl = this._h + (this._l <<8 );
	        
	    }
    }
  }

  process(){

  	var opCode = this.mem[this.reg.pc];

	var hexOp = toHex(opCode);


	if((opCode) == 0b11110011){ // di
			console.log(`${this.reg.pc}: di`);
			this.int_enabled = false;
			this.reg.pc++;
			this.process();
	}

	else if(hexOp == "36"){ // LD (HL), n
			var value = this.mem[this.reg.pc+1];
			this.mem[this.reg.hl] = value;
			console.log(`${this.reg.pc}: ld (hl), ${value}`);
			this.reg.pc= this.reg.pc+2;
			this.process();
	}


	else if(hexOp == "32"){ // LD (nn), a
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			
			console.log(`ld (${value}),a`);

			this.mem[value] = this.reg.a
			this.reg.pc= this.reg.pc+3;
			this.process();
	}

 


	else if((opCode & 0b11000000) == 0b01000000){ //ld r, r'	
	
		var rd = bin2r((opCode & 0b00111000)>>3);
		var ro = bin2r((opCode & 0b00000111));
 
		console.log(`${this.reg.pc}: ld ${rd}, ${ro}`);

		this.reg.pc= this.reg.pc+1;
		this.reg[rd] = this.reg[ro]

 

		this.process();

	}else if((opCode & 0b11111000) == 0b10101000){ //xor r	
	
		var r = bin2r((opCode & 0b00000111));
 
		console.log(`${this.reg.pc}: xor ${r}`);

		this.reg.pc= this.reg.pc+1;
		this.reg[r] = this.reg.a ^ this.reg[r];

 

		this.process();

	}

 
 

	 else if((opCode & 0b11001111) == 0b00000001)//ld dd, nn	 
	{

		var dd = bin2dd((opCode & 0b00110000)>>4);

			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`${this.reg.pc}: ld ${dd}, ${value}`);
			this.reg.pc= this.reg.pc+3;
			this.reg[dd]= value;

			this.process();

	}
	 else if((opCode & 0b11000111) == 0b00000110)//ld r, n	 
	{

		var r = bin2r((opCode & 0b00111000)>>3);



		var value = this.mem[this.reg.pc+1]
		console.log(`${this.reg.pc}: ld ${r}, ${value}`);

		this.reg.pc= this.reg.pc+2;
		this.reg[r] = value;
 

		this.process();

	} else  {



	switch(hexOp){


		case "31":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8);


			console.log(`ld sp, ${value}`);
			this.reg.sp= value;
			this.reg.pc = this.reg.pc+3;
			this.process(); 
			break;

		case "c3":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`${this.reg.pc}: jp ${value}`);
			this.reg.pc= value;
			this.process();
			break;
/*



		case "2c":
			console.log(`${this.reg.pc}: inc l`);
			this.reg.pc++;

			this.reg.l++;
			this.process();
			break;	
		case "2d":
			console.log(`${this.reg.pc}: dec l`);
			this.reg.pc++;
			this.reg.l--;
			this.process();
			break;


		case "24":
			console.log(`${this.reg.pc}: inc h`);
			this.reg.pc++;
			this.reg.h++;
			this.process();
			break;	

		case "7c":
			console.log(`${this.reg.pc}: ld a,h`);
			this.reg.pc++;
			this.reg.a = this.reg.h;
			this.process();
			break;
			
		case "7d":
			console.log(`${this.reg.pc}: ld a,l`);
			this.reg.pc++;
			this.reg.a = this.reg.l;
			this.process();
			break;


		case "67":
			console.log(`${this.reg.pc}: ld h,a`);
			this.reg.pc++;
			this.reg.h = this.reg.a;
			this.process();
			break;



		case "13":
			console.log(`${this.reg.pc}: inc de`);
			this.reg.de++;
			this.reg.pc++;
			this.process();
			break;

		case "77":
			console.log(`${this.reg.pc}: ld (hl),a`);
			this.reg.pc++;
			this.mem[this.reg.hl] = this.reg.a;
			this.process();
			break;

		case "cd":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)


			console.log(`${this.reg.pc}: call ${value}`);

			this.reg.pc = this.reg.pc+3;


			this.reg.sp--;
			this.mem[this.reg.sp] = ((this.reg.pc & 0b1111111100000000 )>> 8)

			this.reg.sp--;
			this.mem[this.reg.sp] = this.reg.pc & 0b0000000011111111

			this.reg.pc = value;
			this.process();
			break;

		case "06":
			var value = this.mem[this.reg.pc+1]
			console.log(`ld b, ${value}`);
			this.reg.b = value;
			this.reg.pc= this.reg.pc+2;
			this.process();
			break;




		case "ed":
			var op = this.mem[this.reg.pc+1]
			var hexOp2 = toHex(op);
			switch(hexOp2){
				case "b0":
					console.log(`${this.reg.pc}: ldir`);

					while(this.reg.bc !== 0){


						this.mem[this.reg.de] =this.mem[this.reg.hl];
						this.reg.de++;
						this.reg.hl++;
						this.reg.bc--;
					}
 
					
					this.reg.pc= this.reg.pc+2;
					this.process();
					break;


				case "58":
					console.log(`${this.reg.pc}: in e, (c)`);

					
					this.reg.pc= this.reg.pc+2;
					this.process();
					break;


				default:
					console.log("ed"+hexOp2);
			}
 
			break;





		case "3e":
			var value = this.mem[this.reg.pc+1]
			console.log(`ld a, ${value}`);
			this.reg.a= value;
			this.reg.pc= this.reg.pc+2;
			this.process();
			break;



 
		case "11":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`${this.reg.pc}: ld de, ${value}`);

			this.reg.de = value;
			this.reg.pc= this.reg.pc+3;
			this.process();
			break;

		case "01":
			var value = this.mem[this.reg.pc+1] +( this.mem[this.reg.pc+2]<<8)
			console.log(`${this.reg.pc}: ld bc, ${value}`);

			this.reg.bc = value;
			this.reg.pc= this.reg.pc+3;
			this.process();
			break;
 
		case "1a":
			console.log(`${this.reg.pc}: ld a,(de)`);

			this.reg.a = this.mem[this.reg.de]
			this.reg.pc++;
			this.process();
			break;


		case "b6":
			console.log(`${this.reg.pc}: or (hl)`);
			this.reg.pc++;

			this.reg.a = this.reg.a | this.mem[this.reg.hl];
 
			
			this.reg.z = this.reg.a==0 ? 1: 0;
			this.reg.h = 1;
			this.reg.n = 0;
			this.reg.c = 1;


			this.process();
			break;



		case "b3":
			console.log(`${this.reg.pc}: or e`);
			this.reg.pc++;

			this.reg.a = this.reg.a | this.reg.e;
 
			
			this.reg.z = this.reg.a==0 ? 1: 0;
			this.reg.h = 1;
			this.reg.n = 0;
			this.reg.c = 1;


			this.process();
			break;

		case "a6":
			console.log(`${this.reg.pc}: and (hl)`);
			this.reg.pc++;

			this.reg.a = this.reg.a & this.mem[this.reg.hl];
 
			
			this.reg.z = this.reg.a==0 ? 1: 0;
			this.reg.h = 1;
			this.reg.n = 0;
			this.reg.c = 1;


			this.process();
			break;

 

		case "e6":
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc}: and ${value}`);
			this.reg.pc= this.reg.pc+2;
			this.reg.a = this.reg.a & value;
 
			
			this.reg.z = this.reg.a==0 ? 1: 0;
			this.reg.h = 1;
			this.reg.n = 0;
			this.reg.c = 1;


			this.process();
			break;






		case "c0":
			console.log(`${this.reg.pc}: ret nz`);

			if(this.reg.z){
				this.reg.pc= this.reg.pc+2;
			}
			else{

 

				this.reg.pc= this.mem[this.reg.sp] + (this.mem[this.reg.sp+1] << 8);
				this.reg.sp = this.reg.sp + 2;
 
 
			}
 
			this.process();
			break;

		case "10":
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc}: djnz ${value}`);
			this.reg.pc= this.reg.pc+2;
			this.reg.b--;

 
			 
			if(this.reg.b !== 0){
				this.reg.pc= this.reg.pc+(value >=192 ?  value-254: value);
			} 

			this.process();
			break;


		case "d6":
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc}: sub ${value}`);
			this.reg.pc= this.reg.pc+2;
			this.reg.a = this.reg.a - value;
 
			this.process();
			break;


		case "28":
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc}: jr z, ${value} # If condition cc is true, the signed value * is added to pc. The jump is measured from the start of the instruction opcode.`);
			
			 
			if(this.reg.z){
				this.reg.pc= this.reg.pc+2+value;
			}
			else{
				this.reg.pc= this.reg.pc+2;
			}

			this.process();
			break;


		case "20":
			var value = this.mem[this.reg.pc+1];
			console.log(`${this.reg.pc}: jr nz, ${value}`);
			
			if(this.reg.z){
				this.reg.pc= this.reg.pc+2;
			}
			else{
				this.reg.pc= this.reg.pc+2+value;
			}

			this.process();
			break;



		case "cb":
			var op = this.mem[this.reg.pc+1]
			var hexOp2 = toHex(op);
			switch(hexOp2){
				case "c6":

					console.log(`${this.reg.pc}: set 0,(hl)`);

					this.mem[this.reg.hl] = this.mem[this.reg.hl] | 1;

					this.reg.pc= this.reg.pc+2;
					this.process();
					break;
				case "41":
					console.log(`${this.reg.pc}: bit 0,c # test bit 0 of c`);

					this.reg.z = this.reg.c & 1;
					this.reg.pc= this.reg.pc+2;
					this.process();
					break;


				case "58":
					console.log(`${this.reg.pc}: bit 3, b`);

					this.reg.z = (this.reg.b & 0b100)>>2;
					this.reg.pc= this.reg.pc+2;
					this.process();
					break;


				default:
					console.log("cb"+hexOp2);
			}

			break;



		case "fd":
			var op = this.mem[this.reg.pc+1]
			var hexOp2 = toHex(op);
			switch(hexOp2){
				 
				case "21":
					var value = this.mem[this.reg.pc+2] +( this.mem[this.reg.pc+3]<<8)
			
					console.log(`${this.reg.pc}: ld iy, ${value}`);
 					this.reg.iv = value;
					this.reg.pc= this.reg.pc+4;
					this.process();
					break;

				case "7e":
					var value = this.mem[this.reg.pc+2];
			
					console.log(`${this.reg.pc}: ld a,(iy+ ${value})`);
 					this.reg.a = this.mem[this.reg.iv + value];
					this.reg.pc= this.reg.pc+3;
					this.process();
					break;


 

				default:
					console.log("fd"+hexOp2);
			}

			break;
*/


		default: 
			console.log(this.reg.pc , opCode, hexOp );
			break;
		}


  }
}
}