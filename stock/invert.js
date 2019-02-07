for(var i = 0; i <dataSort.length; i++){
    var itemI = dataSort[i];


    if(itemI.top)
    {
        minIJ = itemI.low;
        for(var j = i+1;  j <dataSort.length; j++){
            var itemJ = dataSort[j];

            minIJ = Math.min(minIJ, itemJ.low);


            if(itemJ.high > itemI.high){
                break;
            } 

            if(itemJ.down )
            {
                
                if(minIJ<itemJ.low){
                    break;
                }

                maxJK = itemJ.high;
                
                for(var k = j+1;  k < dataSort.length; k++){
                    var itemK = dataSort[k];

                    maxJK = Math.max(itemK.high, maxJK);



            
                    if(itemK.low < itemJ.low){
                        break;
                    } 
                    if(itemK.top)
                    {

                        if(maxJK> itemK.high){
                            break;
                        }

                        var ret = (itemJ.low - Math.max(itemK.open,  itemK.close) ) / (itemJ.low -itemI.high)
                        if(ret > 0.382 && ret < 0.618){
                            
                            minKL = itemK.low;
                
                            for(var l = k+1;  l <dataSort.length; l++){
                                var itemL = dataSort[l];

                                minKL = Math.min(itemL.low, minKL);




                                if(itemL.high > itemK.high){
                                    break;
                                } 
                                if(itemL.down)
                                {

                                    if(minKL < itemL.low){
                                        break;
                                    }

                                    var ret2 = (Math.min(itemL.open,  itemL.close) - itemI.high ) / (itemJ.low -itemI.high)
                                    if(ret2 > 1.272 && ret2 < 1.414){


                                        var valor = itemL.low - 0.786 * (itemL.low-itemI.high)

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