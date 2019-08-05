import React from 'react'
import PropTypes from 'prop-types'

 /*
        <path className="edge" d="M 10,70 C 20,20 200,20 210,70"></path>



*/

const Edge = (edge) => {


    var p1 = edge.relays[edge[0]].points[edge[1]];
    var p2 = edge.relays[edge[2]].points[edge[3]];



    return (

    <g>

<path className="edge"
d={"M "+ p1[0] +","+ p1[1] +" L "+p2[0]+","+ p2[1]}

/>




    </g>





)};
 
export default Edge