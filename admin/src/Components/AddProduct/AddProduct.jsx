import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/images/star_dull_icon.png';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const Add_Product = async () => {
    let product = productDetails;

    // ✅ Validate required fields
    if (!product.name || !product.new_price || !product.old_price || !product.category || !image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    // ✅ Upload Image
    const formData = new FormData();
    formData.append('product', image);

    let responseData;
try {
  const uploadResp = await fetch(`${import.meta.env.VITE_BACKEND_URI}/upload`, {
    method: 'POST',
    body: formData
  });

  const contentType = uploadResp.headers.get("content-type");

  if (contentType && contentType.indexOf("application/json") !== -1) {
    responseData = await uploadResp.json();
  } else {
    const text = await uploadResp.text();
    console.error("Expected JSON but got:", text);
    alert("Unexpected response from server");
    return;
  }
} catch (error) {
  alert("Image upload failed.");
  return;
}


    if (responseData.success) {
      product.image = responseData.image_url;

      // ✅ Convert price strings to numbers
      product.new_price = Number(product.new_price);
      product.old_price = Number(product.old_price);

      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URI}/addproduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });
        const data = await resp.json();
        data.success ? alert('Product Added') : alert(`Failed: ${data.message}`);
      } catch (error) {
        alert("Something went wrong while adding the product.");
        console.error(error);
      }
    }
  };









  

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="number"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="number"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="upload preview"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
