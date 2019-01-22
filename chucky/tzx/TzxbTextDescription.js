

//import TzxbBlock from "./tzxblocks";


export default class TzxbTextDescription/*  extends TzxbBlock*/{

    id = 0x30;
    type = 'Text description';

 
    read(tzx){
    	this.type = tzx.readByte();
    	this.len  = tzx.readByte();
        this.text = tzx.readString(this.len)
        
    }
}
