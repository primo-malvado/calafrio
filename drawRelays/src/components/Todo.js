import React from 'react'
import PropTypes from 'prop-types'


var a = 11;
var b = 9;
var c = 3;
var d = 3;


const points = [
    [0, 0],
    [b, 0],
    [b, a],
    [0, a],

    [1, 1], //no
    [1, 1+d],
    [b-1, 1], //nc
    [b-1, 1+d],  

    [b/2, a-1-d],  
    [b/2, a-1], // f

    [1, a-c],
    [b-1, a-c],
]


const Todo = ({ x, y, r}) => {

    var factor = 10;
    var startX = x*factor;
    var startY = y*factor;


    var ps = points.map(function(p){

    var sin = 0;
    var cos = 1;  

        switch(r){
            case 1:
                var sin = 1;
                var cos = 0;  
                break;
            case 2:
                var sin = 0;
                var cos = -1;  
                break;

            case 3:
                var sin = -1;
                var cos = 0;  
                break;                
        }
 
        
        var _x = (p[0])*factor;
        var _y = (p[1])*factor;

        


        return [
           (_x* cos   - _y * sin ) + x *factor,
           ( _x* sin + _y * cos )  + y *factor,
        
        ];
    })
    

    console.log(ps)

    // x = x cos(s)  - y *sin(s);
    // y = x sin(s)  + y *cos(s);


    return (

    <g>
        <path className="relaybody"
            d={"M "+ ps[0][0] +","+ ps[0][1] +" L "+ps[1][0]+","+ ps[1][1]+" "+ps[2][0]+","+ ps[2][1]+" "+ps[3][0]+","+ ps[3][1]}
            
        />

        <path className="relay-wire" d={"M "+ ps[4][0] +","+ ps[4][1] +" L "+ps[5][0]+","+ ps[5][1]}/>
        <path className="relay-wire" d={
            "M "+ ps[6][0] +","+ ps[6][1] 
            +" L "+ps[7][0]+","+ ps[7][1] 
            +" "+ps[8][0]+","+ ps[8][1]
            +" "+ps[9][0]+","+ ps[9][1]            
            }/>


        <circle className="relay-point" cx={ps[4][0]} cy={ps[4][1]} />
        <text x={ps[4][0]} y={ps[4][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">no</text>

        <circle className="relay-point" cx={ps[6][0]} cy={ps[6][1]} />
        <text x={ps[6][0]} y={ps[6][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">nc</text>
        <circle className="relay-point" cx={ps[9][0]} cy={ps[9][1]} />
        <text x={ps[9][0]} y={ps[9][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">f</text>
        <circle className="relay-point" cx={ps[10][0]} cy={ps[10][1]} />
        <text x={ps[10][0]} y={ps[10][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">c1</text>
        <circle className="relay-point" cx={ps[11][0]} cy={ps[11][1]} />
        <text x={ps[11][0]} y={ps[11][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">c2</text>





    </g>





)};
//   <li
//     onClick={onClick}
//     style={{
//       textDecoration: completed ? 'line-through' : 'none'
//     }}
//   >
//     {text}
//   </li>

// Todo.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   completed: PropTypes.bool.isRequired,
//   text: PropTypes.string.isRequired
// }

export default Todo