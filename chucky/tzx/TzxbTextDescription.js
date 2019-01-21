

import TzxbBlock from "./tzxblocks";


export default class TzxbTextDescription/*  extends TzxbBlock*/{

    id = 0x30;
    type = 'Text description';

 
    read(tzx){
        var len = tzx.readByte()

        this.data = tzx.readString(len)
    }
}
