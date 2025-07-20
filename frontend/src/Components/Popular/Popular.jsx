import React from 'react';
import './Popular.css';
import Data from '../Assets/data.jsx'; // function that returns product array
import Item from '../Item/Item';

const Popular = () => {
  const data_product = Data(); // call the function to get the data

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
