import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewOrders.css'
import { FaChevronRight } from "react-icons/fa";
import Navbar from '../../Components/Navbar/Navbar';
import Pending from '../../Components/pending/Pending';

const ViewOrders = () => {
  const [linkText, setLinkText] = useState('Pending Orders');

  const handleLinkClick = (text) => {
    setLinkText(text);
  }

  return (
    <>
      <Navbar />
      <div className='order-display'>
          <div className="header-link">
            <div className="heading">
              Home  <FaChevronRight /> {linkText}
            </div>
            <ul className='link-order-display'>
              <li className={linkText === "Pending Orders" ? 'active' : ''} onClick={() => handleLinkClick("Pending Orders")}>
                <Link to='/order'>Pending Orders</Link>
              </li>
            </ul>
          </div>

          {linkText === "Pending Orders" && (
            <Pending />
          )}
      </div>
    </>
  )
}

export default ViewOrders;
