import utils from "./utils";
import OpData from "./OpData";

class CPU {
  constructor(nes) {
    this.nes = nes;

    // Keep Chrome happy
    this.mem = null;
    this.REG_ACC = null;
    this.REG_X = null;
    this.REG_Y = null;
    this.REG_SP = null;
    this.REG_PC = null;
    this.REG_PC_NEW = null;
    this.REG_STATUS = null;
    this.F_CARRY = null;
    this.F_DECIMAL = null;
    this.F_INTERRUPT = null;
    this.F_INTERRUPT_NEW = null;
    this.F_OVERFLOW = null;
    this.F_SIGN = null;
    this.F_ZERO = null;
    this.F_NOTUSED = null;
    this.F_NOTUSED_NEW = null;
    this.F_BRK = null;
    this.F_BRK_NEW = null;
    this.opdata = null;
    this.cyclesToHalt = null;
    this.crash = null;
    this.irqRequested = null;
    this.irqType = null;

    this.reset();
  }
  // IRQ Types
  IRQ_NORMAL = 0;
  IRQ_NMI = 1;
  IRQ_RESET = 2;

  reset() {
    // Main memory
    this.mem = new Array(0x10000);

    for (var i = 0; i < 0x2000; i++) {
      this.mem[i] = 0xff;
    }
    for (var p = 0; p < 4; p++) {
      var j = p * 0x800;
      this.mem[j + 0x008] = 0xf7;
      this.mem[j + 0x009] = 0xef;
      this.mem[j + 0x00a] = 0xdf;
      this.mem[j + 0x00f] = 0xbf;
    }
    for (var k = 0x2001; k < this.mem.length; k++) {
      this.mem[k] = 0;
    }

    // CPU Registers:
    this.REG_ACC = 0;
    this.REG_X = 0;
    this.REG_Y = 0;
    // Reset Stack pointer:
    this.REG_SP = 0x01ff;
    // Reset Program counter:
    this.REG_PC = 0x8000 - 1;
    this.REG_PC_NEW = 0x8000 - 1;
    // Reset Status register:
    this.REG_STATUS = 0x28;

    this.setStatus(0x28);

    // Set flags:
    this.F_CARRY = 0;
    this.F_DECIMAL = 0;
    this.F_INTERRUPT = 1;
    this.F_INTERRUPT_NEW = 1;
    this.F_OVERFLOW = 0;
    this.F_SIGN = 0;
    this.F_ZERO = 1;

    this.F_NOTUSED = 1;
    this.F_NOTUSED_NEW = 1;
    this.F_BRK = 1;
    this.F_BRK_NEW = 1;

    this.opdata = new OpData().opdata;
    this.cyclesToHalt = 0;

    // Reset crash flag:
    this.crash = false;

    // Interrupt notification:
    this.irqRequested = false;
    this.irqType = null;
  }

  // Emulates a single CPU instruction, returns the number of cycles
  emulate() {
    var temp;
    var add;

    // Check interrupts:
    if (this.irqRequested) {
      temp =
        this.F_CARRY |
        ((this.F_ZERO === 0 ? 1 : 0) << 1) |
        (this.F_INTERRUPT << 2) |
        (this.F_DECIMAL << 3) |
        (this.F_BRK << 4) |
        (this.F_NOTUSED << 5) |
        (this.F_OVERFLOW << 6) |
        (this.F_SIGN << 7);

      this.REG_PC_NEW = this.REG_PC;
      this.F_INTERRUPT_NEW = this.F_INTERRUPT;
      switch (this.irqType) {
        case 0: {
          // Normal IRQ:
          if (this.F_INTERRUPT !== 0) {
            // console.log("Interrupt was masked.");
            break;
          }
          this.doIrq(temp);
          // console.log("Did normal IRQ. I="+this.F_INTERRUPT);
          break;
        }
        case 1: {
          // NMI:
          this.doNonMaskableInterrupt(temp);
          break;
        }
        case 2: {
          // Reset:
          this.doResetInterrupt();
          break;
        }
      }

      this.REG_PC = this.REG_PC_NEW;
      this.F_INTERRUPT = this.F_INTERRUPT_NEW;
      this.F_BRK = this.F_BRK_NEW;
      this.irqRequested = false;
    }

    var opinf = this.opdata[this.nes.mmap.load(this.REG_PC + 1)];
    var cycleCount = opinf >> 24;
    var cycleAdd = 0;

    // Find address mode:
    var addrMode = (opinf >> 8) & 0xff;

    // Increment PC by number of op bytes:
    var opaddr = this.REG_PC;
    this.REG_PC += (opinf >> 16) & 0xff;

    var addr = 0;
    switch (addrMode) {
      case 0: {
        // Zero Page mode. Use the address given after the opcode,
        // but without high byte.
        addr = this.load(opaddr + 2);
        break;
      }
      case 1: {
        // Relative mode.
        addr = this.load(opaddr + 2);
        if (addr < 0x80) {
          addr += this.REG_PC;
        } else {
          addr += this.REG_PC - 256;
        }
        break;
      }
      case 2: {
        // Ignore. Address is implied in instruction.
        break;
      }
      case 3: {
        // Absolute mode. Use the two bytes following the opcode as
        // an address.
        addr = this.load16bit(opaddr + 2);
        break;
      }
      case 4: {
        // Accumulator mode. The address is in the accumulator
        // register.
        addr = this.REG_ACC;
        break;
      }
      case 5: {
        // Immediate mode. The value is given after the opcode.
        addr = this.REG_PC;
        break;
      }
      case 6: {
        // Zero Page Indexed mode, X as index. Use the address given
        // after the opcode, then add the
        // X register to it to get the final address.
        addr = (this.load(opaddr + 2) + this.REG_X) & 0xff;
        break;
      }
      case 7: {
        // Zero Page Indexed mode, Y as index. Use the address given
        // after the opcode, then add the
        // Y register to it to get the final address.
        addr = (this.load(opaddr + 2) + this.REG_Y) & 0xff;
        break;
      }
      case 8: {
        // Absolute Indexed Mode, X as index. Same as zero page
        // indexed, but with the high byte.
        addr = this.load16bit(opaddr + 2);
        if ((addr & 0xff00) !== ((addr + this.REG_X) & 0xff00)) {
          cycleAdd = 1;
        }
        addr += this.REG_X;
        break;
      }
      case 9: {
        // Absolute Indexed Mode, Y as index. Same as zero page
        // indexed, but with the high byte.
        addr = this.load16bit(opaddr + 2);
        if ((addr & 0xff00) !== ((addr + this.REG_Y) & 0xff00)) {
          cycleAdd = 1;
        }
        addr += this.REG_Y;
        break;
      }
      case 10: {
        // Pre-indexed Indirect mode. Find the 16-bit address
        // starting at the given location plus
        // the current X register. The value is the contents of that
        // address.
        addr = this.load(opaddr + 2);
        if ((addr & 0xff00) !== ((addr + this.REG_X) & 0xff00)) {
          cycleAdd = 1;
        }
        addr += this.REG_X;
        addr &= 0xff;
        addr = this.load16bit(addr);
        break;
      }
      case 11: {
        // Post-indexed Indirect mode. Find the 16-bit address
        // contained in the given location
        // (and the one following). Add to that address the contents
        // of the Y register. Fetch the value
        // stored at that adress.
        addr = this.load16bit(this.load(opaddr + 2));
        if ((addr & 0xff00) !== ((addr + this.REG_Y) & 0xff00)) {
          cycleAdd = 1;
        }
        addr += this.REG_Y;
        break;
      }
      case 12: {
        // Indirect Absolute mode. Find the 16-bit address contained
        // at the given location.
        addr = this.load16bit(opaddr + 2); // Find op
        if (addr < 0x1fff) {
          addr =
            this.mem[addr] +
            (this.mem[(addr & 0xff00) | (((addr & 0xff) + 1) & 0xff)] << 8); // Read from address given in op
        } else {
          addr =
            this.nes.mmap.load(addr) +
            (this.nes.mmap.load(
              (addr & 0xff00) | (((addr & 0xff) + 1) & 0xff)
            ) <<
              8);
        }
        break;
      }
    }
    // Wrap around for addresses above 0xFFFF:
    addr &= 0xffff;

    // ----------------------------------------------------------------------------------------------------
    // Decode & execute instruction:
    // ----------------------------------------------------------------------------------------------------

    // This should be compiled to a jump table.
    switch (opinf & 0xff) {
      case 0: {
        // *******
        // * ADC *
        // *******

        // Add with carry.
        temp = this.REG_ACC + this.load(addr) + this.F_CARRY;

        if (
          ((this.REG_ACC ^ this.load(addr)) & 0x80) === 0 &&
          ((this.REG_ACC ^ temp) & 0x80) !== 0
        ) {
          this.F_OVERFLOW = 1;
        } else {
          this.F_OVERFLOW = 0;
        }
        this.F_CARRY = temp > 255 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        this.REG_ACC = temp & 255;
        cycleCount += cycleAdd;
        break;
      }
      case 1: {
        // *******
        // * AND *
        // *******

        // AND memory with accumulator.
        this.REG_ACC = this.REG_ACC & this.load(addr);
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 2: {
        // *******
        // * ASL *
        // *******

        // Shift left one bit
        if (addrMode === 4) {
          // ADDR_ACC = 4

          this.F_CARRY = (this.REG_ACC >> 7) & 1;
          this.REG_ACC = (this.REG_ACC << 1) & 255;
          this.F_SIGN = (this.REG_ACC >> 7) & 1;
          this.F_ZERO = this.REG_ACC;
        } else {
          temp = this.load(addr);
          this.F_CARRY = (temp >> 7) & 1;
          temp = (temp << 1) & 255;
          this.F_SIGN = (temp >> 7) & 1;
          this.F_ZERO = temp;
          this.write(addr, temp);
        }
        break;
      }
      case 3: {
        // *******
        // * BCC *
        // *******

        // Branch on carry clear
        if (this.F_CARRY === 0) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 4: {
        // *******
        // * BCS *
        // *******

        // Branch on carry set
        if (this.F_CARRY === 1) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 5: {
        // *******
        // * BEQ *
        // *******

        // Branch on zero
        if (this.F_ZERO === 0) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 6: {
        // *******
        // * BIT *
        // *******

        temp = this.load(addr);
        this.F_SIGN = (temp >> 7) & 1;
        this.F_OVERFLOW = (temp >> 6) & 1;
        temp &= this.REG_ACC;
        this.F_ZERO = temp;
        break;
      }
      case 7: {
        // *******
        // * BMI *
        // *******

        // Branch on negative result
        if (this.F_SIGN === 1) {
          cycleCount++;
          this.REG_PC = addr;
        }
        break;
      }
      case 8: {
        // *******
        // * BNE *
        // *******

        // Branch on not zero
        if (this.F_ZERO !== 0) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 9: {
        // *******
        // * BPL *
        // *******

        // Branch on positive result
        if (this.F_SIGN === 0) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 10: {
        // *******
        // * BRK *
        // *******

        this.REG_PC += 2;
        this.push((this.REG_PC >> 8) & 255);
        this.push(this.REG_PC & 255);
        this.F_BRK = 1;

        this.push(
          this.F_CARRY |
            ((this.F_ZERO === 0 ? 1 : 0) << 1) |
            (this.F_INTERRUPT << 2) |
            (this.F_DECIMAL << 3) |
            (this.F_BRK << 4) |
            (this.F_NOTUSED << 5) |
            (this.F_OVERFLOW << 6) |
            (this.F_SIGN << 7)
        );

        this.F_INTERRUPT = 1;
        //this.REG_PC = load(0xFFFE) | (load(0xFFFF) << 8);
        this.REG_PC = this.load16bit(0xfffe);
        this.REG_PC--;
        break;
      }
      case 11: {
        // *******
        // * BVC *
        // *******

        // Branch on overflow clear
        if (this.F_OVERFLOW === 0) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 12: {
        // *******
        // * BVS *
        // *******

        // Branch on overflow set
        if (this.F_OVERFLOW === 1) {
          cycleCount += (opaddr & 0xff00) !== (addr & 0xff00) ? 2 : 1;
          this.REG_PC = addr;
        }
        break;
      }
      case 13: {
        // *******
        // * CLC *
        // *******

        // Clear carry flag
        this.F_CARRY = 0;
        break;
      }
      case 14: {
        // *******
        // * CLD *
        // *******

        // Clear decimal flag
        this.F_DECIMAL = 0;
        break;
      }
      case 15: {
        // *******
        // * CLI *
        // *******

        // Clear interrupt flag
        this.F_INTERRUPT = 0;
        break;
      }
      case 16: {
        // *******
        // * CLV *
        // *******

        // Clear overflow flag
        this.F_OVERFLOW = 0;
        break;
      }
      case 17: {
        // *******
        // * CMP *
        // *******

        // Compare memory and accumulator:
        temp = this.REG_ACC - this.load(addr);
        this.F_CARRY = temp >= 0 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        cycleCount += cycleAdd;
        break;
      }
      case 18: {
        // *******
        // * CPX *
        // *******

        // Compare memory and index X:
        temp = this.REG_X - this.load(addr);
        this.F_CARRY = temp >= 0 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        break;
      }
      case 19: {
        // *******
        // * CPY *
        // *******

        // Compare memory and index Y:
        temp = this.REG_Y - this.load(addr);
        this.F_CARRY = temp >= 0 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        break;
      }
      case 20: {
        // *******
        // * DEC *
        // *******

        // Decrement memory by one:
        temp = (this.load(addr) - 1) & 0xff;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp;
        this.write(addr, temp);
        break;
      }
      case 21: {
        // *******
        // * DEX *
        // *******

        // Decrement index X by one:
        this.REG_X = (this.REG_X - 1) & 0xff;
        this.F_SIGN = (this.REG_X >> 7) & 1;
        this.F_ZERO = this.REG_X;
        break;
      }
      case 22: {
        // *******
        // * DEY *
        // *******

        // Decrement index Y by one:
        this.REG_Y = (this.REG_Y - 1) & 0xff;
        this.F_SIGN = (this.REG_Y >> 7) & 1;
        this.F_ZERO = this.REG_Y;
        break;
      }
      case 23: {
        // *******
        // * EOR *
        // *******

        // XOR Memory with accumulator, store in accumulator:
        this.REG_ACC = (this.load(addr) ^ this.REG_ACC) & 0xff;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        cycleCount += cycleAdd;
        break;
      }
      case 24: {
        // *******
        // * INC *
        // *******

        // Increment memory by one:
        temp = (this.load(addr) + 1) & 0xff;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp;
        this.write(addr, temp & 0xff);
        break;
      }
      case 25: {
        // *******
        // * INX *
        // *******

        // Increment index X by one:
        this.REG_X = (this.REG_X + 1) & 0xff;
        this.F_SIGN = (this.REG_X >> 7) & 1;
        this.F_ZERO = this.REG_X;
        break;
      }
      case 26: {
        // *******
        // * INY *
        // *******

        // Increment index Y by one:
        this.REG_Y++;
        this.REG_Y &= 0xff;
        this.F_SIGN = (this.REG_Y >> 7) & 1;
        this.F_ZERO = this.REG_Y;
        break;
      }
      case 27: {
        // *******
        // * JMP *
        // *******

        // Jump to new location:
        this.REG_PC = addr - 1;
        break;
      }
      case 28: {
        // *******
        // * JSR *
        // *******

        // Jump to new location, saving return address.
        // Push return address on stack:
        this.push((this.REG_PC >> 8) & 255);
        this.push(this.REG_PC & 255);
        this.REG_PC = addr - 1;
        break;
      }
      case 29: {
        // *******
        // * LDA *
        // *******

        // Load accumulator with memory:
        this.REG_ACC = this.load(addr);
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        cycleCount += cycleAdd;
        break;
      }
      case 30: {
        // *******
        // * LDX *
        // *******

        // Load index X with memory:
        this.REG_X = this.load(addr);
        this.F_SIGN = (this.REG_X >> 7) & 1;
        this.F_ZERO = this.REG_X;
        cycleCount += cycleAdd;
        break;
      }
      case 31: {
        // *******
        // * LDY *
        // *******

        // Load index Y with memory:
        this.REG_Y = this.load(addr);
        this.F_SIGN = (this.REG_Y >> 7) & 1;
        this.F_ZERO = this.REG_Y;
        cycleCount += cycleAdd;
        break;
      }
      case 32: {
        // *******
        // * LSR *
        // *******

        // Shift right one bit:
        if (addrMode === 4) {
          // ADDR_ACC

          temp = this.REG_ACC & 0xff;
          this.F_CARRY = temp & 1;
          temp >>= 1;
          this.REG_ACC = temp;
        } else {
          temp = this.load(addr) & 0xff;
          this.F_CARRY = temp & 1;
          temp >>= 1;
          this.write(addr, temp);
        }
        this.F_SIGN = 0;
        this.F_ZERO = temp;
        break;
      }
      case 33: {
        // *******
        // * NOP *
        // *******

        // No OPeration.
        // Ignore.
        break;
      }
      case 34: {
        // *******
        // * ORA *
        // *******

        // OR memory with accumulator, store in accumulator.
        temp = (this.load(addr) | this.REG_ACC) & 255;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp;
        this.REG_ACC = temp;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 35: {
        // *******
        // * PHA *
        // *******

        // Push accumulator on stack
        this.push(this.REG_ACC);
        break;
      }
      case 36: {
        // *******
        // * PHP *
        // *******

        // Push processor status on stack
        this.F_BRK = 1;
        this.push(
          this.F_CARRY |
            ((this.F_ZERO === 0 ? 1 : 0) << 1) |
            (this.F_INTERRUPT << 2) |
            (this.F_DECIMAL << 3) |
            (this.F_BRK << 4) |
            (this.F_NOTUSED << 5) |
            (this.F_OVERFLOW << 6) |
            (this.F_SIGN << 7)
        );
        break;
      }
      case 37: {
        // *******
        // * PLA *
        // *******

        // Pull accumulator from stack
        this.REG_ACC = this.pull();
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        break;
      }
      case 38: {
        // *******
        // * PLP *
        // *******

        // Pull processor status from stack
        temp = this.pull();
        this.F_CARRY = temp & 1;
        this.F_ZERO = ((temp >> 1) & 1) === 1 ? 0 : 1;
        this.F_INTERRUPT = (temp >> 2) & 1;
        this.F_DECIMAL = (temp >> 3) & 1;
        this.F_BRK = (temp >> 4) & 1;
        this.F_NOTUSED = (temp >> 5) & 1;
        this.F_OVERFLOW = (temp >> 6) & 1;
        this.F_SIGN = (temp >> 7) & 1;

        this.F_NOTUSED = 1;
        break;
      }
      case 39: {
        // *******
        // * ROL *
        // *******

        // Rotate one bit left
        if (addrMode === 4) {
          // ADDR_ACC = 4

          temp = this.REG_ACC;
          add = this.F_CARRY;
          this.F_CARRY = (temp >> 7) & 1;
          temp = ((temp << 1) & 0xff) + add;
          this.REG_ACC = temp;
        } else {
          temp = this.load(addr);
          add = this.F_CARRY;
          this.F_CARRY = (temp >> 7) & 1;
          temp = ((temp << 1) & 0xff) + add;
          this.write(addr, temp);
        }
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp;
        break;
      }
      case 40: {
        // *******
        // * ROR *
        // *******

        // Rotate one bit right
        if (addrMode === 4) {
          // ADDR_ACC = 4

          add = this.F_CARRY << 7;
          this.F_CARRY = this.REG_ACC & 1;
          temp = (this.REG_ACC >> 1) + add;
          this.REG_ACC = temp;
        } else {
          temp = this.load(addr);
          add = this.F_CARRY << 7;
          this.F_CARRY = temp & 1;
          temp = (temp >> 1) + add;
          this.write(addr, temp);
        }
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp;
        break;
      }
      case 41: {
        // *******
        // * RTI *
        // *******

        // Return from interrupt. Pull status and PC from stack.

        temp = this.pull();
        this.F_CARRY = temp & 1;
        this.F_ZERO = ((temp >> 1) & 1) === 0 ? 1 : 0;
        this.F_INTERRUPT = (temp >> 2) & 1;
        this.F_DECIMAL = (temp >> 3) & 1;
        this.F_BRK = (temp >> 4) & 1;
        this.F_NOTUSED = (temp >> 5) & 1;
        this.F_OVERFLOW = (temp >> 6) & 1;
        this.F_SIGN = (temp >> 7) & 1;

        this.REG_PC = this.pull();
        this.REG_PC += this.pull() << 8;
        if (this.REG_PC === 0xffff) {
          return;
        }
        this.REG_PC--;
        this.F_NOTUSED = 1;
        break;
      }
      case 42: {
        // *******
        // * RTS *
        // *******

        // Return from subroutine. Pull PC from stack.

        this.REG_PC = this.pull();
        this.REG_PC += this.pull() << 8;

        if (this.REG_PC === 0xffff) {
          return; // return from NSF play routine:
        }
        break;
      }
      case 43: {
        // *******
        // * SBC *
        // *******

        temp = this.REG_ACC - this.load(addr) - (1 - this.F_CARRY);
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        if (
          ((this.REG_ACC ^ temp) & 0x80) !== 0 &&
          ((this.REG_ACC ^ this.load(addr)) & 0x80) !== 0
        ) {
          this.F_OVERFLOW = 1;
        } else {
          this.F_OVERFLOW = 0;
        }
        this.F_CARRY = temp < 0 ? 0 : 1;
        this.REG_ACC = temp & 0xff;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 44: {
        // *******
        // * SEC *
        // *******

        // Set carry flag
        this.F_CARRY = 1;
        break;
      }
      case 45: {
        // *******
        // * SED *
        // *******

        // Set decimal mode
        this.F_DECIMAL = 1;
        break;
      }
      case 46: {
        // *******
        // * SEI *
        // *******

        // Set interrupt disable status
        this.F_INTERRUPT = 1;
        break;
      }
      case 47: {
        // *******
        // * STA *
        // *******

        // Store accumulator in memory
        this.write(addr, this.REG_ACC);
        break;
      }
      case 48: {
        // *******
        // * STX *
        // *******

        // Store index X in memory
        this.write(addr, this.REG_X);
        break;
      }
      case 49: {
        // *******
        // * STY *
        // *******

        // Store index Y in memory:
        this.write(addr, this.REG_Y);
        break;
      }
      case 50: {
        // *******
        // * TAX *
        // *******

        // Transfer accumulator to index X:
        this.REG_X = this.REG_ACC;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        break;
      }
      case 51: {
        // *******
        // * TAY *
        // *******

        // Transfer accumulator to index Y:
        this.REG_Y = this.REG_ACC;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        break;
      }
      case 52: {
        // *******
        // * TSX *
        // *******

        // Transfer stack pointer to index X:
        this.REG_X = this.REG_SP - 0x0100;
        this.F_SIGN = (this.REG_SP >> 7) & 1;
        this.F_ZERO = this.REG_X;
        break;
      }
      case 53: {
        // *******
        // * TXA *
        // *******

        // Transfer index X to accumulator:
        this.REG_ACC = this.REG_X;
        this.F_SIGN = (this.REG_X >> 7) & 1;
        this.F_ZERO = this.REG_X;
        break;
      }
      case 54: {
        // *******
        // * TXS *
        // *******

        // Transfer index X to stack pointer:
        this.REG_SP = this.REG_X + 0x0100;
        this.stackWrap();
        break;
      }
      case 55: {
        // *******
        // * TYA *
        // *******

        // Transfer index Y to accumulator:
        this.REG_ACC = this.REG_Y;
        this.F_SIGN = (this.REG_Y >> 7) & 1;
        this.F_ZERO = this.REG_Y;
        break;
      }
      case 56: {
        // *******
        // * ALR *
        // *******

        // Shift right one bit after ANDing:
        temp = this.REG_ACC & this.load(addr);
        this.F_CARRY = temp & 1;
        this.REG_ACC = this.F_ZERO = temp >> 1;
        this.F_SIGN = 0;
        break;
      }
      case 57: {
        // *******
        // * ANC *
        // *******

        // AND accumulator, setting carry to bit 7 result.
        this.REG_ACC = this.F_ZERO = this.REG_ACC & this.load(addr);
        this.F_CARRY = this.F_SIGN = (this.REG_ACC >> 7) & 1;
        break;
      }
      case 58: {
        // *******
        // * ARR *
        // *******

        // Rotate right one bit after ANDing:
        temp = this.REG_ACC & this.load(addr);
        this.REG_ACC = this.F_ZERO = (temp >> 1) + (this.F_CARRY << 7);
        this.F_SIGN = this.F_CARRY;
        this.F_CARRY = (temp >> 7) & 1;
        this.F_OVERFLOW = ((temp >> 7) ^ (temp >> 6)) & 1;
        break;
      }
      case 59: {
        // *******
        // * AXS *
        // *******

        // Set X to (X AND A) - value.
        temp = (this.REG_X & this.REG_ACC) - this.load(addr);
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        if (
          ((this.REG_X ^ temp) & 0x80) !== 0 &&
          ((this.REG_X ^ this.load(addr)) & 0x80) !== 0
        ) {
          this.F_OVERFLOW = 1;
        } else {
          this.F_OVERFLOW = 0;
        }
        this.F_CARRY = temp < 0 ? 0 : 1;
        this.REG_X = temp & 0xff;
        break;
      }
      case 60: {
        // *******
        // * LAX *
        // *******

        // Load A and X with memory:
        this.REG_ACC = this.REG_X = this.F_ZERO = this.load(addr);
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        cycleCount += cycleAdd;
        break;
      }
      case 61: {
        // *******
        // * SAX *
        // *******

        // Store A AND X in memory:
        this.write(addr, this.REG_ACC & this.REG_X);
        break;
      }
      case 62: {
        // *******
        // * DCP *
        // *******

        // Decrement memory by one:
        temp = (this.load(addr) - 1) & 0xff;
        this.write(addr, temp);

        // Then compare with the accumulator:
        temp = this.REG_ACC - temp;
        this.F_CARRY = temp >= 0 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 63: {
        // *******
        // * ISC *
        // *******

        // Increment memory by one:
        temp = (this.load(addr) + 1) & 0xff;
        this.write(addr, temp);

        // Then subtract from the accumulator:
        temp = this.REG_ACC - temp - (1 - this.F_CARRY);
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        if (
          ((this.REG_ACC ^ temp) & 0x80) !== 0 &&
          ((this.REG_ACC ^ this.load(addr)) & 0x80) !== 0
        ) {
          this.F_OVERFLOW = 1;
        } else {
          this.F_OVERFLOW = 0;
        }
        this.F_CARRY = temp < 0 ? 0 : 1;
        this.REG_ACC = temp & 0xff;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 64: {
        // *******
        // * RLA *
        // *******

        // Rotate one bit left
        temp = this.load(addr);
        add = this.F_CARRY;
        this.F_CARRY = (temp >> 7) & 1;
        temp = ((temp << 1) & 0xff) + add;
        this.write(addr, temp);

        // Then AND with the accumulator.
        this.REG_ACC = this.REG_ACC & temp;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 65: {
        // *******
        // * RRA *
        // *******

        // Rotate one bit right
        temp = this.load(addr);
        add = this.F_CARRY << 7;
        this.F_CARRY = temp & 1;
        temp = (temp >> 1) + add;
        this.write(addr, temp);

        // Then add to the accumulator
        temp = this.REG_ACC + this.load(addr) + this.F_CARRY;

        if (
          ((this.REG_ACC ^ this.load(addr)) & 0x80) === 0 &&
          ((this.REG_ACC ^ temp) & 0x80) !== 0
        ) {
          this.F_OVERFLOW = 1;
        } else {
          this.F_OVERFLOW = 0;
        }
        this.F_CARRY = temp > 255 ? 1 : 0;
        this.F_SIGN = (temp >> 7) & 1;
        this.F_ZERO = temp & 0xff;
        this.REG_ACC = temp & 255;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 66: {
        // *******
        // * SLO *
        // *******

        // Shift one bit left
        temp = this.load(addr);
        this.F_CARRY = (temp >> 7) & 1;
        temp = (temp << 1) & 255;
        this.write(addr, temp);

        // Then OR with the accumulator.
        this.REG_ACC = this.REG_ACC | temp;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 67: {
        // *******
        // * SRE *
        // *******

        // Shift one bit right
        temp = this.load(addr) & 0xff;
        this.F_CARRY = temp & 1;
        temp >>= 1;
        this.write(addr, temp);

        // Then XOR with the accumulator.
        this.REG_ACC = this.REG_ACC ^ temp;
        this.F_SIGN = (this.REG_ACC >> 7) & 1;
        this.F_ZERO = this.REG_ACC;
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }
      case 68: {
        // *******
        // * SKB *
        // *******

        // Do nothing
        break;
      }
      case 69: {
        // *******
        // * IGN *
        // *******

        // Do nothing but load.
        // TODO: Properly implement the double-reads.
        this.load(addr);
        if (addrMode !== 11) cycleCount += cycleAdd; // PostIdxInd = 11
        break;
      }

      default: {
        // *******
        // * ??? *
        // *******

        this.nes.stop();
        this.nes.crashMessage =
          "Game crashed, invalid opcode at address $" + opaddr.toString(16);
        break;
      }
    } // end of switch

    return cycleCount;
  }

  load(addr) {
    if (addr < 0x2000) {
      return this.mem[addr & 0x7ff];
    } else {
      return this.nes.mmap.load(addr);
    }
  }

  load16bit(addr) {
    if (addr < 0x1fff) {
      return this.mem[addr & 0x7ff] | (this.mem[(addr + 1) & 0x7ff] << 8);
    } else {
      return this.nes.mmap.load(addr) | (this.nes.mmap.load(addr + 1) << 8);
    }
  }

  write(addr, val) {
    if (addr < 0x2000) {
      this.mem[addr & 0x7ff] = val;
    } else {
      this.nes.mmap.write(addr, val);
    }
  }

  requestIrq(type) {
    if (this.irqRequested) {
      if (type === this.IRQ_NORMAL) {
        return;
      }
      // console.log("too fast irqs. type="+type);
    }
    this.irqRequested = true;
    this.irqType = type;
  }

  push(value) {
    this.nes.mmap.write(this.REG_SP, value);
    this.REG_SP--;
    this.REG_SP = 0x0100 | (this.REG_SP & 0xff);
  }

  stackWrap() {
    this.REG_SP = 0x0100 | (this.REG_SP & 0xff);
  }

  pull() {
    this.REG_SP++;
    this.REG_SP = 0x0100 | (this.REG_SP & 0xff);
    return this.nes.mmap.load(this.REG_SP);
  }

  pageCrossed(addr1, addr2) {
    return (addr1 & 0xff00) !== (addr2 & 0xff00);
  }

  haltCycles(cycles) {
    this.cyclesToHalt += cycles;
  }

  doNonMaskableInterrupt(status) {
    if ((this.nes.mmap.load(0x2000) & 128) !== 0) {
      // Check whether VBlank Interrupts are enabled

      this.REG_PC_NEW++;
      this.push((this.REG_PC_NEW >> 8) & 0xff);
      this.push(this.REG_PC_NEW & 0xff);
      //this.F_INTERRUPT_NEW = 1;
      this.push(status);

      this.REG_PC_NEW =
        this.nes.mmap.load(0xfffa) | (this.nes.mmap.load(0xfffb) << 8);
      this.REG_PC_NEW--;
    }
  }

  doResetInterrupt() {
    this.REG_PC_NEW =
      this.nes.mmap.load(0xfffc) | (this.nes.mmap.load(0xfffd) << 8);
    this.REG_PC_NEW--;
  }

  doIrq(status) {
    this.REG_PC_NEW++;
    this.push((this.REG_PC_NEW >> 8) & 0xff);
    this.push(this.REG_PC_NEW & 0xff);
    this.push(status);
    this.F_INTERRUPT_NEW = 1;
    this.F_BRK_NEW = 0;

    this.REG_PC_NEW =
      this.nes.mmap.load(0xfffe) | (this.nes.mmap.load(0xffff) << 8);
    this.REG_PC_NEW--;
  }

  getStatus() {
    return (
      this.F_CARRY |
      (this.F_ZERO << 1) |
      (this.F_INTERRUPT << 2) |
      (this.F_DECIMAL << 3) |
      (this.F_BRK << 4) |
      (this.F_NOTUSED << 5) |
      (this.F_OVERFLOW << 6) |
      (this.F_SIGN << 7)
    );
  }

  setStatus(st) {
    this.F_CARRY = st & 1;
    this.F_ZERO = (st >> 1) & 1;
    this.F_INTERRUPT = (st >> 2) & 1;
    this.F_DECIMAL = (st >> 3) & 1;
    this.F_BRK = (st >> 4) & 1;
    this.F_NOTUSED = (st >> 5) & 1;
    this.F_OVERFLOW = (st >> 6) & 1;
    this.F_SIGN = (st >> 7) & 1;
  }
}


export default CPU;
