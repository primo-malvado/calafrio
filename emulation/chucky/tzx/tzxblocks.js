/*
from struct import pack, unpack

from tzxlib.tapfile import TapFile
*/


import TzxbTextDescription from "./TzxbTextDescription";
import TapFile from "./TapFile";





class TzxbData/* extends TzxbBlock*/{
    id = 0x10
    type = 'Standard Speed Data Block'
/*
    setup( tap){

        this.tap = tap
        this.data = pack('<HH', 1000, len(tap.data))
    }
*/
    read( tzx){
        this.type = tzx.readByte();
        this.pauseAfter = tzx.readWord();
        this.len = tzx.readWord();

        //len = unpack('<H', this.data[0x02:0x04])[0]



        this.tap = TapFile.create(tzx.read(this.len))
    }
/*
    write( tzx){

        TzxbBlock.write( tzx)
        this.tap.write(tzx)
    }

    valid(){

        return this.tap.valid()
    }

    __str__(){
        return str(this.tap)
    }
    */
}




export default class TzxbBlock {
 

    static blockTypes = {
        0x10: TzxbData,
        /*
        0x11: TzxbTurboData,
        0x12: TzxbPureTone,
        0x13: TzxbPulseSequence,
        0x14: TzxbPureData,
        0x15: TzxbDirectRecording,
        0x16: TzxbC64Data,
        0x17: TzxbC64TurboData,
        0x18: TzxbCswRecording,
        0x19: TzxbGeneralizedData,
        0x20: TzxbPause,
        0x21: TzxbGroupStart,
        0x22: TzxbGroupEnd,
        0x23: TzxbJumpTo,
        0x24: TzxbLoopStart,
        0x25: TzxbLoopEnd,
        0x26: TzxbCallSequence,
        0x27: TzxbReturn,
        0x28: TzxbSelect,
        0x2A: TzxbStopTape48k,
        0x2B: TzxbSetSignalLevel,
        */
        0x30: TzxbTextDescription,
        /*
        0x31: TzxbMessage,
        0x32: TzxbArchiveInfo,
        0x33: TzxbHardwareType,
        0x34: TzxbEmulationInfo,
        0x35: TzxbCustomInfo,
        0x40: TzxbSnapshot,
        0x5A: TzxbGlue,
        */
    };


 

    static createBlock(parser){
        var type = parser.data[parser.pos];

        if(TzxbBlock.blockTypes[type]===undefined){

            throw `Unknown block type ${type}`;
        }
        var block =  new TzxbBlock.blockTypes[type]();
        block.read(parser);

        return block;
        
    }

  constructor() {
    this.data = bytearray();
  }

  read(tzx) {
    this.data = tzx.read(0x04);
    len = unpack("<L", this.data)[0];
    this.data += tzx.read(len);
  }

  write(tzx) {
    tzx.write(bytes([this.id]));
    tzx.write(this.data);
  }
  /*
    __str__(){
        return ''
    }
    */
}


/*
class TzxbTurboData(TzxbBlock):
    id = 0x11
    type = 'Turbo Speed Data Block'

    read( tzx):
        this.data = tzx.read(0x12)
        len = unpack('<BBB', this.data[0x0F:0x12])
        len = len[2] << 16 | len[1] << 8 | len[0]
        this.tap = TapFile.create(tzx.read(len))

    write( tzx):
        TzxbBlock.write( tzx)
        this.tap.write(tzx)

    valid():
        return this.tap.valid()

    asData():
        if this.data[0x11] != 0:
            return      # Too large, won't fit into standard data block
        result = TzxbData()
        result.data = this.data[0x0D:0x11]
        result.tap = this.tap
        return result

    __str__():
        return str(this.tap)


class TzxbPureTone(TzxbBlock):
    id = 0x12
    type = 'Pure Tone'

    read( tzx):
        this.data = tzx.read(0x04)

    __str__():
        return '%d x %d T-states' % unpack('<HH', this.data)


class TzxbPulseSequence(TzxbBlock):
    id = 0x13
    type = 'Pulse Sequence'

    read( tzx):
        this.data = tzx.read(0x01)
        len = unpack('<B', this.data)[0]
        this.data += tzx.read(len * 2)

class TzxbPureData(TzxbBlock):
    id = 0x14
    type = 'Pure Data Block'

    read( tzx):
        this.data = tzx.read(0x0A)
        len = unpack('<BBB', this.data[0x07:0x0A])
        len = len[2] << 16 | len[1] << 8 | len[0]
        this.tap = TapFile.create(tzx.read(len))

    write( tzx):
        TzxbBlock.write( tzx)
        this.tap.write(tzx)

    valid():
        return this.tap.valid()

    asData():
        if this.data[0x09] != 0:
            return      # Too large, won't fit into standard data block
        result = TzxbData()
        result.data = this.data[0x05:0x09]
        result.tap = this.tap
        return result

    __str__():
        return str(this.tap)


class TzxbDirectRecording(TzxbBlock):
    id = 0x15
    type = 'Direct Recording'

    read( tzx):
        this.data = tzx.read(0x08)
        len = unpack('<BBB', this.data[0x05:0x08])
        len = len[2] << 16 | len[1] << 8 | len[0]
        this.data += tzx.read(len)


class TzxbC64Data(TzxbBlock): # deprecated
    id = 0x16
    type = 'C64 ROM type data'

    read( tzx):
        this.data = tzx.read(0x04)
        len = unpack('<L', this.data)[0]
        this.data += tzx.read(len - 4)


class TzxbC64TurboData(TzxbBlock): # deprecated
    id = 0x17
    type = 'C64 turbo tape data'

    read( tzx):
        this.data = tzx.read(0x04)
        len = unpack('<L', this.data)[0]
        this.data += tzx.read(len - 4)


class TzxbCswRecording(TzxbBlock):
    id = 0x18
    type = 'CSW recording'


class TzxbGeneralizedData(TzxbBlock):
    id = 0x19
    type = 'Generalized data'


class TzxbPause(TzxbBlock):
    id = 0x20
    type = 'Pause'

    read( tzx):
        this.data = tzx.read(0x02)

    length():
        return unpack('<H', this.data)[0]

    __str__():
        return '%d ms' % (this.length())


class TzxbGroupStart(TzxbBlock):
    id = 0x21
    type = 'Group start'

    read( tzx):
        this.data = tzx.read(0x01)
        len = unpack('<B', this.data)[0]
        this.data += tzx.read(len)


class TzxbGroupEnd(TzxbBlock):
    id = 0x22
    type = 'Group end'

    read( tzx):
        pass


class TzxbJumpTo(TzxbBlock):
    id = 0x23
    type = 'Jump to'

    read( tzx):
        this.data = tzx.read(0x02)


class TzxbLoopStart(TzxbBlock):
    id = 0x24
    type = 'Loop start'

    read( tzx):
        this.data = tzx.read(0x02)


class TzxbLoopEnd(TzxbBlock):
    id = 0x25
    type = 'Loop end'

    read( tzx):
        pass


class TzxbCallSequence(TzxbBlock):
    id = 0x26
    type = 'Call sequence'

    read( tzx):
        this.data = tzx.read(0x02)
        len = unpack('<H', this.data)[0]
        this.data += tzx.read(len * 2)


class TzxbReturn(TzxbBlock):
    id = 0x27
    type = 'Return from sequence'

    read( tzx):
        pass


class TzxbSelect(TzxbBlock):
    id = 0x28
    type = 'Select'

    read( tzx):
        this.data = tzx.read(0x02)
        len = unpack('<H', this.data)[0]
        this.data += tzx.read(len)


class TzxbStopTape48k(TzxbBlock):
    id = 0x2A
    type = 'Stop the tape (48k)'


class TzxbSetSignalLevel(TzxbBlock):
    id = 0x2B
    type = 'Set signal level'

*/


/*
class TzxbMessage(TzxbBlock):
    id = 0x31
    type = 'Message'

    read( tzx):
        this.data = tzx.read(0x02)
        len = unpack('<xB', this.data)[0]
        this.data += tzx.read(len)


class TzxbArchiveInfo(TzxbBlock):
    id = 0x32
    type = 'Archive info'

    read( tzx):
        this.data = tzx.read(0x02)
        len = unpack('<H', this.data)[0]
        this.data += tzx.read(len)


class TzxbHardwareType(TzxbBlock):
    id = 0x33
    type = 'Hardware type'

    read( tzx):
        this.data = tzx.read(0x01)
        len = unpack('<B', this.data)[0]
        this.data += tzx.read(len * 3)


class TzxbEmulationInfo(TzxbBlock): # deprecated
    id = 0x34
    type = 'Emulation info'

    read( tzx):
        this.data = tzx.read(0x08)


class TzxbCustomInfo(TzxbBlock):
    id = 0x35
    type = 'Custom info'

    read( tzx):
        this.data = tzx.read(0x14)
        len = unpack('<L', this.data[0x10:0x14])[0]
        this.data += tzx.read(len)


class TzxbSnapshot(TzxbBlock): # deprecated
    id = 0x40
    type = 'Snapshot'

    read( tzx):
        this.data = tzx.read(0x04)
        len = unpack('<BBB', this.data[0x01:0x04])
        len = len[2] << 16 | len[1] << 8 | len[0]
        this.data += tzx.read(len)


class TzxbGlue(TzxbBlock):
    id = 0x5A
    type = 'Glue'

    read( tzx):
        tzx.read(0x09)

    write( tzx):
        pass    # never write the glue block, it serves no purpose
*/


