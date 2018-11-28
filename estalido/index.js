function printR(){
  var a = all.A.output.value?"x":" ";
  var b = all.B.output.value?"x":" ";
  var c = all.C.output.value?"x":" ";
  var d = all.D.output.value?"x":" ";
  var e = all.E.output.value?"x":" ";
  var f = all.F.output.value?"x":" ";
  var g = all.G.output.value?"x":" ";

     console.log(`
 ${a}${a}${a}
${f}   ${b}
${f}   ${b}
${f}   ${b}
 ${g}${g}${g}
${e}   ${c}
${e}   ${c}
${e}   ${c}
 ${d}${d}${d}
    
  `);
}



class Observable {
  constructor(value) {
    this.observers = [];
    this.value = value;
  }

  subscribe(f) {
    this.observers.push(f);
  }

  unsubscribe(f) {
    this.observers = this.observers.filter(subscriber => subscriber !== f);
  }

  notify() {
    var _this = this;

    this.observers.forEach(function(observer){
      observer()
    });
  }
}

class Switch{

  constructor(value) {
    this.output = new Observable(value);
  }
  
  switch(){
    this.output.value = (this.output.value+1 )%2
    this.output.notify();
  }

}



class Const{

  constructor(value) {
    this.output = new Observable(value);
  }
  
 
}




 


class Relay{
  constructor( coil, no, nc) {
    //super();

    this.coil = all[coil];
    this.no = all[no];
    this.nc = all[nc];


    this.setNC = this.setNC.bind(this);
    this.setNO = this.setNO.bind(this);
    this.setCoil = this.setCoil.bind(this);

 
    this.coil.output.subscribe(this.setCoil)
    this.no.output.subscribe(this.setNO)
    this.nc.output.subscribe(this.setNC)






    var out = this.calculateOutputValue();

 
    this.output = new Observable(out); 


  }

  setNC (){
    if(!this.coil.output.value && this.output.value != this.nc.output.value){
      this.output.value = this.nc.output.value;
      this.output.notify()
    } 
  }  

  setNO (){
    if(this.coil.output.value && this.output.value != this.no.output.value){
      this.output.value = this.no.output.value;
      this.output.notify()
    } 
  }  



  calculateOutputValue(){
    if(!this.coil.output.value){
      return this.nc.output.value;
    }else if(this.coil.output.value){
      return this.no.output.value;
    }
  }

  setCoil(output){
    //if( this.coil.output != output){

    var _this = this;

    setTimeout(function(){
      if(!_this.coil.output.value && _this.nc.output.value != 0){

    
        _this.output.value = _this.nc.output.value;
        _this.output.notify()
      }else if(_this.coil.output.value &&  _this.no.output.value != 0){

        
        _this.output.value = _this.no.output.value;
        _this.output.notify()
      }




    }, 10)

    if( _this.output.value != 0){
      _this.output.value = 0;
      _this.output.notify();
    }

  }
}


var all = {};

all.a = new Switch(0);
all.b = new Switch(0);
all.c = new Switch(0);
all.d = new Switch(0);

all.one = new Const(1);
all.zero = new Const(0);

all.m = new Relay("b", "c", "one") ;
all.n = new Relay("d", "a", "one");
all.E = new Relay("d", "zero", "m");
all.p = new Relay("c", "d", "n");
all.B = new Relay("b", "p", "one");
all.F = new Relay("p", "n", "b");
all.C = new Relay("d", "one", "F");
all.q = new Relay("b", "F", "c");
all.A = new Relay("p", "m", "q");
all.D = new Relay("n", "m", "q");
all.G = new Relay("a", "one", "q");
 

printR()

setTimeout(function(){
  all.d.switch(); //1

  setTimeout(function(){
    printR();


    setTimeout(function(){
      all.d.switch(); //0
      all.c.switch(); //1

      setTimeout(function(){
          printR();

          setTimeout(function(){
            all.d.switch(); //1
      //all.c.switch(); //1

      setTimeout(function(){
          printR();


          setTimeout(function(){
            all.b.switch(); //1
            all.d.switch(); //0
            all.c.switch(); //0

      setTimeout(function(){
          printR();
      }, 100);

      }, 1);






      }, 100);

      }, 1);




      }, 100);

      }, 1);
    }, 100);





 



}, 1);

 

var stdin = process.openStdin();

stdin.on('data', function(chunk) { 

  chunk = ""+chunk;
  chunk = chunk.substring(0,1)

 
      all[chunk].switch();
      setTimeout(function(){

        console.log( `${all.a.output.value}${all.b.output.value}${all.c.output.value}${all.d.output.value}`);

          printR();
      }, 100);

 
 
});