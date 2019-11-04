 

class Pin{
    
    constructor(relay){
      this.relay = relay;
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