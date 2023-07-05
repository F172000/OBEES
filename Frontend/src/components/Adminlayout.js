import React from 'react'
import Navbar from './Navbar';
import Teacherdashheader from './Teacherdashheader';
import Footer from './Footer';

const Adminlayout = ({children}) => {
  return (
    <div>
      <Navbar/>
      <Teacherdashheader/>
      {children}
      <Footer/>
    </div>
  )
}

export default Adminlayout;
