import React from 'react'
//import PropTypes from 'prop-types'

const SevenSegmentDecoder = function({ 
  aValue, bValue,cValue, dValue,
  AValue, BValue,CValue, DValue, EValue, FValue, GValue

}){
 



 return (

  <div className="SevenSegmentDecoder">
    {aValue}
    {bValue}
    {cValue}
    {dValue}

    <br/>

    {AValue}
    {BValue}
    {CValue}
    {DValue}
    {EValue}
    {FValue}
    {GValue}
 
  </div>
  )
}


export default SevenSegmentDecoder
