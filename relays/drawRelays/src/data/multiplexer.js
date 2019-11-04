import Relay from "../misc/Relay";

var address7 = new Relay();
address7.setPos({x: 12, y: 35, r: 1, labels : {coil2: "add7", com: "enable"}});
 

var address6_0 = new Relay();
address6_0.setPos({x: 25, y: 15, r: 1, labels : {coil2: "add6", com: ""}});

var address6_1 = new Relay();
address6_1.setPos({x: 25, y: 55, r: 1, labels : {coil2: "add6", com: ""}});
 


var address5_0 = new Relay();
address5_0.setPos({x: 38, y: 5, r: 1, labels : {coil2: "add5", com: ""}});

var address5_1 = new Relay();
address5_1.setPos({x: 38, y: 25, r: 1, labels : {coil2: "add5", com: ""}});

var address5_2 = new Relay();
address5_2.setPos({x: 38, y: 45, r: 1, labels : {coil2: "add5", com: ""}});

var address5_3 = new Relay();
address5_3.setPos({x: 38, y: 65, r: 1, labels : {coil2: "add5", com: ""}});
 


var address4_0 = new Relay();
address4_0.setPos({x: 51, y: 0, r: 1, labels : {coil2: "add4", com: ""}});

var address4_1 = new Relay();
address4_1.setPos({x: 51, y: 10, r: 1, labels : {coil2: "add4", com: ""}});

var address4_2 = new Relay();
address4_2.setPos({x: 51, y: 20, r: 1, labels : {coil2: "add4", com: ""}});

var address4_3 = new Relay();
address4_3.setPos({x: 51, y: 30, r: 1, labels : {coil2: "add4", com: ""}});

var address4_4 = new Relay();
address4_4.setPos({x: 51, y: 40, r: 1, labels : {coil2: "add4", com: ""}});

var address4_5 = new Relay();
address4_5.setPos({x: 51, y: 50, r: 1, labels : {coil2: "add4", com: ""}});

var address4_6 = new Relay();
address4_6.setPos({x: 51, y: 60, r: 1, labels : {coil2: "add4", com: ""}});

var address4_7 = new Relay();
address4_7.setPos({x: 51, y: 70, r: 1, labels : {coil2: "add4", com: ""}});
 






var _state = {
    relays:  [ 
        address7, 
        address6_0,
        address6_1,
        address5_0,
        address5_1,
        address5_2,
        address5_3,

        address4_0,
        address4_1,
        address4_2,
        address4_3,
        address4_4,
        address4_5,
        address4_6,
        address4_7,

    ],
    edges: [
        [address7.no, address6_0.com],
        [address7.nc, address6_1.com],      
        
        [address6_0.no, address5_0.com],
        [address6_0.nc, address5_1.com],              
        [address6_1.no, address5_2.com],
        [address6_1.nc, address5_3.com],       
        
        

        [address5_0.no, address4_0.com],
        [address5_0.nc, address4_1.com],
        [address5_1.no, address4_2.com],
        [address5_1.nc, address4_3.com],
        [address5_2.no, address4_4.com],
        [address5_2.nc, address4_5.com],
        [address5_3.no, address4_6.com],
        [address5_3.nc, address4_7.com],




/*
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
*/
    ]
};
 
export default _state;