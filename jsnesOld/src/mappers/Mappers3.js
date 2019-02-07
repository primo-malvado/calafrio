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





/*

 


Mappers[4] = function(nes) {
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
};

Mappers[4].prototype = new Mappers[0]();

Mappers[4].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
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

Mappers[4].prototype.executeCommand = function(cmd, arg) {
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

Mappers[4].prototype.loadROM = function() {
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
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};

Mappers[4].prototype.clockIrqCounter = function() {
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

 
*/
/**
 * Mapper005 (MMC5,ExROM)
 *
 * @example Castlevania 3, Just Breed, Uncharted Waters, Romance of the 3 Kingdoms 2, Laser Invasion, Metal Slader Glory, Uchuu Keibitai SDF, Shin 4 Nin Uchi Mahjong - Yakuman Tengoku
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_005
 * @constructor
 */

/*
Mappers[5] = function(nes) {
  this.nes = nes;
};

Mappers[5].prototype = new Mappers[0]();

Mappers[5].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
  } else {
    this.load8kVromBank(value, 0x0000);
  }
};

Mappers[5].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x5000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  }

  switch (address) {
    case 0x5100:
      this.prg_size = value & 3;
      break;
    case 0x5101:
      this.chr_size = value & 3;
      break;
    case 0x5102:
      this.sram_we_a = value & 3;
      break;
    case 0x5103:
      this.sram_we_b = value & 3;
      break;
    case 0x5104:
      this.graphic_mode = value & 3;
      break;
    case 0x5105:
      this.nametable_mode = value;
      this.nametable_type[0] = value & 3;
      this.load1kVromBank(value & 3, 0x2000);
      value >>= 2;
      this.nametable_type[1] = value & 3;
      this.load1kVromBank(value & 3, 0x2400);
      value >>= 2;
      this.nametable_type[2] = value & 3;
      this.load1kVromBank(value & 3, 0x2800);
      value >>= 2;
      this.nametable_type[3] = value & 3;
      this.load1kVromBank(value & 3, 0x2c00);
      break;
    case 0x5106:
      this.fill_chr = value;
      break;
    case 0x5107:
      this.fill_pal = value & 3;
      break;
    case 0x5113:
      this.SetBank_SRAM(3, value & 3);
      break;
    case 0x5114:
    case 0x5115:
    case 0x5116:
    case 0x5117:
      this.SetBank_CPU(address, value);
      break;
    case 0x5120:
    case 0x5121:
    case 0x5122:
    case 0x5123:
    case 0x5124:
    case 0x5125:
    case 0x5126:
    case 0x5127:
      this.chr_mode = 0;
      this.chr_page[0][address & 7] = value;
      this.SetBank_PPU();
      break;
    case 0x5128:
    case 0x5129:
    case 0x512a:
    case 0x512b:
      this.chr_mode = 1;
      this.chr_page[1][(address & 3) + 0] = value;
      this.chr_page[1][(address & 3) + 4] = value;
      this.SetBank_PPU();
      break;
    case 0x5200:
      this.split_control = value;
      break;
    case 0x5201:
      this.split_scroll = value;
      break;
    case 0x5202:
      this.split_page = value & 0x3f;
      break;
    case 0x5203:
      this.irq_line = value;
      this.nes.cpu.ClearIRQ();
      break;
    case 0x5204:
      this.irq_enable = value;
      this.nes.cpu.ClearIRQ();
      break;
    case 0x5205:
      this.mult_a = value;
      break;
    case 0x5206:
      this.mult_b = value;
      break;
    default:
      if (address >= 0x5000 && address <= 0x5015) {
        this.nes.papu.exWrite(address, value);
      } else if (address >= 0x5c00 && address <= 0x5fff) {
        if (this.graphic_mode === 2) {
          // ExRAM
          // vram write
        } else if (this.graphic_mode !== 3) {
          // Split,ExGraphic
          if (this.irq_status & 0x40) {
            // vram write
          } else {
            // vram write
          }
        }
      } else if (address >= 0x6000 && address <= 0x7fff) {
        if (this.sram_we_a === 2 && this.sram_we_b === 1) {
          // additional ram write
        }
      }
      break;
  }
};

Mappers[5].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("UNROM: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.load8kRomBank(this.nes.rom.romCount * 2 - 1, 0x8000);
  this.load8kRomBank(this.nes.rom.romCount * 2 - 1, 0xa000);
  this.load8kRomBank(this.nes.rom.romCount * 2 - 1, 0xc000);
  this.load8kRomBank(this.nes.rom.romCount * 2 - 1, 0xe000);

  // Load CHR-ROM:
  this.loadCHRROM();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};
*/

/**
 * Mapper007 (AxROM)
 * @example Battletoads, Time Lord, Marble Madness
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_007
 * @constructor
 */

/*

Mappers[7] = function(nes) {
  this.nes = nes;
};

Mappers[7].prototype = new Mappers[0]();

Mappers[7].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
  } else {
    this.load32kRomBank(value & 0x7, 0x8000);
    if (value & 0x10) {
      this.nes.ppu.setMirroring(ROM.SINGLESCREEN_MIRRORING2);
    } else {
      this.nes.ppu.setMirroring(ROM.SINGLESCREEN_MIRRORING);
    }
  }
};

Mappers[7].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("AOROM: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.loadPRGROM();

  // Load CHR-ROM:
  this.loadCHRROM();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};
*/

/**
 * Mapper 011 (Color Dreams)
 *
 * @description http://wiki.nesdev.com/w/index.php/Color_Dreams
 * @example Crystal Mines, Metal Fighter
 * @constructor
 */

/*
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
*/
/**
 * Mapper 034 (BNROM, NINA-01)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_034
 * @example Darkseed, Mashou, Mission Impossible 2
 * @constructor
 */
/*
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
*/
/**
 * Mapper 038
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_038
 * @example Crime Busters
 * @constructor
 */
/*
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
*/
/**
 * Mapper 066 (GxROM)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_066
 * @example Doraemon, Dragon Power, Gumshoe, Thunder & Lightning,
 * Super Mario Bros. + Duck Hunt
 * @constructor
 */

/* 
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
*/
/**
 * Mapper 094 (UN1ROM)
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_094
 * @example Senjou no Ookami
 * @constructor
 */
/*
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
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};
*/
/**
 * Mapper 140
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_140
 * @example Bio Senshi Dan - Increaser Tono Tatakai
 * @constructor
 */

/*
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
*/
/**
 * Mapper 180
 *
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_180
 * @example Crazy Climber
 * @constructor
 */

/*
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
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};
*/