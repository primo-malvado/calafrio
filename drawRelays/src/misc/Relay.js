//import Pin from "./Pin";

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
  [b/2, a-1], // common 9 

  [1, a-c], //10
  [b-1, a-c], //11
]

var factor = 10;


function process(relay){

  var startX = relay.pos.x*factor;
  var startY = relay.pos.y*factor;
  



  
  var ps = points.map(function(p){
    
    var sin = 0;
    var cos = 1;  
    
    switch(relay.pos.r){
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
            (_x* cos   - _y * sin ) + relay.pos.x *factor,
            ( _x* sin + _y * cos )  + relay.pos.y *factor,
            
          ];
        })
        
        
        relay.points = ps;
        
}
        
        
        




class Relay{
    
    constructor(){
/*
        this.com = new Pin(this);
        this.no = new Pin(this);
        this.nc = new Pin(this);
        this.coil1 = new Pin(this);
        this.coil2 = new Pin(this);
*/

    }
    defaulLabels = {
      no : "",
      nc : "",
      com : "",
      coil1 : "",
      coil2 : "",

      
    }
    setPos(pos){
        this.pos = pos;

        this.labels = Object.assign(this.defaulLabels , pos.labels || {} )

 
        this.processPoints();

    }

    processPoints(){
        process(this);

      
    }

 
    get no() {
        return this.points[4];
    }
    get nc() {
        return this.points[6];
    }

    get com() {
        return this.points[9];
    }

    get coil1() {
        return this.points[10];
    }

    get coil2() {
        return this.points[11];
    }
 
}



export default Relay;