
/*
https://www.worldofspectrum.org/TZXformat.html
http://www.zx-modules.de/fileformats/tapformat.html

*/

import Parser from "./Parser";

export default class TzxParser{

	constructor(data){
		this.parser = new Parser(data);

		this.blocks = [];
	}


  	static MAJOR = 1;

 
	parseAll(){

 
  			this.blocks=[],
			this.signature= this.parser.readString(7);
			this.marker= this.parser.readByte();
			this.major= this.parser.readByte();
			this.minor= this.parser.readByte();
 


	    if (this.signature != "ZXTape!" || this.marker  != 0x1a) {
	      throw "Not a TZX file";
	    }

 
	 
	    if (this.major != TzxParser.MAJOR) {
	      throw `Cannot handle TZX with major version ${this.major}`;
	    } 


	    while (this.parser.pos < this.parser.data.length) {
    		var block = this.parseBlock()

	      	this.blocks.push(block);
	    }
  	}

	parseBlock(){
		var type = this.parser.data[this.parser.pos];

		switch(type){
			case 0x10:
				return this.readTzxbData();
			case 0x30:
				return this.readTzxbTextDescription();
			default: 
				throw `parser block ${type} not implemented`;

		}
	}


	readTzxbTextDescription(){
		var data  = {
			type: this.parser.readByte(),
			len: this.parser.readByte(),

		};

		data.description = this.parser.readString(data.len);

		return data;
		
	}

 
	readTzxbData(){
		var data  = {
			type: this.parser.readByte(),
			pause: this.parser.readWord(),
			length: this.parser.readWord(),

		};

		data.tap = this.readTap(data.length);

		return data;
		
	}
	readTap(len){

		var data  = {};

		var flag = this.parser.data[this.parser.pos];

		if(flag == 0){
			

			var dataType = this.parser.data[this.parser.pos+1];

			if(dataType == 0){


				var data  = {
					flag: this.parser.readByte(),
					dataType: this.parser.readByte(),
					filename: this.parser.readString(10),
					length: this.parser.readWord(),
					autostart: this.parser.readWord(),
					programLen: this.parser.readWord(),
					checksum: this.parser.readByte(),
					
					

				};
				return data;


				

			}else{
				throw "dataType " + dataType;
			}



			
		}else if(flag == 255){
 

				var data  = {
					flag: this.parser.readByte(),
					data: this.parser.read(len-2),
					checksum: this.parser.readByte(),
					
					

				};
				return data;




		}else{
			throw "flag "+flag;
		}


		
	}
 

 
 
 


 
}