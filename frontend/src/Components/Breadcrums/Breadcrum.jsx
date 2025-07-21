import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../../../images/breadcrum_arrow.png'
import Product from '../../Pages/Product'
function Breadcrum(props) {
  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> 
      SHOP <img src= {arrow_icon} alt="" /> 
      {props.product.category} <img src= {arrow_icon} alt="" />
      {props.product.name}
    </div>
  )
}

export default Breadcrum
