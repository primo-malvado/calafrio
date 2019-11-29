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

// var data = [
//     {i: [0,1, 0,0], o:[0,0],},   
//     {i: [0,1, 0,1], o:[0,1],},
//     {i: [0,1, 1,0], o:[0,1],},
//     {i: [0,1, 1,1], o:[1,1],},
// ] 






var test = [
    data.map(function(item){return item.o[0];}).join(","),
    data.map(function(item){return item.o[1];}).join(","),
];

//var inputs = ["0", "1", "a", "b"];
//   a,b,ci,co,r     
// var data = [
//     {i: [0,1, 0,0], o:[0],},   
//     {i: [0,1, 0,1], o:[1],},
//     {i: [0,1, 1,0], o:[1],},
//     {i: [0,1, 1,1], o:[0],},
// ] 



function clone(a){
    return JSON.parse(JSON.stringify(a));
}
 

function generate1(_data, faltam, config, ouputPorEncontrar){
 
    if(faltam == 0)return ;

    var inputLen = _data[0].i.length;

    for(var c = 2; c < inputLen; c++){
        for(var f = 1; f < inputLen; f++){
            if(c != f){
                //console.log( "1:[!"+_data.i[c]+"&"+_data.i[f]+" , "+_data.i[c]+"&"+_data.i[f]+"]");
                
                var _conf = clone(config);
                var _ouputPorEncontrar = clone(ouputPorEncontrar);
                
                var dataClone = JSON.parse(JSON.stringify(_data));

                _conf.push([1,c,f])
                
                dataClone.forEach(element => {
                    element.i.push( !element.i[c] & element.i[f],  element.i[c] & element.i[f]);
                });
                
                
                for (var oIdx=0; oIdx< _ouputPorEncontrar.length ;oIdx++)
                {
                    var o = _ouputPorEncontrar[oIdx];



                    if(dataClone.map(function(item){
                        return item.i[inputLen+0];
                    }).join(",") == test[o]){
                         


                        _ouputPorEncontrar.splice(oIdx, 1);
                    }else if(dataClone.map(function(item){
                        return item.i[inputLen+1];
                    }).join(",") == test[o]){ 

                        _ouputPorEncontrar.splice(oIdx, 1);
                    }


                    if(_ouputPorEncontrar.length === 0){
                        console.log( _conf );
                        console.log(dataClone);
                    }                    


                }










                generate1(dataClone, faltam-1, _conf, _ouputPorEncontrar);
                generate0(dataClone, faltam-1, _conf, _ouputPorEncontrar);







            }
        }
        
    }
    
}
 

function generate0(_data, faltam, config, ouputPorEncontrar){
 
    if(faltam == 0)return ;
    var inputLen = _data[0].i.length;
    
    for(var c = 2; c < inputLen; c++){
        
        for(var no = 0; no < inputLen; no++){
            for(var nc = 0; nc < inputLen; nc++){
                if(no != nc && !(no == 1 && nc == 0)    && !(c == no )  && !(c == nc )  ){


                    var _ouputPorEncontrar = clone(ouputPorEncontrar);

                    var _conf = clone(config);
 

                    var dataClone = JSON.parse(JSON.stringify(_data));
                    //console.log( "0:["+_data.i[c] +"?"+ _data.i[no]+":"+ _data.i[nc] + "]");

                    _conf.push([0, c, no, nc]);

                    
                    dataClone.forEach(element => {
                        element.i.push( element.i[c] ? element.i[no] :element.i[nc])
                    });



                    for (var oIdx=0; oIdx< _ouputPorEncontrar.length ;oIdx++)
                    {
                        var o = _ouputPorEncontrar[oIdx];
    
    
    
                        if(dataClone.map(function(item){
                            return item.i[inputLen+0];
                        }).join(",") == test[o]){
                            

    
    
                            _ouputPorEncontrar.splice(oIdx, 1);


                            if(_ouputPorEncontrar.length === 0){
                                console.log( _conf );
                                console.log(dataClone);
                            }



                        } 
    
    
                    }


                    
                    
              
            
                    //console.log(dataClone);
                         
                    generate1(dataClone, faltam-1, _conf, _ouputPorEncontrar)
                    generate0(dataClone, faltam-1, _conf, _ouputPorEncontrar)

                }
            }
        }
    }
}
 

var num = 4;
generate1(data, num, [], [0,1] );
generate0(data, num, [], [0,1]);