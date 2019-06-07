class Subject {
   constructor() {
      this.observers = [];
      this.value = null;
   }

   getState() {
      return this.state;
   }

   setValue(value) {
 
      this.value = value;
      this.notifyAllObservers();
   }

   attach(observer){

      observer.ref = this;
      this.observers.push(observer);
      observer.update();
   }

   notifyAllObservers(){
      for(var i = 0; i< this.observers.length; i++){
         this.observers[i].update();
      }
   } 	
}

class Observer {
   constructor(parent){
      this.parent = parent
      this.value = null;
   }
   update(){
      this.parent.update();
   }
}




class Relay{
   constructor(){
      this.no = new Observer(this);
      this.nc = new Observer(this);
      this.coil = new Observer(this);
      this.output = new Subject();
   }
   update(){




      var value = (this.coil.ref !== undefined && this.coil.ref.value )? this.no.ref.value: this.nc.ref.value; 

      if(this.output.value !== value){


         console.log("update", value);
         this.output.setValue(value);
      }

   }
}




class Switch{
   constructor(value){
      this.output = new Subject();
      this.output.setValue(value);

   }
   toogle(){
      //console.log( this.output);
      this.output.setValue(!!!this.output.value);
   }
}



var on = new Switch(true);
var off = new Switch(false);


var setSwitch = new Switch(false);
var resetSwitch = new Switch(false);

var set = new Relay();
var reset = new Relay();


on.output.attach(set.nc);
off.output.attach(set.no);
setSwitch.output.attach(set.coil);

off.output.attach(reset.nc);
set.output.attach(reset.no);

resetSwitch.output.attach(reset.coil);



setSwitch.toogle()
resetSwitch.toogle()
resetSwitch.toogle()

setSwitch.toogle()