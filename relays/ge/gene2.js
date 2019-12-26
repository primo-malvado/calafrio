// var inputs = ["0", "1", "a", "b"];
//   a,b,ci,co,r     
var data = [
    {i: [0,1, 0,0,0], o:[0,0],},   
    {i: [0,1, 0,0,1], o:[0,1],},
    {i: [0,1, 0,1,0], o:[0,1],},
    {i: [0,1, 0,1,1], o:[1,0],},
    {i: [0,1, 1,0,0], o:[0,1],},
    {i: [0,1, 1,0,1], o:[1,0],},
    {i: [0,1, 1,1,0], o:[1,0],},
    {i: [0,1, 1,1,1], o:[1,1],}
] 

 
var data = [
    {i: [0,1, 0,0], o:[0,0],},   
    {i: [0,1, 0,1], o:[0,1],},
    {i: [0,1, 1,0], o:[0,1],},
    {i: [0,1, 1,1], o:[1,0],},
] 



var data = [
    {i: [0,1, 0,0], o:[0],},   
    {i: [0,1, 0,1], o:[1],},
    {i: [0,1, 1,0], o:[1],},
    {i: [0,1, 1,1], o:[0],},
] 




var labels = [
    "false",
    "true",
    "a",
    "b",
];

var outLabels = [
     "cout",
    "sum",
];



var test = data[0].o.map(function(v, index){
    return data.map(function(item){return item.o[index];}).join(",");
})

 

 
var count = 0;

function clone(a){
    return JSON.parse(JSON.stringify(a));
}
 

function generate1(_data, faltam, config, ouputPorEncontrar, _labels){
 
    if(faltam == 0)return ;

    var inputLen = _data[0].i.length;

    for(var c = 2; c < inputLen; c++){
        for(var f = 1; f < inputLen; f++){
            if(c != f){
                //console.log( "1:[!"+_data.i[c]+"&"+_data.i[f]+" , "+_data.i[c]+"&"+_data.i[f]+"]");
                
                var _conf = clone(config);
                var labels = clone(_labels);
                var _ouputPorEncontrar = clone(ouputPorEncontrar);
                
                var dataClone = JSON.parse(JSON.stringify(_data));

                _conf.push([1,c,f])
                labels.push("nc"+(labels.length), "no"+(labels.length+1));

                
                dataClone.forEach(element => {
                    element.i.push( !element.i[c] & element.i[f],  element.i[c] & element.i[f]);
                });
                
                
                for (var oIdx=0; oIdx< _ouputPorEncontrar.length ;oIdx++)
                {
                    var o = _ouputPorEncontrar[oIdx];



                    if(dataClone.map(function(item){
                        return item.i[inputLen+0];
                    }).join(",") == test[o]){
                         
                        labels[labels.length-2] = outLabels[o];

                        _ouputPorEncontrar.splice(oIdx, 1);
                    }else if(dataClone.map(function(item){
                        return item.i[inputLen+1];
                    }).join(",") == test[o]){ 
                        labels[labels.length-1] = outLabels[o];
                        _ouputPorEncontrar.splice(oIdx, 1);
                    }


                    if(_ouputPorEncontrar.length === 0){
                        printResult( _conf, labels );
                        // console.log(dataClone);
                    }                    


                }









                if(faltam-1 > 0){

                    generate1(dataClone, faltam-1, _conf, _ouputPorEncontrar, labels);
                    generate0(dataClone, faltam-1, _conf, _ouputPorEncontrar, labels);
                }else{
                    count++;
 
                }







            }
        }
        
    }
    
}
 

function generate0(_data, faltam, config, ouputPorEncontrar, _labels){
    if(faltam == 0)return ;
    var inputLen = _data[0].i.length;
    
    for(var c = 2; c < inputLen; c++){
        
        for(var no = 0; no < inputLen; no++){
            for(var nc = 0; nc < inputLen; nc++){
                if(no != nc && !(no == 1 && nc == 0)    && !(c == no )  && !(c == nc )  ){


                    var _ouputPorEncontrar = clone(ouputPorEncontrar);

                    var _conf = clone(config);
                    var labels = clone(_labels);
 

                    var dataClone = JSON.parse(JSON.stringify(_data));
                    //console.log( "0:["+_data.i[c] +"?"+ _data.i[no]+":"+ _data.i[nc] + "]");

                    _conf.push([0, c, no, nc]);
                    labels.push("f"+(labels.length));


                    
                    dataClone.forEach(element => {
                        element.i.push( element.i[c] ? element.i[no] :element.i[nc])
                    });



                    for (var oIdx=0; oIdx< _ouputPorEncontrar.length ;oIdx++)
                    {
                        var o = _ouputPorEncontrar[oIdx];
    
    
    
                        if(dataClone.map(function(item){
                            return item.i[inputLen+0];
                        }).join(",") == test[o]){
                            

    
                            labels[labels.length-1] = outLabels[o];
                            _ouputPorEncontrar.splice(oIdx, 1);


                            if(_ouputPorEncontrar.length === 0){
                                printResult( _conf, labels );
                                //console.log(dataClone);
                            }


                            oIdx=0;
                        } 
                    }


                    
                    
              
            
                    //console.log(dataClone);
                    if(faltam-1 > 0){
                         
                        generate1(dataClone, faltam-1, _conf, _ouputPorEncontrar, labels)
                        generate0(dataClone, faltam-1, _conf, _ouputPorEncontrar, labels)
                    }else{
                        count++;
                         
                    }
                }
            }
        }
    }
}
 

function printResult( _conf, labels ){

    console.log("\n ------\n" /*, _conf, labels*/);

    var startLabel = data[0].i.length-0;

    for(var i = 0; i< _conf.length; i++){
        var r = _conf[i];
        if(r[0] == 0){
            //console.log(  "c:"+labels[r[1]]+"  no:"+labels[r[2]] +" nc:"+labels[r[3]] +"  f:" + labels[startLabel]  );


            console.log(  ` ${(labels[r[3]]+"    ").substring(0,4)}____                    
         \\____ ${labels[startLabel]}
 ${(labels[r[2]]+"    ").substring(0,4)}____                     
          ${labels[r[1]]}`  );
            



            startLabel+=1;
        }

        if(r[0] == 1){
           // console.log(    "c:"+labels[r[1]] ,    "f:"+labels[r[2]], " nc:"+labels[startLabel] +" no:"+ labels[startLabel+1]   );


           console.log(  
`          ____ ${labels[startLabel+1]}           
 ${(labels[r[2]]+"    ").substring(0,4)}____                    
         \\____ ${labels[startLabel]}                 
          ${labels[r[1]]}`  );


            startLabel+=2;
        }
    }

}


var num = 2;

var missing = [];
for (var i = 0; i< data[0].o.length ; i++){
    missing.push(i);
}



generate1(data, num, [], missing , labels);
generate0(data, num, [], missing, labels);


console.log("count", count);





