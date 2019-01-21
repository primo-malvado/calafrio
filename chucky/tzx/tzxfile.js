//from tzxlib.tzxblocks import TzxbBlock


import TzxbBlock from "./tzxblocks"

export default class TzxFile {
  static MAJOR = 1;
  static MINOR = 20;

  constructor() {
    this.pos = 0;
    this._reset();
  }

  _reset() {
    this.version = (TzxFile.MAJOR, TzxFile.MINOR);
    this.blocks = [];
  }

  read(tzx) {
    this._reset();

    this.version = this._readHeader(tzx);

    while (true) {
      var blockType = tzx.readByte();

      if (!blockType) {
        break;
      }
      var block = TzxbBlock.createBlock(blockType);
      block.read(tzx);
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

    var major = tzx.readByte();
    if (major != TzxFile.MAJOR) {
      throw `Cannot handle TZX with major version ${major}`;
    }
    var minor = tzx.readByte();
    return [major, minor];
  }

  /*
    _writeHeader( tzx){

        tzx.write('ZXTape!'.encode('ascii'))
        tzx.write(bytes([0x1A, TzxFile.MAJOR, TzxFile.MINOR]))
    }
    */
}
