colors = [
    [
        [0,0,0],
        [0,0,192],
        [192,0,0],
        [192,0,192],
        [0,192,0],
        [0,192,192],
        [192,192,0],
        [192,192,192],

    ],

    [
        [0,0,0],
        [0,0,255],
        [255,0,0],
        [255,0,255],
        [0,255,0],
        [0,255,255],
        [255,255,0],
        [255,255,255],

    ],

]

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


        var w = canvas.width ;
        var h = canvas.height;

 
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
        context.putImageData( imgData, 0,0 );
 
    };

    imageObj.src = dataURL;
  }


 loadCanvas("watchmen.png"); 