for(var i = 0; i <dataSort.length; i++){
    var itemI = dataSort[i];

    if(itemI.down)
    {
        for(var j = i+1;  j <dataSort.length; j++){
            var itemJ = dataSort[j];

            if(itemJ.low < itemI.low){
                break;
            } 

            if(itemJ.top )
            {
                
                
                for(var k = j+1;  k <dataSort.length; k++){
                    var itemK = dataSort[k];

            
                    if(itemK.high > itemJ.high){
                        break;
                    } 

                    if(itemK.down)
                    {

                    
                        var ret = (itemJ.high - Math.min(itemK.open,  itemK.close) ) / (itemJ.high -itemI.low)
                        if(ret > 0.382 && ret < 0.618){
                            
                            //console.log(ret, itemI, itemJ, itemK)
                            
                            
                            for(var l = k+1;  l <dataSort.length; l++){
                                var itemL = dataSort[l];

                                


                                if(itemL.low < itemK.low){
                                    break;
                                } 
                                if(itemL.top)
                                {

                        
                                    var ret2 = (Math.max(itemL.open,  itemL.close) - itemI.low ) / (itemJ.high -itemI.low)
                        
                                    if(ret2 > 1.272 && ret2 < 1.414){
                            
                            
                                        var valor = itemL.high - 0.786 * (itemL.high-itemI.low)
                            
                                        console.log(ret, itemI, itemJ, itemK, itemL, valor)
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }

}