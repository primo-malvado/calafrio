import React from 'react'
import PropTypes from 'prop-types'

const Relay = function({ output,  todoKey, coilValue, ncValue, noValue}){
 



 return (

  <div className="relay">

 
<svg   >
   
   
  <g>
   <rect id="rect3336" width="50" height="40" x="5" y="5"></rect>
   <path className={noValue?"active":""} d="M 20,40 0,40 " id="path4140"></path>
   <path className={ncValue?"active":""}  d="M 20,10 0,10" id="path4142"></path>
   <path  className={coilValue?"active":""}   d="m 40,40 0,10" id="path4138"></path>



   <path className={output?"active":""}  d="M 60,25 40,25" id="path4144"></path>

   {coilValue && <path className={output?"active":""}  d="M  40,25 20,10" id="path4146"></path> }
   { !coilValue && <path className={output?"active":""}  d="M  40,25 20,40" id="path4146"></path> }
   
  </g>
</svg>





{todoKey} {output}={coilValue}?{noValue}:{ncValue}
  </div>)
}
Relay.propTypes = {
  //onClick: PropTypes.func.isRequired,
  //completed: PropTypes.bool.isRequired,

  //componentes: 
  coil: PropTypes.string.isRequired,
  nc: PropTypes.string.isRequired,
  no: PropTypes.string.isRequired,
  output: PropTypes.number.isRequired,
}

export default Relay
