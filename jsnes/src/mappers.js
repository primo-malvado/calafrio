import utils from "./utils";

var Mappers = {};


/**
 * Mapper 038
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_038
 * @example Crime Busters
 * @constructor
 */
Mappers[38] = function(nes) {
  this.nes = nes;
};

Mappers[38].prototype = new Mappers[0]();

Mappers[38].prototype.write = function(address, value) {
  if (address < 0x7000 || address > 0x7fff) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // Swap in the given PRG-ROM bank at 0x8000:
    this.load32kRomBank(value & 3, 0x8000);

    // Swap in the given VROM bank at 0x0000:
    this.load8kVromBank(((value >> 2) & 3) * 2, 0x0000);
  }
};

/**
 * Mapper 066 (GxROM)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_066
 * @example Doraemon, Dragon Power, Gumshoe, Thunder & Lightning,
 * Super Mario Bros. + Duck Hunt
 * @constructor
 */
Mappers[66] = function(nes) {
  this.nes = nes;
};

Mappers[66].prototype = new Mappers[0]();

Mappers[66].prototype.write = function(address, value) {
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // Swap in the given PRG-ROM bank at 0x8000:
    this.load32kRomBank((value >> 4) & 3, 0x8000);

    // Swap in the given VROM bank at 0x0000:
    this.load8kVromBank((value & 3) * 2, 0x0000);
  }
};

/**
 * Mapper 094 (UN1ROM)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_094
 * @example Senjou no Ookami
 * @constructor
 */
Mappers[94] = function(nes) {
  this.nes = nes;
};

Mappers[94].prototype = new Mappers[0]();

Mappers[94].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // This is a ROM bank select command.
    // Swap in the given ROM bank at 0x8000:
    this.loadRomBank(value >> 2, 0x8000);
  }
};

Mappers[94].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("UN1ROM: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.loadRomBank(0, 0x8000);
  this.loadRomBank(this.nes.rom.romCount - 1, 0xc000);

  // Load CHR-ROM:
  this.loadCHRROM();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(CPU.IRQ_RESET);
};

/**
 * Mapper 140
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_140
 * @example Bio Senshi Dan - Increaser Tono Tatakai
 * @constructor
 */
Mappers[140] = function(nes) {
  this.nes = nes;
};

Mappers[140].prototype = new Mappers[0]();

Mappers[140].prototype.write = function(address, value) {
  if (address < 0x6000 || address > 0x7fff) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // Swap in the given PRG-ROM bank at 0x8000:
    this.load32kRomBank((value >> 4) & 3, 0x8000);

    // Swap in the given VROM bank at 0x0000:
    this.load8kVromBank((value & 0xf) * 2, 0x0000);
  }
};

/**
 * Mapper 180
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_180
 * @example Crazy Climber
 * @constructor
 */
Mappers[180] = function(nes) {
  this.nes = nes;
};

Mappers[180].prototype = new Mappers[0]();

Mappers[180].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // This is a ROM bank select command.
    // Swap in the given ROM bank at 0xc000:
    this.loadRomBank(value, 0xc000);
  }
};

Mappers[180].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("Mapper 180: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.loadRomBank(0, 0x8000);
  this.loadRomBank(this.nes.rom.romCount - 1, 0xc000);

  // Load CHR-ROM:
  this.loadCHRROM();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(CPU.IRQ_RESET);
};

export default Mappers;
