for(var i = 0; i <dataSort.length; i++){
    var itemI = dataSort[i];


    if(itemI.down)
    {
        maxIJ = itemI.high;
        for(var j = i+1;  j <dataSort.length; j++){
            var itemJ = dataSort[j];

            maxIJ = Math.max(maxIJ, itemJ.high);


            if(itemJ.low < itemI.low){
                break;
            } 

            if(itemJ.top )
            {
                
                if(maxIJ>itemJ.high){
                    break;
                }

                minJK = itemJ.low;
                
                for(var k = j+1;  k <dataSort.length; k++){
                    var itemK = dataSort[k];

                    minJK = Math.min(itemK.low, minJK);



            
                    if(itemK.high > itemJ.high){
                        break;
                    } 
                    if(itemK.down)
                    {

                        if(minJK< itemK.low){
                            break;
                        }

                        var ret = (itemJ.high - Math.min(itemK.open,  itemK.close) ) / (itemJ.high -itemI.low)
                        if(ret > 0.382 && ret < 0.618){
                            
                            maxKL = itemK.high;
                
                            for(var l = k+1;  l <dataSort.length; l++){
                                var itemL = dataSort[l];

                                maxKL = Math.max(itemL.high, maxKL);




                                if(itemL.low < itemK.low){
                                    break;
                                } 
                                if(itemL.top)
                                {

                                    if(maxKL > itemL.high){
                                        break;
                                    }

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