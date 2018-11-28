var relayCount =2;

function print(relays) {
    var text = "";
    relays.forEach(function (relay, idx) {
        //!=${printX(relay[3])}
        text += `o${idx}=${printX(relay[2])}!=${printX(relay[3])}?${printX(relay[1])}:${printX(relay[0])}    `;
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
"set", "reset", "old", "B"
  ];

var list = [
    [0,0,0,1,0],
    [0,0,1,1,1],
    [0,1,0,0,0],
    [0,1,1,0,0],
    [1,0,0,1,1],
    [1,0,1,1,1],
    [1,1,0,0,0],
    [1,1,1,0,0],

];
 
 
var real = list.map(function (item) {

    var set = item[0];
    var res = item[1];
    var act = item[2];
    var A = item[3];
    var B = item[4];
     

 

    return {
        i: [
            set, 
            res, 
            act, 
        ],
        o: [
         B
        ]
    }
})
 
inCount =3
outCount = 1;

 





var relayList = generateRelays(inCount);

function relay(a, b, c, d) {
    return c == d ? a : b;
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
            _out.push(relay(calc(relays[j][0], values[i].i, _out), calc(relays[j][1], values[i].i, _out), calc(relays[j][2], values[i].i, _out), calc(relays[j][3], values[i].i, _out)));
        }
        ouputs.push(_out);
    }
    var ok = true;
    for (var i = 0; i < values.length && ok; i++) {
        if (values[i].o[0] != ouputs[i][relayCount - 1] /*||  values[i].o[1] !=  ouputs[i][relayCount-2]*/ ) {
            return;
            ok = false;
        }
        //for(var j = 0; j < ouputs.length; j++){
        //console.log(values[i].o, ouputs[i])
        //}
    }
    if (ok) {
        print(relays);
    }
}
relayList.forEach(function (relay) {
    test(relay, real);
})

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

function _generateRelays(inCount, incount, m, listlevel, listGlobal, count) {
    var listlevelClone = listlevel.slice(0);
    if (count === 0) {
        listGlobal.push(listlevel);
        //console.log(listlevel);
    } else {
        for (var _j0 = 0; _j0 < incount+m; _j0++) {
            var a1 = f(_j0, inCount);
            for (var _j1 = 0; _j1 < incount+m; _j1++) {
                if (_j0 != _j1) {
                    var b1 = f(_j1, inCount);
                    for (var _j2 = 2; _j2 < incount+m; _j2++) {
                        if (_j1 != _j2) {
                        var c1 = f(_j2, inCount);


                        //for(var _j3 = _j2+1 ; _j3< m; _j3++){
                        _j3 = 1; {

                            if(_j2 !== _j3){

                                var d1 = f(_j3, inCount);
                                var listlevelClone2 = listlevelClone.slice(0);
                                listlevelClone2.push(
                                    [a1, b1, c1, d1] );
                                _generateRelays(inCount, incount, m + 1, listlevelClone2, listGlobal, count - 1);
                            }
                        }
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
    _generateRelays(inCount, m, 0, listlevel, listGlobal, relayCount);
    //console.log(listlevel);
    return listGlobal;
}