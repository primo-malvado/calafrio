/*
from struct import pack, unpack

from tzxlib.convert import convert
*/
export default class TapFile {
  static create(data) {
    if (data.length == 19 && data[0] == 0x00) {
      return new TapHeader(data);
    } else {
      return new TapData(data);
    }
  }

  valid() {
    var val = 0;

    for (var b in this.data) {
      val ^= this.data[b];
    }
    return val == 0;
  }

  body() {
    return this.data.slice(1);
  }

  writeBody(out) {
    out.write(this.body());
  }

  write(tzx) {
    tzx.write(this.data);
  }

  writeFragment(tzx) {
    tzx.write(pack("<H", len(this.data)));
    tzx.write(this.data);
  }
}

class TapHeader /*extends TapFile*/ {
  constructor(data) {
    this.data = data;
  }

  type() {
    var typeId = this.typeId();

    if (typeId == 0) {
      return "Program";
    } else if (typeId == 1) {
      return "Number array";
    } else if (typeId == 2) {
      return "Character array";
    } else if (typeId == 3) {
      return "Bytes";
    } else {
      return `Unknown (${typeId})`;
    }
  }

  typeId() {
    return this.data[1];
  }

  name() {
    if (this.data[2] == 0xff) {
      return "";
    } else {
      return String.fromCharCode.apply(null, this.data.slice(2, 12));
      //return convert(this.data[2:12])
    }
  }

  param1() {
    return this.data[14] + (this.data[15] << 8);
  }

  param2() {
    return this.data[16] + (this.data[17] << 8);
    //        return unpack('<H', this.data[16:18])[0]
  }

  length() {
    //return unpack('<H', this.data[12:14])[0]
    return this.data[12] + (this.data[13] << 8);
  }
  /*
    __str__(){

        if (this.data[1] == 3):
            if (this.param1() == 0x4000 and this.length() == 6912):
                result = 'Screen: %s' % (this.name())
            else:
                result = '%s: %s (start: %s, %s bytes)' % (this.type(), this.name(), this.param1(), this.length())
        else:
            result = '%s: %s (%s bytes)' % (this.type(), this.name(), this.length())
        if not this.valid():
            result += ', CRC ERROR!'
        return result
    }*/
}

class TapData /* extends TapFile*/ {
  constructor(data) {
    this.data = data;
  }

  length() {
    return len(this.data) - 2;
  }
  /*
    __str__(){

        if len(this.data) < 2:
            result = '%d bytes of incomplete data' % (len(this.data))
        else if this.data[0] == 0x00:
            result = '%d bytes of bogus header' % (len(this.data) - 2)
        else:
            result = '%d bytes of data' % (len(this.data) - 2)
        if not this.valid():
            result += ', CRC ERROR!'
        return result
    }
    */
}
