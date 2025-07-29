import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../../assets/images/breadcrum_arrow.png';

function Breadcrum({ product }) {
  // Avoid rendering if product is not yet loaded
  if (!product) return null;

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> 
      SHOP <img src={arrow_icon} alt="" /> 
      {product.category} <img src={arrow_icon} alt="" />
      {product.name}
    </div>
  );
}

export default Breadcrum;
