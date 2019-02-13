import Mappers0 from "./mappers/Mappers0";
import Mappers4 from "./mappers/Mappers4";

class Mappers {
  //static create

  static getMapperName(type) {
    switch (type) {
      case 0:
        return "Direct Access";
      case 1:
        return "Nintendo MMC1";
      case 2:
        return "UNROM";
      case 3:
        return "CNROM";
      case 4:
        return "Nintendo MMC3";
      case 5:
        return "Nintendo MMC5";
      case 6:
        return "FFE F4xxx";
      case 7:
        return "AOROM";
      case 8:
        return "FFE F3xxx";
      case 9:
        return "Nintendo MMC2";
      case 10:
        return "Nintendo MMC4";
      case 11:
        return "Color Dreams Chip";
      case 12:
        return "FFE F6xxx";
      case 15:
        return "100-in-1 switch";
      case 16:
        return "Bandai chip";
      case 17:
        return "FFE F8xxx";
      case 18:
        return "Jaleco SS8806 chip";
      case 19:
        return "Namcot 106 chip";
      case 20:
        return "Famicom Disk System";
      case 21:
        return "Konami VRC4a";
      case 22:
        return "Konami VRC2a";
      case 23:
        return "Konami VRC2a";
      case 24:
        return "Konami VRC6";
      case 25:
        return "Konami VRC4b";
      case 32:
        return "Irem G-101 chip";
      case 33:
        return "Taito TC0190/TC0350";
      case 34:
        return "32kB ROM switch";

      case 64:
        return "Tengen RAMBO-1 chip";
      case 65:
        return "Irem H-3001 chip";
      case 66:
        return "GNROM switch";
      case 67:
        return "SunSoft3 chip";
      case 68:
        return "SunSoft4 chip";
      case 69:
        return "SunSoft5 FME-7 chip";
      case 71:
        return "Camerica chip";
      case 78:
        return "Irem 74HC161/32-based";
      case 91:
        return "Pirate HK-SF3 chip";

      default:
        return "Unknown Mapper, " + type;
    }
  }

  static createMapper(rom) {
    switch (rom.mapperType) {
      case 0:
        return new Mappers0(rom.nes);
        break;
      case 4:
        return new Mappers4(rom.nes);
        break;
      default:
        throw new Error(
          "This ROM uses a mapper not supported by JSNES: " +
            Mappers.getMapperName(rom.mapperType) +
            "(" +
            rom.mapperType +
            ")"
        );
    }
  }
}

 

export default Mappers;