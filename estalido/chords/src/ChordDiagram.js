import React from 'react';


class ChordDiagram extends React.Component {

  insept(keys, stringsLength, stringIndex, options, result, globalResult, minFret, maxFret){


    var f = options.filter(function(item){return item[0] === stringIndex});
//debugger;
    for(var x = 0; x <f.length; x++){

      var keysClone = keys.slice(0);
      var pos = keysClone.indexOf(f[x][2]);
      if(pos!==-1){

        keysClone.splice(pos, 1)
      }
 

      if(f[x][1] !== 0){

        if(minFret === undefined || minFret > f[x][1])
        {
          minFret =  f[x][1];

        }
        if(maxFret === undefined || maxFret < f[x][1])
        {
          maxFret =  f[x][1];
          
        }
      }



      if(maxFret !== undefined && maxFret-minFret>3){

        return 
      }
  
      
      var _result = result.slice(0)
      _result.push(f[x][1]);


      if(stringIndex<stringsLength-1){
        this.insept(keysClone, stringsLength, stringIndex+1, options, _result, globalResult,minFret, maxFret)
      }else{
        if(keysClone.length === 0)
        {

          globalResult.push(_result);
        }
      }
    }





















      var keysClone = keys.slice(0);
 
   
      
      var _result = result.slice(0)
      _result.push(-1);


      if(stringIndex<stringsLength-1){
        this.insept(keysClone, stringsLength, stringIndex+1, options, _result, globalResult,minFret, maxFret)
      }else{
        if(keysClone.length === 0)
        {

          globalResult.push(_result);
        }
      }









  }



  calcValid(strings, keys, frets){
    var s = [];

    for (var stringIndex = 0; stringIndex < strings.length; stringIndex++) {
      for (var fret = 0; fret < frets; fret++) {
        var note = (strings[stringIndex] + fret)%12;

        var pos = keys.indexOf(note);

        if(pos !== -1 ){
          s.push([stringIndex, fret, note]);
        }
      }

   
    }

    var result = [];
    var globalResult = [];

    this.insept(keys, strings.length, 0, s, result, globalResult);
    return globalResult;
  }

  render () {



      const {strings, keys, frets} = this.props;
      const validChords = this.calcValid(strings, keys, frets);

      var fretList = [];
      for (var i = 0; i < frets; i++) {
        fretList.push(i);
      }

 

      return  (<div> {
        validChords.map(function(validChord, validChordIndex){
          return <div className="chord-diagram" key={validChordIndex}> 
          { 
            fretList.map(function(fret, fretIndex){


return <div key={fretIndex}>
  <div>{
    strings.map(function(string, index){
        if( fret === validChord[index]){


            return <span key={index}>● </span>
   

        }else{
          //console.log(fret);
          if(fret === 0){
 
              return <span key={index}>&nbsp;&nbsp;</span>
 
          }else{
             
              return <span key={index}>│ </span>
 



          }








             
        }
    })
  }</div>


  <div>{
    strings.map(function(string, index){
      if(fret === 0){
        if(index === strings.length-1){
           return "╕";
          
          
        }else{

          if(index === 0){
            return "╒═";
          }else{
            return "╤═";
            
          }
        }
      }else{
        
        if(index === strings.length-1){
           return "┤";
          
          
        }else    if(index === 0){
          return "├─";
        }else{
          return "┼─";
          
        }
      }
 
 



       // return "x";
    })
  }</div>



 
          </div>





       })   
  }

   </div> 
              
           })
        }
    





  </div>);
  } 
}


export default  ChordDiagram;
