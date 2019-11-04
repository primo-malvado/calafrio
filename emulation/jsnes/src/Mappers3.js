
/**
 * Mapper 003 (CNROM)
 *
 * @constructor
 * @example Solomon's Key, Arkanoid, Arkista's Ring, Bump 'n' Jump, Cybernoid
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_003
 */
Mappers[3] = function(nes) {
  this.nes = nes;
};

Mappers[3].prototype = new Mappers[0]();

Mappers[3].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // This is a ROM bank select command.
    // Swap in the given ROM bank at 0x8000:
    // This is a VROM bank select command.
    // Swap in the given VROM bank at 0x0000:
    var bank = (value % (this.nes.rom.vromCount / 2)) * 2;
    this.loadVromBank(bank, 0x0000);
    this.loadVromBank(bank + 1, 0x1000);
    this.load8kVromBank(value * 2, 0x0000);
  }
};
