
class Parser {
    constructor(data) {
        this.dv = new DataView(data)
        this.pos = 0;
    }

/*
    readString(len) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(this.uint8_t());
        }
        return str;
    }

    uint8_t() {
        var r = this.dv.getUint8(this.pos);
        this.pos++;
        return r;
    }

    readBytes(n) {
        return this.array(n, "uint8_t");
    }

*/
    tr2_room_staticmesh() { //20
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

    uint32_t() {

        var a = this.dv.getUint32(this.pos, true);
        this.pos +=4;

        return a

    }

    int32_t(){
        var a = this.dv.getInt32(this.pos, true);
        this.pos +=4;
        return a
    }

    int16_t() { 
        var a = this.dv.getInt16(this.pos, true);
        this.pos +=2;

        return a

    }

    uint16_t() {
        var a = this.dv.getUint16(this.pos, true);
        this.pos +=2;
        return a
    }

    uint8_t() {
        var a = this.dv.getUint8(this.pos, true);
        this.pos +=1;
        return a
    }

    int8_t() {
        var a = this.dv.getInt8(this.pos, true);
        this.pos +=1;

        return a
    }

    array(count, parserFunction) {

        var l = [];
        for (var i = 0; i < count; i++) {
            //	console.log(parserFunction)
            l.push(this[parserFunction]());
        }


 

        return l;
    }



    tr_colour() { //3
        return {
            Red: this.uint8_t(),
            Green: this.uint8_t(),
            Blue: this.uint8_t()
        }
    }

    tr_colour4() { //4
        return {
            Red: this.uint8_t(),
            Green: this.uint8_t(),
            Blue: this.uint8_t(),
            Unused: this.uint8_t(),
        }
    }
    tr_textile8() {
        return {
            Tile: this.array(256 * 256, "uint8_t"),
        };

    }
    tr_textile16() {
        /*
        Each uint16_t represents a pixel whose colour is of the form ARGB, MSB-to-LSB:

        1-bit transparency (0 = transparent, 1 = opaque) (0x8000) 
        5-bit red channel (0x7C00) 
        5-bit green channel (0x03E0) 
        5-bit blue channel (0x001F)

        */

        var l = this.array(256 * 256, "uint16_t");


        var cores = l.map(function(color){

            var b = (color & 31) << 3;
            color = color >> 5;
            
            var g = (color & 31) << 3;
            color = color >>  5;

            var r = (color & 31) << 3;
            color = color >>  5;
            
            var transparent = color;

            return {
                r: r,
                g: g,
                b: b,
                t: transparent
            }


        })

        return cores;
        //36931 & 7


        return {
            Tile: this.array(256 * 256, "uint16_t"),
        };

    }
    tr_room_info() {

        return {

            x: this.int32_t(true),
            z: this.int32_t(true),
            yBottom: this.int32_t(true),
            yTop: this.int32_t(true),
        }

    }

    tr_vertex() {
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
    tr_room_portal() {
        /*
struct tr_room_portal  // 32 bytes
{
    uint16_t  AdjoiningRoom; // Which room this portal leads to
    tr_vertex Normal;
    tr_vertex Vertices[4];
};
 */

        var start = this.pos; 


        var portal =  {

            AdjoiningRoom: this.uint16_t(true),
            Normal: this.tr_vertex(),
            Vertices: this.array(4, "tr_vertex")
        }

        if( (this.pos - start ) % 4 != 0)
        {
            console.error("tr_room_portal");
        }

        return portal;

    }

    tr_mesh() {
        /*
virtual struct tr_mesh // (variable length)
{
    tr_vertex Centre;
      int32_t CollRadius;

      int16_t NumVertices;           // Number of vertices in this mesh
    tr_vertex Vertices[NumVertices]; // List of vertices (relative coordinates)

      int16_t NumNormals;

  if(NumNormals > 0)
    tr_vertex Normals[NumNormals];
  else
      int16_t Lights[abs(NumNormals)];

     int16_t NumTexturedRectangles; // number of textured rectangles in this mesh
    tr_face4 TexturedRectangles[NumTexturedRectangles]; // list of textured rectangles

     int16_t NumTexturedTriangles;  // number of textured triangles in this mesh
    tr_face3 TexturedTriangles[NumTexturedTriangles]; // list of textured triangles

     int16_t NumColouredRectangles; // number of coloured rectangles in this mesh
    tr_face4 ColouredRectangles[NumColouredRectangles]; // list of coloured rectangles

     int16_t NumColouredTriangles; // number of coloured triangles in this mesh
    tr_face3 ColouredTriangles[NumColouredTriangles]; // list of coloured triangles
};
 */


 
 



        var mesh =  { };

        mesh.Centre = this.tr_vertex(true);
        mesh.CollRadius = this.int32_t(true);
        mesh.NumVertices = this.int16_t(true);

        mesh.Vertices  = this.array(mesh.NumVertices, "tr_vertex");
        mesh.NumNormals  = this.int16_t();

        if(mesh.NumNormals > 0){
            mesh.Normals  = this.array(mesh.NumNormals, "tr_vertex");
        }else{

            //debugger;
            mesh.Lights  = this.array(-mesh.NumNormals, "int16_t");
        }
        if(mesh.Vertices == 0){

            debugger;
            
        }

        mesh.NumTexturedRectangles  = this.int16_t();
        mesh.TexturedRectangles  = this.array(mesh.NumTexturedRectangles, "tr_face4");

        mesh.NumTexturedTriangles  = this.int16_t();
        mesh.TexturedTriangles  = this.array(mesh.NumTexturedTriangles, "tr_face3");

        mesh.NumColouredRectangles  = this.int16_t();
        mesh.ColouredRectangles  = this.array(mesh.NumColouredRectangles, "tr_face4");

        mesh.NumColouredTriangles  = this.int16_t();
        mesh.ColouredTriangles  = this.array(mesh.NumColouredTriangles, "tr_face3");

 
        return mesh;
    }



    tr_room_sector() {
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

    tr2_room_light() {
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
    tr2_room_vertex() {
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

tr_sound_source() {
/*
struct tr_sound_source // 16 bytes
{
     int32_t x;         // absolute X position of sound source (world coordinates)
     int32_t y;         // absolute Y position of sound source (world coordinates)
     int32_t z;         // absolute Z position of sound source (world coordinates)
    uint16_t SoundID;   // internal sound index
    uint16_t Flags;     // 0x40, 0x80, or 0xC0
};
 */
        return {

            x: this.int32_t(),
            y: this.int32_t(),
            z: this.int32_t(),
            SoundID: this.uint16_t(),
            Flags: this.uint16_t(),
        }

    } 

tr2_box() {
/*
struct tr2_box   // 8 bytes
{
    uint8_t Zmin;          // Horizontal dimensions in sectors
    uint8_t Zmax;
    uint8_t Xmin;
    uint8_t Xmax;
    int16_t TrueFloor;     // Height value in global units
    int16_t OverlapIndex;  // Index into Overlaps[] (same as tr_box?)
};
 */
        return {

            Zmin: this.uint8_t(),
            Zmax: this.uint8_t(),
            Xmin: this.uint8_t(),
            Xmax: this.uint8_t(),
            TrueFloor: this.int16_t(),
            OverlapIndex: this.int16_t(),
        }

    }

tr2_entity() {
/*
struct tr2_entity // 24 bytes
{
    int16_t TypeID;
    int16_t Room;
    int32_t x;
    int32_t y;
    int32_t z;
    int16_t Angle;
    int16_t Intensity1;
    int16_t Intensity2; // Like Intensity1, and almost always with the same value.
    uint16_t Flags;
};

 */
        return {

            TypeID: this.int16_t(),
            Room: this.int16_t(),
            x: this.int32_t(),
            y: this.int32_t(),
            z: this.int32_t(),
            Angle: this.int16_t(),
            Intensity1: this.int16_t(),
            Intensity2: this.int16_t(),
            Flags: this.uint16_t(),
        }

    } 

tr_cinematic_frame() {
/*
struct tr_cinematic_frame // 16 bytes
{
    int16_t rotY;    // rotation about Y axis, +/- 32767 == +/- 180 degrees
    int16_t rotZ;    // rotation about Z axis, +/- 32767 == +/- 180 degrees
    int16_t rotZ2;   // seems to work a lot like rotZ;  I haven't yet been able to
                     // differentiate them
    int16_t posZ;    // camera position relative to something (target? Lara? room
                     // origin?).  pos* are _not_ in world coordinates.
    int16_t posY;    // camera position relative to something (see posZ)
    int16_t posX;    // camera position relative to something (see posZ)
    int16_t unknown; // changing this can cause a runtime error
    int16_t rotX;    // rotation about X axis, +/- 32767 == +/- 180 degrees
};

 */
        return {

            rotY: this.int16_t(),
            rotZ: this.int16_t(),
            rotZ2: this.int16_t(),
            posZ: this.int16_t(),
            posY: this.int16_t(),
            posX: this.int16_t(),
            unknown: this.int16_t(),
            rotX: this.int16_t(), 
        }

    } 

tr_sound_details() {
/*
struct tr_sound_details // 8 bytes
{
   uint16_t Sample; // (index into SampleIndices)
   uint16_t Volume;
   uint16_t Chance; // If !=0 and ((rand()&0x7fff) > Chance), this sound is not played
   uint16_t Characteristics;
};

 */
        return {

            Sample: this.uint16_t(),
            Volume: this.uint16_t(),
            Chance: this.uint16_t(),
            Characteristics: this.uint16_t(),
        }

    } 


   tr_animation() {

        var anim =  {};

        anim.FrameOffset= this.uint32_t(true);
        anim.FrameRate= this.uint8_t(true);
        anim.FrameSize= this.uint8_t(true);
        anim.State_ID= this.uint16_t(true);
        
        anim.unknown= this.int16_t(true);
        
        anim.Speed =  this.int16_t(true);
        anim.accelLo= this.uint16_t(true);
        anim.accelHi= this.int16_t(true);

        anim.FrameStart= this.uint16_t(true);
        anim.FrameEnd= this.uint16_t(true);
        anim.NextAnimation= this.uint16_t(true);
        anim.NextFrame= this.uint16_t(true);

        anim.NumStateChanges= this.uint16_t(true);
        anim.StateChangeOffset= this.uint16_t(true);

        anim.NumAnimCommands= this.uint16_t(true);
        anim.AnimCommand= this.uint16_t(true);


 
        return anim;

    }
   tr_state_change() {

/*
    uint16_t StateID;
    uint16_t NumAnimDispatches; // number of ranges (seems to always be 1..5)
    uint16_t AnimDispatch;      // Offset into AnimDispatches[]
*/

        var x =  {};

        x.StateID= this.uint16_t(true);
        x.NumAnimDispatches= this.uint16_t(true);
        x.AnimDispatch= this.uint16_t(true); 
        return x;

    } 

    tr_anim_dispatch() {

/*
    int16_t Low;           // Lowest frame that uses this range
    int16_t High;          // Highest frame that uses this range
    int16_t NextAnimation; // Animation to dispatch to
    int16_t NextFrame;     // Frame offset to dispatch to
*/

        var x =  {};

        x.Low= this.int16_t(true);
        x.High= this.int16_t(true);
        x.NextAnimation= this.int16_t(true); 
        x.NextFrame= this.int16_t(true); 
        return x;

    }


    tr_face4() {
        return {

            Vertices: this.array(4, "uint16_t"),
            Texture: this.uint16_t(true),
        }

    }

    tr_face3() {
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



    tr_room_data() {
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


    tr_anim_command() {
        /*
struct tr_anim_command // 2 bytes
{
    int16_t Value;
};
 */
        var tr_anim_command = {};
        tr_anim_command.Value = this.int16_t(true); 


        return tr_anim_command;
    }


    tr_object_texture_vert() {
        /*
struct tr_object_texture_vert // 4 bytes
{
    uint8_t Xcoordinate; // 1 if Xpixel is the low value, 255 if Xpixel is the high value in the object texture
    uint8_t Xpixel;
    uint8_t Ycoordinate; // 1 if Ypixel is the low value, 255 if Ypixel is the high value in the object texture
    uint8_t Ypixel;
}; 
 */
        var x = {};
        x.Xcoordinate = this.uint8_t(true); 
        x.Xpixel = this.uint8_t(true); 
        x.Ycoordinate = this.uint8_t(true); 
        x.Ypixel = this.uint8_t(true); 


        return x;
    }









    tr_object_texture() {
        /*
struct tr_object_texture  // 20 bytes
{
    uint16_t Attribute;
    uint16_t TileAndFlag;
    tr_object_texture_vert Vertices[4]; // The four corners of the texture
};
 */
        var x = {};
        x.Attribute = this.uint16_t(true); 
        x.TileAndFlag = this.uint16_t(true); 
        x.Vertices = this.array(4, "tr_object_texture_vert"); 


        return x;
    }


    tr_sprite_texture() {
        /*
struct tr_sprite_texture   // 16 bytes
{
    uint16_t Tile;
     uint8_t x;
     uint8_t y;
    uint16_t Width;        // (ActualWidth  * 256) + 255
    uint16_t Height;       // (ActualHeight * 256) + 255
     int16_t LeftSide;
     int16_t TopSide;
     int16_t RightSide;
     int16_t BottomSide;
};
 */
        var x = {};
        x.Tile = this.uint16_t(true); 
        x.x = this.uint8_t(true); 
        x.y = this.uint8_t(true); 
        x.Width = this.uint16_t(true); 
        x.Height = this.uint16_t(true); 
        x.LeftSide = this.int16_t(true); 
        x.TopSide = this.int16_t(true); 
        x.RightSide = this.int16_t(true); 
        x.BottomSide = this.int16_t(true); 

        return x;
    }



tr_bounding_box() {
/*
struct tr_bounding_box // 12 bytes
{
    int16_t MinX, MaxX, MinY, MaxY, MinZ, MaxZ;
};
 */
        var x = {};
        x.MinX = this.int16_t(); 
        x.MaxX = this.int16_t(); 
        x.MinY = this.int16_t(); 
        x.MaxY = this.int16_t(); 
        x.MinZ = this.int16_t(); 
        x.MaxZ = this.int16_t(); 


        return x;
    }

tr_staticmesh() {
/*
struct tr_staticmesh   // 32 bytes
{
    uint32_t        ID;   // Static Mesh Identifier
    uint16_t        Mesh; // Mesh (offset into MeshPointers[])
    tr_bounding_box VisibilityBox;
    tr_bounding_box CollisionBox;
    uint16_t        Flags;
};
 */
        var x = {};
        x.ID = this.uint32_t(); 
        x.Mesh = this.uint16_t(); 
        x.VisibilityBox = this.tr_bounding_box(); 
        x.CollisionBox = this.tr_bounding_box(); 
        x.Flags = this.uint16_t(); 


        return x;
    }

    tr_meshtree_node() {


        var conf = this.int32_t(true);
        return conf;
        /*
struct tr_meshtree_node // 4 bytes
{
    uint32_t Flags;
     int32_t Offset_X;
     int32_t Offset_Y;
     int32_t Offset_Z;
};
 */


        var x = {};
        x.Flags = this.uint32_t(true); 
        x.Offset_X = this.int32_t(true); 
        x.Offset_Y = this.int32_t(true); 
        x.Offset_Z = this.int32_t(true); 
        
        return x;
    }


    tr_sprite_sequence() {
 
        /*
struct tr_sprite_sequence  // 8 bytes
{
    int32_t SpriteID;       // Sprite identifier
    int16_t NegativeLength; // Negative of ``how many sprites are in this sequence''
    int16_t Offset;         // Where (in sprite texture list) this sequence starts
};
 */


        var x = {};
        x.SpriteID = this.int32_t(); 
        x.NegativeLength = this.int16_t(); 
        x.Offset = this.int16_t();  
        
        return x;
    }

    tr_camera() {
 
        /*
struct tr_camera // 16 bytes
{
    int32_t x;
    int32_t y;
    int32_t z;
    int16_t Room;
   uint16_t Flag;
};
 */


        var x = {};
        x.x = this.int32_t(); 
        x.y = this.int32_t(); 
        x.z = this.int32_t();  
        x.Room = this.int16_t();  
        x.Flag = this.uint16_t();  
        
        return x;
    }






    tr_model() {

 
        /*
struct tr_model  // 18 bytes
{
    uint32_t ID;           // Type Identifier (matched in Entities[])
    uint16_t NumMeshes;    // Number of meshes in this object
    uint16_t StartingMesh; // Stating mesh (offset into MeshPointers[])
    uint32_t MeshTree;     // Offset into MeshTree[]
    uint32_t FrameOffset;  // Byte offset into Frames[] (divide by 2 for Frames[i])
    uint16_t Animation;    // Offset into Animations[]
};
 */


        var x = {};
        x.ID = this.uint32_t(true); 
        x.NumMeshes = this.uint16_t(true); 
        x.StartingMesh = this.uint16_t(true); 
        x.MeshTree = this.uint32_t(true); 
        x.FrameOffset = this.uint32_t(true); 
        x.Animation = this.uint16_t(true); 
        
        return x;
    }



    tr2_room() {
 
        var room = {};

        //tr_room_info info;           // Where the room exists, in world coordinates
        room.info = this.tr_room_info();

        //uint32_t NumDataWords;       // Number of data words (uint16_t's)
        room.NumDataWords = this.uint32_t(true);
        var end = this.pos + 2 * room.NumDataWords;

        room.RoomData = [];
        while (this.pos < end) {
            room.RoomData.push(this.tr_room_data());
        }




        //uint16_t Data[NumDataWords]; // The raw data from which the rest of this is derived
        //room.Data = this.array(room.NumDataWords , "uint16_t");

        //tr_room_data RoomData;       // The room mesh


        //uint16_t NumPortals;                 // Number of visibility portals to other rooms
        room.NumPortals = this.uint16_t(true);
        //tr_room_portal Portals[NumPortals];  // List of visibility portals
        room.Portals = this.array(room.NumPortals, "tr_room_portal");

        //uint16_t NumZsectors;                                  // ``Width'' of sector list
        room.NumZsectors = this.uint16_t(true);

        //uint16_t NumXsectors;                                  // ``Height'' of sector list
        room.NumXsectors = this.uint16_t(true);

        //tr_room_sector SectorList[NumXsectors * NumZsectors];  // List of sectors in this room
        room.SectorList = this.array(room.NumZsectors * room.NumXsectors, "tr_room_sector");

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




function loadLevel(buffer) {


    //var data = new Uint8Array(buffer);
    parser = new Parser(buffer);


    var schema = { };
    //uint32_t Version; // version (4 bytes)
    schema.Version = parser.uint32_t(true);
    //tr_colour Palette[256]; // 8-bit palette (768 bytes)
    schema.Palette = parser.array(256, "tr_colour");
    //tr_colour4 Palette16[256]; //  (1024 bytes)
    schema.Palette16 = parser.array(256, "tr_colour4");
    //uint32_t NumTextiles; // number of texture tiles (4 bytes)
    schema.NumTextiles = parser.uint32_t(true);

    
    //tr_textile8 Textile8[NumTextiles]; // 8-bit (palettized) textiles (NumTextiles * 65536 bytes)
    schema.Textile8 = parser.array(schema.NumTextiles, "tr_textile8");


    //tr_textile16 Textile16[NumTextiles]; // 16-bit (ARGB) textiles (NumTextiles * 131072 bytes)
    schema.Textile16 = parser.array(schema.NumTextiles, "tr_textile16");

    //uint32_t Unused; // 32-bit unused value (4 bytes)
    schema.Unused = parser.uint32_t(true);

    //uint16_t NumRooms; // number of rooms (2 bytes)
    schema.NumRooms = parser.uint16_t(true);
    //schema.NumRooms = 3;

    //tr2_room Rooms[NumRooms]; // room list (variable length)
    schema.Rooms = parser.array(schema.NumRooms, "tr2_room");

    
    //uint32_t NumFloorData; // number of floor data uint16_t's to follow (4 bytes)
    schema.NumFloorData = parser.uint32_t(true);
     
    //uint16_t FloorData[NumFloorData]; // floor data (NumFloorData * 2 bytes)
    schema.FloorData = parser.array(schema.NumFloorData, "uint16_t");
 

    //uint32_t NumMeshData; // number of uint16_t's of mesh data to follow (=Meshes[]) (4 bytes)
    schema.NumMeshData = parser.uint32_t(true);

    var start = parser.pos;



    parser.pos += schema.NumMeshData*2;
    //uint32_t NumMeshPointers; // number of mesh pointers to follow (4 bytes)
    schema.NumMeshPointers = parser.uint32_t(true);


    //uint32_t MeshPointers[NumMeshPointers]; // mesh pointer list (NumMeshPointers * 4 bytes)
    schema.MeshPointers = parser.array(schema.NumMeshPointers, "uint32_t");

    var pos2 = parser.pos;


    


    
 
 
    //tr_mesh Meshes[NumMeshPointers]; // note that NumMeshPointers comes AFTER Meshes[]
    schema.Meshes = [];
    for(var i = 0; i<  schema.NumMeshPointers ; i++) {

        parser.pos = start+schema.MeshPointers[i];

        schema.Meshes.push(parser.tr_mesh());
    }

 

    //tr_mesh Meshes[NumMeshPointers]; // note that NumMeshPointers comes AFTER Meshes[]
   // schema.Meshes = parser.array(schema.NumMeshData, "uint16_t");


    //uint32_t NumMeshPointers; // number of mesh pointers to follow (4 bytes)
    //schema.NumMeshPointers = parser.uint32_t(true);

    //uint32_t MeshPointers[NumMeshPointers]; // mesh pointer list (NumMeshPointers * 4 bytes)
    //schema.MeshPointers = parser.array(schema.NumMeshPointers, "uint32_t");



    parser.pos =  pos2;



    
    //uint32_t NumAnimations; // number of animations to follow (4 bytes)
    schema.NumAnimations = parser.uint32_t(true);

    //tr_animation Animations[NumAnimations]; // animation list (NumAnimations * 32 bytes)
    schema.Animations = parser.array(schema.NumAnimations, "tr_animation");

    //uint32_t NumStateChanges; // number of state changes to follow (4 bytes)
    schema.NumStateChanges = parser.uint32_t(true);

    //tr_state_change StateChanges[NumStateChanges]; // state-change list (NumStructures * 6 bytes)
    schema.StateChanges = parser.array(schema.NumStateChanges, "tr_state_change");
    
    //uint32_t NumAnimDispatches; // number of animation dispatches to follow (4 bytes)
    schema.NumAnimDispatches = parser.uint32_t(true);

    //tr_anim_dispatch AnimDispatches[NumAnimDispatches]; // animation-dispatch list list (NumAnimDispatches * 8 bytes)
    schema.AnimDispatches = parser.array(schema.NumAnimDispatches, "tr_anim_dispatch");
    

    //uint32_t NumAnimCommands; // number of animation commands to follow (4 bytes)
    schema.NumAnimCommands = parser.uint32_t(true);

    //tr_anim_command AnimCommands[NumAnimCommands]; // animation-command list (NumAnimCommands * 2 bytes)
    schema.AnimCommands = parser.array(schema.NumAnimCommands, "tr_anim_command");



    //uint32_t NumMeshTrees; // number of MeshTrees to follow (4 bytes)
    schema.NumMeshTrees = parser.uint32_t(true);

    //tr_meshtree_node MeshTrees[NumMeshTrees]; // MeshTree list (NumMeshTrees * 4 bytes)
    schema.MeshTrees = parser.array(schema.NumMeshTrees, "tr_meshtree_node");



    //uint32_t NumFrames; // number of words of frame data to follow (4 bytes)
    schema.NumFrames = parser.uint32_t();


    //uint16_t Frames[NumFrames]; // frame data (NumFrames * 2 bytes)
    schema.Frames = parser.array(schema.NumFrames, "uint16_t");

    
    //uint32_t NumModels; // number of models to follow (4 bytes)
    schema.NumModels = parser.uint32_t();

    //tr_model Models[NumModels]; // model list (NumModels * 18 bytes)
    schema.Models = parser.array(schema.NumModels, "tr_model");

    //uint32_t NumStaticMeshes; // number of StaticMesh data records to follow (4 bytes)
    schema.NumStaticMeshes = parser.uint32_t();

    //tr_staticmesh StaticMeshes[NumStaticMeshes]; // StaticMesh data (NumStaticMesh * 32 bytes)
    schema.StaticMeshes = parser.array(schema.NumStaticMeshes, "tr_staticmesh");
    
    //uint32_t NumObjectTextures; // number of object textures to follow (4 bytes)
    schema.NumObjectTextures = parser.uint32_t();

    //tr_object_texture ObjectTextures[NumObjectTextures]; // object texture list (NumObjectTextures * 20 bytes) (after AnimatedTextures in TR3)
     schema.ObjectTextures = parser.array(schema.NumObjectTextures, "tr_object_texture");

    //uint32_t NumSpriteTextures; // number of sprite textures to follow (4 bytes)
    schema.NumSpriteTextures = parser.uint32_t();

    //tr_sprite_texture SpriteTextures[NumSpriteTextures]; // sprite texture list (NumSpriteTextures * 16 bytes)
    schema.SpriteTextures = parser.array(schema.NumSpriteTextures, "tr_sprite_texture");
    
    //uint32_t NumSpriteSequences; // number of sprite sequences records to follow (4 bytes)
    schema.NumSpriteSequences = parser.uint32_t();

    //tr_sprite_sequence SpriteSequences[NumSpriteSequences]; // sprite sequence data (NumSpriteSequences * 8 bytes)
    schema.SpriteSequences = parser.array(schema.NumSpriteSequences, "tr_sprite_sequence");

    
    //uint32_t NumCameras; // number of camera data records to follow (4 bytes)
    schema.NumCameras = parser.uint32_t();

    //tr_camera Cameras[NumCameras]; // camera data (NumCameras * 16 bytes)
    schema.Cameras = parser.array(schema.NumCameras, "tr_camera");
    
    //uint32_t NumSoundSources; // number of sound source data records to follow (4 bytes)
    schema.NumSoundSources = parser.uint32_t();

    //tr_sound_source SoundSources[NumSoundSources]; // sound source data (NumSoundSources * 16 bytes)
    schema.SoundSources = parser.array(schema.NumSoundSources, "tr_sound_source");
    
    //uint32_t NumBoxes; // number of box data records to follow (4 bytes)
    schema.NumBoxes = parser.uint32_t();


    //tr2_box Boxes[NumBoxes]; // box data (NumBoxes * 8 bytes)
    schema.Boxes = parser.array(schema.NumBoxes, "tr2_box");
    
    //uint32_t NumOverlaps; // number of overlap records to follow (4 bytes)
    schema.NumOverlaps = parser.uint32_t();


    //uint16_t Overlaps[NumOverlaps]; // overlap data (NumOverlaps * 2 bytes)
    schema.Overlaps = parser.array(schema.NumOverlaps, "uint16_t");
    
    //int16_t Zones[10*NumBoxes]; // zone data (NumBoxes * 20 bytes)
    schema.Zones = parser.array(10*schema.NumBoxes, "int16_t");

    
    //uint32_t NumAnimatedTextures; // number of animated texture records to follow (4 bytes)
    schema.NumAnimatedTextures = parser.uint32_t();


    //uint16_t AnimatedTextures[NumAnimatedTextures]; // animated texture data (NumAnimatedTextures * 2 bytes)
    schema.AnimatedTextures = parser.array(schema.NumAnimatedTextures, "uint16_t");

    
    //uint32_t NumEntities; // number of entities to follow (4 bytes)
    schema.NumEntities = parser.uint32_t();


    //tr2_entity Entities[NumEntities]; // entity list (NumEntities * 24 bytes)
    schema.Entities = parser.array(schema.NumEntities, "tr2_entity");

    
    //uint8_t LightMap[32 * 256]; // light map (8192 bytes)
    schema.LightMap = parser.array(32 * 256, "uint8_t");

    
    //uint16_t NumCinematicFrames; // number of cinematic frame records to follow (2 bytes)
    schema.NumCinematicFrames = parser.uint16_t();

    
    //tr_cinematic_frame CinematicFrames[NumCinematicFrames]; // (NumCinematicFrames * 16 bytes)
    schema.CinematicFrames = parser.array(schema.NumCinematicFrames, "tr_cinematic_frame");    
    
    //uint16_t NumDemoData; // number of demo data records to follow (2 bytes)
    schema.NumDemoData = parser.uint16_t();

    
    //uint8_t DemoData[NumDemoData]; // demo data (NumDemoData bytes)
    schema.DemoData = parser.array(schema.NumDemoData, "uint8_t");    

    
    //int16_t SoundMap[370]; // sound map (740 bytes)
    schema.SoundMap = parser.array(370, "int16_t");    


    
    //uint32_t NumSoundDetails; // number of sound-detail records to follow (4 bytes)
    schema.NumSoundDetails = parser.uint32_t();

    //tr_sound_details SoundDetails[NumSoundDetails]; // sound-detail list (NumSoundDetails * 8 bytes)
    schema.SoundDetails = parser.array(schema.NumSoundDetails, "tr_sound_details"); 

    //uint32_t NumSampleIndices; // number of sample indices to follow (4 bytes)
    schema.NumSampleIndices = parser.uint32_t();

    //uint32_t SampleIndices[NumSampleIndices]; // sample indices (NumSampleIndices * 4 bytes)
    schema.SampleIndices = parser.array(schema.NumSampleIndices, "uint32_t");

 

    return schema;
}