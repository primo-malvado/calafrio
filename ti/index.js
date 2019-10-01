const ti = require('technicalindicators');

const data = require('./data');
 
var candles = data.Candles[0].Candles.sort(function(a, b) {
    return a.FromDate > b.FromDate ? 1:-1;
  });
 
 
// https://www.investopedia.com/articles/active-trading/012815/top-technical-indicators-scalping-trading-strategy.asp
var sma5Data = ti.sma({
  values: candles.map(function(item){return item.Close;}),
  period: 5,
} ) 

var sma8Data = ti.sma({
  values: candles.map(function(item){return item.Close;}),
  period: 8,
} ) 
var sma13Data = ti.sma({
  values: candles.map(function(item){return item.Close;}),
  period: 13,
} ) 



var bollingerData = ti.bollingerbands({
    period: 13,
    stdDev: 3,
    values: candles.map(function(item){return item.Close;}),
});


var stochasticData = ti.stochastic({

  period: 5,
  low: candles.map(function(item){return item.Low;}),
  high: candles.map(function(item){return item.High;}),
  close: candles.map(function(item){return item.Close;}),
  signalPeriod: 3,

})






var candlesLen = candles.length;

var sma5DataLen = sma5Data.length;
var sma8DataLen = sma8Data.length;
var sma13DataLen = sma13Data.length;
var bollingerDataLen = bollingerData.length;
var stochasticDataLen = stochasticData.length;




sma5Adjust = candlesLen-sma5DataLen;
sma8Adjust = candlesLen-sma8DataLen;
sma13Adjust = candlesLen-sma13DataLen;
bollingerAdjust = candlesLen-bollingerDataLen;
stochasticAdjust = candlesLen-stochasticDataLen;


var result = [];
for(var i = 0; i< candlesLen; i++){

    var sma5Pos = i-sma5Adjust;
    var sma8Pos = i- sma8Adjust;
    var sma13Pos = i- sma13Adjust;


    var bollingerPos = i- bollingerAdjust;
    var stochasticPos = i- stochasticAdjust;

    t = [
        //i, 
        //adxPos,
        candles[i].Open,
        candles[i].Close,
        candles[i].Low,
        candles[i].High,        

        sma5Pos >=0 ? sma5Data[sma5Pos] : null,
        sma8Pos >=0 ? sma8Data[sma8Pos] : null,
        sma13Pos >=0 ? sma13Data[sma13Pos] : null,

        bollingerPos >=0 ? bollingerData[bollingerPos].middle : null,
        bollingerPos >=0 ? bollingerData[bollingerPos].upper : null,
        bollingerPos >=0 ? bollingerData[bollingerPos].lower : null,
        bollingerPos >=0 ? bollingerData[bollingerPos].pb : null,



        stochasticPos >=0 ? stochasticData[stochasticPos].k : null,
        stochasticPos >=0 ? stochasticData[stochasticPos].d : null,
        


         

    ];

    //console.log(t)
    result.push(t.join(","));
}


console.log(result.join("\n"));



