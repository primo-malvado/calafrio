//https://wiki.nesdev.com/w/index.php/NROM
/*
CPU $6000-$7FFF: Family Basic only: PRG RAM, mirrored as necessary to fill entire 8 KiB window, write protectable with an external switch
CPU $8000-$BFFF: First 16 KB of ROM.
CPU $C000-$FFFF: Last 16 KB of ROM (NROM-256) or mirror of $8000-$BFFF (NROM-128).
*/

/*
$0000-$07FF	$0800	2KB internal RAM
$0800-$0FFF	$0800	Mirrors of $0000-$07FF
$1000-$17FF	$0800
$1800-$1FFF	$0800
$2000-$2007	$0008	NES PPU registers
$2008-$3FFF	$1FF8	Mirrors of $2000-2007 (repeats every 8 bytes)
$4000-$4017	$0018	NES APU and I/O registers
$4018-$401F	$0008	APU and I/O functionality that is normally disabled. See CPU Test Mode.
$4020-$FFFF	$BFE0	Cartridge space: PRG ROM, PRG RAM, and mapper registers (See Note)

*/

/*
PPU
Size	Description
$0000-$0FFF	$1000	Pattern table 0
$1000-$1FFF	$1000	Pattern Table 1
$2000-$23FF	$0400	Nametable 0
$2400-$27FF	$0400	Nametable 1
$2800-$2BFF	$0400	Nametable 2
$2C00-$2FFF	$0400	Nametable 3
$3000-$3EFF	$0F00	Mirrors of $2000-$2EFF
$3F00-$3F1F	$0020	Palette RAM indexes
$3F20-$3FFF	$00E0	Mirrors of $3F00-$3F1F


*/

class Mapper00{


	constructor(a){
		this.ram = [];
		this.prgRam = [];
		this.prgRoms = [];
		this.chrRoms = [];

		this.firstRom;
		this.secondRom;

		this.PPUCTRL = 0; //	$2000	VPHB SINN	NMI enable (V), PPU master/slave (P), sprite height (H), background tile select (B), sprite tile select (S), increment mode (I), nametable select (NN)
		this.PPUMASK = 0; //	$2001	BGRs bMmG	color emphasis (BGR), sprite enable (s), background enable (b), sprite left column enable (M), background left column enable (m), greyscale (G)
		this.PPUSTATUS = 0; //	$2002	VSO- ----	vblank (V), sprite 0 hit (S), sprite overflow (O); read resets write pair for $2005/$2006
		this.OAMADDR = 0; //	$2003	aaaa aaaa	OAM read/write address
		this.OAMDATA = 0; //	$2004	dddd dddd	OAM data read/write
		this.PPUSCROLL = 0; //	$2005	xxxx xxxx	fine scroll position (two writes: X scroll, Y scroll)
		this.PPUADDR = 0; //	$2006	aaaa aaaa	PPU read/write address (two writes: most significant byte, least significant byte)
		this.PPUDATA = 0; //	$2007	dddd dddd	PPU data read/write
		this.OAMDMA = 0; //	$4014	aaaa aaaa	OAM DMA high address

		this.ppuAddress = 0;
		this.ppuMemory = [];

		this.data;


	if(!(a[0] == 78 && a[1] == 69 && a[2] == 83 && a[3] == 26 )){
		throw "not nes"
	}

	var pos;
	var PrgRomSize = a[4]; // *16384
	var PrgChrSize = a[5]; // *8192
	var flags6 = a[6];
	var flags7 = a[7];
	var flags8 = a[8];
	var flags9 = a[9];
	var flags10 = a[10];

	  this.data = {
		header: {
			mirroring: flags6  & 1,
			batterybacked : ((flags6  & 2) >> 1),
			trainer : ((flags6  & 4) >> 2),
			ignoremirroring : ((flags6  & 8) >> 3),

			mapperNumber : (flags7  & 0b11110000) + ((flags6  & 0b11110000) >> 4)
		},
		trainer: []
	};

	pos = 16;

	if(this.data.header.trainer){
		this.data.trainer = a.slice(pos, pos+512);
		pos = pos+512;
	}


	for(var i = 0; i < PrgRomSize; i++)
	{
		this.prgRoms.push(
			a.slice(pos, pos+16384)
		);

		pos = pos+16384;
	}
	for(var i = 0; i < PrgChrSize; i++)
	{
		this.chrRoms.push(
			a.slice(pos, pos+8192)
		);

		pos = pos+8192;
	}


	this.firstRom = this.prgRoms[0];
	if(PrgRomSize>1){

		this.secondRom = this.prgRoms[1];
	}else{
		this.secondRom = this.prgRoms[0];
	}





	}

	getCpuAddress(address){



		if(address == 0x4016){
			return 0b00000001;
		}

		else if(address == 0x4017){
			return 0b00000000;
		}

		else  if(address <=0x1fff){
			return this.ram[address % (0x07FF+1)] | 0;
		}
/*
$0000-$07FF	$0800	2KB internal RAM
$0800-$0FFF	$0800	Mirrors of $0000-$07FF
$1000-$17FF	$0800
$1800-$1FFF	$0800
*/

		else if(address >= 0x8000 && address <=0xBFFF){
			return this.firstRom[address-0x8000];
		}else if(address >= 0xc000 && address <=0xffff){
			return this.secondRom[address-0xc000];
		}else if(address == 0x2002){
			return this.PPUSTATUS;
		}else if(address == 0x2000){
			return this.PPUCTRL;
		}else{
			console.error("getCpuAddress", address.toString(16), this.ram[address]);
			return this.ram[address] | 0;
		}

	}

	setCpuAddress(address, value){
 
		if(address <=0x0100 && address >= 0x01ff){
			//stack
			
			return this.ram[address] = value;

		}else if(address >= 0x4000 && address <=0x4017){
			//$4000-$4017	$0018	NES APU and I/O registers
			//this.firstRom[address-0x8000] = value;
			console.error("APU", address.toString(16), value)
		}else if(address <=0x1FFF){

/*
$0000-$07FF	$0800	2KB internal RAM
$0800-$0FFF	$0800	Mirrors of $0000-$07FF
$1000-$17FF	$0800
$1800-$1FFF	$0800
*/


			
			return this.ram[address % (0x07FF+1)] = value;

		}else if(address >= 0x8000 && address <=0xBFFF){
			this.firstRom[address-0x8000] = value;
		}else if(address == 0x2000){
			this.PPUCTRL = value;

			this.baseNametableAddess = value & 0b11;
			this.VRAMaddressincrementPerCPU =( (value & 0b00000100)>>2 ) ? 32:1;
			this.SpritePatternTableAddress8x8 = ((value & 0b00001000)>>3) ? 0x1000 : 0x0000 ;
			this.BackgroundPatternTableAddress = ((value & 0b00010000)>>4) ?  0x1000 : 0x0000 ;


			this.SpriteSize = (value & 0b00100000)>>5; //(0: 8x8 pixels; 1: 8x16 pixels) = 
			this.PpuMasterSlaveSelect = (value & 0b01000000)>>6 ; //(0: read backdrop from EXT pins; 1: output color on EXT pins)
			this.GenerateNmiAtStartVerticalBlankingInterval = (value & 0b10000000)>>7;
			
 





		}else if(address == 0x2006){

			//console.error("PPUADDR", value.toString(16))

			this.ppuAddress = ((this.ppuAddress<<8)+value) & 0xffff;
			this.PPUADDR = value; 
		}else if(address == 0x2003){

			//console.error("OAMADDR", value.toString(16))

			//this.ppuAddress = ((this.ppuAddress<<8)+value) & 0xffff;
			this.OAMADDR = value; 
		}
		 else if(address == 0x2005){

			console.error("PPUSCROLL", value.toString(16))
			this.PPUSCROLL = value; 
		}
	
		else if(address == 0x2007){

			//console.error("PPUDATA", value.toString(16))
			//this.PPUDATA = value; 


			
			this.ppuMemory[this.ppuAddress] = value;

			this.ppuAddress += this.VRAMaddressincrementPerCPU;



		}


		 else if(address == 0x2001){

			console.error("PPUMASK",  value.toString(16))
			this.PPUMASK = value; 

			this.B = (value & 0b10000000)>>7;
			this.G = (value & 0b01000000)>>6;
			this.R = (value & 0b00100000)>>5;
			this.s = (value & 0b00010000)>>4;
			this.b = (value & 0b00001000)>>3;
			this.M = (value & 0b00000100)>>2;
			this.m = (value & 0b00000010)>>1;
			this.grey = (value & 0b00000001)>>0;

/*
7  bit  0
---- ----
BGRs bMmG
|||| ||||
|||| |||+- Greyscale (0: normal color, 1: produce a greyscale display)
|||| ||+-- 1: Show background in leftmost 8 pixels of screen, 0: Hide
|||| |+--- 1: Show sprites in leftmost 8 pixels of screen, 0: Hide
|||| +---- 1: Show background
|||+------ 1: Show sprites
||+------- Emphasize red
|+-------- Emphasize green
+--------- Emphasize blue
*/





		}else{ 
			throw "setCpuAddress "+ address;
		}

	}
	write(address, value){

	}

}