
/**
 * Mapper 011 (Color Dreams)
 *
 * @description http://wiki.nesdev.com/w/index.php/Color_Dreams
 * @example Crystal Mines, Metal Fighter
 * @constructor
 */
Mappers[11] = function(nes) {
  this.nes = nes;
};

Mappers[11].prototype = new Mappers[0]();

Mappers[11].prototype.write = function(address, value) {
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // Swap in the given PRG-ROM bank:
    var prgbank1 = ((value & 0xf) * 2) % this.nes.rom.romCount;
    var prgbank2 = ((value & 0xf) * 2 + 1) % this.nes.rom.romCount;

    this.loadRomBank(prgbank1, 0x8000);
    this.loadRomBank(prgbank2, 0xc000);

    if (this.nes.rom.vromCount > 0) {
      // Swap in the given VROM bank at 0x0000:
      var bank = ((value >> 4) * 2) % this.nes.rom.vromCount;
      this.loadVromBank(bank, 0x0000);
      this.loadVromBank(bank + 1, 0x1000);
    }
  }
};
