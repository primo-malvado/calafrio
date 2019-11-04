import React from 'react'
import PropTypes from 'prop-types'

 

const Todo = (relay) => {
 

    // x = x cos(s)  - y *sin(s);
    // y = x sin(s)  + y *cos(s);


    return (

    <g>
        <path className="relaybody"
            d={"M "+ relay.points[0][0] +","+ relay.points[0][1] +" L "+relay.points[1][0]+","+ relay.points[1][1]+" "+relay.points[2][0]+","+ relay.points[2][1]+" "+relay.points[3][0]+","+ relay.points[3][1]}
            
        />

        <path className="relay-wire" d={"M "+ relay.points[4][0] +","+ relay.points[4][1] +" L "+relay.points[5][0]+","+ relay.points[5][1]}/>
        <path className="relay-wire" d={
            "M "+ relay.points[6][0] +","+ relay.points[6][1] 
            +" L "+relay.points[7][0]+","+ relay.points[7][1] 
            +" "+relay.points[8][0]+","+ relay.points[8][1]
            +" "+relay.points[9][0]+","+ relay.points[9][1]            
            }/>


        <circle className="relay-point" cx={relay.points[4][0]} cy={relay.points[4][1]} />
        <text x={relay.points[4][0]} y={relay.points[4][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">{relay.labels.no}</text>

        <circle className="relay-point" cx={relay.points[6][0]} cy={relay.points[6][1]} />
        <text x={relay.points[6][0]} y={relay.points[6][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">{relay.labels.nc}</text>
        <circle className="relay-point" cx={relay.points[9][0]} cy={relay.points[9][1]} />
        <text x={relay.points[9][0]} y={relay.points[9][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">{relay.labels.com}</text>
        <circle className="relay-point" cx={relay.points[10][0]} cy={relay.points[10][1]} />
        <text x={relay.points[10][0]} y={relay.points[10][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">{relay.labels.coil1}</text>
        <circle className="relay-point" cx={relay.points[11][0]} cy={relay.points[11][1]} />
        <text x={relay.points[11][0]} y={relay.points[11][1]} dy="-10" dx="0" textAnchor="middle" alignmentBaseline="middle">{relay.labels.coil2}</text>





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
