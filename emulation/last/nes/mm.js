var nes; 

fetch('SuperMarioBros.nes')
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(arrayBuffer) { 

  	var cart = new Uint8Array(arrayBuffer);

  	nes = new Nes(cart)
  	debugger;

  })

 ;





 
