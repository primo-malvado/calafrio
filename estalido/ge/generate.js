
var relayCount =1;

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
    //"a3","a2", 
    "a1" , "a0",
     //"b1",
      "b0",
       "b3"
  ];


var list = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
 
 
var real = list.map(function (item) {

     


 

    return {
        i: [
            
            //(item & 8)>3, 
           // (item & 4)>2, 
            (item & 2)>1,
            item & 1,
 
           // ((item+1) & 4)>2,
            //((item+1) & 2)>1,
            (item+1) & 1,
        ],
        o: [
           // ((item+1) & 8)>3,
          // (item+1) & 1,

          ((item+1) & 2)>1,
        ]
    }
})
 
inCount =3
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