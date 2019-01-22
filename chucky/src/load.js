import TzxParser from "./TzxParser";




fetch("ChuckieEgg.tzx", {
  method: "get"
})
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(arrayBuffer) {


    var data = Array.from(new Uint8Array(arrayBuffer));
    var parser = new TzxParser(data);
    parser.parseAll();



    

    debugger;

    
  });
