import utils from "./utils";

var Mappers = {};

Mappers[1] = function(nes) {
  this.nes = nes;
};

Mappers[1].prototype = new Mappers[0]();

Mappers[1].prototype.reset = function() {
  Mappers[0].prototype.reset.apply(this);

  // 5-bit buffer:
  this.regBuffer = 0;
  this.regBufferCounter = 0;

  // Register 0:
  this.mirroring = 0;
  this.oneScreenMirroring = 0;
  this.prgSwitchingArea = 1;
  this.prgSwitchingSize = 1;
  this.vromSwitchingSize = 0;

  // Register 1:
  this.romSelectionReg0 = 0;

  // Register 2:
  this.romSelectionReg1 = 0;

  // Register 3:
  this.romBankSelect = 0;
};

Mappers[1].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  }

  // See what should be done with the written value:
  if ((value & 128) !== 0) {
    // Reset buffering:
    this.regBufferCounter = 0;
    this.regBuffer = 0;

    // Reset register:
    if (this.getRegNumber(address) === 0) {
      this.prgSwitchingArea = 1;
      this.prgSwitchingSize = 1;
    }
  } else {
    // Continue buffering:
    //regBuffer = (regBuffer & (0xFF-(1<<regBufferCounter))) | ((value & (1<<regBufferCounter))<<regBufferCounter);
    this.regBuffer =
      (this.regBuffer & (0xff - (1 << this.regBufferCounter))) |
      ((value & 1) << this.regBufferCounter);
    this.regBufferCounter++;

    if (this.regBufferCounter === 5) {
      // Use the buffered value:
      this.setReg(this.getRegNumber(address), this.regBuffer);

      // Reset buffer:
      this.regBuffer = 0;
      this.regBufferCounter = 0;
    }
  }
};

Mappers[1].prototype.setReg = function(reg, value) {
  var tmp;

  switch (reg) {
    case 0:
      // Mirroring:
      tmp = value & 3;
      if (tmp !== this.mirroring) {
        // Set mirroring:
        this.mirroring = tmp;
        if ((this.mirroring & 2) === 0) {
          // SingleScreen mirroring overrides the other setting:
          this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING);
        } else if ((this.mirroring & 1) !== 0) {
          // Not overridden by SingleScreen mirroring.
          this.nes.ppu.setMirroring(this.nes.rom.HORIZONTAL_MIRRORING);
        } else {
          this.nes.ppu.setMirroring(this.nes.rom.VERTICAL_MIRRORING);
        }
      }

      // PRG Switching Area;
      this.prgSwitchingArea = (value >> 2) & 1;

      // PRG Switching Size:
      this.prgSwitchingSize = (value >> 3) & 1;

      // VROM Switching Size:
      this.vromSwitchingSize = (value >> 4) & 1;

      break;

    case 1:
      // ROM selection:
      this.romSelectionReg0 = (value >> 4) & 1;

      // Check whether the cart has VROM:
      if (this.nes.rom.vromCount > 0) {
        // Select VROM bank at 0x0000:
        if (this.vromSwitchingSize === 0) {
          // Swap 8kB VROM:
          if (this.romSelectionReg0 === 0) {
            this.load8kVromBank(value & 0xf, 0x0000);
          } else {
            this.load8kVromBank(
              Math.floor(this.nes.rom.vromCount / 2) + (value & 0xf),
              0x0000
            );
          }
        } else {
          // Swap 4kB VROM:
          if (this.romSelectionReg0 === 0) {
            this.loadVromBank(value & 0xf, 0x0000);
          } else {
            this.loadVromBank(
              Math.floor(this.nes.rom.vromCount / 2) + (value & 0xf),
              0x0000
            );
          }
        }
      }

      break;

    case 2:
      // ROM selection:
      this.romSelectionReg1 = (value >> 4) & 1;

      // Check whether the cart has VROM:
      if (this.nes.rom.vromCount > 0) {
        // Select VROM bank at 0x1000:
        if (this.vromSwitchingSize === 1) {
          // Swap 4kB of VROM:
          if (this.romSelectionReg1 === 0) {
            this.loadVromBank(value & 0xf, 0x1000);
          } else {
            this.loadVromBank(
              Math.floor(this.nes.rom.vromCount / 2) + (value & 0xf),
              0x1000
            );
          }
        }
      }
      break;

    default:
      // Select ROM bank:
      // -------------------------
      tmp = value & 0xf;
      var bank;
      var baseBank = 0;

      if (this.nes.rom.romCount >= 32) {
        // 1024 kB cart
        if (this.vromSwitchingSize === 0) {
          if (this.romSelectionReg0 === 1) {
            baseBank = 16;
          }
        } else {
          baseBank =
            (this.romSelectionReg0 | (this.romSelectionReg1 << 1)) << 3;
        }
      } else if (this.nes.rom.romCount >= 16) {
        // 512 kB cart
        if (this.romSelectionReg0 === 1) {
          baseBank = 8;
        }
      }

      if (this.prgSwitchingSize === 0) {
        // 32kB
        bank = baseBank + (value & 0xf);
        this.load32kRomBank(bank, 0x8000);
      } else {
        // 16kB
        bank = baseBank * 2 + (value & 0xf);
        if (this.prgSwitchingArea === 0) {
          this.loadRomBank(bank, 0xc000);
        } else {
          this.loadRomBank(bank, 0x8000);
        }
      }
  }
};

// Returns the register number from the address written to:
Mappers[1].prototype.getRegNumber = function(address) {
  if (address >= 0x8000 && address <= 0x9fff) {
    return 0;
  } else if (address >= 0xa000 && address <= 0xbfff) {
    return 1;
  } else if (address >= 0xc000 && address <= 0xdfff) {
    return 2;
  } else {
    return 3;
  }
};

Mappers[1].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("MMC1: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.loadRomBank(0, 0x8000); //   First ROM bank..
  this.loadRomBank(this.nes.rom.romCount - 1, 0xc000); // ..and last ROM bank.

  // Load CHR-ROM:
  this.loadCHRROM();

  // Load Battery RAM (if present):
  this.loadBatteryRam();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};

// eslint-disable-next-line no-unused-vars
Mappers[1].prototype.switchLowHighPrgRom = function(oldSetting) {
  // not yet.
};

Mappers[1].prototype.switch16to32 = function() {
  // not yet.
};

Mappers[1].prototype.switch32to16 = function() {
  // not yet.
};

 

 

Mappers[2] = function(nes) {
  this.nes = nes;
};

Mappers[2].prototype = new Mappers[0]();

Mappers[2].prototype.write = function(address, value) {
  // Writes to addresses other than MMC registers are handled by NoMapper.
  if (address < 0x8000) {
    Mappers[0].prototype.write.apply(this, arguments);
    return;
  } else {
    // This is a ROM bank select command.
    // Swap in the given ROM bank at 0x8000:
    this.loadRomBank(value, 0x8000);
  }
};

Mappers[2].prototype.loadROM = function() {
  if (!this.nes.rom.valid) {
    throw new Error("UNROM: Invalid ROM! Unable to load.");
  }

  // Load PRG-ROM:
  this.loadRomBank(0, 0x8000);
  this.loadRomBank(this.nes.rom.romCount - 1, 0xc000);

  // Load CHR-ROM:
  this.loadCHRROM();

  // Do Reset-Interrupt:
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};

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


/**
 * Mapper005 (MMC5,ExROM)
 *
 * @example Castlevania 3, Just Breed, Uncharted Waters, Romance of the 3 Kingdoms 2, Laser Invasion, Metal Slader Glory, Uchuu Keibitai SDF, Shin 4 Nin Uchi Mahjong - Yakuman Tengoku
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_005
 * @constructor
 */
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

/**
 * Mapper007 (AxROM)
 * @example Battletoads, Time Lord, Marble Madness
 * @description http://wiki.nesdev.com/w/index.php/INES_Mapper_007
 * @constructor
 */
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
      this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING2);
    } else {
      this.nes.ppu.setMirroring(this.nes.rom.SINGLESCREEN_MIRRORING);
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
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
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
  this.nes.cpu.requestIrq(this.nes.cpu.IRQ_RESET);
};

export default Mappers;
