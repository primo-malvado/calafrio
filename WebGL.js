//https://opentomb.earvillage.net/TRosettaStone3/trosettastone.html#level_format_tr2

class WebGL{
	constructor(CID, FSID, VSID) {
	    var canvas = document.getElementById(CID);
	    if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl"))
	        alert("Your Browser Doesn't Support WebGL");
	    else {
	        this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");

	        this.GL.clearColor(1.0, 1.0, 1.0, 1.0); // this is the color 
	        this.GL.enable(this.GL.DEPTH_TEST); //Enable Depth Testing
	        this.GL.depthFunc(this.GL.LEQUAL); //Set Perspective View
	        this.AspectRatio = canvas.width / canvas.height;

	        var FShader = document.getElementById(FSID);
	        var VShader = document.getElementById(VSID);

	        if (!FShader || !VShader)
	            alert("Error, Could Not Find Shaders");
	        else {
	            //Load and Compile Fragment Shader
	            var Code = LoadShader(FShader);
	            FShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
	            this.GL.shaderSource(FShader, Code);
	            this.GL.compileShader(FShader);

	            //Load and Compile Vertex Shader
	            Code = LoadShader(VShader);
	            VShader = this.GL.createShader(this.GL.VERTEX_SHADER);
	            this.GL.shaderSource(VShader, Code);
	            this.GL.compileShader(VShader);

	            //Create The Shader Program
	            this.ShaderProgram = this.GL.createProgram();
	            this.GL.attachShader(this.ShaderProgram, FShader);
	            this.GL.attachShader(this.ShaderProgram, VShader);
	            this.GL.linkProgram(this.ShaderProgram);
	            this.GL.useProgram(this.ShaderProgram);

	            //Link Vertex Position Attribute from Shader
	            this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
	            this.GL.enableVertexAttribArray(this.VertexPosition);

	            //Link Texture Coordinate Attribute from Shader
	            this.VertexTexture = this.GL.getAttribLocation(this.ShaderProgram, "TextureCoord");
	            this.GL.enableVertexAttribArray(this.VertexTexture);




	        }




	    }






	}




    LoadTexture() {
        //Create a new Texture and Assign it as the active one
        var TempTex = this.GL.createTexture();
        this.GL.bindTexture(this.GL.TEXTURE_2D, TempTex);




        const pixel = new Uint8Array([255, 123, 125, 255]); // opaque blue
        this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA,
            1, 1, 0, this.GL.RGBA, this.GL.UNSIGNED_BYTE,
            pixel);




        TextureImage = new Image();

        var _that = this;
        TextureImage.onload = function() {




            //Flip Positive Y (Optional)
            _that.GL.pixelStorei(_that.GL.UNPACK_FLIP_Y_WEBGL, true);

            //Load in The Image
            _that.GL.texImage2D(_that.GL.TEXTURE_2D, 0, _that.GL.RGBA, _that.GL.RGBA, _that.GL.UNSIGNED_BYTE, TextureImage);

            //Setup Scaling properties
            _that.GL.texParameteri(_that.GL.TEXTURE_2D, _that.GL.TEXTURE_MAG_FILTER, _that.GL.LINEAR);
            _that.GL.texParameteri(_that.GL.TEXTURE_2D, _that.GL.TEXTURE_MIN_FILTER, _that.GL.LINEAR_MIPMAP_NEAREST);
            _that.GL.generateMipmap(_that.GL.TEXTURE_2D);

            //Unbind the texture and return it.
            _that.GL.bindTexture(_that.GL.TEXTURE_2D, null);




        };

        TextureImage.src = "Texture.png";




        return TempTex;
    }



    Draw(Object, Texture) {
        var VertexBuffer = this.GL.createBuffer(); //Create a New Buffer

        //Bind it as The Current Buffer
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, VertexBuffer);

        // Fill it With the Data
        this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Vertices), this.GL.STATIC_DRAW);

        //Connect Buffer To Shader's attribute
        this.GL.vertexAttribPointer(this.VertexPosition, 3, this.GL.FLOAT, false, 0, 0);

        //Repeat For The next Two
        var TextureBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, TextureBuffer);
        this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Texture), this.GL.STATIC_DRAW);
        this.GL.vertexAttribPointer(this.VertexTexture, 2, this.GL.FLOAT, false, 0, 0);




        var TriangleBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, TriangleBuffer);


        this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Object.Triangles), this.GL.STATIC_DRAW);




        //Generate The Perspective Matrix
        var PerspectiveMatrix = MakePerspective(45, this.AspectRatio, 1, 10000.0);

        var TransformMatrix = MakeTransform(Object);

        //Set slot 0 as the active Texture
        this.GL.activeTexture(this.GL.TEXTURE0);

        //Load in the Texture To Memory
        this.GL.bindTexture(this.GL.TEXTURE_2D, Texture);





        //Update The Texture Sampler in the fragment shader to use slot 0
        this.GL.uniform1i(this.GL.getUniformLocation(this.ShaderProgram, "uSampler"), 0);

        //Set The Perspective and Transformation Matrices
        var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, "PerspectiveMatrix");
        this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));

        var tmatrix = this.GL.getUniformLocation(this.ShaderProgram, "TransformationMatrix");
        this.GL.uniformMatrix4fv(tmatrix, false, new Float32Array(TransformMatrix));

        //Draw The Triangles
        this.GL.drawElements(this.GL.TRIANGLES, Object.Triangles.length, this.GL.UNSIGNED_SHORT, 0);
    }



}




function LoadShader(Script) {
    var Code = "";
    var CurrentChild = Script.firstChild;
    while (CurrentChild) {
        if (CurrentChild.nodeType == CurrentChild.TEXT_NODE)
            Code += CurrentChild.textContent;
        CurrentChild = CurrentChild.nextSibling;
    }
    return Code;
}


function MakePerspective(FOV, AspectRatio, Closest, Farest) {
    var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
    var A = -(Farest + Closest) / (Farest - Closest);
    var B = -2 * Farest * Closest / (Farest - Closest);
    var C = (2 * Closest) / ((YLimit * AspectRatio) * 2);
    var D = (2 * Closest) / (YLimit * 2);
    return [
        C, 0, 0, 0,
        0, D, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ];
}

function MakeTransform(Object) {
    var y = Object.Rotation * (Math.PI / 180.0);
    var A = Math.cos(y);
    var B = -1 * Math.sin(y);
    var C = Math.sin(y);
    var D = Math.cos(y);
    Object.Rotation += 3;
    return [
        A, 0, B, 0,
        0, 1, 0, 0,
        C, 0, D, 0,
        0, 0, -6, 1
    ];
}




//This will hold our WebGL variable
var GL;

//Our finished texture
var Texture;

//This will hold the textures image 
var TextureImage;
 




function Ready() {





fetch('WALL.TR2')
  .then(function(response) {


	return response.arrayBuffer()
	}).then(function(buffer) {
		var data = new Uint8Array(buffer);
	 	parser = new Parser(data);


	 	var schema = {
//uint32_t Version; // version (4 bytes)
	 		Version: parser.uint32_t(true),
//tr_colour Palette[256]; // 8-bit palette (768 bytes)
	 		Palette : parser.array(256, "tr_colour"),
//tr_colour4 Palette16[256]; //  (1024 bytes)
	 		Palette16 : parser.array(256, "tr_colour4"),
//uint32_t NumTextiles; // number of texture tiles (4 bytes)
	 		NumTextiles: parser.uint32_t(true),

	 	};
 		
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
	 	schema.Rooms = parser.array(schema.NumRooms, "tr2_room"),

//uint32_t NumFloorData; // number of floor data uint16_t's to follow (4 bytes)
//uint16_t FloorData[NumFloorData]; // floor data (NumFloorData * 2 bytes)
//uint32_t NumMeshData; // number of uint16_t's of mesh data to follow (=Meshes[]) (4 bytes)
//tr_mesh Meshes[NumMeshPointers]; // note that NumMeshPointers comes AFTER Meshes[]
//uint32_t NumMeshPointers; // number of mesh pointers to follow (4 bytes)
//uint32_t MeshPointers[NumMeshPointers]; // mesh pointer list (NumMeshPointers * 4 bytes)
//uint32_t NumAnimations; // number of animations to follow (4 bytes)
//tr_animation Animations[NumAnimations]; // animation list (NumAnimations * 32 bytes)
//uint32_t NumStateChanges; // number of state changes to follow (4 bytes)
//tr_state_change StateChanges[NumStateChanges]; // state-change list (NumStructures * 6 bytes)
//uint32_t NumAnimDispatches; // number of animation dispatches to follow (4 bytes)
//tr_anim_dispatch AnimDispatches[NumAnimDispatches]; // animation-dispatch list list (NumAnimDispatches * 8 bytes)
//uint32_t NumAnimCommands; // number of animation commands to follow (4 bytes)
//tr_anim_command AnimCommands[NumAnimCommands]; // animation-command list (NumAnimCommands * 2 bytes)
//uint32_t NumMeshTrees; // number of MeshTrees to follow (4 bytes)
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




 		

		console.log(schema);

/*

		var schema = [
			{ label: 'Version', parser: Parsers.uint32_t(true) },
			{
				label: 'Palette', // global color table
 
				parser: Parsers.readList(256,tr_colour)
			},


    		// part definitions...
		];

		// get the input file data
		var data = new Uint8Array(buffer);
		// create a parser object
		var file = new BSP.DataParser(data);
		// parse the file using your schema
		var parsedObject = file.parse(schema);

*/



	})
/*
  .then(function(myJson) {
    console.log(myJson);
  })
*/
  ;

/*
$.get('WALL.TR2', function (data) {
  var parser = new jParser(data, {
    magic: 'int32'
  });
  console.log(parser.parse('magic'));
}, 'dataview');
*/








    GL = new WebGL("GLCanvas", "FragmentShader", "VertexShader");
    Texture = GL.LoadTexture();
    setInterval(Update, 41.6666);
}


function Update() {
    GL.GL.clear(16384 | 256);
    GL.Draw(Cube, Texture);
}