
/**
 * Mapper 034 (BNROM, NINA-01)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_034
 * @example Darkseed, Mashou, Mission Impossible 2
 * @constructor
 */
Mappers[34] = function(nes) {
  this.nes = nes;
};

Mappers[34].prototype = new Mappers[0]();

Mappers[34].prototype.write = function(address, value) {
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    this.load32kRomBank(value, 0x8000);
  }
};
