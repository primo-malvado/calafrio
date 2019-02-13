import utils from "../utils";
import CPU from "../cpu";
import Map from "./Map";
import Mappers0 from "./Mappers0";
import ROM from "../rom";

class Mappers4  extends Map{
 

  constructor(nes) {
    super(nes);
  this.nes = nes;

  this.CMD_SEL_2_1K_VROM_0000 = 0;
  this.CMD_SEL_2_1K_VROM_0800 = 1;
  this.CMD_SEL_1K_VROM_1000 = 2;
  this.CMD_SEL_1K_VROM_1400 = 3;
  this.CMD_SEL_1K_VROM_1800 = 4;
  this.CMD_SEL_1K_VROM_1C00 = 5;
  this.CMD_SEL_ROM_PAGE1 = 6;
  this.CMD_SEL_ROM_PAGE2 = 7;

  this.command = null;
  this.prgAddressSelect = null;
  this.chrAddressSelect = null;
  this.pageNumber = null;
  this.irqCounter = null;
  this.irqLatchValue = null;
  this.irqEnable = null;
  this.prgAddressChanged = false;
}

  load1kVromBank(bank1k, address) {
    if (this.nes.rom.vromCount === 0) {
      return;
    }
    this.nes.ppu.triggerRendering();

    var bank4k = Math.floor(bank1k / 4) % this.nes.rom.vromCount;
    var bankoffset = (bank1k % 4) * 1024;
    utils.copyArrayElements(
      this.nes.rom.vrom[bank4k],
      bankoffset,
      this.nes.ppu.vramMem,
      address,
      1024
    );

    // Update tiles:
    var vromTile = this.nes.rom.vromTile[bank4k];
    var baseIndex = address >> 4;
    for (var i = 0; i < 64; i++) {
      this.nes.ppu.ptTile[baseIndex + i] = vromTile[(bank1k % 4 << 6) + i];
    }
  }




}
//Mappers4.prototype = new Mappers[0]();

Mappers4.prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers0.prototype.write.apply(this, arguments);
    return;
  }

  switch (address) {
    case 0x8000:
      // Command/Address Select register
      this.command = value & 7;
      var tmp = (value >> 6) & 1;
      if (tmp !== this.prgAddressSelect) {
        this.prgAddressChanged = true;
      }
      this.prgAddressSelect = tmp;
      this.chrAddressSelect = (value >> 7) & 1;
      break;

    case 0x8001:
      // Page number for command
      this.executeCommand(this.command, value);
      break;

    case 0xa000:
      // Mirroring select
      if ((value & 1) !== 0) {
        this.nes.ppu.setMirroring(ROM.HORIZONTAL_MIRRORING);
      } else {
        this.nes.ppu.setMirroring(ROM.VERTICAL_MIRRORING);
      }
      break;

    case 0xa001:
      // SaveRAM Toggle
      // TODO
      //nes.getRom().setSaveState((value&1)!=0);
      break;

    case 0xc000:
      // IRQ Counter register
      this.irqCounter = value;
      //nes.ppu.mapperIrqCounter = 0;
      break;

    case 0xc001:
      // IRQ Latch register
      this.irqLatchValue = value;
      break;

    case 0xe000:
      // IRQ Control Reg 0 (disable)
      //irqCounter = irqLatchValue;
      this.irqEnable = 0;
      break;

    case 0xe001:
      // IRQ Control Reg 1 (enable)
      this.irqEnable = 1;
      break;

    default:
    // Not a MMC3 register.
    // The game has probably crashed,
    // since it tries to write to ROM..
    // IGNORE.
  }
};

Mappers4.prototype.executeCommand = function(cmd, arg) {
  switch (cmd) {
    case this.CMD_SEL_2_1K_VROM_0000:
      // Select 2 1KB VROM pages at 0x0000:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x0000);
        this.load1kVromBank(arg + 1, 0x0400);
      } else {
        this.load1kVromBank(arg, 0x1000);
        this.load1kVromBank(arg + 1, 0x1400);
      }
      break;

    case this.CMD_SEL_2_1K_VROM_0800:
      // Select 2 1KB VROM pages at 0x0800:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x0800);
        this.load1kVromBank(arg + 1, 0x0c00);
      } else {
        this.load1kVromBank(arg, 0x1800);
        this.load1kVromBank(arg + 1, 0x1c00);
      }
      break;

    case this.CMD_SEL_1K_VROM_1000:
      // Select 1K VROM Page at 0x1000:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x1000);
      } else {
        this.load1kVromBank(arg, 0x0000);
      }
      break;

    case this.CMD_SEL_1K_VROM_1400:
      // Select 1K VROM Page at 0x1400:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x1400);
      } else {
        this.load1kVromBank(arg, 0x0400);
      }
      break;

    case this.CMD_SEL_1K_VROM_1800:
      // Select 1K VROM Page at 0x1800:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x1800);
      } else {
        this.load1kVromBank(arg, 0x0800);
      }
      break;

    case this.CMD_SEL_1K_VROM_1C00:
      // Select 1K VROM Page at 0x1C00:
      if (this.chrAddressSelect === 0) {
        this.load1kVromBank(arg, 0x1c00);
      } else {
        this.load1kVromBank(arg, 0x0c00);
      }
      break;

    case this.CMD_SEL_ROM_PAGE1:
      if (this.prgAddressChanged) {
        // Load the two hardwired banks:
        if (this.prgAddressSelect === 0) {
          this.load8kRomBank((this.nes.rom.romCount - 1) * 2, 0xc000);
        } else {
          this.load8kRomBank((this.nes.rom.romCount - 1) * 2, 0x8000);
        }
        this.prgAddressChanged = false;
      }

      // Select first switchable ROM page:
      if (this.prgAddressSelect === 0) {
        this.load8kRomBank(arg, 0x8000);
      } else {
        this.load8kRomBank(arg, 0xc000);
      }
      break;

    case this.CMD_SEL_ROM_PAGE2:
      // Select second switchable ROM page:
      this.load8kRomBank(arg, 0xa000);

      // hardwire appropriate bank:
      if (this.prgAddressChanged) {
        // Load the two hardwired banks:
        if (this.prgAddressSelect === 0) {
          this.load8kRomBank((this.nes.rom.romCount - 1) * 2, 0xc000);
        } else {
          this.load8kRomBank((this.nes.rom.romCount - 1) * 2, 0x8000);
        }
        this.prgAddressChanged = false;
      }
  }
};

Mappers4.prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("MMC3: Invalid ROM! Unable to load.");
  }

  // Load hardwired PRG banks (0xC000 and 0xE000):
  this.load8kRomBank((this.nes.rom.romCount - 1) * 2, 0xc000);
  this.load8kRomBank((this.nes.rom.romCount - 1) * 2 + 1, 0xe000);

  // Load swappable PRG banks (0x8000 and 0xA000):
  this.load8kRomBank(0, 0x8000);
  this.load8kRomBank(1, 0xa000);

  // Load CHR-ROM:
  this.loadCHRROM();

  // Load Battery RAM (if present):
  this.loadBatteryRam();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(CPU.IRQ_RESET);
};

Mappers4.prototype.clockIrqCounter = function() {
  if (this.irqEnable === 1) {
    this.irqCounter--;
    if (this.irqCounter < 0) {
      // Trigger IRQ:
      //nes.getCpu().doIrq();
      this.nes.cpu.requestIrq(CPU.IRQ_NORMAL);
      this.irqCounter = this.irqLatchValue;
    }
  }
};

Mappers4.prototype.load8kRomBank = function(bank8k, address) {
    var bank16k = Math.floor(bank8k / 2) % this.nes.rom.romCount;
    var offset = (bank8k % 2) * 8192;

    //this.nes.cpu.mem.write(address,this.nes.rom.rom[bank16k],offset,8192);
    utils.copyArrayElements(
      this.nes.rom.rom[bank16k],
      offset,
      this.nes.cpu.mem,
      address,
      8192
    );
  }


export default Mappers4;