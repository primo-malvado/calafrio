 
import TzxbBlock from "./tzxblocks"

export default class TzxFile {
  static MAJOR = 1;
  static MINOR = 20;

  constructor() {
    this._reset();
  }

  _reset() {
    this.version = {
        major:TzxFile.MAJOR,
        minor:TzxFile.MINOR
    };

    this.blocks = [];
  }

  read(tzx) {
    this._reset();

    
    this._readHeader(tzx);

    while (tzx.pos < tzx.data.length) {
        debugger;
      var block = TzxbBlock.createBlock(tzx);
      //block.read(tzx);
      this.blocks.push(block);
    }
  }
  /*
    write( filename){
        with open(filename, 'wb') as tzx:
            this._writeHeader(tzx)
            for b in this.blocks:
                b.write(tzx)
    }
    */

  _readHeader(tzx) {
    //var header = tzx.read(10);
    if (
      tzx.readString(7) != "ZXTape!" ||
      tzx.readByte() != 0x1a
    ) {
      throw "Not a TZX file";
    }

    this.version = {
        major: tzx.readByte(),
        minor: tzx.readByte(),
    }

 
    if (this.version.major != TzxFile.MAJOR) {
      throw `Cannot handle TZX with major version ${this.version.major}`;
    } 
  }

  /*
    _writeHeader( tzx){

        tzx.write('ZXTape!'.encode('ascii'))
        tzx.write(bytes([0x1A, TzxFile.MAJOR, TzxFile.MINOR]))
    }
    */
}
