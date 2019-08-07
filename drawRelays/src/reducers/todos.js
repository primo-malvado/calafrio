import Relay from "../misc/Relay";

var reset = new Relay();
reset.setPos({x: 2, y: 25, r: 0, labels : {coil2: "reset", com: "5v"}});

var set7 = new Relay();
set7.setPos({x: 15,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable7 = new Relay();
enable7.setPos({x: 15,  y: 25,  r: 0 , labels : {coil1: "enable", com: "bus7"}});

var set6 = new Relay();
set6.setPos({x: 25,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable6 = new Relay();
enable6.setPos({x: 25,  y: 25,  r: 0 , labels : {coil1: "", com: "bus6"}});


var set5 = new Relay();
set5.setPos({x: 35,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable5 = new Relay();
enable5.setPos({x: 35,  y: 25,  r: 0 , labels : {coil1: "", com: "bus5"}});

var set4 = new Relay();
set4.setPos({x: 45,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable4 = new Relay();
enable4.setPos({x: 45,  y: 25,  r: 0 , labels : {coil1: "", com: "bus4"}});

var set3 = new Relay();
set3.setPos({x: 55,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable3 = new Relay();
enable3.setPos({x: 55,  y: 25,  r: 0 , labels : {coil1: "", com: "bus3"}});

var set2 = new Relay();
set2.setPos({x: 65,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable2 = new Relay();
enable2.setPos({x: 65,  y: 25,  r: 0 , labels : {coil1: "", com: "bus2"}});

var set1 = new Relay();
set1.setPos({x: 75,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable1 = new Relay();
enable1.setPos({x: 75,  y: 25,  r: 0 , labels : {coil1: "", com: "bus1"}});

var set0 = new Relay();
set0.setPos({x: 85,  y: 8,  r: 0 , labels : {coil1: ""}});
var enable0 = new Relay();
enable0.setPos({x: 85,  y: 25,  r: 0 , labels : {coil1: "", com: "bus0"}});



 


var _state = {
    relays:  [ 
      reset,

      set7,
      enable7,

      set6,
      enable6,

      set5,
      enable5,
      set4,
      enable4,
      set3,
      enable3,
      set2,
      enable2,
      set1,
      enable1,
      set0,
      enable0,

    ],
    edges: [

      [set7.no, set7.coil1],
      [set7.com, reset.nc],
      [enable7.no, set7.coil1],
      
      [set6.no, set6.coil1],
      [set6.com, set7.com],
      [enable6.no, set6.coil1],
      [enable7.coil1, enable6.coil1],

      [set5.no, set5.coil1],
      [set5.com, set6.com],
      [enable5.no, set5.coil1],
      [enable6.coil1, enable5.coil1],



      [set4.no, set4.coil1],
      [set4.com, set5.com],
      [enable4.no, set4.coil1],
      [enable5.coil1, enable4.coil1],

      [set3.no, set3.coil1],
      [set3.com, set4.com],
      [enable3.no, set3.coil1],
      [enable4.coil1, enable3.coil1],

      [set2.no, set2.coil1],
      [set2.com, set3.com],
      [enable2.no, set2.coil1],
      [enable3.coil1, enable2.coil1],

      [set1.no, set1.coil1],
      [set1.com, set2.com],
      [enable1.no, set1.coil1],
      [enable2.coil1, enable1.coil1],

      [set0.no, set0.coil1],
      [set0.com, set1.com],
      [enable0.no, set0.coil1],
      [enable1.coil1, enable0.coil1],

    ]
};
 


const todos = (state = _state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            id: action.id,
            text: action.text,
            completed: false
          }
        ]
      case 'TOGGLE_TODO':
        return state.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      default:
        return state
    }
  }
  
  export default todos