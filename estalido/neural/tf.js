 
var fs = require('fs'); 
var parse = require('csv-parse');



var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;


var csvData=[];



fs.createReadStream("ruiMacd.csv")
    .pipe(parse({delimiter: '	'}))
    .on('data', function(csvrow) {
        //console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);        
    })
    .on('end',function() {
    	var list = [];

    	for(var i = 0; i< csvData.length; i++ ){
    		var prCompra = csvData[i][15];
    		var prVenda = csvData[i][16];


    		var searchCompra = true;
    		var searchVenda = true;

 
    		var exit = false;


	    	for(var j = i+1; !exit && j< csvData.length; j++ ){
	    		


	    		var saldoCompra = (csvData[j][16] - prCompra)*1000;
				var saldoVenda = (prVenda - csvData[j][15])*1000;

				if(saldoCompra<-8){
					searchCompra = false;
	    		}
				if(saldoVenda<-8){
					searchVenda = false;
	    		}

				if(searchCompra && saldoCompra>15){
					csvData[i].push(1);
					exit = true;
				}

				if(saldoVenda && saldoVenda>15){
					csvData[i].push(0);
					exit = true;
				}
	    	}

 

	    	if(exit == false){
	    		csvData[i].push(0.5)
	    	}



	    	//console.log(csvData[i].join(";"));


    	}
 


var myNetwork = new Architect.Perceptron(8,3,1);

var trainer = new Trainer(myNetwork);




/*
var morm = {
	min7: Math.min.apply(null, csvData.map(function(row){return parseFloat(row[7]);})),
	max7: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[7]);})),

	min8: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[8]);})),
	max8: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[8]);})),

	min9: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[9]);})),
	max9: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[9]);})),

	min10: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[10]);})),
	max10: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[10]);})),

	min11: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[11]);})),
	max11: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[12]);})),

	min12: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[12]);})),
	max12: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[12]);})),

	min13: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[13]);})),
	max13: Math.max.apply(null, csvData.map(function(row){return parseFloat( row[13]);})),

	min14: Math.min.apply(null, csvData.map(function(row){return  parseFloat(row[14]);})),
	max14: Math.max.apply(null, csvData.map(function(row){return  parseFloat(row[14]);})),

}

*/

var trainingSet = csvData.filter(function(r, index){return index<1000}).map(
	      		function(row){

  					return {
    					input: [

					      	parseFloat(row[7]),
					      	parseFloat(row[8]),
					      	parseFloat(row[9]),
					      	parseFloat(row[10]),

					      	parseFloat(row[11]),
					      	parseFloat(row[12]),
					      	parseFloat(row[13]),
					      	parseFloat(row[14]),

      					],
    					output: [row[17]]
  					};

	      			
  				}
				);
		

 
 
trainer.train(trainingSet,{
	iterations: 50000000,

	error: .0005,
	rate: .2,
	log: 100,
	cost: Trainer.cost.MSE
}
	/*,{
	shuffle: true,
}
*/
);


 
for(var previsao = 11100; previsao < 11200; previsao= previsao+25){

var f = myNetwork.activate([



					      	parseFloat(csvData[previsao][7]),
					      	parseFloat(csvData[previsao][8]),
					      	parseFloat(csvData[previsao][9]),
					      	parseFloat(csvData[previsao][10]),

					      	parseFloat(csvData[previsao][11]),
					      	parseFloat(csvData[previsao][12]),
					      	parseFloat(csvData[previsao][13]),
					      	parseFloat(csvData[previsao][14]),


      					]

	);
	console.log(f, csvData[previsao][17])
}

	      });



 



 /*

csvData.filter(function(r, index){return index<1000}).map(
	      		function(row){
	      			return [

				      	row[7],
				      	row[8],
				      	row[9],
				      	row[10],
				      	row[11],
				      	row[12],
				      	row[13],
				      	row[14]
      				];
  				}
  				)
		);
	      const ys = tf.tensor2d( csvData.filter(function(r, index){return index<1000}).map(function(row){return [row[17]]}));


 */