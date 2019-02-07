/*
0000 - 3fff Rom
4000 - 57ff Screen Memory
5800 5aff screen memory (color data)
5b00 5bff Printer buffer
5c00 5cbf System variables
5cc0 5cca Reserved
5ccb ff57 Availeable memory 
ff58 ffff Reserved

rom http://www.shadowmagic.org.uk/spectrum/roms.html

*/

import TzxParser from "./TzxParser";
 

window.mem

 
// --------------- Memory --------------
function Memory() {
    this.data = new Uint8Array(0xFFFF);
}

Memory.prototype.readByte = function(address) {
    return this.data[address];
}

Memory.prototype.readWord = function(address) {
    return ((this.readByte(address + 1) << 8) | this.readByte(address));
}

Memory.prototype.writeByte = function(address, data) {
    this.data[address] = data & 0xFF;
}

Memory.prototype.writeWord = function(address, data) {
    this.writeByte(address, data);
    this.writeByte(address + 1, data >> 8);
}

// --------------- IO -------------------
function IO() {}

IO.prototype.read = function(address) {
    return 0;
}

IO.prototype.write = function(address, data) {
    console.log(address, data);
}






function loadRom(){


  fetch("48.rom", {
    method: "get"
  })
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {


      var mem = new Memory();
      window.mem = mem;
      var io = new IO();
      mem.data = Array.from(new Uint8Array(arrayBuffer));


      window.z80 = Z80({
        mem_read: function (address){
          return mem.readByte(address);
        },
        mem_write: function (address, value){
          mem.writeByte(address, value);
        },
        io_read: function (port){
          io.read(port);
        },
        io_write: function (port, value){
          io.write(port, value)
        },
      }
  

      );


for(var i = 0; i< 660000; i++){
    z80.run_instruction();
}

draw(mem);




      loadGame("ChuckieEgg.tzx")
    });



}

var parser;

function loadGame(filename){
  fetch(filename, {
    method: "get"
  })
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {


      var data = Array.from(new Uint8Array(arrayBuffer));
      parser = new TzxParser(data);
      parser.parseAll();


 
      parser.blocks[2].tap.data.forEach(function(value, p){
        mem.data[0x5ccb+p] = value;

      });




      var run = 0x1EA1;
      //var run = 24394; // chuchy start

      var state = z80.getState();
      state.pc = run;

      z80.setState(state);





      for(var i = 0; i< 6600; i++){

          console.log(z80.getState().pc.toString(16));
          z80.run_instruction();
      }

      draw(mem);




      
    });
}


loadRom();

function draw(mem){


  var c = document.getElementById("zx-canvas");
  var ctx = c.getContext("2d");

  var id = ctx.createImageData(8, 1);

  var d  = id.data;                 

  for(var y = 0; y< 192; y++){

    var realY = (y&0b11000000) + ((y&0b00111000) >> 3 ) + ((y&0b00000111) << 3 )

    for(var x = 0; x< 32; x++){


 
      for(var px = 0; px< 8; px++){




         // 0x4000

          var pixel = ( (mem.data[0x4000 + y*32+x] >> (7-px )) &1 ) ? 0: 255;

          d[px*4+0]   = pixel;
          d[px*4+1]   = pixel;
          d[px*4+2]   = pixel;
          d[px*4+3]   = 255;
           


      }

      ctx.putImageData( id, x*8, realY );    
 
    }

  }
 
  console.log(0x4000 + y*32+x);


}


window.draw = draw;