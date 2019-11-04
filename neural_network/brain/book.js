const brain  = require("brain.js");

const trainingData = [
"as armas e os baroes assinalados",
"que da ocidental praia lusitana",
"por mares nunca de antes navegados",
"passaram ainda alem da taprobana",
"em perigos e guerras esforcados",
"mais do que prometia a forca humana",
"e entre gente remota edificaram",
"novo reino que tanto sublimaram",
"e tambem as memórias gloriosas",
"daqueles reis que foram dilatando",
"a fe o imperio e as terras viciosas",
"de africa e de asia andaram devastando",
"e aqueles que por obras valerosas",
"se vao da lei da morte libertando",
"cantando espalharei por toda parte",
"se a tanto me ajudar o engenho e arte",
"cessem do sabio grego e do troiano",
"as navegacoes grandes que fizeram",
"cale se de alexandro e de trajano",
"a fama das vitorias que tiveram",
"que eu canto o peito ilustre lusitano",
"a quem neptuno e marte obedeceram",
"cesse tudo o que a musa antiga canta",
"que outro valor mais alto se alevanta"

];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(trainingData, {
  iterations: 1500,
  log: details => console.log(details),
  errorThresh: 0.013
});

var start = "grandes";
start = start + " "+ lstm.run(start); 
console.log(start); 


start = "valor";
start = start + " "+ lstm.run(start); 
console.log(start); 

start = "antiga";
start = start + " "+ lstm.run(start); 
console.log(start); 

start = "ilustre";
start = start + " "+ lstm.run(start); 
console.log(start); 


start = "libertando";
start = start + " "+ lstm.run(start); 
console.log(start); 

start = "imperio";
start = start + " "+ lstm.run(start); 
console.log(start); 


start = "da ocidental ";
start = start + " "+ lstm.run(start); 
console.log(start); 


start = "canto o peito";
start = start + " "+ lstm.run(start); 
console.log(start); 


start = "perigos e guerras prometia";
start = start + " "+ lstm.run(start); 
console.log(start); 

