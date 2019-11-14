/*
nand2:
    o0=cn?m:1 
nor4:
    o0=b?!s0:!s1    o1=a?0:o0 
nor5 :
    o0=b?!s3:!s2    o1=a?o0:1

nor14:
    o0=nor5?nand2:1    o1=nor4?m:o0    
    o0=nor4?m:nand2    o1=nor5?o0:1  


xor1:



    o0=nand2?0:1         o1=nor5?o0:nand2     o2=nor4?nand2:o1    
    o0=nor5?0:1          o1=nand2?o0:nor5     o2=nor4?nand2:o1    


    o0=nor4?0:nor5       o1=nor5?nor4:1       o2=nand2?o1:o0     
    o0=nor5?nor4:1       o1=nor4?0:nor5       o2=nand2?o0:o1    
    
    

    o0=nand2?0:1         o1=nor4?nand2:o0     o2=nor5?o1:nand2    
    o0=nor4?0:1          o1=nand2?nor4:o0     o2=nor5?o1:nand2    







    
    
    
    
    


    

*/

var relayCount =3;

function print(relays) {
    var text = "";
    relays.forEach(function (relay, idx) {
        text += `o${idx}=${printX(relay[2])}?${printX(relay[1])}:${printX(relay[0])}    `;
    })
    console.log(text);
}

function printX(pin) {
    if (pin.t == "l") {
        return pin.v ? "1" : "0";
    }
    if (pin.t == "i") {
        return xxx[pin.v];
    }
    if (pin.t == "o") {
        return pin.t + pin.v
    }
}
  
/*
o0=c?b:a    o1=o0?b:a    
o0=b?c:a    o1=o0?c:a    
o0=c?a:b    o1=o0?a:b   
o0=a?c:b    o1=o0?c:b    

o0=b?a:c    o1=o0?a:c    
o0=a?b:c    o1=o0?b:c 
*/

var xxx = [
    // "a",
    // "b",
    // //  "cn",
    // //  "m",
    // //  "!s0",
    // //  "!s1",
    //  "!s2",
    //  "!s3",

    "nand2",
     "nor4",
     "nor5",
  ];

 


var real = [];




for(var i = 0; i< Math.pow(2,8); i++) {

    var a = ((i & 1)>0)?1:0;
    var b = ((i & 2)>1)?1:0;    
    var s2 = ((i & 4)>2)?1:0;
    var s3 = ((i & 8)>3)?1:0;


    var cn = ((i & 16)>4)?1:0;
    var m = ((i & 32)>5)?1:0;

    var s0 = ((i &64)>6)?1:0;
    var s1 = ((i & 128)>7)?1:0;

 


    var not11 = m?0:1;
    var not12 = b?0:1;

    var nand2 = (not11 & cn)?0:1;


    var and6 = a?1:0;
    var and7 = (s0 & b)?1:0;
    var and8 = (not12 & s1)?1:0;

    var and9 = (not12 & s2 & a)?1:0;
    var and10 = (a & s3 & b)?1:0;


    var nor4 = (and6 | and7 | and8 ) ? 0:1;
    var nor5 = (and9 | and10 ) ? 0:1;


    var and15 = (nor4 & not11)?1:0;
    var and16 = (not11 & nor5 & cn)?1:0;

    var nor14 = ( and15 | and16 )?0:1;

    
    var xor3 = nor4 ^nor5 ;
    var xor1 = (nand2 ^ xor3)?1:0;

    real.push( {
        i: [
            // a,
            // b,
            //  cn,
            //  m,
            //  !s0,
            //  !s1,
            //  !s2,
            //  !s3,
             nand2,
             nor4,
             nor5,
        ],
        o: [
            // nand2, 
            //nor14
             xor1
        ]
    });
}
  
 
inCount = 3
 


 





var relayList = generateRelays(inCount);

function relay(a, b, c) {
    return !c ? a : b;
}

function calc(relay_pos, inputs, ouputs) {
    if (relay_pos.t == "l") {
        return relay_pos.v;
    }
    if (relay_pos.t == "i") {
        return inputs[relay_pos.v];
    }
    if (relay_pos.t == "o") {
        return ouputs[relay_pos.v];
    }
}

function test(relays, values) {
    var ouputs = [];
    for (var i = 0; i < values.length; i++) {
        var _out = [];
        for (var j = 0; j < relays.length; j++) {
            _out.push(relay(
                calc(relays[j][0], values[i].i, _out), 
                calc(relays[j][1], values[i].i, _out), 
                calc(relays[j][2], values[i].i, _out)
            ));
        }
        ouputs.push(_out);
    }
 
    for (var i = 0; i < values.length ; i++) {
        if (values[i].o[0] != ouputs[i][relayCount - 1]  ) {
            return; 
        }
 
    }
    
    print(relays);
    
}
/*
relayList.forEach(function (relay) {
    test(relay, real);
})
*/
function f(_i1, inCount) {
    if (_i1 < 2) {
        return {
            t: "l",
            v: (_i1 + 1) % 2
        };
    } else if (_i1 < 2 + inCount) {
        return {
            t: "i",
            v: _i1 - 2
        };
    } else {
        return {
            t: "o",
            v: _i1 - (2 + inCount)
        };
    }
}

function _generateRelays(inCount, xxx, m, listlevel/*, listGlobal*/, count) {
    var listlevelClone = listlevel.slice(0);
    if (count === 0) {

        test(listlevel, real);

        //listGlobal.push(listlevel);
        //console.log(listlevel);
    } else {
        for (var _j0 = 0; _j0 < xxx+m; _j0++) {

            //console.log(xxx);
            var a1 = f(_j0, inCount);
            for (var _j1 = 0; _j1 < xxx+m; _j1++) {
                if (_j0 != _j1) {
                    var b1 = f(_j1, inCount);
                    for (var _j2 = 2; _j2 < xxx/*+m*/; _j2++) {
                        if (_j1 != _j2) {
                            var c1 = f(_j2, inCount);
                                
                            var listlevelClone2 = listlevelClone.slice(0);
                            listlevelClone2.push(
                                [a1, b1, c1]
                            );
                            _generateRelays(inCount, xxx, m + 1, listlevelClone2, /* listGlobal,*/ count - 1);
                        }
                    }
                }
            }
        }
    }
}

function generateRelays(inCount) {
    var listlevel = [];
    var listGlobal = [];
    var m = 2 + inCount;
    _generateRelays(inCount, m, 0, listlevel, /*listGlobal,*/ relayCount);
    //console.log(listlevel);
    return listGlobal;
}