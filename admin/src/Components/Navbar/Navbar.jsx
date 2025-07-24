import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/images/admin-panel.png'
import navProfile from '../../assets/images/profile.png'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="navbar-leftpart">
                <img src={navlogo} alt="" className='nav-logo' />
                <h1>Admin</h1>
                <p></p>
            </div>
            <img src={navProfile} alt="" className='nav-profile' />
        </div>
    )
}

export default Navbar
