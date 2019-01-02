import React from 'react'
//import PropTypes from 'prop-types'

const SevenSeg = function({ AValue, BValue,CValue, DValue, EValue, FValue, GValue}){
 



 return (

  <div className="sevenseg">
    <table>
      <tbody>
        <tr>
          <td></td>
          <td className={AValue ? "selected": ""}></td>
          <td></td>
        </tr>
        <tr>
          <td className={FValue ? "selected": ""}></td>
          <td></td>
          <td className={BValue ? "selected": ""}></td>
        </tr>

        <tr>
          <td></td>
          <td className={GValue ? "selected": ""}></td>
          <td></td>
        </tr>

        <tr>
          <td className={EValue ? "selected": ""}></td>
          <td></td>
          <td className={CValue ? "selected": ""}></td>
        </tr>

        <tr>
          <td></td>
          <td className={DValue ? "selected": ""}></td>
          <td></td>
        </tr>

</tbody>
    </table>
  {/*
    {AValue}
    {BValue}
    {CValue}
    {DValue}
    {EValue}
    {FValue}
    {GValue}
  */}
 
  </div>
  )
}


export default SevenSeg
