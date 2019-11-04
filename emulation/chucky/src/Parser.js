export default class Parser {

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