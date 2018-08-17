//https://opentomb.earvillage.net/TRosettaStone3/trosettastone.html#level_format_tr2
// Compute the position of the first F
var fPosition = [8192, -1023, 1024];

var cameraPosition =  [15573.642270153401, -1050, 3986.0616611949986]
var cameraMovement = [ 0,0,0];

function degToRad(d) {
    return d * Math.PI / 180;
}


  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);

class WebGL {
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
                this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "a_position");
                this.GL.enableVertexAttribArray(this.VertexPosition);

                //Link Texture Coordinate Attribute from Shader
                this.VertexTexture = this.GL.getAttribLocation(this.ShaderProgram, "TextureCoord");
                this.GL.enableVertexAttribArray(this.VertexTexture);

                this.matrixLocation = this.GL.getUniformLocation(this.ShaderProgram, "u_matrix");


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


    getVertices(){
        return level.Rooms[0].RoomData[0].Vertices.reduce(function(accumulator, currentValue) {
            accumulator.push(currentValue.Vertex.x);
            accumulator.push(currentValue.Vertex.y);
            accumulator.push(currentValue.Vertex.z);
            return accumulator;
        }, []);
    }

    getTriangles(room){

        return level.Rooms[room].RoomData[0].Triangles.reduce(function(accumulator, currentValue) {
                accumulator.push(currentValue.Vertices[0]);
                accumulator.push(currentValue.Vertices[1]);
                accumulator.push(currentValue.Vertices[2]);
 

                //console.log(currentValue)
                return accumulator;
            }, []);


    }
    getRectangles(room){
        return level.Rooms[room].RoomData[0].Rectangles.reduce(function(accumulator, currentValue) {
            accumulator.push(currentValue.Vertices[0]);
            accumulator.push(currentValue.Vertices[1]);
            accumulator.push(currentValue.Vertices[2]);

            accumulator.push(currentValue.Vertices[0]);
            accumulator.push(currentValue.Vertices[2]);
            accumulator.push(currentValue.Vertices[3]);



            //console.log(currentValue)
            return accumulator;
        }, []);
    }

    Draw(Object, Texture) {
        var VertexBuffer = this.GL.createBuffer(); //Create a New Buffer

        //Bind it as The Current Buffer
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, VertexBuffer);

        var vertices = this.getVertices();


        // Fill it With the Data
        this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(vertices), this.GL.STATIC_DRAW);

        //Connect Buffer To Shader's attribute
        this.GL.vertexAttribPointer(this.VertexPosition, 3, this.GL.FLOAT, false, 0, 0);

        //Repeat For The next Two
        var TextureBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, TextureBuffer);
        this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Texture), this.GL.STATIC_DRAW);
        this.GL.vertexAttribPointer(this.VertexTexture, 2, this.GL.FLOAT, false, 0, 0);




        //Set slot 0 as the active Texture
        this.GL.activeTexture(this.GL.TEXTURE0);
        //Load in the Texture To Memory
        this.GL.bindTexture(this.GL.TEXTURE_2D, Texture);
        //Update The Texture Sampler in the fragment shader to use slot 0
        this.GL.uniform1i(this.GL.getUniformLocation(this.ShaderProgram, "uSampler"), 0);
        //Set The Perspective and Transformation Matrices


 /*

        //Generate The Perspective Matrix
        var PerspectiveMatrix = MakePerspective(90, this.AspectRatio, 1, 100000.0);
        var TransformMatrix = MakeTransform(Object);
        var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, "PerspectiveMatrix");
        this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));
        var tmatrix = this.GL.getUniformLocation(this.ShaderProgram, "TransformationMatrix");
        this.GL.uniformMatrix4fv(tmatrix, false, new Float32Array(TransformMatrix));
*/
 
    var gl = this.GL;

    var numFs = 5;
    var radius = 200;

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 100000;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, this.AspectRatio, zNear, zFar);

/*

    // Use matrix math to compute a position on a circle where
    // the camera is
    var cameraMatrix = m4.yRotation(cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    // Get the camera's postion from the matrix we computed
    cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);


    var up = [0, 1, 0];

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
*/

/*
    
    var cameraMatrix = m4.yRotation(degToRad( Object.Rotation) );
    cameraMatrix = m4.translate(cameraMatrix,cameraPosition[0], cameraPosition[1], cameraPosition[2]);
*/


    var cameraMatrix = m4.yRotation(degToRad(0) );
    cameraMatrix = m4.translate(cameraMatrix,cameraPosition[0], cameraPosition[1], cameraPosition[2]);

    cameraMatrix = m4.multiply(cameraMatrix, m4.yRotation(degToRad( Object.Rotation) ));
    cameraMatrix = m4.multiply(cameraMatrix, m4.zRotation(degToRad( 180) ));

    cameraMatrix = m4.translate(cameraMatrix,cameraMovement[0], cameraMovement[1], cameraMovement[2]);
    cameraMovement = [ 0,0,0];

    cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];



    // Make a view matrix from the camera matrix
    var viewMatrix = m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

 
      gl.uniformMatrix4fv(this.matrixLocation, false, viewProjectionMatrix);
















        var roomList = [0, 1, 4 ,2 ,13, 3, 77];
        for(var i in roomList) {
//        for(var i = 0; i<level.Rooms.length; i++) {
            var room =i;


            // Rectangles
            var RectangleBuffer = this.GL.createBuffer();
            this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, RectangleBuffer);
            var rectangles = this.getRectangles(room);
            this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(rectangles), this.GL.STATIC_DRAW);
            //Draw The rectangles
            this.GL.drawElements(this.GL.TRIANGLES, rectangles.length, this.GL.UNSIGNED_SHORT, 0);
            //
 
            // Triangles
            var TriangleBuffer = this.GL.createBuffer();
            this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, TriangleBuffer);
            var triangles = this.getTriangles(room);
            this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), this.GL.STATIC_DRAW);
            //Draw The Triangles
            this.GL.drawElements(this.GL.TRIANGLES, triangles.length, this.GL.UNSIGNED_SHORT, 0);        
            //
 
 
        }














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

    console.log(Object.Rotation);


    var y = Object.Rotation * (Math.PI / 180.0);
    var A = Math.cos(y);
    var B = -1 * Math.sin(y);
    var C = Math.sin(y);
    var D = Math.cos(y);

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


var level;


function Ready() {




    fetch('WALL.TR2')
        .then(function(response) {


            return response.arrayBuffer()
        })
        .then(function(buffer) {

            level = loadLevel(buffer);
            console.log(level)


            GL = new WebGL("GLCanvas", "FragmentShader", "VertexShader");
            Texture = GL.LoadTexture();
            //setInterval(Update, 41.6666);


        })

    ;




}


function Update() {
    GL.GL.clear(16384 | 256);
    GL.Draw(Cube, Texture);
}