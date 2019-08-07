import React from 'react'
import PropTypes from 'prop-types'

 /*
        <path className="edge" d="M 10,70 C 20,20 200,20 210,70"></path>



*/

const Edge = (edge) => {
 
    var p1 = edge[0];
    var p4 = edge[1];

    var p2 = [ 
        edge[0][0]+11,
        edge[0][1]+11,
    ]
    var p3 = [ 
        edge[1][0]+11,
        edge[1][1]+11,
    ]


    //var m = (edge[1][1] - edge[0][1]) / (edge[1][0] - edge[0][0]);



    return (

    <g>

<path className="edge"
d={"M "+ p1[0] +","+ p1[1] 
    +" C "+p2[0]+","+ p2[1]
    +" "+p3[0]+","+ p3[1]
    +" "+p4[0]+","+ p4[1]

}

/>




    </g>





)};
 
export default Edge