import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../../images/logo.png'
import cart_icon from '../../../images/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../../../images/nav_dropdown.svg'

const Navbar = () => {
  const [menu, setMenu] = useState("shop")
  const { getTotalCartItems } = useContext(ShopContext)
  const menuRef = useRef()

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible')
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="logo" />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />

      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("shop") }}> <Link to='/'> Shop </Link>{menu === "shop" ? <hr /> : <></>} </li>
        <li onClick={() => { setMenu("mens") }}> <Link to='/mens'>Men</Link> {menu === "mens" ? <hr /> : <></>} </li>
        <li onClick={() => { setMenu("womens") }}> <Link to='/women'>Women</Link> {menu === "womens" ? <hr /> : <></>} </li>
        <li onClick={() => { setMenu("kids") }}> <Link to='/kids'>Kids</Link> {menu === "kids" ? <hr /> : <></>} </li>
      </ul>
      <div className="nav-login-cart">
        <Link to='/login'> <button>Login</button></Link>
        <Link to='/cart'> <img src={cart_icon} alt="" /> </Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar
