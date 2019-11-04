cores = [
    [
        {R: 0, G: 0, B: 0},
        {R: 0, G: 0, B: 192},
        {R: 192, G: 0, B: 0},
        {R: 192, G: 0, B: 192},
        {R: 0, G: 192, B: 0},
        {R: 0, G: 192, B: 192},
        {R: 192, G: 192, B: 0},
        {R: 192, G: 192, B: 192},

    ],

    [
        {R: 0, G: 0, B: 0},
        {R: 0, G: 0, B: 255},
        {R: 255, G: 0, B: 0},
        {R: 255, G: 0, B: 255},
        {R: 0, G: 255, B: 0},
        {R: 0, G: 255, B: 255},
        {R: 255, G: 255, B: 0},
        {R: 255, G: 255, B: 255},

    ],

];

function FloydSteinbergDithering( errorMultiplier, data, w, h )
{

    var filter = [
                    [   0,    0,    0, 7/48, 5/48],
                    [3/48, 5/48, 7/48, 5/48, 3/48],
                    [1/48, 3/48, 5/48, 3/48, 1/48]
                ];

    var x, y, xx, yy, r, g, b;

   //red
   var error = [];

   for( y = 0; y < h; y++)
   {
       error.push( new Float32Array( w ) );
   }

   for( y = 0; y < h; y++ )
   {

       for (x = 0; x < w; x++)
       {
           var id = ( ( y * w ) + x ) * 4;


           var avg = (data[ id ]+ data[ id + 1 ] + data[ id + 2 ])/3 ;
           avg -= error[y][x] * errorMultiplier;

           var e = 0;
           if (avg < 128 )
           {
               e = -avg;
               avg = 0;
           }
           else
           {
               e = 255 - avg;
               avg = 255;
           }

           data[ id ] = avg;
           data[ id + 1 ] = avg;
           data[ id + 2 ] = avg;

           data[ id + 3 ] = 255;

           for( yy = 0; yy < 3; yy++)
           {
               for ( xx = -2; xx <= 2; xx++)
               {
                   if( y + yy < 0 || h <= y + yy
                   ||  x + xx < 0 || w <= x + xx) continue;

                   error[ y + yy ][ x + xx ] += e * filter[ yy ][ xx + 2 ];
               }
           }
       }
   }


    return data;
}


function loadCanvas(dataURL) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var imageObj = new Image();
    
    imageObj.onload = function() {
        context.drawImage(this, 0, 0);


        var w = this.width ; 
        var h = this.height;

 
 /*

      var cW = w/8;
      var cH = h/8;
      

        for(var iw = 0; iw < cW; iw++){
            for(var ih = 0; ih < cH; ih++){
                

                var imgData = context.getImageData( iw*8,ih*8,8,8 );

                imgData.data = FloydSteinbergDithering(.75, imgData.data, 8, 8 );
                context.putImageData( imgData, iw*8,ih*8 );
            }
        }


*/






        var imgData = context.getImageData( 0,0, w,h );
        var original = imgData.data.map(function(a) {return a;} )

        
        imgData.data = FloydSteinbergDithering(.75, imgData.data, w,h);


        context.putImageData(imgData, 0, 192);

       // context.putImageData( imgData, 0,0 );


       tileLoop(context);
 
    };

    imageObj.src = dataURL;
  }


 loadCanvas("watchmen.png"); 



var map = {};

function tileLoop(context){


    var cW = 256/8;
    var cH = 192/8;

    // cW = 12;
    // cH = 12;

    for(var iw = 0; iw < cW; iw++){
        for(var ih = 0; ih < cH; ih++){


            var imgDataOriginal = context.getImageData( iw*8,ih*8,8,8 );
            var imgDataBit = context.getImageData( iw*8,ih*8 + 192,8,8 );


            var _bri = null;
            var _back = null;
            var _fore = null;

            var minDist = -1;

            for(var bri = 0; bri < 2; bri++){
                for(var back = 0; back < 8; back++){
                    for(var fore = 0; fore < 8; fore++){
                        

                        var dist = 0;
                        for(var bit = 0; bit < 64;  bit++){
                            var real = {
                                R: imgDataOriginal.data[bit*4+0],
                                G: imgDataOriginal.data[bit*4+1],
                                B: imgDataOriginal.data[bit*4+2],
                            }


                            
                            var newBit = imgDataBit.data[bit*4+0] == 0 ? cores[bri][back]  : cores[bri][fore];


                            dist += ciede2000(rgb_to_lab(real),rgb_to_lab(newBit));





                        }


                        if(minDist == -1 || dist < minDist ){
                            minDist = dist;
                            _bri = bri;
                            _back = back;
                            _fore = fore;

                           // console.log(_bri, _back, _fore, dist);


                            // for(var x = 0; x<64; x++){
                            //     imgDataBit.data[x*4+0] = 
                            // }
                        }



                    }
                }
    
            }


            console.log(iw, ih, _bri, _back, _fore, dist);

            for(var x = 0; x<64; x++){
                var t = imgDataBit.data[x*4+0];

                imgDataBit.data[x*4+0] =  t == 0 ? cores[_bri][_back].R  : cores[_bri][_fore].R;
                imgDataBit.data[x*4+1] =  t == 0 ? cores[_bri][_back].G  : cores[_bri][_fore].G;
                imgDataBit.data[x*4+2] =  t == 0 ? cores[_bri][_back].B  : cores[_bri][_fore].B;
            }

            context.putImageData( imgDataBit, iw*8,ih*8 +192 );
        }
    }

     
 }