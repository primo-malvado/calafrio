import ReactDOM from 'react-dom'
import React from 'react';


import Diagram from './Diagram';

/*
0 1 2 3 4 5 6 7 8 9 10 11
a   b c   d   e f    g 
*/

//const tunning = [7,0,5,10, 2, 7]; //guitar
//const tunning = [10, 10, 2, 5]; //cavaquinho GGBD
//const tunning = [0,5,10, 2]; //cavaquinho dgbe

//const tunning = [5,10,2, 7]; //dgbe
//const tunning = [10, 2, 7, 0]; //teste



//let tunning ;

/*cavaquinho*/
//tunning = [5, 0, 2, 7]; //ré-lá-si-mi (do grave para o agudo)  , afinaçaão do julio pererira
 //tunning = [5, 10, 2, 5]; //ré-sol-si-ré (do grave para o agudo) 

//tunning = [10, 10, 2, 5]; //mas usa-se também sol-sol-si-ré
//const tunning = [10, 3, 7, 0];  //Em Barcelos, era preferida a de sol-dó-mi-lá> (afinação da «Maia») ; ukelele
 

//mais fina para a mais grossa: Si - Lá - Mi - Si - Lá - Ré.

const tunning = [5, 0, 2, 7, 0, 2];  //guitarra portuguesa afinação lisboa


const element = <div>
<Diagram  strings={tunning} frets={15}  base={"3"} chordType={"M"} />
 
</div>
;
ReactDOM.render(
  element,
  document.getElementById('root')
);


