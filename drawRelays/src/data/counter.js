import Relay from "../misc/Relay";

var xorc1 = new Relay();
xorc1.setPos({x: 85, y: 40, r: 2, labels : {coil2: "c1=a0", nc: "not(a0)=b0", no:"a0", com: "5v"}});

var b1 = new Relay();
b1.setPos({x: 76, y: 45, r: 0, labels : {coil2: "a1", nc: "",  com: "b1"}});

var c2 = new Relay();
c2.setPos({x: 65, y: 15, r: 1, labels : {coil1: "a1", nc: "", no: "a0",  com: "c2"}});


var c3 = new Relay();
c3.setPos({x: 50, y: 15, r: 1, labels : {coil1: "a2", nc: "", no: "",  com: "c3"}});

var c4= new Relay();
c4.setPos({x: 35, y: 15, r: 1, labels : {coil1: "a3", nc: "", no: "",  com: "c4"}});

var c5= new Relay();
c5.setPos({x: 20, y: 15, r: 1, labels : {coil1: "a4", nc: "", no: "",  com: "c5"}});



var xorc2 = new Relay();
xorc2.setPos({x: 60, y: 40, r: 2, labels : {coil2: "c2", nc: "", no:"", com: "5v"}});

var b2 = new Relay();
b2.setPos({x: 51, y: 45, r: 0, labels : {coil2: "a2", nc: "",  com: "b2"}});


var xorc3 = new Relay();
xorc3.setPos({x: 45, y: 40, r: 2, labels : {coil2: "c3", nc: "", no:"", com: "5v"}});

var b3 = new Relay();
b3.setPos({x: 36, y: 45, r: 0, labels : {coil2: "a3", nc: "",  com: "b3"}});




 


var _state = {
    relays:  [ 
      xorc1,
      b1,

      c2,
      c3,
      c4,
      c5,

      xorc2,
      b2,
      xorc3,
      b3,

    ],
    edges: [
        [xorc1.nc, b1.no],
        [xorc1.no, b1.nc],

        [c3.no, c2.com],
        [c4.no, c3.com],     
        [c5.no, c4.com],   
        

        [c2.no, xorc1.no],  


        [c2.com, xorc2.coil2],  
        [xorc2.nc, b2.no],
        [xorc2.no, b2.nc],        
 
    ]
};
 
export default _state;