
var a = 11;
var b = 9;
var c = 3;
var d = 3;


const points = [
  [0, 0],
  [b, 0],
  [b, a],
  [0, a],

  [1, 1], //no 4
  [1, 1+d],
  [b-1, 1], //nc 6 
  [b-1, 1+d],  

  [b/2, a-1-d],  
  [b/2, a-1], // f 9 

  [1, a-c], //10
  [b-1, a-c], //11
]

var factor = 6;


function process(relay){

  var startX = relay.x*factor;
  var startY = relay.y*factor;
  



  
  var ps = points.map(function(p){
    
    var sin = 0;
    var cos = 1;  
    
    switch(relay.r){
      case 1:
        var sin = 1;
        var cos = 0;  
        break;
        case 2:
          var sin = 0;
          var cos = -1;  
          break;
          
          case 3:
            var sin = -1;
            var cos = 0;  
            break;                
          }
          
          
          var _x = (p[0])*factor;
          var _y = (p[1])*factor;
          
          
          
          
          return [
            (_x* cos   - _y * sin ) + relay.x *factor,
            ( _x* sin + _y * cos )  + relay.y *factor,
            
          ];
        })
        
        
        relay.points = ps;
        
}
        
        
        
        


var _state = {
    relays:  [
      {
 
        id:0,

        x: 12,
        y: 40,
        r: 0 , 
    },      
         {
 
            id:1,

            x: 35,
            y: 15,
            r:2, 
        },
        {
 
            id:2,
            x: 2,
            y: 14,
            r:0, 
        },
         {
 
            id:3,

            x: 52,
            y: 20,
            r: 0, 
        },

      ],
    edges: [
      [0,4, 1, 6], // fromRelay; formRelayPoint; toRelay; toRelayPoint;
      [2,9,3, 11],
    ]
};

for(var i in _state.relays)
{
  var relay = _state.relays[i];
  process(relay);
}



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