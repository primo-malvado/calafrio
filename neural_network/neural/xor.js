 

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;



 


var myNetwork = new Architect.Perceptron(2,2,1);

var trainer = new Trainer(myNetwork);

 


var trainingSet = [
	{input: [0,0], output: [0]},
	{input: [0,1], output: [1]},
	{input: [1,0], output: [1]},
	{input: [1,1], output: [0]},
];
		

 
 
trainer.train(trainingSet
	,{
	//iterations: 1000000,
	//error: .00001,
	log: 10,
	
	rate: .01,
	/*
	shuffle: true,
	cost: Trainer.cost.CROSS_ENTROPY
	*/
});



 
console.log(myNetwork.activate([0,0]), 0);
console.log(myNetwork.activate([0,1]), 1);
console.log(myNetwork.activate([1,0]), 1);
console.log(myNetwork.activate([1,1]), 0);
 


 

 