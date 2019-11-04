var l = [0,1];
var i = ["a", "b"/*, "c"*/];
var o = ["cout","res" ];

var temp = [].concat(l, i);

console.log(temp)

var relayCount = 3;


function createRelay(options, relayCount){
    
    for (var i3 = 0; i3< options.length; i3++){

        for (var j3 = 0; j3< options.length; j3++){
            if(i3!= j3){

                for (var k3 = 2; k3< options.length; k3++){
                    console.log(relayCount, " - ", options[i3], options[j3], options[k3])
                    
                    if(relayCount >1 )
                    {
                        var temp2 = options.concat(["o"+relayCount])
                        createRelay(temp2, relayCount-1);
                    }
                }
            }
        }
    }          
}

createRelay(temp, relayCount);