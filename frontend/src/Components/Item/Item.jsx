import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <Link 
      to={`/product/${props.id}`} 
      onClick={() => window.scrollTo(0, 0)} 
      className="item-link"
    >
      <div className="item">
        <img src={props.image} alt={props.name} />  
        <p>{props.name}</p>
        <div className="item-prices">
          <div className="item-price-new">  
            ${props.new_price}
          </div>
          <div className="item-price-old">
            ${props.old_price}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Item
