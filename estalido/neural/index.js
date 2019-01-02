class NeuralNetwork{
	constructor() {
    	this.input = [];
    	this.output = [];
  	}
	get error(){
		return this.output.reduce(function(accumulator, output){
			console.log(output.expected, output.value);
			return accumulator +  (1/2)*Math.pow(output.expected - output.value, 2);
  		}, 0)
	}
} 

class Node{
  constructor() {
    this.next = [];
    this.previous = [];
  }
  get value(){
  	return activation(this.previous.reduce(function(accumulator, edge){
  		return accumulator + edge.width * edge.from.value;
  	}, 0));
  }
}
 
class Input extends Node{
	get value(){
		return this._value
	}
	set value(value){
		this._value = value;
	}
}


class Output extends Node{
	get expected(){
  		return this._expected
	}
	set expected(value){
		this._expected = value;
	}
}


class Edge{
  constructor() {
    this.from;
    this.to;
    this.width = Math.random();
  }
}

function addEdge(from, to){
	var e = new Edge();
	e.from = from;
	e.to = to;


	from.next.push(e);
	to.previous.push(e);

	return e;

}

var neural = new NeuralNetwork();
var i0 = new Input();
var i1 = new Input();

var j0 = new Node();
var j1 = new Node();
var j2 = new Node();

var o0 = new Output();
var o1 = new Output();

addEdge(i0, j0);
addEdge(i0, j1);
addEdge(i0, j2);
 
addEdge(i1, j0);
addEdge(i1, j1);
addEdge(i1, j2);


addEdge(j0, o0);
addEdge(j0, o1);
 
addEdge(j1, o0);
addEdge(j1, o1);
 
addEdge(j2, o0);
addEdge(j2, o1);

 
neural.input.push(i0);
neural.input.push(i1);
neural.output.push(o0);
neural.output.push(o1);



i0.value = 1;
i1.value = 1;
o0.expected = 1;
o1.expected = 1;



 
console.log("o0", neural.output[0].value);
console.log("o1", neural.output[1].value);
console.log("error", neural.error);


for(var i = 0; i< neural.output.length ; i++){
	var out = neural.output[i];
	console.log("out", out.value);
	for(var j = 0; j< out.previous.length ; j++){
		var edge = out.previous[j];

		var dErro_do1 = -( out.expected- out.value);
		var do1_dno1 = derivateActivationFromResult(out.value);
		var dErro_dw5 = dErro_do1*do1_dno1*edge.from.value;

		console.log("    part", dErro_dw5);
	}
}




var real = [
	[0,0],
	[0,1],
	[1,0],
	[1,1]
];

real.forEach(function(r){
	r.push( !!( r[0] ^ r[1] ) ? 1:0)
});

var w1 = Math.random();
var w2 = Math.random();
var w3 = Math.random();
var w4 = Math.random();
var w5 = Math.random();
var w6 = Math.random();


function activation(value){
	//return value;
	//return Math.tanh(value);
	return (1/(1+Math.exp(-value)));
}


function derivateActivation(value){
	
	return Math.exp(-value)/Math.pow((1+Math.exp(-value)), 2);
}

function derivateActivationFromResult(value){
	//return 1;
	return value*(1-value);
}

var learningRate = 0.050;
for(var iter = 0; iter <10000000; iter++){
	for(var pos = 0; pos < real.length ; pos++){
		var nh0 = real[pos][0] *w1 +  real[pos][1] *w3;
		var h0 = activation(nh0);

		var nh1 = real[pos][0] *w2 +  real[pos][1] *w4;
		var h1 = activation(nh1);

		var no1 = h0 * w5 +  h1*w6;
		var o1 = activation(no1);

		var erro = (1/2)*Math.pow(real[pos][2] - o1, 2);
		
 
		//dErro/dw5 = dErro/do1 * do1/dno1 * dno1/dw5;
		
		//var dErro_do1 = 2*(1/2) * (real[pos][2] - o1) * (0 - 1);
		var dErro_do1 = -(real[pos][2] - o1);


		//var do1/dno1 = (1/(1+Math.exp(-no1)))'  =  no1 / (1+Math.exp(no1))
		//var do1_dno1 = derivateActivation(no1);
		var do1_dno1 = derivateActivationFromResult(o1);

		// dno1/dw5 = (h0 * w5 +  h1*w6)' = h0

		var dErro_dw5 = dErro_do1*do1_dno1*h0;

		var dErro_dw6 = dErro_do1*do1_dno1*h1;



		var dh0_dnh0 = derivateActivationFromResult(h0);
		var dh1_dnh1 = derivateActivationFromResult(h1);


	   	//dErro/dw1 = dErro/dO1 *	do1/dnO1 * dnO1/dh0 *  dh0/dnh0 * dnh0/w1; 
	   	var dErro_dw1 = dErro_do1 *	do1_dno1 * w5 *  dh0_dnh0 * real[pos][0]; 
	   	var dErro_dw3 = dErro_do1 *	do1_dno1 * w5 *  dh0_dnh0 * real[pos][1]; 

	   	var dErro_dw2 = dErro_do1 *	do1_dno1 * w6 *  dh1_dnh1 * real[pos][0]; 
	   	var dErro_dw4 = dErro_do1 *	do1_dno1 * w6 *  dh1_dnh1 * real[pos][1]; 



		w1 = w1 - learningRate * dErro_dw1;
		w2 = w2 - learningRate * dErro_dw2;
		w3 = w3 - learningRate * dErro_dw3;
		w4 = w4 - learningRate * dErro_dw4;
		w5 = w5 - learningRate * dErro_dw5;
		w6 = w6 - learningRate * dErro_dw6;



	}
}


console.log(w1, w2, w3, w4, w5, w6 )



for(var pos = 0; pos < real.length ; pos++){
	var nh0 = real[pos][0] *w1 +  real[pos][1] *w3;
	var h0 = activation(nh0);

	var nh1 = real[pos][0] *w2 +  real[pos][1] *w4;
	var h1 = activation(nh1);

	var no1 = h0 * w5 +  h1*w6;
	var o1 = activation(no1);

	console.log(real[pos][0], real[pos][1], real[pos][2],  o1  );

}