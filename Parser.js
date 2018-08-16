class Parser {
    constructor(data) {
        this.data = data;
        this.pos = 0;
    }


    readString(len) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(this.readByte());
        }
        return str;
    }

    readByte() {
        return this.data[this.pos++];
    }

    readBytes(n) {
        var bytes = new Array(n);
        for (var i = 0; i < n; i++) {
            bytes[i] = this.readByte();
        }
        return bytes;
    }


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

    uint32_t() { //4
        var a = this.readBytes(4);

        return a[3] * 256 *256 *256 + a[2] * 256 *256 + a[1] * 256 + a[0] 

    }

    int32_t() { //4
        var a = this.readBytes(4);

        var v =  a[3] * 256 *256 *256 + a[2] * 256 *256 + a[1] * 256 + a[0] 


        if(a[3] >= 128){

            var bin = (+v).toString(2);
            //console.log(bin)


            
            bin = bin.replace(new RegExp("1", 'g'), "t");
            bin = bin.replace(new RegExp("0", 'g'), "1");
            bin = bin.replace(new RegExp("t", 'g'), "0");
            return -parseInt(bin, 2);
        }

        return v;



    }
    int16_t() { //2
        var a = this.readBytes(2);
        var v =  a[1] * 256 + a[0] 
        if(a[1] >= 128){

            var bin = (+v).toString(2);
            //console.log(bin)


            
            bin = bin.replace(new RegExp("1", 'g'), "t");
            bin = bin.replace(new RegExp("0", 'g'), "1");
            bin = bin.replace(new RegExp("t", 'g'), "0");
            return -parseInt(bin, 2);
        }
        return v;

    }

    uint16_t() {
        var a = this.readBytes(2);
        return a[1] * 256 + a[0] 
    }
    uint8_t() {
        var a = this.readByte();
        return a;
    }

    int8_t() {
        var v = this.readByte();

  
        if(v >= 128){

            var bin = (+v).toString(2);
            //console.log(bin)


            
            bin = bin.replace(new RegExp("1", 'g'), "t");
            bin = bin.replace(new RegExp("0", 'g'), "1");
            bin = bin.replace(new RegExp("t", 'g'), "0");
            return -parseInt(bin, 2);
        }
        return v;




        return a;
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
            Red: this.readByte(),
            Green: this.readByte(),
            Blue: this.readByte()
        }
    }

    tr_colour4() { //4
        return {
            Red: this.readByte(),
            Green: this.readByte(),
            Blue: this.readByte(),
            Unused: this.readByte(),
        }
    }
    tr_textile8() {
        return {
            Tile: this.readBytes(256 * 256),
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

        return {
            Tile: this.readBytes(2 * 256 * 256),
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


    var start = parser.pos;






        var mesh =  { };

        mesh.Centre = this.tr_vertex(true);
        mesh.CollRadius = this.int32_t(true);
        mesh.NumVertices = this.int16_t(true);

        mesh.Vertices  = this.array(mesh.NumVertices, "tr_vertex");
        mesh.NumNormals  = this.int16_t();

        if(mesh.NumNormals > 0){
            mesh.Normals  = this.array(mesh.NumNormals, "tr_vertex");
        }else{
            mesh.Lights  = this.array(-mesh.NumNormals, "int16_t");
        }

        mesh.NumTexturedRectangles  = this.int16_t();
        mesh.TexturedRectangles  = this.array(mesh.NumTexturedRectangles, "tr_face4");

        mesh.NumTexturedTriangles  = this.int16_t();
        mesh.TexturedTriangles  = this.array(mesh.NumTexturedTriangles, "tr_face3");

        mesh.NumColouredRectangles  = this.int16_t();
        mesh.ColouredRectangles  = this.array(mesh.NumColouredRectangles, "tr_face4");

        mesh.NumColouredTriangles  = this.int16_t();
        mesh.ColouredTriangles  = this.array(mesh.NumColouredTriangles, "tr_face3");




        var diff = (parser.pos - start) % 4;
        if(diff > 0){
            //debugger;
            parser.readBytes(4-diff)
        }



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

   tr_animation() {
        /*
struct tr_animation // 32 bytes
{
    uint32_t  FrameOffset; // Byte offset into Frames[] (divide by 2 for Frames[i])
     uint8_t  FrameRate;   // Engine ticks per frame
     uint8_t  FrameSize;   // Number of int16_t's in Frames[] used by this animation

    uint16_t  State_ID;

       fixed  Speed;
       fixed  Accel;

    uint16_t  FrameStart;  // First frame in this animation
    uint16_t  FrameEnd;    // Last frame in this animation
    uint16_t  NextAnimation;
    uint16_t  NextFrame;

    uint16_t  NumStateChanges;
    uint16_t  StateChangeOffset; // Offset into StateChanges[]

    uint16_t  NumAnimCommands;   // How many of them to use.
    uint16_t  AnimCommand;       // Offset into AnimCommand[]
};
 */


        var anim =  {

            FrameOffset: this.uint32_t(true),
            FrameRate: this.uint8_t(true),
            FrameSize: this.uint8_t(true),
            State_ID: this.uint16_t(true),
        }
        anim.Speed =  this.int16_t(true);
anim.Accel= this.int16_t(true);
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
    tr_face4() {
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


    var data = new Uint8Array(buffer);
    parser = new Parser(data);


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

    
    debugger;

    //uint32_t NumFloorData; // number of floor data uint16_t's to follow (4 bytes)
    schema.NumFloorData = parser.uint32_t(true);

    //uint16_t FloorData[NumFloorData]; // floor data (NumFloorData * 2 bytes)
    schema.FloorData = parser.array(schema.NumFloorData, "uint16_t");

 

    //uint32_t NumMeshData; // number of uint16_t's of mesh data to follow (=Meshes[]) (4 bytes)
    schema.NumMeshData = parser.uint32_t(true);
    var start = parser.pos;
    var end = parser.pos + 2 * schema.NumMeshData;
    //tr_mesh Meshes[NumMeshPointers]; // note that NumMeshPointers comes AFTER Meshes[]


    schema.Meshes = [];
    while (parser.pos < end) {

        schema.Meshes.push(parser.tr_mesh());
    }
    /*
    */

    //tr_mesh Meshes[NumMeshPointers]; // note that NumMeshPointers comes AFTER Meshes[]
   // schema.Meshes = parser.array(schema.NumMeshData, "uint16_t");


    //uint32_t NumMeshPointers; // number of mesh pointers to follow (4 bytes)
    schema.NumMeshPointers = parser.uint32_t(true);





    //uint32_t MeshPointers[NumMeshPointers]; // mesh pointer list (NumMeshPointers * 4 bytes)
    schema.MeshPointers = parser.array(schema.NumMeshPointers, "uint32_t");


    
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
    //uint32_t NumFrames; // number of words of frame data to follow (4 bytes)
    //uint16_t Frames[NumFrames]; // frame data (NumFrames * 2 bytes)
    //uint32_t NumModels; // number of models to follow (4 bytes)
    //tr_model Models[NumModels]; // model list (NumModels * 18 bytes)
    //uint32_t NumStaticMeshes; // number of StaticMesh data records to follow (4 bytes)
    //tr_staticmesh StaticMeshes[NumStaticMeshes]; // StaticMesh data (NumStaticMesh * 32 bytes)
    //uint32_t NumObjectTextures; // number of object textures to follow (4 bytes)
    //tr_object_texture ObjectTextures[NumObjectTextures]; // object texture list (NumObjectTextures * 20 bytes) (after AnimatedTextures in TR3)
    //uint32_t NumSpriteTextures; // number of sprite textures to follow (4 bytes)
    //tr_sprite_texture SpriteTextures[NumSpriteTextures]; // sprite texture list (NumSpriteTextures * 16 bytes)
    //uint32_t NumSpriteSequences; // number of sprite sequences records to follow (4 bytes)
    //tr_sprite_sequence SpriteSequences[NumSpriteSequences]; // sprite sequence data (NumSpriteSequences * 8 bytes)
    //uint32_t NumCameras; // number of camera data records to follow (4 bytes)
    //tr_camera Cameras[NumCameras]; // camera data (NumCameras * 16 bytes)
    //uint32_t NumSoundSources; // number of sound source data records to follow (4 bytes)
    //tr_sound_source SoundSources[NumSoundSources]; // sound source data (NumSoundSources * 16 bytes)
    //uint32_t NumBoxes; // number of box data records to follow (4 bytes)
    //tr2_box Boxes[NumBoxes]; // box data (NumBoxes * 8 bytes)
    //uint32_t NumOverlaps; // number of overlap records to follow (4 bytes)
    //uint16_t Overlaps[NumOverlaps]; // overlap data (NumOverlaps * 2 bytes)
    //int16_t Zones[10*NumBoxes]; // zone data (NumBoxes * 20 bytes)
    //uint32_t NumAnimatedTextures; // number of animated texture records to follow (4 bytes)
    //uint16_t AnimatedTextures[NumAnimatedTextures]; // animated texture data (NumAnimatedTextures * 2 bytes)
    //uint32_t NumEntities; // number of entities to follow (4 bytes)
    //tr2_entity Entities[NumEntities]; // entity list (NumEntities * 24 bytes)
    //uint8_t LightMap[32 * 256]; // light map (8192 bytes)
    //uint16_t NumCinematicFrames; // number of cinematic frame records to follow (2 bytes)
    //tr_cinematic_frame CinematicFrames[NumCinematicFrames]; // (NumCinematicFrames * 16 bytes)
    //uint16_t NumDemoData; // number of demo data records to follow (2 bytes)
    //uint8_t DemoData[NumDemoData]; // demo data (NumDemoData bytes)
    //int16_t SoundMap[370]; // sound map (740 bytes)
    //uint32_t NumSoundDetails; // number of sound-detail records to follow (4 bytes)
    //tr_sound_details SoundDetails[NumSoundDetails]; // sound-detail list (NumSoundDetails * 8 bytes)
    //uint32_t NumSampleIndices; // number of sample indices to follow (4 bytes)
    //uint32_t SampleIndices[NumSampleIndices]; // sample indices (NumSampleIndices * 4 bytes)




    return schema;
}