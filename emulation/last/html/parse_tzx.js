

function readString(len){
	var  a = array.slice(pos, pos+len);
	pos = pos+len;
	return String.fromCharCode.apply(null, a);
}

function readByte(){
	var  a = array[pos];
	pos++;
	return a;
}
function readWord(){
	var  a = array[pos];
	pos++;
	var  b = array[pos];
	pos++;	
	
	return (b<<8) + a;
}


function readArray(len, fun){

	var arr = [];

	for(var i = 0; i< len; i++){
		arr.push(fun())
	}
	return arr;
}


function readTzx(){
	return {
		signature: readString(7),
		end: readByte(),	
		majorVersion: readByte(),	
		minorVersion: readByte(),	
		block1: readBlock(),	
		block2: readBlock(),	
		block3: readBlock(),	
		block4: readBlock(),	
		block5: readBlock(),	
		block6: readBlock(),
	}
 
}


function readBlock(){
	var type =  readByte();
	pos--;
	
	switch(type)
	{
		case 16:
			return read10Block();
	
	}
 
 
}

function read10Block(){
	var d= {
		type: readByte(),
		pause: readWord(),
		len: readWord(),
	}

	d.data =readArray(d.len, readByte);
	//var old = pos;
	//d.tape = readTap();

	
	return d;
}

function readTap(){
	var d= {
		flag: readByte(),
		type: readByte(),
	}

	if(d.flag === 0 && d.type === 0){
		d.fileName = readString(10);
		d.dataLength = readWord();
		d.autostart = readWord();
		d.programLength = readWord();

		d.checksum = readByte();

		d.data =readArray(d.dataLength, readByte);
	}
 
	return d;
}





 
    