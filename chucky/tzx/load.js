class Parser {

	constructor(data){
		this.data = data;  
		this.pos = 0;
	}
    readString(len){

        var text = String.fromCharCode.apply(null, this.data.slice(this.pos, this.pos+len));

        this.pos = this.pos+len;

        return text; 
    }
    read(len){

		var data = this.data.slice(this.pos, this.pos+len);

		this.pos = this.pos+len;

		return data; 
	}

	readByte(){
		var res = this.data[this.pos];
		this.pos = this.pos+1;

		return res; 
	}
	readWord(){
		var res = ((this.data[this.pos +1 ])<<8) + this.data[this.pos];
		this.pos = this.pos+2;

		return res; 
	}

}

/*





 

class TapFile{

	static create(data){
		debugger;
        if (data.length == 19 && data[0] == 0x00){

            return new TapHeader(data)
        }
        else{
            return new TapData(data);
        }
	}

    valid(){

        var val = 0;
        for(var b in this.data){

            val ^= b
        }
        return val == 0
    }

 

}

class TapHeader{
	constructor(data){

        this.data = data;

        console.log("    type  : ", this.type());
        console.log("    name  : ", this.name());
        console.log("    param1: ", this.param1());
        console.log("    param2: ", this.param2());
        console.log("    length: ", this.length());
	}


    type(){
        var typeId = this.typeId();
        if(typeId == 0){
        	 return 'Program';
    	}else if(typeId == 1){
        	 return 'Number array';
    	}else if(typeId == 2){
        	 return 'Character array';
    	}else if(typeId == 3){
        	 return 'Bytes';
    	}else{
        	 return 'Unknown (%d)' % (typeId);
    	}
    }

    typeId(){
        return this.data[1];
    }

    name(){

        if(this.data[2] == 0xFF){
            return ''
        }else{


        	return String.fromCharCode.apply(null, this.data.slice(2, 12))
            
        }
    }

    param1(){
        return this.data[14] + (this.data[15] << 8)
    }

    param2(){
    	return this.data[16] + (this.data[17] << 8)
//        return unpack('<H', this.data[16:18])[0]
    }

    length(){
        //return unpack('<H', this.data[12:14])[0]
        return this.data[12] + (this.data[13] << 8)
    }
}

 

class TapData{

    constructor(data){
        this.data = data


         console.log("    length  : ", this.length());
    }

    length(){
        return this.data.length - 2;
    }

 

}
 














*/

import TzxFile from "./tzxfile";

fetch("ChuckieEgg.tzx", {
  method: "get"
})
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(arrayBuffer) {
    var data = Array.from(new Uint8Array(arrayBuffer));

    var parser = new Parser(data);
    var tzx = new TzxFile();
    tzx.read(parser);

    debugger;

    /*
 
	console.log(parser.readString(7) == "ZXTape!");
	console.log(parser.readByte() == 0x1a);
	console.log("major revision number", parser.readByte());
	console.log("minor revision number", parser.readByte());


while(parser.data.length > parser.pos){


	var type = parser.readByte();

	switch(type){
		case 0x30:
			//ID 30 - Text description
			var l = parser.readByte();
			console.log("Length of the text description: ", l);
			console.log("Text description: ", parser.readString(l));

			break;	


 
		case 0x10:
			//ID 10 - Standard Speed Data Block
			console.log("Pause after this block (ms.): ", parser.readWord());

			var l = parser.readWord();
			console.log("Length of data that follow: ", l);

			var tap = TapFile.create(parser.data.slice(parser.pos, parser.pos+l));



			parser.pos = parser.pos + l;

			break;
		default: 

			throw "not implemented: "+type;
			
	}
 
 

}
*/
  });
