//nor4  = o0=b0?!s0:!s1    o1=a0?0:o0 
//nor5  = o0=b0?!s3:!s2    o1=a0?o0:1  
//nand2 = o0=cn?m:1 
//nor14 = o0=nor4?nand2:1    o1=nor5?o0:1    
//nor14 = o0=nor5?nand2:1    o1=nor4?o0:1 

//nor18 = o0=nor22?nor14:1    o1=nor23?o0:1    
//nor18 = o0=nor23?nor14:1    o1=nor22?o0:1 

var relayCount = 3;

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
  


var xxx = [
    "a0",
    "b0",
    "cn",
    "m",
    "s0",
    "s1",
    "s2",
    "s3",
    "xor1"
     

  ];

 


var real = [];




for(var i = 0; i< Math.pow(2,8); i++) {

    var a0 = ((i & 1)>0)?1:0;
    var b0 = ((i & 2)>1)?1:0;
    var cn =( (i & 4)>2)?1:0;
    var m = ((i & 8)>3)?1:0;
    var s0 = ((i & 16)>4)?1:0;
    var s1 = ((i & 32)>5)?1:0;
    var s2 = ((i & 64)>6)?1:0;
    var s3 =( (i & 128)>7)?1:0;

    var result = a0 ? (b0?s0:s1) : (b0?s2:s3) ;

    if(!m){
        result = result+ a0 + cn;
    } 


 
    // console.log(
    //     a0?0:1,
    //     b0?0:1,
    //     cn?0:1,
    //     m?0:1,
    //     s0?0:1,
    //     s1?0:1,
    //     s2?0:1,
    //     s3?0:1
    // );
 
    real.push( {
        i: [
            a0,
            b0,
            cn,
            m,
            //s0,
            //s1,
            s2,
            s3,
        ],
        o: [
            
            ((result & 2)>1)?0:1
        ]
    });
}
  
 
inCount =6
outCount = 1;
 


 





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