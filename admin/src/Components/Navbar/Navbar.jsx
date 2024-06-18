import React from 'react'
import './Navbar.css'
import user from '../../assets/user-account.png';
import { Link } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";



const Navbar = () => {
    return (
        <div className='navbar'>
            <span className='cart_logo'>Cart</span>
            <ul>
                <Link to={'/add-product'}> <li>Add Product</li></Link>
                <Link to={'/all-product'} > <li>All Product</li></Link>
                <Link to={'/view-orders'} > <li>View Orders </li></Link>
            </ul>
            <div className="profile-pic">
                <img src={user} alt="" className='admin-photo' />
            </div>
        </div>
    )
}

export default Navbar