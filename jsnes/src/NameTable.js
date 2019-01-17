export default class NameTable {
  constructor(width, height, name) {
    this.width = width;
    this.height = height;
    this.name = name;

    this.tile = new Array(width * height);
    this.attrib = new Array(width * height);
    for (var i = 0; i < width * height; i++) {
      this.tile[i] = 0;
      this.attrib[i] = 0;
    }
  }
  getTileIndex(x, y) {
    return this.tile[y * this.width + x];
  }

  getAttrib(x, y) {
    return this.attrib[y * this.width + x];
  }

  writeAttrib(index, value) {
    var basex = (index % 8) * 4;
    var basey = Math.floor(index / 8) * 4;
    var add;
    var tx, ty;
    var attindex;

    for (var sqy = 0; sqy < 2; sqy++) {
      for (var sqx = 0; sqx < 2; sqx++) {
        add = (value >> (2 * (sqy * 2 + sqx))) & 3;
        for (var y = 0; y < 2; y++) {
          for (var x = 0; x < 2; x++) {
            tx = basex + sqx * 2 + x;
            ty = basey + sqy * 2 + y;
            attindex = ty * this.width + tx;
            this.attrib[attindex] = (add << 2) & 12;
          }
        }
      }
    }
  }
}
