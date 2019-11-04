import React from 'react'
 import TodoList from '../components/TodoList'

const openTime = 320;
const closeTime = 480;


var list = {

    one: {
        output: 1,
        type: "const"
    },
    zero: {
        output: 0,
        type: "const"
    },

    a: {
        parent: "",
        output: 0,
        type: "switch"
    },
    b: {
        parent: "",
        output: 0,
        type: "switch"
    }};
 
function createRelay(list, name, parentName,coil, nc, no) {
    list[name] = {
        parent:parentName,
        coil: coil,
        nc: nc,
        no: no,
        type: "relay",
        coilValue: list[coil].output,
        ncValue: list[nc].output,
        noValue: list[no].output,
        output: list[coil].output ? list[nc].output : list[no].output,
    };
}

function toogleSwitch(switchId, app){
    app.changes.push(switchId);
    var copy = Object.assign({}, app.state.list);

    copy[switchId].output = (copy[switchId].output + 1) % 2;
    var time = (new Date()).getTime();
    afterSwitch(app, copy, time);
}

function afterSwitch(app, copy, time){

    var callAgain = [];


    for (var key in copy) {
        if (copy[key].type === "relay") {
            var relayA = copy[key];

            if (relayA.time === time) {
                relayA.output = relayA.coilValue ? relayA.ncValue : relayA.noValue;

                if(relayA.output !== 0){
                    app.changes.push(key);
                }
            }
        }
    }
                
             











    if(app.changes.length>0){


        while(app.changes.length>0){
            var actual = app.changes.shift();


            for (var keyA in copy) {
                if (copy[keyA].type === "relay") {
                    var relay = copy[keyA];

                    if (relay.coil === actual || relay.nc === actual || relay.no === actual) {
                        var old = relay.output;


                        var oldCoilValue = relay.coilValue;


                        relay.coilValue = copy[relay.coil].output;
                        relay.ncValue = copy[relay.nc].output;
                        relay.noValue = copy[relay.no].output;

                        if(relay.coilValue !== oldCoilValue){
                            console.log("switch", keyA);

                            var timeX = (relay.coilValue > oldCoilValue?openTime:closeTime)*1;

                            if(callAgain.indexOf(timeX) === -1){

                                callAgain.push(timeX);
                            }


                            relay.output = 0;
                            relay.time = timeX;



                        }else{
                            relay.output = relay.coilValue ? relay.ncValue : relay.noValue;
                        }


                        if (relay.output !== old) {
                            app.changes.push(keyA);
                        }

                    }
                }
 

            }


        }
     
        app.setState(copy)
    }



    callAgain.forEach(function(t){
        setTimeout(function(){

            var copy = Object.assign({}, app.state.list);
            afterSwitch(app, copy, t);


        }, t)
    })
}

class App extends React.Component{

	constructor(props) {
    	super(props);

        this.changes = [];
    	this.state= {
    		list: list
    	}

    	this.toogleSwitch = this.toogleSwitch.bind(this)

 
  	}

  	toogleSwitch(swId){
  		toogleSwitch(swId, this, 0);
  	}

  render(){
    return(<div> 
        <TodoList todos={this.state.list} toggleTodo={this.toogleSwitch} /> 
    </div>);
  }
}
 

export default App






createRelay(list, "reset", "", "a", "zero", "one");
createRelay(list, "set", "", "b", "reset", "zero");

