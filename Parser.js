
 
class Parser {
	constructor(data){
		this.data = data;
		this.pos = 0;
	}


	readString(len){
		var str = '';
		for(var i=0; i<len; i++){
			str += String.fromCharCode(this.readByte());
		}
		return str;
	}

	readByte (){
		return this.data[this.pos++];
	}

	readBytes(n){
		var bytes = new Array(n);
		for(var i=0; i<n; i++){
			bytes[i] = this.readByte();
		}
		return bytes;
	}


	tr2_room_staticmesh(){
/*
struct tr2_room_staticmesh  // 20 bytes
{
    uint32_t x, y, z;    // Absolute position in world coordinates
    uint16_t Rotation;
    uint16_t Intensity1;
    uint16_t Intensity2; // Absent in TR1
    uint16_t MeshID;     // Which StaticMesh item to draw
};

*/
		return {
			x: this.uint32_t(),
			y: this.uint32_t(),
			z: this.uint32_t(),
			Rotation: this.uint16_t(),
			Intensity1: this.uint16_t(),
			Intensity2: this.uint16_t(),
			MeshID: this.uint16_t(),
		}	



	}

	uint32_t(){
		var a = this.readBytes(4);
		
			return (a[3] << 24) + (a[2] << 14) +(a[1] << 8)+(a[0])
		
	}

	int32_t(){
		var a = this.readBytes(4);
		
			return (a[3] << 24) + (a[2] << 14) +(a[1] << 8)+(a[0])
		
	}
	int16_t(){
		var a = this.readBytes(2);
		return (a[1] << 8)+(a[0])
	}

	uint16_t(){
		var a = this.readBytes(2);
			return (a[1] << 8)+(a[0]);
	}
	uint8_t(){
		var a = this.readByte();
		return a;
	}

	int8_t(){
		var a = this.readByte();
		return a;
	}

	array(count, parserFunction){

		var l = [];
		for(var i = 0; i< count; i++){
		//	console.log(parserFunction)
			l.push(this[parserFunction]());
		}

		return l;
	}



	tr_colour(){
		return {
			Red: this.readByte(),
			Green: this.readByte(),
			Blue: this.readByte()
		}	
	}
 
	tr_colour4 ()
	{
		return {
			Red: this.readByte(),
			Green: this.readByte(),
			Blue: this.readByte(),
			Unused: this.readByte(),
		}	
	}
	tr_textile8 ()
	{
		return {
			Tile : this.readBytes(256 * 256),
		};

	}
	tr_textile16 ()
	{
		/*
		Each uint16_t represents a pixel whose colour is of the form ARGB, MSB-to-LSB:

		1-bit transparency (0 = transparent, 1 = opaque) (0x8000) 
		5-bit red channel (0x7C00) 
		5-bit green channel (0x03E0) 
		5-bit blue channel (0x001F)

		*/

		return {
			Tile : this.readBytes(2*256 * 256),
		};

	}
	tr_room_info ()
	{
 
		return {

		    x: this.int32_t(true),
		    z: this.int32_t(true),
		    yBottom: this.int32_t(true),
		    yTop: this.int32_t(true),
		}

	}	

	tr_vertex ()
	{
 /*
    int16_t x;
    int16_t y;
    int16_t z;
 */
		return {

		    x: this.int16_t(true),
		    y: this.int16_t(true),
		    z: this.int16_t(true),
		}

	}
	tr_room_portal ()
	{
 /*
struct tr_room_portal  // 32 bytes
{
    uint16_t  AdjoiningRoom; // Which room this portal leads to
    tr_vertex Normal;
    tr_vertex Vertices[4];
};
 */
		return {

		    AdjoiningRoom: this.uint16_t(true),
		    Normal: this.tr_vertex(),
		    Vertices: this.array(4, "tr_vertex")
     	}

	}



	tr_room_sector ()
	{
 /*
struct tr_room_sector // 8 bytes
{
    uint16_t FDindex;    // Index into FloorData[]
    uint16_t BoxIndex;   // Index into Boxes[] (-1 if none)
    uint8_t  RoomBelow;  // 255 is none
    int8_t   Floor;      // Absolute height of floor
    uint8_t  RoomAbove;  // 255 if none
    int8_t   Ceiling;    // Absolute height of ceiling
};
 */
		return {

		    FDindex: this.uint16_t(true),
		    BoxIndex: this.uint16_t(true),
		    RoomBelow: this.uint8_t(true),
		    Floor: this.int8_t(true),
		    RoomAbove: this.uint8_t(true),
		    Ceiling: this.int8_t(true),
     	}

	}

	tr2_room_light ()
	{
 /*
 struct tr2_room_light   // 24 bytes
{
     int32_t x, y, z;       // Position of light, in world coordinates
    uint16_t Intensity1;    // Light intensity
    uint16_t Intensity2;    // Only in TR2
    uint32_t Fade1;         // Falloff value
    uint32_t Fade2;         // Only in TR2
};
 */
		return {

		    x: this.int32_t(true),
		    y: this.int32_t(true),
		    z: this.int32_t(true),
		    Intensity1: this.uint16_t(true),
		    Intensity2: this.uint16_t(true),
		    Fade1: this.uint32_t(true),
		    Fade2: this.uint32_t(true),
     	}

	}
	tr2_room_vertex ()
	{
 /*
struct tr2_room_vertex  // 12 bytes
{
     tr_vertex Vertex;
       int16_t Lighting;
      uint16_t Attributes; // A set of flags for special rendering effects
       int16_t Lighting2;  // Almost always equal to Lighting1
};
 */
		return {

		    Vertex: this.tr_vertex(true),
		    Lighting: this.int16_t(true),
		    Attributes: this.uint16_t(true),
		    Lighting2: this.int16_t(true),
     	}

	}
	tr_face4 ()
	{
 /*
struct tr_face4    // 12 bytes
{
    uint16_t Vertices[4];
    uint16_t Texture;
};
 */
		return {

		    Vertices: this.array(4, "uint16_t"),
		    Texture: this.uint16_t(true),
     	}

	}	

	tr_face3 ()
	{
 /*
struct tr_face3    // 8 bytes
{
    uint16_t Vertices[3];
    uint16_t Texture;
};
 */
		return {

		    Vertices: this.array(3, "uint16_t"),
		    Texture: this.uint16_t(true),
     	}

	}



	tr_room_data ()
	{
 /*
virtual struct tr_room_data    // (variable length)
{
    int16_t NumVertices;                   // Number of vertices in the following list
    tr2_room_vertex Vertices[NumVertices]; // List of vertices (relative coordinates)

    int16_t NumRectangles;                 // Number of textured rectangles
    tr_face4 Rectangles[NumRectangles];    // List of textured rectangles

    int16_t NumTriangles;                  // Number of textured triangles
    tr_face3 Triangles[NumTriangles];      // List of textured triangles

    int16_t NumSprites;                    // Number of sprites
    tr_room_sprite Sprites[NumSprites];    // List of sprites
};
 */
 		var roomdata = {};
 		roomdata.NumVertices = this.int16_t(true);
 		roomdata.Vertices = this.array(roomdata.NumVertices, "tr2_room_vertex");

 		roomdata.NumRectangles = this.int16_t(true);
 		roomdata.Rectangles = this.array(roomdata.NumRectangles, "tr_face4");
 		
 		roomdata.NumTriangles = this.int16_t(true);
 		roomdata.Triangles = this.array(roomdata.NumTriangles, "tr_face3");

 		roomdata.NumSprites = this.int16_t(true);
 		roomdata.Sprites = this.array(roomdata.NumSprites, "tr_room_sprite");


 		return roomdata;
	}
 


	tr2_room ()
	{

		var room =  {};
		
		//tr_room_info info;           // Where the room exists, in world coordinates
		room.info= this.tr_room_info();
		
		//uint32_t NumDataWords;       // Number of data words (uint16_t's)
		room.NumDataWords = this.uint32_t(true);
		var end = this.pos+2*room.NumDataWords;
 
		room.RoomData = [];
		while(this.pos < end){
			room.RoomData.push(this.tr_room_data());
		}

 
		

		//uint16_t Data[NumDataWords]; // The raw data from which the rest of this is derived
		//room.Data = this.array(room.NumDataWords , "uint16_t");

		//tr_room_data RoomData;       // The room mesh


		//uint16_t NumPortals;                 // Number of visibility portals to other rooms
		room.NumPortals = this.uint16_t(true);
		//tr_room_portal Portals[NumPortals];  // List of visibility portals
		room.Portals = this.array(room.NumPortals , "tr_room_portal");

		//uint16_t NumZsectors;                                  // ``Width'' of sector list
		room.NumZsectors = this.uint16_t(true);
		
		//uint16_t NumXsectors;                                  // ``Height'' of sector list
		room.NumXsectors = this.uint16_t(true);

		//tr_room_sector SectorList[NumXsectors * NumZsectors];  // List of sectors in this room
		room.SectorList = this.array(room.NumZsectors* room.NumXsectors, "tr_room_sector");

		//int16_t AmbientIntensity;
		room.AmbientIntensity = this.int16_t(true);

		//int16_t AmbientIntensity2;  // Usually the same as AmbientIntensity
		room.AmbientIntensity2 = this.int16_t(true);

		//int16_t LightMode;
		room.LightMode = this.int16_t(true);

		//uint16_t NumLights;                 // Number of point lights in this room
		room.NumLights = this.uint16_t(true);


		
		//tr_room_light Lights[NumLights];    // List of point lights
		room.Lights = this.array(room.NumLights, "tr2_room_light");

		//uint16_t NumStaticMeshes;                            // Number of static meshes
		room.NumStaticMeshes = this.uint16_t(true);

		//tr_room_staticmesh StaticMeshes[NumStaticMeshes];   // List of static meshes
		room.StaticMeshes = this.array(room.NumStaticMeshes, "tr2_room_staticmesh");

		//int16_t AlternateRoom;
		room.AlternateRoom = this.int16_t(true);
		//int16_t Flags;
		room.Flags = this.int16_t(true);

		return room;
	}



}
 
