 var fs = require("fs");

 var contents = fs.readFileSync("32.json");

 var jsonContent = JSON.parse(contents);

jsonContent.Candles[0].Candles.sort(function(a,b){
	return (a.FromDate < b.FromDate) ? -1 : 1
});

var len =  jsonContent.Candles[0].Candles.length;
var last = 0;

var list = [];


for(var i = 0; i< len; i++){
	var data = jsonContent.Candles[0].Candles[i];
	if(Math.ceil(data.Low/10) === Math.floor(data.High/10))
	{
		var actual = Math.ceil(data.Low/10);
		if(last !== actual){
			last = actual;
			console.log(data.FromDate, Math.ceil(data.Low/10));
			data.level = Math.ceil(data.Low/10);
			list.push(data);
		}

	}

}

//=IF(J13=1;1;(C14-$C$9)*$F$9)

var last = [];
var sentido = [];
for(var i = 1; i< list.length; i++){
	last[i] = "";
	sentido[i] = (list[i] - list[i-1]) > 0 ? -1 : 1;
}


 /*
for(var i = 1; i< list.length; i++){
	last[i] = 0;


 	for(var j = 1; j< i; j++){

 		if(last[j] >0){

		 }else{

 			last[j]= (list[j].level - list[i].level) * sentido[j];
 		}
 
	}

 


	console.log( list[i].FromDate, last.join(";"))



}
*/




var lastProfit = 0;
for(var i = 1; i< list.length; i++){
	last[i] = 0;

	var step = i-lastProfit; 
	var profit = 0;

 	for(var j = lastProfit+1; j< i; j++){

 		if(last[j] >= 1  ){

		 }else{

 			last[j]= (list[j].level - list[i].level) * sentido[j];
 		}

 		profit += last[j];
	}

	if(profit> step*3/7){
		lastProfit = i;
	}


	console.log( step, list[i].FromDate, last.join(";"))



}
 