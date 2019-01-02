function toHex(yourNumber){
	var hexString = yourNumber.toString(16);
	if (hexString.length % 2) {
  		hexString = '0' + hexString;
	}
	return hexString;

}

 



 


class Nes{
 constructor(array) { 
 	this.data = array;
 	this.pos = 0;

 	this.strct = this.readCart();
  }
 
readString(len){
	var  a = this.data.slice(this.pos, this.pos+len);
	this.pos = this.pos+len;
	return String.fromCharCode.apply(null, a);
}

readArray(len, fun){

	var arr = [];

	for(var i = 0; i< len; i++){
		arr.push(fun())
	}
	return arr;
}

 readByte(){
	var  a = this.data[this.pos];
	this.pos++;
	return a;
}

 readWord(){
	var  a = this.data[this.pos];
	this.pos++;
	var  b = this.data[this.pos];
	this.pos++;	
	
	return (b<<8) + a;
}



  readCart(){
  	var _this = this;

  		_this.readString(4);
		var sizePrg = _this.readByte();
		var sizeChr =  _this.readByte();
		var flag6 =  _this.readByte();		
		var flag7 =  _this.readByte();		
		var flag8 =  _this.readByte();		
		var flag9 =  _this.readByte();		
		var flag10 =  _this.readByte();	
		_this.readArray(5,  _this.readByte.bind(this));



	var r =  {
		header: {
			mirroring: flag6 & 1,
			batery: (flag6 & 2 )>1,
			trainer: (flag6 & 4 )>2,
			ignoreMirroring: (flag6 & 8 )>3,

			lowerNybbleMapper: (flag6 & 0b11110000 )>4


		}


	};


	if(r.header.trainer){
		r.trainer = _this.readArray(512,  _this.readByte.bind(this));
	}

	r.prgRom = _this.readArray(sizePrg*16384,  _this.readByte.bind(this));
	r.chrRom = _this.readArray(sizeChr*8192,  _this.readByte.bind(this));
	


 
	return r;
 
}

 
}