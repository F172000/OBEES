import React from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import Teacherdashheader from './Teacherdashheader';
const Teacherdash = ({children}) => {
  return (
    <div>
      <Navbar/>
      <Teacherdashheader/>
      {children}
      <Footer/>
    </div>
  )
}

export default Teacherdash;
